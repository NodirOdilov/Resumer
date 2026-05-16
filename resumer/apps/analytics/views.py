from __future__ import annotations

from django.db.models import Count, QuerySet
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.analytics.models import Event
from apps.analytics.serializers import EventSerializer, EventSummarySerializer


class EventViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet[Event],
):
    """ViewSet for tracking analytics events.

    * **create** — Record a new analytics event (public, attaches user if authenticated).
    * **summary** — Aggregated event counts by type (authenticated users only).
    """

    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def get_queryset(self) -> QuerySet[Event]:
        return Event.objects.all()

    def perform_create(self, serializer: EventSerializer) -> None:
        extra: dict = {}
        request = self.request
        if request.user.is_authenticated:
            extra["user"] = request.user
        extra["ip_address"] = self._get_client_ip(request)
        extra["user_agent"] = request.META.get("HTTP_USER_AGENT", "")
        extra["session_id"] = request.session.session_key or ""
        serializer.save(**extra)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def summary(self, request: Request) -> Response:
        """Return event counts grouped by event_type for the current user."""
        qs = (
            Event.objects.filter(user=request.user)
            .values("event_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        serializer = EventSummarySerializer(qs, many=True)
        return Response(serializer.data)

    @staticmethod
    def _get_client_ip(request: Request) -> str | None:
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
