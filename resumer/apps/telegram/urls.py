"""Маршруты API Telegram."""

from django.urls import path

from apps.telegram.views import (
    TelegramLinkTokenView,
    TelegramLinkView,
    TelegramMeView,
    TelegramUnlinkView,
)

urlpatterns = [
    path("me/", TelegramMeView.as_view(), name="telegram-me"),
    path("link-token/", TelegramLinkTokenView.as_view(), name="telegram-link-token"),
    path("link/", TelegramLinkView.as_view(), name="telegram-link"),
    path("unlink/", TelegramUnlinkView.as_view(), name="telegram-unlink"),
]
