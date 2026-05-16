"""Модели исходящих вебхуков."""

from __future__ import annotations

import secrets
import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


class WebhookEventType(models.TextChoices):
    """Типы событий, отправляемых через вебхуки."""

    RESUME_CREATED = "resume.created", _("Резюме создано")
    RESUME_UPDATED = "resume.updated", _("Резюме обновлено")
    RESUME_DELETED = "resume.deleted", _("Резюме удалено")
    RESUME_DOWNLOADED = "resume.downloaded", _("Резюме скачано")
    PAYMENT_SUCCEEDED = "payment.succeeded", _("Платёж успешен")
    SUBSCRIPTION_UPDATED = "subscription.updated", _("Подписка обновлена")
    USER_REGISTERED = "user.registered", _("Пользователь зарегистрирован")


class WebhookEndpoint(TimestampMixin):
    """Конечная точка вебхука пользователя или организации."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="webhook_endpoints",
        verbose_name=_("Пользователь"),
    )
    organization_id = models.UUIDField(
        null=True,
        blank=True,
        db_index=True,
        verbose_name=_("ID организации"),
    )
    url = models.URLField(max_length=2048, verbose_name=_("URL"))
    secret = models.CharField(
        max_length=64,
        verbose_name=_("Секрет подписи"),
        help_text=_("Используется для HMAC-SHA256 подписи payload."),
    )
    events = models.JSONField(
        default=list,
        verbose_name=_("События"),
        help_text=_("Список типов событий WebhookEventType."),
    )
    is_active = models.BooleanField(default=True, db_index=True, verbose_name=_("Активен"))
    description = models.CharField(max_length=255, blank=True, verbose_name=_("Описание"))
    failure_count = models.PositiveIntegerField(default=0, verbose_name=_("Счётчик ошибок"))

    class Meta:
        db_table = "webhook_endpoints"
        verbose_name = _("конечная точка вебхука")
        verbose_name_plural = _("конечные точки вебхуков")
        ordering = ["-created_at"]

    def save(self, *args, **kwargs) -> None:
        if not self.secret:
            self.secret = secrets.token_hex(32)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Webhook {self.url[:50]}"


class WebhookDelivery(models.Model):
    """Запись о доставке вебхука."""

    class Status(models.TextChoices):
        PENDING = "pending", _("Ожидает")
        SUCCESS = "success", _("Успех")
        FAILED = "failed", _("Ошибка")
        RETRYING = "retrying", _("Повтор")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    endpoint = models.ForeignKey(
        WebhookEndpoint,
        on_delete=models.CASCADE,
        related_name="deliveries",
        verbose_name=_("Конечная точка"),
    )
    event_type = models.CharField(max_length=64, db_index=True, verbose_name=_("Тип события"))
    payload = models.JSONField(default=dict, verbose_name=_("Payload"))
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
        verbose_name=_("Статус"),
    )
    response_status = models.PositiveSmallIntegerField(null=True, blank=True)
    response_body = models.TextField(blank=True)
    attempt_count = models.PositiveSmallIntegerField(default=0)
    next_retry_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "webhook_deliveries"
        verbose_name = _("доставка вебхука")
        verbose_name_plural = _("доставки вебхуков")
        ordering = ["-created_at"]
