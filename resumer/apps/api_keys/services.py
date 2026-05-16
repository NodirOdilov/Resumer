"""Сервис генерации и проверки API-ключей."""

from __future__ import annotations

import hashlib
import logging
import secrets

from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.api_keys.models import APIKey

logger = logging.getLogger(__name__)
User = get_user_model()

KEY_PREFIX = "rsr_live_"


class APIKeyService:
    """Создание и аутентификация API-ключей."""

    @staticmethod
    def _hash_key(raw_key: str) -> str:
        return hashlib.sha256(raw_key.encode()).hexdigest()

    @staticmethod
    def generate_key(user: User, name: str, scopes: list[str] | None = None) -> tuple[APIKey, str]:
        """Создать API-ключ. Возвращает (модель, plaintext ключ — показывается один раз)."""
        prefix_suffix = secrets.token_hex(4)
        prefix = f"{KEY_PREFIX}{prefix_suffix}"
        secret = secrets.token_urlsafe(32)
        raw_key = f"{prefix}.{secret}"

        api_key = APIKey.objects.create(
            user=user,
            name=name,
            prefix=prefix,
            key_hash=APIKeyService._hash_key(raw_key),
            scopes=scopes or ["read"],
        )
        logger.info("API-ключ создан: %s для user=%s", api_key.prefix, user.pk)
        return api_key, raw_key

    @staticmethod
    def authenticate(raw_key: str) -> APIKey | None:
        """Проверить API-ключ и вернуть модель при успехе."""
        if not raw_key or "." not in raw_key:
            return None

        prefix = raw_key.split(".", 1)[0]
        key_hash = APIKeyService._hash_key(raw_key)

        try:
            api_key = APIKey.objects.select_related("user").get(
                prefix=prefix,
                key_hash=key_hash,
                is_active=True,
            )
        except APIKey.DoesNotExist:
            return None

        if api_key.is_expired:
            return None

        api_key.last_used_at = timezone.now()
        api_key.save(update_fields=["last_used_at", "updated_at"])
        return api_key

    @staticmethod
    def has_scope(api_key: APIKey, required_scope: str) -> bool:
        """Проверить наличие области доступа."""
        scopes = api_key.scopes or []
        return "full" in scopes or required_scope in scopes
