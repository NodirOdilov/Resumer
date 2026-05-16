"""Сериализаторы API журнала аудита."""

from rest_framework import serializers

from apps.audit.models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    """Сериализация записи журнала аудита для API."""

    user_email = serializers.EmailField(source="user.email", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "user",
            "user_email",
            "action",
            "resource_type",
            "resource_id",
            "description",
            "changes",
            "metadata",
            "ip_address",
            "request_id",
            "organization_id",
            "created_at",
        ]
        read_only_fields = fields
