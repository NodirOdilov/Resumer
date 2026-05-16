"""Модели журнала аудита для enterprise-платформы."""

from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class AuditAction(models.TextChoices):
    """Типы действий, фиксируемых в журнале аудита."""

    CREATE = "create", _("Создание")
    UPDATE = "update", _("Обновление")
    DELETE = "delete", _("Удаление")
    LOGIN = "login", _("Вход")
    LOGOUT = "logout", _("Выход")
    DOWNLOAD = "download", _("Скачивание")
    EXPORT = "export", _("Экспорт")
    PAYMENT = "payment", _("Платёж")
    PERMISSION = "permission", _("Изменение прав")
    API = "api", _("API-запрос")
    SYSTEM = "system", _("Системное событие")


class AuditLog(models.Model):
    """Запись журнала аудита — неизменяемый след действия в системе."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
        verbose_name=_("Пользователь"),
    )
    action = models.CharField(
        max_length=32,
        choices=AuditAction.choices,
        db_index=True,
        verbose_name=_("Действие"),
    )
    resource_type = models.CharField(
        max_length=64,
        db_index=True,
        verbose_name=_("Тип ресурса"),
        help_text=_("Например: resume, cv, subscription, organization."),
    )
    resource_id = models.CharField(
        max_length=64,
        blank=True,
        db_index=True,
        verbose_name=_("ID ресурса"),
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("Описание"),
    )
    changes = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Изменения"),
        help_text=_("Словарь old/new значений для операций обновления."),
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Метаданные"),
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name=_("IP-адрес"),
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name=_("User-Agent"),
    )
    request_id = models.CharField(
        max_length=64,
        blank=True,
        db_index=True,
        verbose_name=_("ID запроса"),
    )
    organization_id = models.UUIDField(
        null=True,
        blank=True,
        db_index=True,
        verbose_name=_("ID организации"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name=_("Создано"),
    )

    class Meta:
        db_table = "audit_log"
        verbose_name = _("запись аудита")
        verbose_name_plural = _("журнал аудита")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "created_at"], name="idx_audit_user_time"),
            models.Index(fields=["resource_type", "resource_id"], name="idx_audit_resource"),
            models.Index(fields=["action", "created_at"], name="idx_audit_action_time"),
        ]

    def __str__(self) -> str:
        user_label = str(self.user_id) if self.user_id else "system"
        return f"{self.action} {self.resource_type}:{self.resource_id} by {user_label}"
