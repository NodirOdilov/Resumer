from __future__ import annotations

import uuid
from typing import Self

from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class ActiveManager(models.Manager["SoftDeleteMixin"]):
    """Manager that filters out soft-deleted records."""

    def get_queryset(self) -> models.QuerySet[SoftDeleteMixin]:
        return super().get_queryset().filter(is_deleted=False)


class AllObjectsManager(models.Manager["SoftDeleteMixin"]):
    """Manager that returns all records including soft-deleted ones."""

    def get_queryset(self) -> models.QuerySet[SoftDeleteMixin]:
        return super().get_queryset()


class TimestampMixin(models.Model):
    """Adds created_at and updated_at timestamp fields."""

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name="created at",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="updated at",
    )

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class SlugMixin(models.Model):
    """Adds an auto-generated slug field derived from the `name` field."""

    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        db_index=True,
        verbose_name="slug",
    )

    class Meta:
        abstract = True

    def save(self, *args: object, **kwargs: object) -> None:
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)  # type: ignore[misc]

    def _generate_unique_slug(self) -> str:
        name_value: str = getattr(self, "name", "")
        base_slug = slugify(name_value, allow_unicode=True)
        if not base_slug:
            base_slug = str(uuid.uuid4())[:8]

        slug = base_slug
        model_class = self.__class__
        counter = 1
        queryset = model_class.objects.all()
        if self.pk:
            queryset = queryset.exclude(pk=self.pk)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug


class OrderableMixin(models.Model):
    """Adds an integer order field for manual ordering."""

    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="order",
    )

    class Meta:
        abstract = True
        ordering = ["order"]


class SoftDeleteMixin(models.Model):
    """Adds soft-delete capability with is_deleted flag and deleted_at timestamp."""

    is_deleted = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="is deleted",
    )
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="deleted at",
    )

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    class Meta:
        abstract = True

    def soft_delete(self) -> None:
        """Mark the record as deleted without removing it from the database."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_at", "updated_at"])  # type: ignore[misc]

    def restore(self) -> None:
        """Restore a soft-deleted record."""
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=["is_deleted", "deleted_at", "updated_at"])  # type: ignore[misc]

    def hard_delete(self) -> tuple[int, dict[str, int]]:
        """Permanently remove the record from the database."""
        return super().delete()  # type: ignore[misc]

    def delete(self, using: str | None = None, keep_parents: bool = False) -> tuple[int, dict[str, int]]:
        """Override default delete to perform soft delete."""
        self.soft_delete()
        return (0, {})


class BaseModel(TimestampMixin, SoftDeleteMixin):
    """Abstract base model with UUID primary key, timestamps, and soft delete."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class SystemConfiguration(models.Model):
    """Глобальные настройки платформы (key-value store)."""

    key = models.CharField(
        max_length=128,
        unique=True,
        db_index=True,
        verbose_name="ключ",
    )
    value = models.JSONField(
        default=dict,
        verbose_name="значение",
    )
    description = models.TextField(
        blank=True,
        verbose_name="описание",
    )
    is_public = models.BooleanField(
        default=False,
        verbose_name="публичный",
        help_text="Доступен через публичный API без авторизации.",
    )
    updated_at = models.DateTimeField(auto_now=True, verbose_name="обновлено")

    class Meta:
        db_table = "system_configuration"
        verbose_name = "системная настройка"
        verbose_name_plural = "системные настройки"
        ordering = ["key"]

    def __str__(self) -> str:
        return self.key
