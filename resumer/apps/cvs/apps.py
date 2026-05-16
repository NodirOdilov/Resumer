from __future__ import annotations

from django.apps import AppConfig


class CvsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.cvs"
    verbose_name = "CVs"

    def ready(self) -> None:
        import apps.cvs.signals  # noqa: F401
