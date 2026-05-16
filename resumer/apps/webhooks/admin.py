"""Административная панель вебхуков."""

from django.contrib import admin

from apps.webhooks.models import WebhookDelivery, WebhookEndpoint


@admin.register(WebhookEndpoint)
class WebhookEndpointAdmin(admin.ModelAdmin):
    list_display = ["url", "user", "is_active", "failure_count", "created_at"]
    list_filter = ["is_active"]


@admin.register(WebhookDelivery)
class WebhookDeliveryAdmin(admin.ModelAdmin):
    list_display = ["event_type", "endpoint", "status", "response_status", "attempt_count", "created_at"]
    list_filter = ["status", "event_type"]
    readonly_fields = ["payload", "response_body"]
