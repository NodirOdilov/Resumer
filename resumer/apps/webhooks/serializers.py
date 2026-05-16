"""Сериализаторы API вебхуков."""

from rest_framework import serializers

from apps.webhooks.models import WebhookDelivery, WebhookEndpoint


class WebhookEndpointSerializer(serializers.ModelSerializer):
  class Meta:
    model = WebhookEndpoint
    fields = [
      "id", "url", "events", "is_active", "description",
      "failure_count", "organization_id", "created_at", "updated_at",
    ]
    read_only_fields = ["id", "failure_count", "created_at", "updated_at"]


class WebhookEndpointCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = WebhookEndpoint
    fields = ["url", "events", "description", "organization_id"]


class WebhookDeliverySerializer(serializers.ModelSerializer):
  class Meta:
    model = WebhookDelivery
    fields = [
      "id", "endpoint", "event_type", "payload", "status",
      "response_status", "attempt_count", "delivered_at", "created_at",
    ]
    read_only_fields = fields
