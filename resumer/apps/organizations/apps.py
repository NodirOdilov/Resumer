"""Конфигурация приложения организаций."""

from django.apps import AppConfig


class OrganizationsConfig(AppConfig):
    """Регистрация модуля организаций."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.organizations"
    verbose_name = "Организации"

    def ready(self) -> None:
        import apps.organizations.signals  # noqa: F401
