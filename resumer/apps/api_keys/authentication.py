"""Аутентификация по API-ключу для DRF."""

from __future__ import annotations

from rest_framework import authentication, exceptions

from apps.api_keys.services import APIKeyService


class APIKeyAuthentication(authentication.BaseAuthentication):
    """Аутентификация запросов через заголовок Authorization: Api-Key <key>."""

    keyword = "Api-Key"

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith(f"{self.keyword} "):
            return None

        raw_key = auth_header[len(self.keyword) + 1 :].strip()
        api_key = APIKeyService.authenticate(raw_key)

        if api_key is None:
            raise exceptions.AuthenticationFailed("Недействительный API-ключ.")

        # Прикрепляем ключ к request для проверки scopes в permissions.
        request.api_key = api_key
        return (api_key.user, api_key)

    def authenticate_header(self, request):
        return self.keyword
