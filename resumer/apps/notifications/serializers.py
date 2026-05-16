from __future__ import annotations

from rest_framework import serializers

from apps.notifications.models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer[Notification]):
    """Read-only serializer for user notifications."""

    class Meta:
        model = Notification
        fields: list[str] = [
            "id",
            "notification_type",
            "subject",
            "body",
            "is_read",
            "created_at",
        ]
        read_only_fields: list[str] = [
            "id",
            "notification_type",
            "subject",
            "body",
            "created_at",
        ]


class NotificationPreferenceSerializer(serializers.ModelSerializer[NotificationPreference]):
    """Serializer for viewing and updating notification preferences."""

    class Meta:
        model = NotificationPreference
        fields: list[str] = [
            "email_marketing",
            "email_product_updates",
            "email_tips",
        ]
