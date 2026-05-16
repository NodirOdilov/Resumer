from __future__ import annotations

from django.apps import AppConfig


class TemplatesLibraryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.templates_library"
    verbose_name = "Templates Library"
