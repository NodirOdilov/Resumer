from __future__ import annotations

from django.apps import AppConfig


class ClExamplesConfig(AppConfig):
    """Configuration for the cover-letter examples application."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.cl_examples"
    verbose_name = "Cover Letter Examples"

    def ready(self) -> None:
        import apps.cl_examples.signals  # noqa: F401
