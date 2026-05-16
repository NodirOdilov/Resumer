"""Модели привязки Telegram-аккаунтов к пользователям Resumer."""

from __future__ import annotations

import secrets
import uuid
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


class TelegramAccount(TimestampMixin):
    """Привязка Telegram user_id к аккаунту Resumer."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="telegram_account",
        verbose_name=_("пользователь"),
    )
    telegram_id = models.BigIntegerField(
        unique=True,
        db_index=True,
        verbose_name=_("Telegram ID"),
    )
    telegram_username = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("username"),
    )
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    language_code = models.CharField(max_length=10, default="ru")
    is_active = models.BooleanField(default=True, db_index=True)
    notifications_enabled = models.BooleanField(default=True)
    last_interaction_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "telegram_accounts"
        verbose_name = _("Telegram-аккаунт")
        verbose_name_plural = _("Telegram-аккаунты")

    def __str__(self) -> str:
        return f"@{self.telegram_username or self.telegram_id} -> {self.user.email}"


class TelegramLinkToken(TimestampMixin):
    """Одноразовый токен для привязки Telegram через веб или бота."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="telegram_link_tokens",
    )
    token = models.CharField(max_length=64, unique=True, db_index=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "telegram_link_tokens"
        ordering = ["-created_at"]

    @classmethod
    def create_for_user(cls, user, minutes: int = 15) -> TelegramLinkToken:
        return cls.objects.create(
            user=user,
            token=secrets.token_urlsafe(32),
            expires_at=timezone.now() + timedelta(minutes=minutes),
        )

    @property
    def is_valid(self) -> bool:
        return self.used_at is None and timezone.now() < self.expires_at
