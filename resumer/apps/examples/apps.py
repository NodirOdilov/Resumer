from __future__ import annotations

from django.apps import AppConfig


class ExamplesConfig(AppConfig):
    """Configuration for the examples application."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.examples"
    verbose_name = "Resume Examples"

    def ready(self) -> None:
        import apps.examples.signals  # noqa: F401
