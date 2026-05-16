"""Конфигурация приложения feature flags."""

from django.apps import AppConfig


class FeatureFlagsConfig(AppConfig):
    """Регистрация модуля feature flags."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.feature_flags"
    verbose_name = "Функциональные флаги"
