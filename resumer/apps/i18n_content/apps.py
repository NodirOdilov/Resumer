from __future__ import annotations

from django.apps import AppConfig


class I18NContentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.i18n_content"
    verbose_name = "Internationalization Content"
