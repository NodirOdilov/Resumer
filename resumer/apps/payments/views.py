"""Payment views — checkout, webhooks, subscription management, invoices."""

from __future__ import annotations

import logging
from typing import Any

import stripe
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.payments.models import (
    Invoice,
    PlanChoice,
    Subscription,
    SubscriptionStatus,
)
from apps.payments.serializers import (
    CheckoutSerializer,
    InvoiceSerializer,
    SubscriptionSerializer,
)
from apps.payments.webhooks import (
    handle_checkout_completed,
    handle_payment_failed,
    handle_subscription_deleted,
    handle_subscription_updated,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Plan → Stripe price mapping (set in Django settings)
# ---------------------------------------------------------------------------

PLAN_PRICE_MAP: dict[str, str] = {
    PlanChoice.MONTHLY: getattr(settings, "STRIPE_PRICE_MONTHLY", ""),
    PlanChoice.YEARLY: getattr(settings, "STRIPE_PRICE_YEARLY", ""),
}


# ---------------------------------------------------------------------------
# Checkout
# ---------------------------------------------------------------------------


class CheckoutView(APIView):
    """Create a Stripe Checkout session and return the session URL.

    POST /api/v1/payments/checkout/
    Body: {"plan": "monthly" | "yearly"}
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan: str = serializer.validated_data["plan"]
        price_id: str = PLAN_PRICE_MAP.get(plan, "")

        if not price_id:
            return Response(
                {"detail": "Selected plan is not configured."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            checkout_session = stripe.checkout.Session.create(
                customer_email=request.user.email,
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode="subscription",
                subscription_data={
                    "trial_period_days": 14,
                    "metadata": {"plan": plan, "user_id": str(request.user.pk)},
                },
                metadata={"user_id": str(request.user.pk), "plan": plan},
                success_url=settings.STRIPE_SUCCESS_URL,
                cancel_url=settings.STRIPE_CANCEL_URL,
            )
        except stripe.error.StripeError as exc:
            logger.exception("Stripe checkout session creation failed.")
            return Response(
                {"detail": str(exc.user_message or exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "checkout_url": checkout_session.url,
                "session_id": checkout_session.id,
            },
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Webhook
# ---------------------------------------------------------------------------

EVENT_HANDLERS: dict[str, Any] = {
    "checkout.session.completed": handle_checkout_completed,
    "customer.subscription.updated": handle_subscription_updated,
    "customer.subscription.deleted": handle_subscription_deleted,
    "invoice.payment_failed": handle_payment_failed,
}


class WebhookView(APIView):
    """Receive and verify Stripe webhook events.

    POST /api/v1/payments/webhook/
    """

    permission_classes = [permissions.AllowAny]
    authentication_classes: list[type] = []

    def post(self, request: Request) -> Response:
        payload: bytes = request.body
        sig_header: str = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        webhook_secret: str = settings.STRIPE_WEBHOOK_SECRET

        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError:
            logger.warning("Stripe webhook: invalid payload.")
            return Response(
                {"detail": "Invalid payload."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.error.SignatureVerificationError:
            logger.warning("Stripe webhook: invalid signature.")
            return Response(
                {"detail": "Invalid signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_type: str = event.get("type", "")
        event_data: dict[str, Any] = event.get("data", {})

        handler = EVENT_HANDLERS.get(event_type)
        if handler is not None:
            try:
                handler(event_data)
            except Exception:
                logger.exception(
                    "Stripe webhook handler failed for event %s.", event_type
                )
                return Response(
                    {"detail": "Webhook handler error."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            logger.debug("Unhandled Stripe event type: %s", event_type)

        return Response({"status": "ok"}, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Subscription management
# ---------------------------------------------------------------------------


class SubscriptionView(generics.RetrieveAPIView):  # type: ignore[type-arg]
    """Return the current user's subscription.

    GET /api/v1/payments/subscription/
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_object(self) -> Subscription:
        subscription, _ = Subscription.objects.get_or_create(
            user=self.request.user,
        )
        return subscription


class CancelSubscriptionView(APIView):
    """Cancel the current subscription at period end.

    POST /api/v1/payments/subscription/cancel/
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        try:
            subscription = Subscription.objects.get(user=request.user)
        except Subscription.DoesNotExist:
            return Response(
                {"detail": "No active subscription found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if subscription.status not in (
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.TRIALING,
        ):
            return Response(
                {"detail": "Subscription is not active."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not subscription.stripe_subscription_id:
            return Response(
                {"detail": "No Stripe subscription linked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            stripe.Subscription.modify(
                subscription.stripe_subscription_id,
                cancel_at_period_end=True,
            )
        except stripe.error.StripeError as exc:
            logger.exception("Stripe subscription cancel failed.")
            return Response(
                {"detail": str(exc.user_message or exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        subscription.cancel_at_period_end = True
        subscription.save(update_fields=["cancel_at_period_end", "updated_at"])

        return Response(
            SubscriptionSerializer(subscription).data,
            status=status.HTTP_200_OK,
        )


class ReactivateSubscriptionView(APIView):
    """Reactivate a subscription that was set to cancel at period end.

    POST /api/v1/payments/subscription/reactivate/
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        try:
            subscription = Subscription.objects.get(user=request.user)
        except Subscription.DoesNotExist:
            return Response(
                {"detail": "No subscription found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not subscription.cancel_at_period_end:
            return Response(
                {"detail": "Subscription is not scheduled for cancellation."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not subscription.stripe_subscription_id:
            return Response(
                {"detail": "No Stripe subscription linked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            stripe.Subscription.modify(
                subscription.stripe_subscription_id,
                cancel_at_period_end=False,
            )
        except stripe.error.StripeError as exc:
            logger.exception("Stripe subscription reactivation failed.")
            return Response(
                {"detail": str(exc.user_message or exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        subscription.cancel_at_period_end = False
        subscription.save(update_fields=["cancel_at_period_end", "updated_at"])

        return Response(
            SubscriptionSerializer(subscription).data,
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Invoices
# ---------------------------------------------------------------------------


class InvoiceListView(generics.ListAPIView):  # type: ignore[type-arg]
    """List invoices for the current user.

    GET /api/v1/payments/invoices/
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InvoiceSerializer

    def get_queryset(self):  # type: ignore[override]
        return Invoice.objects.filter(user=self.request.user).order_by("-created_at")
