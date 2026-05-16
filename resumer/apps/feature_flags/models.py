"""Модели функциональных флагов для постепенного раската функций."""

from __future__ import annotations

import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


class FeatureFlag(TimestampMixin):
    """Функциональный флаг — включает/отключает возможности платформы."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    key = models.CharField(
        max_length=128,
        unique=True,
        db_index=True,
        verbose_name=_("Ключ"),
        help_text=_("Уникальный идентификатор, например: ai_suggestions_v2."),
    )
    name = models.CharField(
        max_length=255,
        verbose_name=_("Название"),
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("Описание"),
    )
    is_enabled = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name=_("Включён"),
    )
    rollout_percentage = models.PositiveSmallIntegerField(
        default=100,
        verbose_name=_("Процент раската"),
        help_text=_("0-100: доля пользователей, для которых флаг активен."),
    )
    # Список email или user_id для принудительного включения.
    whitelist = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_("Белый список"),
    )
    # Список ключей для принудительного отключения.
    blacklist = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_("Чёрный список"),
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Метаданные"),
    )

    class Meta:
        db_table = "feature_flags"
        verbose_name = _("функциональный флаг")
        verbose_name_plural = _("функциональные флаги")
        ordering = ["key"]

    def __str__(self) -> str:
        status = "ON" if self.is_enabled else "OFF"
        return f"{self.key} [{status}]"
