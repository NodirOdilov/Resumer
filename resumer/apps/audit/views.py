"""API представления журнала аудита."""

from __future__ import annotations

from django.db.models import QuerySet
from django_filters import rest_framework as filters
from rest_framework import permissions, viewsets

from apps.audit.models import AuditLog
from apps.audit.serializers import AuditLogSerializer


class AuditLogFilter(filters.FilterSet):
    """Фильтры для поиска записей аудита."""

    action = filters.CharFilter(field_name="action")
    resource_type = filters.CharFilter(field_name="resource_type")
    user = filters.UUIDFilter(field_name="user_id")
    created_after = filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_before = filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = AuditLog
        fields = ["action", "resource_type", "user"]


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Только чтение журнала аудита — доступно администраторам и staff."""

    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_class = AuditLogFilter
    search_fields = ["description", "resource_id", "resource_type"]
    ordering_fields = ["created_at", "action", "resource_type"]
    ordering = ["-created_at"]

    def get_queryset(self) -> QuerySet[AuditLog]:
        """Возвращает все записи аудита с оптимизацией запросов."""
        return AuditLog.objects.select_related("user").all()
