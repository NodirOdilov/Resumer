from __future__ import annotations

from rest_framework import serializers

from apps.analytics.models import Event


class EventSerializer(serializers.ModelSerializer[Event]):
    """Serializer for creating analytics events from the frontend."""

    class Meta:
        model = Event
        fields: list[str] = [
            "id",
            "event_type",
            "metadata",
            "created_at",
        ]
        read_only_fields: list[str] = [
            "id",
            "created_at",
        ]


class EventSummarySerializer(serializers.Serializer):
    """Serializer for aggregated analytics summaries."""

    event_type = serializers.CharField()
    count = serializers.IntegerField()
