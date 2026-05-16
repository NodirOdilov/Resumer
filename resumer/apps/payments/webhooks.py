"""Stripe webhook event handlers.

Each handler receives the full Stripe event data dict and updates
the corresponding local models.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone as dt_timezone
from decimal import Decimal
from typing import Any

from django.conf import settings

from apps.accounts.models import User
from apps.payments.models import (
    Invoice,
    InvoiceStatus,
    Payment,
    PaymentStatus,
    PlanChoice,
    Subscription,
    SubscriptionStatus,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _ts_to_dt(ts: int | None) -> datetime | None:
    """Convert a Unix timestamp to a timezone-aware datetime, or None."""
    if ts is None:
        return None
    return datetime.fromtimestamp(ts, tz=dt_timezone.utc)


def _get_or_create_subscription(user: User, stripe_customer_id: str) -> Subscription:
    """Return the user's subscription, creating one if needed."""
    subscription, _ = Subscription.objects.get_or_create(
        user=user,
        defaults={"stripe_customer_id": stripe_customer_id},
    )
    if not subscription.stripe_customer_id:
        subscription.stripe_customer_id = stripe_customer_id
        subscription.save(update_fields=["stripe_customer_id", "updated_at"])
    return subscription


def _resolve_plan_from_amount(amount_cents: int) -> str:
    """Rough heuristic to determine plan from Stripe amount (cents)."""
    yearly_threshold = 2000  # amounts above $20 are likely yearly
    if amount_cents >= yearly_threshold:
        return PlanChoice.YEARLY
    return PlanChoice.MONTHLY


def _map_stripe_sub_status(stripe_status: str) -> str:
    """Map Stripe subscription status string to local enum."""
    mapping: dict[str, str] = {
        "trialing": SubscriptionStatus.TRIALING,
        "active": SubscriptionStatus.ACTIVE,
        "past_due": SubscriptionStatus.PAST_DUE,
        "canceled": SubscriptionStatus.CANCELED,
        "unpaid": SubscriptionStatus.PAST_DUE,
        "incomplete": SubscriptionStatus.PAST_DUE,
        "incomplete_expired": SubscriptionStatus.EXPIRED,
        "paused": SubscriptionStatus.CANCELED,
    }
    return mapping.get(stripe_status, SubscriptionStatus.ACTIVE)


def _map_stripe_invoice_status(stripe_status: str) -> str:
    """Map Stripe invoice status string to local enum."""
    mapping: dict[str, str] = {
        "draft": InvoiceStatus.DRAFT,
        "open": InvoiceStatus.OPEN,
        "paid": InvoiceStatus.PAID,
        "void": InvoiceStatus.VOID,
        "uncollectible": InvoiceStatus.UNCOLLECTIBLE,
    }
    return mapping.get(stripe_status, InvoiceStatus.OPEN)


# ---------------------------------------------------------------------------
# Event handlers
# ---------------------------------------------------------------------------


def handle_checkout_completed(event_data: dict[str, Any]) -> None:
    """Handle ``checkout.session.completed``.

    Creates / updates the Subscription and marks the user as premium.
    """
    session: dict[str, Any] = event_data.get("object", {})
    stripe_customer_id: str = session.get("customer", "")
    stripe_subscription_id: str = session.get("subscription", "")
    customer_email: str = session.get("customer_details", {}).get("email", "")

    if not customer_email:
        customer_email = session.get("customer_email", "")

    if not customer_email:
        logger.warning("checkout.session.completed: no customer email found.")
        return

    try:
        user = User.objects.get(email=customer_email)
    except User.DoesNotExist:
        logger.error(
            "checkout.session.completed: user with email %s not found.",
            customer_email,
        )
        return

    subscription = _get_or_create_subscription(user, stripe_customer_id)
    subscription.stripe_subscription_id = stripe_subscription_id
    subscription.status = SubscriptionStatus.ACTIVE
    subscription.plan = PlanChoice.MONTHLY  # default; updated by subscription.updated

    # Populate from session metadata if available
    amount_total: int | None = session.get("amount_total")
    if amount_total is not None:
        subscription.plan = _resolve_plan_from_amount(amount_total)

    subscription.save(
        update_fields=[
            "stripe_subscription_id",
            "status",
            "plan",
            "updated_at",
        ]
    )

    # Mark user premium
    user.is_premium = True
    user.save(update_fields=["is_premium", "updated_at"])

    logger.info(
        "checkout.session.completed processed for user %s (sub=%s).",
        user.email,
        stripe_subscription_id,
    )


