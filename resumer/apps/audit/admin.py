"""Административная панель журнала аудита."""

from django.contrib import admin

from apps.audit.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Просмотр записей аудита в Django Admin."""

    list_display = [
        "created_at",
        "action",
        "resource_type",
        "resource_id",
        "user",
        "ip_address",
    ]
    list_filter = ["action", "resource_type", "created_at"]
    search_fields = ["resource_id", "description", "user__email"]
    readonly_fields = [
        "id",
        "user",
        "action",
        "resource_type",
        "resource_id",
        "description",
        "changes",
        "metadata",
        "ip_address",
        "user_agent",
        "request_id",
        "organization_id",
        "created_at",
    ]
    date_hierarchy = "created_at"

    def has_add_permission(self, request) -> bool:
        """Запрет ручного создания записей аудита."""
        return False

    def has_change_permission(self, request, obj=None) -> bool:
        """Запрет редактирования записей аудита."""
        return False

    def has_delete_permission(self, request, obj=None) -> bool:
        """Удаление только суперпользователем."""
        return request.user.is_superuser
