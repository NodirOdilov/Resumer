"""Админка Telegram."""

from django.contrib import admin

from apps.telegram.models import TelegramAccount, TelegramLinkToken


@admin.register(TelegramAccount)
class TelegramAccountAdmin(admin.ModelAdmin):
    list_display = ["telegram_username", "telegram_id", "user", "is_active", "last_interaction_at"]
    search_fields = ["telegram_username", "telegram_id", "user__email"]
    list_filter = ["is_active", "notifications_enabled"]


@admin.register(TelegramLinkToken)
class TelegramLinkTokenAdmin(admin.ModelAdmin):
    list_display = ["token", "user", "expires_at", "used_at"]
    readonly_fields = ["token", "used_at"]
