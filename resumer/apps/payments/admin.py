from __future__ import annotations

from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from apps.payments.models import Invoice, Payment, Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin[Subscription]):
    list_display = (
        "user",
        "plan",
        "status",
        "trial_end",
        "current_period_end",
        "cancel_at_period_end",
        "created_at",
    )
    list_filter = ("status", "plan", "cancel_at_period_end")
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "stripe_customer_id",
        "stripe_subscription_id",
    )
    readonly_fields = (
        "id",
        "stripe_customer_id",
        "stripe_subscription_id",
        "created_at",
        "updated_at",
    )
    raw_id_fields = ("user",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("id", "user", "plan", "status")}),
        (
            _("Stripe"),
            {"fields": ("stripe_customer_id", "stripe_subscription_id")},
        ),
        (
            _("Trial"),
            {"fields": ("trial_start", "trial_end")},
        ),
        (
            _("Billing period"),
            {"fields": ("current_period_start", "current_period_end")},
        ),
        (
            _("Cancellation"),
            {"fields": ("cancel_at_period_end", "canceled_at")},
        ),
        (
            _("Timestamps"),
            {"fields": ("created_at", "updated_at")},
        ),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin[Payment]):
    list_display = (
        "user",
        "amount",
        "currency",
        "status",
        "stripe_payment_intent_id",
        "created_at",
    )
    list_filter = ("status", "currency")
    search_fields = (
        "user__email",
        "stripe_payment_intent_id",
        "description",
    )
    readonly_fields = (
        "id",
        "stripe_payment_intent_id",
        "created_at",
        "updated_at",
    )
    raw_id_fields = ("user", "subscription")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin[Invoice]):
    list_display = (
        "user",
        "stripe_invoice_id",
        "amount",
        "currency",
        "status",
        "period_start",
        "period_end",
        "created_at",
    )
    list_filter = ("status", "currency")
    search_fields = (
        "user__email",
        "stripe_invoice_id",
    )
    readonly_fields = (
        "id",
        "stripe_invoice_id",
        "created_at",
        "updated_at",
    )
    raw_id_fields = ("user", "subscription")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
