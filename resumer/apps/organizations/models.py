"""Модели организаций, участников и приглашений."""

from __future__ import annotations

import secrets
import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


class OrganizationRole(models.TextChoices):
    """Роли участников организации."""

    OWNER = "owner", _("Владелец")
    ADMIN = "admin", _("Администратор")
    MEMBER = "member", _("Участник")
    VIEWER = "viewer", _("Наблюдатель")


class Organization(TimestampMixin):
    """Организация (компания/команда) — контейнер для совместной работы."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    name = models.CharField(max_length=255, verbose_name=_("Название"))
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name=_("Slug"))
    description = models.TextField(blank=True, verbose_name=_("Описание"))
    logo = models.ImageField(
        upload_to="organizations/logos/",
        blank=True,
        null=True,
        verbose_name=_("Логотип"),
    )
    website = models.URLField(blank=True, verbose_name=_("Сайт"))
    is_active = models.BooleanField(default=True, db_index=True, verbose_name=_("Активна"))
    # Лимиты тарифного плана организации.
    max_members = models.PositiveIntegerField(default=10, verbose_name=_("Макс. участников"))
    max_documents = models.PositiveIntegerField(default=100, verbose_name=_("Макс. документов"))
    settings = models.JSONField(default=dict, blank=True, verbose_name=_("Настройки"))

    class Meta:
        db_table = "organizations"
        verbose_name = _("организация")
        verbose_name_plural = _("организации")
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class OrganizationMember(TimestampMixin):
    """Участник организации с ролью."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="members",
        verbose_name=_("Организация"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_memberships",
        verbose_name=_("Пользователь"),
    )
    role = models.CharField(
        max_length=20,
        choices=OrganizationRole.choices,
        default=OrganizationRole.MEMBER,
        db_index=True,
        verbose_name=_("Роль"),
    )
    is_active = models.BooleanField(default=True, verbose_name=_("Активен"))
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Дата вступления"))

    class Meta:
        db_table = "organization_members"
        verbose_name = _("участник организации")
        verbose_name_plural = _("участники организаций")
        unique_together = [("organization", "user")]
        ordering = ["-joined_at"]

    def __str__(self) -> str:
        return f"{self.user} @ {self.organization} ({self.role})"


class OrganizationInvite(TimestampMixin):
    """Приглашение в организацию по email."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="invites",
        verbose_name=_("Организация"),
    )
    email = models.EmailField(db_index=True, verbose_name=_("Email"))
    role = models.CharField(
        max_length=20,
        choices=OrganizationRole.choices,
        default=OrganizationRole.MEMBER,
        verbose_name=_("Роль"),
    )
    token = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        verbose_name=_("Токен"),
    )
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="sent_invites",
        verbose_name=_("Пригласил"),
    )
    expires_at = models.DateTimeField(verbose_name=_("Истекает"))
    accepted_at = models.DateTimeField(null=True, blank=True, verbose_name=_("Принято"))
    is_revoked = models.BooleanField(default=False, verbose_name=_("Отозвано"))

    class Meta:
        db_table = "organization_invites"
        verbose_name = _("приглашение")
        verbose_name_plural = _("приглашения")
        ordering = ["-created_at"]

    def save(self, *args, **kwargs) -> None:
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            from datetime import timedelta
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    def __str__(self) -> str:
        return f"Invite {self.email} -> {self.organization}"
