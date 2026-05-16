from __future__ import annotations

from django.apps import AppConfig


class CoverLettersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.cover_letters"
    verbose_name = "Cover Letters"

    def ready(self) -> None:
        import apps.cover_letters.signals  # noqa: F401
