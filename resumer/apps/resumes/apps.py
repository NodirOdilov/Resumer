from __future__ import annotations

from django.apps import AppConfig


class ResumesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.resumes"
    verbose_name = "Resumes"

    def ready(self) -> None:
        import apps.resumes.signals  # noqa: F401
