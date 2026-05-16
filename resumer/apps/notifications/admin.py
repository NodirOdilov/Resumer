from __future__ import annotations

from django.contrib import admin

from apps.notifications.models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin[Notification]):
    """Admin configuration for notifications."""

    list_display = (
        "subject",
        "notification_type",
        "user",
        "is_read",
        "is_sent",
        "sent_at",
        "created_at",
    )
    list_filter = ("notification_type", "is_read", "is_sent")
    search_fields = ("subject", "user__email")
    ordering = ("-created_at",)
    readonly_fields = ("id", "created_at", "sent_at")
    raw_id_fields = ("user",)

    fieldsets = (
        (
            None,
            {
                "fields": ("user", "notification_type", "subject", "body"),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_read", "is_sent", "sent_at"),
            },
        ),
        (
            "Metadata",
            {
                "classes": ("collapse",),
                "fields": ("id", "created_at"),
            },
        ),
    )


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin[NotificationPreference]):
    """Admin configuration for notification preferences."""

    list_display = (
        "user",
        "email_marketing",
        "email_product_updates",
        "email_tips",
    )
    search_fields = ("user__email",)
    raw_id_fields = ("user",)
    readonly_fields = ("id",)
