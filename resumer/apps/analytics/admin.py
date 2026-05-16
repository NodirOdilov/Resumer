from __future__ import annotations

from django.contrib import admin

from apps.analytics.models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin[Event]):
    """Admin configuration for analytics events."""

    list_display = (
        "event_type",
        "user",
        "ip_address",
        "session_id_short",
        "created_at",
    )
    list_filter = ("event_type", "created_at")
    search_fields = ("event_type", "user__email", "ip_address", "session_id")
    ordering = ("-created_at",)
    readonly_fields = (
        "id",
        "user",
        "event_type",
        "metadata",
        "ip_address",
        "user_agent",
        "session_id",
        "created_at",
    )
    raw_id_fields = ("user",)
    date_hierarchy = "created_at"

    fieldsets = (
        (
            None,
            {
                "fields": ("event_type", "user", "metadata"),
            },
        ),
        (
            "Request Info",
            {
                "fields": ("ip_address", "user_agent", "session_id"),
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

    @admin.display(description="Session")
    def session_id_short(self, obj: Event) -> str:
        if obj.session_id:
            return f"{obj.session_id[:12]}..."
        return "-"

    def has_add_permission(self, request: object) -> bool:
        return False

    def has_change_permission(self, request: object, obj: object = None) -> bool:
        return False
