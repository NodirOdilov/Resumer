"""Сервис глобальных настроек и метрик платформы."""

from __future__ import annotations

import logging
from typing import Any

from django.core.cache import cache

from apps.core.models import SystemConfiguration

logger = logging.getLogger(__name__)

CACHE_PREFIX = "syscfg:"
CACHE_TTL = 300


class PlatformService:
    """Управление системными настройками платформы."""

    @staticmethod
    def get(key: str, default: Any = None) -> Any:
        """Получить значение настройки с кешированием."""
        cache_key = f"{CACHE_PREFIX}{key}"
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

        try:
            config = SystemConfiguration.objects.get(key=key)
            value = config.value
            cache.set(cache_key, value, CACHE_TTL)
            return value
        except SystemConfiguration.DoesNotExist:
            return default

    @staticmethod
    def set(key: str, value: Any, description: str = "", is_public: bool = False) -> SystemConfiguration:
        """Установить или обновить настройку."""
        config, _ = SystemConfiguration.objects.update_or_create(
            key=key,
            defaults={
                "value": value,
                "description": description,
                "is_public": is_public,
            },
        )
        cache.delete(f"{CACHE_PREFIX}{key}")
        logger.info("Системная настройка обновлена: %s", key)
        return config

    @staticmethod
    def get_public_settings() -> dict[str, Any]:
        """Все публичные настройки для клиентского API."""
        configs = SystemConfiguration.objects.filter(is_public=True)
        return {cfg.key: cfg.value for cfg in configs}
