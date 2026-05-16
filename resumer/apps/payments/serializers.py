from __future__ import annotations

from rest_framework import serializers

from apps.payments.models import (
    Invoice,
    Payment,
    PlanChoice,
    Subscription,
)


class SubscriptionSerializer(serializers.ModelSerializer[Subscription]):
    """Read-only serializer for the current user's subscription."""

    plan_display = serializers.CharField(source="get_plan_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "status",
            "status_display",
            "plan",
            "plan_display",
            "trial_start",
            "trial_end",
            "current_period_start",
            "current_period_end",
            "cancel_at_period_end",
            "canceled_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class PaymentSerializer(serializers.ModelSerializer[Payment]):
    """Read-only serializer for payment records."""

    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "stripe_payment_intent_id",
            "amount",
            "currency",
            "status",
            "status_display",
            "description",
            "created_at",
        ]
        read_only_fields = fields


class InvoiceSerializer(serializers.ModelSerializer[Invoice]):
    """Read-only serializer for invoices."""

    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "stripe_invoice_id",
            "amount",
            "currency",
            "status",
            "status_display",
            "pdf_url",
            "period_start",
            "period_end",
            "created_at",
        ]
        read_only_fields = fields


class CheckoutSerializer(serializers.Serializer):  # type: ignore[type-arg]
    """Input serializer for creating a Stripe Checkout session."""

    plan = serializers.ChoiceField(
        choices=[
            (PlanChoice.MONTHLY, "Monthly"),
            (PlanChoice.YEARLY, "Yearly"),
        ],
        help_text="Subscription plan to purchase.",
    )
