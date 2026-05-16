"""Сервис проверки функциональных флагов."""

from __future__ import annotations

import hashlib
import logging

from django.core.cache import cache
from django.contrib.auth.models import AbstractBaseUser

from apps.feature_flags.models import FeatureFlag

logger = logging.getLogger(__name__)

CACHE_TTL = 60  # секунд
CACHE_PREFIX = "ff:"


class FeatureFlagService:
    """Централизованная проверка включённости функций."""

    @staticmethod
    def is_enabled(key: str, user: AbstractBaseUser | None = None) -> bool:
        """Проверить, включён ли флаг для данного пользователя."""
        cache_key = f"{CACHE_PREFIX}{key}"
        flag_data = cache.get(cache_key)

        if flag_data is None:
            try:
                flag = FeatureFlag.objects.get(key=key)
                flag_data = {
                    "is_enabled": flag.is_enabled,
                    "rollout_percentage": flag.rollout_percentage,
                    "whitelist": flag.whitelist,
                    "blacklist": flag.blacklist,
                }
                cache.set(cache_key, flag_data, CACHE_TTL)
            except FeatureFlag.DoesNotExist:
                return False

        if not flag_data["is_enabled"]:
            return False

        if user is None:
            return flag_data["rollout_percentage"] >= 100

        user_id = str(user.pk)
        user_email = getattr(user, "email", "")

        # Чёрный список имеет приоритет.
        blacklist = flag_data.get("blacklist") or []
        if user_id in blacklist or user_email in blacklist:
            return False

        # Белый список — принудительное включение.
        whitelist = flag_data.get("whitelist") or []
        if user_id in whitelist or user_email in whitelist:
            return True

        # Процентный раскат по стабильному хешу user_id + key.
        rollout = flag_data.get("rollout_percentage", 100)
        if rollout >= 100:
            return True
        if rollout <= 0:
            return False

        bucket = int(hashlib.md5(f"{key}:{user_id}".encode()).hexdigest(), 16) % 100
        return bucket < rollout

    @staticmethod
    def invalidate_cache(key: str) -> None:
        """Сбросить кеш флага после изменения в админке."""
        cache.delete(f"{CACHE_PREFIX}{key}")

    @staticmethod
    def get_all_for_user(user: AbstractBaseUser | None = None) -> dict[str, bool]:
        """Вернуть словарь всех флагов и их состояния для пользователя."""
        flags = FeatureFlag.objects.filter(is_enabled=True)
        return {flag.key: FeatureFlagService.is_enabled(flag.key, user) for flag in flags}
