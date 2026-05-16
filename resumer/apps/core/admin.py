"""Административная панель ядра платформы."""

from django.contrib import admin

from apps.core.models import SystemConfiguration


@admin.register(SystemConfiguration)
class SystemConfigurationAdmin(admin.ModelAdmin):
    list_display = ["key", "is_public", "updated_at"]
    list_filter = ["is_public"]
    search_fields = ["key", "description"]
