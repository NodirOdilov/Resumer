"""Конфигурация приложения аудита."""

from django.apps import AppConfig


class AuditConfig(AppConfig):
    """Регистрация модуля аудита в Django."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.audit"
    verbose_name = "Аудит"

    def ready(self) -> None:
        # Подключение сигналов аудита при старте приложения.
        import apps.audit.signals  # noqa: F401
