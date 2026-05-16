"""API представления функциональных флагов."""

from __future__ import annotations

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.feature_flags.models import FeatureFlag
from apps.feature_flags.serializers import FeatureFlagPublicSerializer, FeatureFlagSerializer
from apps.feature_flags.services import FeatureFlagService


class FeatureFlagViewSet(viewsets.ModelViewSet):
    """CRUD флагов для администраторов; публичный список для клиентов."""

    queryset = FeatureFlag.objects.all()
    lookup_field = "key"

    def get_permissions(self) -> list:
        """Админские операции — только staff; список для клиента — любой авторизованный."""
        if self.action in {"list", "retrieve", "evaluate"}:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.request.user and self.request.user.is_staff:
            return FeatureFlagSerializer
        return FeatureFlagPublicSerializer

    @action(detail=False, methods=["get"], url_path="evaluate")
    def evaluate(self, request: Request) -> Response:
        """Вернуть состояние всех флагов для текущего пользователя."""
        flags = FeatureFlagService.get_all_for_user(request.user)
        data = [{"key": k, "enabled": v} for k, v in flags.items()]
        return Response(data, status=status.HTTP_200_OK)

    def perform_create(self, serializer) -> None:
        instance = serializer.save()
        FeatureFlagService.invalidate_cache(instance.key)

    def perform_update(self, serializer) -> None:
        instance = serializer.save()
        FeatureFlagService.invalidate_cache(instance.key)

    def perform_destroy(self, instance) -> None:
        key = instance.key
        instance.delete()
        FeatureFlagService.invalidate_cache(key)
