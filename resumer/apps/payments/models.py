from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


# ---------------------------------------------------------------------------
# Choices
# ---------------------------------------------------------------------------


class SubscriptionStatus(models.TextChoices):
    TRIALING = "trialing", _("Trialing")
    ACTIVE = "active", _("Active")
    PAST_DUE = "past_due", _("Past Due")
    CANCELED = "canceled", _("Canceled")
    EXPIRED = "expired", _("Expired")


class PlanChoice(models.TextChoices):
    TRIAL = "trial", _("Trial")
    MONTHLY = "monthly", _("Monthly")
    YEARLY = "yearly", _("Yearly")


class PaymentStatus(models.TextChoices):
    PENDING = "pending", _("Pending")
    SUCCEEDED = "succeeded", _("Succeeded")
    FAILED = "failed", _("Failed")
    REFUNDED = "refunded", _("Refunded")


class InvoiceStatus(models.TextChoices):
    DRAFT = "draft", _("Draft")
    OPEN = "open", _("Open")
    PAID = "paid", _("Paid")
    VOID = "void", _("Void")
    UNCOLLECTIBLE = "uncollectible", _("Uncollectible")


# ---------------------------------------------------------------------------
# Subscription
# ---------------------------------------------------------------------------


class Subscription(TimestampMixin):
    """Tracks a user's Stripe subscription lifecycle."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscription",
        verbose_name=_("user"),
    )
    stripe_customer_id = models.CharField(
        _("Stripe customer ID"),
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )
    stripe_subscription_id = models.CharField(
        _("Stripe subscription ID"),
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        db_index=True,
    )
    status = models.CharField(
        _("status"),
        max_length=20,
        choices=SubscriptionStatus.choices,
        default=SubscriptionStatus.TRIALING,
        db_index=True,
    )
    plan = models.CharField(
        _("plan"),
        max_length=20,
        choices=PlanChoice.choices,
        default=PlanChoice.TRIAL,
        db_index=True,
    )
    trial_start = models.DateTimeField(_("trial start"), null=True, blank=True)
    trial_end = models.DateTimeField(_("trial end"), null=True, blank=True)
    current_period_start = models.DateTimeField(
        _("current period start"), null=True, blank=True
    )
    current_period_end = models.DateTimeField(
        _("current period end"), null=True, blank=True
    )
    cancel_at_period_end = models.BooleanField(
        _("cancel at period end"), default=False
    )
    canceled_at = models.DateTimeField(_("canceled at"), null=True, blank=True)

    class Meta:
        db_table = "payments_subscription"
        verbose_name = _("subscription")
        verbose_name_plural = _("subscriptions")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"], name="idx_sub_status"),
            models.Index(fields=["plan"], name="idx_sub_plan"),
            models.Index(
                fields=["trial_end"], name="idx_sub_trial_end"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.user} — {self.get_plan_display()} ({self.get_status_display()})"

    @property
    def is_active(self) -> bool:
        return self.status in (
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.TRIALING,
        )


# ---------------------------------------------------------------------------
# Payment
# ---------------------------------------------------------------------------


class Payment(TimestampMixin):
    """Records individual payment transactions."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
        verbose_name=_("user"),
    )
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payments",
        verbose_name=_("subscription"),
    )
    stripe_payment_intent_id = models.CharField(
        _("Stripe payment intent ID"),
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        db_index=True,
    )
    amount = models.DecimalField(
        _("amount"),
        max_digits=10,
        decimal_places=2,
    )
    currency = models.CharField(
        _("currency"),
        max_length=10,
        default="usd",
    )
    status = models.CharField(
        _("status"),
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
    )
    description = models.CharField(
        _("description"),
        max_length=500,
        blank=True,
        default="",
    )

    class Meta:
        db_table = "payments_payment"
        verbose_name = _("payment")
        verbose_name_plural = _("payments")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"], name="idx_pay_user_date"),
            models.Index(fields=["status"], name="idx_pay_status"),
        ]

    def __str__(self) -> str:
        return f"{self.user} — {self.amount} {self.currency} ({self.get_status_display()})"


# ---------------------------------------------------------------------------
# Invoice
# ---------------------------------------------------------------------------


class Invoice(TimestampMixin):
    """Mirrors Stripe invoices for local querying."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="invoices",
        verbose_name=_("user"),
    )
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices",
        verbose_name=_("subscription"),
    )
    stripe_invoice_id = models.CharField(
        _("Stripe invoice ID"),
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        db_index=True,
    )
    amount = models.DecimalField(
        _("amount"),
        max_digits=10,
        decimal_places=2,
    )
    currency = models.CharField(
        _("currency"),
        max_length=10,
        default="usd",
    )
    status = models.CharField(
        _("status"),
        max_length=20,
        choices=InvoiceStatus.choices,
        default=InvoiceStatus.DRAFT,
        db_index=True,
    )
    pdf_url = models.URLField(
        _("PDF URL"),
        max_length=1024,
        blank=True,
        default="",
    )
    period_start = models.DateTimeField(_("period start"), null=True, blank=True)
    period_end = models.DateTimeField(_("period end"), null=True, blank=True)

    class Meta:
        db_table = "payments_invoice"
        verbose_name = _("invoice")
        verbose_name_plural = _("invoices")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"], name="idx_inv_user_date"),
            models.Index(fields=["status"], name="idx_inv_status"),
        ]

    def __str__(self) -> str:
        return f"Invoice {self.stripe_invoice_id or self.pk} — {self.amount} {self.currency}"
