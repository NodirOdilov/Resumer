"""Модели API-ключей для enterprise-интеграций."""

from __future__ import annotations

import secrets
import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


class APIKeyScope(models.TextChoices):
    """Области доступа API-ключа."""

    READ = "read", _("Чтение")
    WRITE = "write", _("Запись")
    DOCUMENTS = "documents", _("Документы")
    TEMPLATES = "templates", _("Шаблоны")
    ANALYTICS = "analytics", _("Аналитика")
    FULL = "full", _("Полный доступ")


class APIKey(TimestampMixin):
    """API-ключ пользователя для программного доступа."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="api_keys",
        verbose_name=_("Пользователь"),
    )
    name = models.CharField(max_length=128, verbose_name=_("Название"))
    # Префикс ключа для идентификации (rsr_live_abc123).
    prefix = models.CharField(max_length=16, unique=True, db_index=True, verbose_name=_("Префикс"))
    # Хеш полного ключа (никогда не храним plaintext).
    key_hash = models.CharField(max_length=128, verbose_name=_("Хеш ключа"))
    scopes = models.JSONField(
        default=list,
        verbose_name=_("Области доступа"),
        help_text=_("Список значений APIKeyScope."),
    )
    is_active = models.BooleanField(default=True, db_index=True, verbose_name=_("Активен"))
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name=_("Истекает"))
    last_used_at = models.DateTimeField(null=True, blank=True, verbose_name=_("Последнее использование"))
    rate_limit = models.PositiveIntegerField(
        default=1000,
        verbose_name=_("Лимит запросов/час"),
    )
    organization_id = models.UUIDField(null=True, blank=True, db_index=True)

    class Meta:
        db_table = "api_keys"
        verbose_name = _("API-ключ")
        verbose_name_plural = _("API-ключи")
        ordering = ["-created_at"]

    @property
    def is_expired(self) -> bool:
        if self.expires_at is None:
            return False
        return timezone.now() > self.expires_at

    def __str__(self) -> str:
        return f"{self.name} ({self.prefix}...)"
