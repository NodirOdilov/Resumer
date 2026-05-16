from __future__ import annotations

import uuid
from typing import Any

from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


class Category(TimestampMixin):
    """Generic hierarchical category used across the platform."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    name = models.CharField(
        _("name"),
        max_length=255,
    )
    slug = models.SlugField(
        _("slug"),
        max_length=255,
        unique=True,
        blank=True,
        db_index=True,
    )
    icon = models.CharField(
        _("icon"),
        max_length=100,
        blank=True,
        default="",
        help_text=_("Icon identifier (e.g. Material Icon or FontAwesome class)."),
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="children",
        verbose_name=_("parent category"),
    )
    order = models.PositiveIntegerField(
        _("order"),
        default=0,
        db_index=True,
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        db_index=True,
    )

    class Meta:
        db_table = "categories_category"
        verbose_name = _("category")
        verbose_name_plural = _("categories")
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)

    def _generate_unique_slug(self) -> str:
        base_slug: str = slugify(self.name, allow_unicode=True)
        if not base_slug:
            base_slug = str(uuid.uuid4())[:8]

        slug = base_slug
        counter = 1
        qs = Category.objects.all()
        if self.pk:
            qs = qs.exclude(pk=self.pk)

        while qs.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    @property
    def is_root(self) -> bool:
        """Return ``True`` if this category has no parent."""
        return self.parent_id is None

    @property
    def depth(self) -> int:
        """Return the nesting depth (0 for root categories)."""
        level = 0
        current = self
        while current.parent_id is not None:
            level += 1
            current = current.parent  # type: ignore[assignment]
        return level
