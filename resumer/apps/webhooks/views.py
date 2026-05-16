"""API представления вебхуков."""

from django.db.models import QuerySet
from rest_framework import permissions, viewsets

from apps.webhooks.models import WebhookDelivery, WebhookEndpoint
from apps.webhooks.serializers import (
    WebhookDeliverySerializer,
    WebhookEndpointCreateSerializer,
    WebhookEndpointSerializer,
)


class WebhookEndpointViewSet(viewsets.ModelViewSet):
    """Управление конечными точками вебхуков."""

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self) -> QuerySet[WebhookEndpoint]:
        return WebhookEndpoint.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return WebhookEndpointCreateSerializer
        return WebhookEndpointSerializer

    def perform_create(self, serializer) -> None:
        serializer.save(user=self.request.user)


class WebhookDeliveryViewSet(viewsets.ReadOnlyModelViewSet):
    """История доставок вебхуков."""

    serializer_class = WebhookDeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self) -> QuerySet[WebhookDelivery]:
        return WebhookDelivery.objects.filter(
            endpoint__user=self.request.user,
        ).select_related("endpoint")
