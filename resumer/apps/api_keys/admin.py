"""Административная панель API-ключей."""

from django.contrib import admin

from apps.api_keys.models import APIKey


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ["name", "prefix", "user", "is_active", "last_used_at", "expires_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "prefix", "user__email"]
    readonly_fields = ["key_hash", "prefix", "last_used_at", "created_at", "updated_at"]
