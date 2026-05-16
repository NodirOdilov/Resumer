"""Права доступа для API-ключей."""

from rest_framework import permissions

from apps.api_keys.services import APIKeyService


class HasAPIKeyScope(permissions.BasePermission):
    """Требует наличия области доступа у API-ключа."""

    required_scope = "read"

    def has_permission(self, request, view) -> bool:
        api_key = getattr(request, "api_key", None)
        if api_key is None:
            return True  # JWT-аутентификация — пропускаем.
        return APIKeyService.has_scope(api_key, self.required_scope)
