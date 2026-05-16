"""API представления API-ключей."""

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.api_keys.models import APIKey
from apps.api_keys.serializers import APIKeyCreateSerializer, APIKeySerializer
from apps.api_keys.services import APIKeyService


class APIKeyViewSet(viewsets.ModelViewSet):
    """Управление API-ключами пользователя."""

    serializer_class = APIKeySerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return APIKey.objects.filter(user=self.request.user)

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = APIKeyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        api_key, raw_key = APIKeyService.generate_key(
            user=request.user,
            name=serializer.validated_data["name"],
            scopes=serializer.validated_data.get("scopes"),
        )
        return Response(
            {
                "api_key": APIKeySerializer(api_key).data,
                "raw_key": raw_key,
                "warning": "Сохраните ключ сейчас — он больше не будет показан.",
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="revoke")
    def revoke(self, request: Request, pk=None) -> Response:
        """Отозвать API-ключ."""
        api_key = self.get_object()
        api_key.is_active = False
        api_key.save(update_fields=["is_active", "updated_at"])
        return Response({"status": "revoked"})