def handle_subscription_updated(event_data: dict[str, Any]) -> None:
    """Handle ``customer.subscription.updated``.

    Syncs local subscription fields with Stripe's authoritative state.
    """
    sub_obj: dict[str, Any] = event_data.get("object", {})
    stripe_subscription_id: str = sub_obj.get("id", "")

    try:
        subscription = Subscription.objects.select_related("user").get(
            stripe_subscription_id=stripe_subscription_id,
        )
    except Subscription.DoesNotExist:
        logger.warning(
            "subscription.updated: no local subscription for %s.",
            stripe_subscription_id,
        )
        return

    subscription.status = _map_stripe_sub_status(sub_obj.get("status", "active"))
    subscription.cancel_at_period_end = sub_obj.get("cancel_at_period_end", False)
    subscription.canceled_at = _ts_to_dt(sub_obj.get("canceled_at"))
    subscription.current_period_start = _ts_to_dt(sub_obj.get("current_period_start"))
    subscription.current_period_end = _ts_to_dt(sub_obj.get("current_period_end"))
    subscription.trial_start = _ts_to_dt(sub_obj.get("trial_start"))
    subscription.trial_end = _ts_to_dt(sub_obj.get("trial_end"))

    subscription.save(
        update_fields=[
            "status",
            "cancel_at_period_end",
            "canceled_at",
            "current_period_start",
            "current_period_end",
            "trial_start",
            "trial_end",
            "updated_at",
        ]
    )

    # Sync user premium flag
    user = subscription.user
    user.is_premium = subscription.is_active
    user.premium_until = subscription.current_period_end
    user.save(update_fields=["is_premium", "premium_until", "updated_at"])

    logger.info(
        "subscription.updated processed for %s — status=%s.",
        user.email,
        subscription.status,
    )


def handle_subscription_deleted(event_data: dict[str, Any]) -> None:
    """Handle ``customer.subscription.deleted``.

    Marks the subscription as canceled and removes premium from the user.
    """
    sub_obj: dict[str, Any] = event_data.get("object", {})
    stripe_subscription_id: str = sub_obj.get("id", "")

    try:
        subscription = Subscription.objects.select_related("user").get(
            stripe_subscription_id=stripe_subscription_id,
        )
    except Subscription.DoesNotExist:
        logger.warning(
            "subscription.deleted: no local subscription for %s.",
            stripe_subscription_id,
        )
        return

    subscription.status = SubscriptionStatus.CANCELED
    subscription.canceled_at = _ts_to_dt(sub_obj.get("canceled_at"))
    subscription.cancel_at_period_end = False
    subscription.save(
        update_fields=[
            "status",
            "canceled_at",
            "cancel_at_period_end",
            "updated_at",
        ]
    )

    user = subscription.user
    user.is_premium = False
    user.premium_until = None
    user.save(update_fields=["is_premium", "premium_until", "updated_at"])

    logger.info(
        "subscription.deleted processed for %s.",
        user.email,
    )


def handle_payment_failed(event_data: dict[str, Any]) -> None:
    """Handle ``invoice.payment_failed``.

    Records the failed payment and updates the related invoice.
    """
    invoice_obj: dict[str, Any] = event_data.get("object", {})
    stripe_customer_id: str = invoice_obj.get("customer", "")
    stripe_invoice_id: str = invoice_obj.get("id", "")
    stripe_subscription_id: str | None = invoice_obj.get("subscription")
    amount_due: int = invoice_obj.get("amount_due", 0)
    currency: str = invoice_obj.get("currency", "usd")

    # Resolve user via subscription or customer id
    user: User | None = None
    subscription: Subscription | None = None

    if stripe_subscription_id:
        try:
            subscription = Subscription.objects.select_related("user").get(
                stripe_subscription_id=stripe_subscription_id,
            )
            user = subscription.user
        except Subscription.DoesNotExist:
            pass

    if user is None:
        try:
            subscription = Subscription.objects.select_related("user").get(
                stripe_customer_id=stripe_customer_id,
            )
            user = subscription.user
        except Subscription.DoesNotExist:
            logger.error(
                "invoice.payment_failed: cannot resolve user for customer %s.",
                stripe_customer_id,
            )
            return

    # Record failed payment
    Payment.objects.create(
        user=user,
        subscription=subscription,
        stripe_payment_intent_id=invoice_obj.get("payment_intent"),
        amount=Decimal(amount_due) / Decimal("100"),
        currency=currency,
        status=PaymentStatus.FAILED,
        description=f"Failed payment for invoice {stripe_invoice_id}",
    )

    # Upsert invoice record
    Invoice.objects.update_or_create(
        stripe_invoice_id=stripe_invoice_id,
        defaults={
            "user": user,
            "subscription": subscription,
            "amount": Decimal(amount_due) / Decimal("100"),
            "currency": currency,
            "status": _map_stripe_invoice_status(invoice_obj.get("status", "open")),
            "pdf_url": invoice_obj.get("invoice_pdf", "") or "",
            "period_start": _ts_to_dt(invoice_obj.get("period_start")),
            "period_end": _ts_to_dt(invoice_obj.get("period_end")),
        },
    )

    logger.info(
        "invoice.payment_failed processed for %s (invoice=%s).",
        user.email,
        stripe_invoice_id,
    )
