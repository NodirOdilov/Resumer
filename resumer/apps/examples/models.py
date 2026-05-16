from __future__ import annotations

import uuid
from typing import Any

from django.db import models
from django.utils.text import slugify

from apps.core.models import TimestampMixin


# ──────────────────────────── Choices ────────────────────────────


class ExperienceLevel(models.TextChoices):
    ENTRY = "entry", "Entry Level"
    MID = "mid", "Mid Level"
    SENIOR = "senior", "Senior Level"


# ──────────────────────────── Example Category ────────────────────────────


class ExampleCategory(TimestampMixin):
    """Category grouping for resume and cover-letter examples."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    name = models.CharField(
        max_length=255,
        verbose_name="name",
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        db_index=True,
        verbose_name="slug",
    )
    description = models.TextField(
        blank=True,
        default="",
        verbose_name="description",
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        default="",
        verbose_name="icon",
        help_text="Icon name (e.g. Material or FontAwesome identifier).",
    )
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="order",
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="children",
        verbose_name="parent category",
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="is active",
    )

    class Meta:
        verbose_name = "example category"
        verbose_name_plural = "example categories"
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
        queryset = ExampleCategory.objects.all()
        if self.pk:
            queryset = queryset.exclude(pk=self.pk)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug


# ──────────────────────────── Resume Example ────────────────────────────


class ResumeExample(TimestampMixin):
    """A curated resume example used for inspiration and SEO content."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    title = models.CharField(
        max_length=255,
        verbose_name="title",
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        db_index=True,
        verbose_name="slug",
    )
    category = models.ForeignKey(
        ExampleCategory,
        on_delete=models.CASCADE,
        related_name="resume_examples",
        verbose_name="category",
    )
    subcategory = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        default="",
        verbose_name="subcategory",
    )
    job_title = models.CharField(
        max_length=255,
        verbose_name="job title",
    )
    industry = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name="industry",
    )
    experience_level = models.CharField(
        max_length=10,
        choices=ExperienceLevel.choices,
        verbose_name="experience level",
    )
    content = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="content",
        help_text="Full resume content stored as structured JSON.",
    )
    template = models.ForeignKey(
        "templates_library.DocumentTemplate",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resume_examples",
        verbose_name="template",
    )
    preview_image = models.ImageField(
        upload_to="examples/resumes/previews/",
        null=True,
        blank=True,
        verbose_name="preview image",
    )
    meta_title = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name="meta title",
    )
    meta_description = models.TextField(
        blank=True,
        default="",
        verbose_name="meta description",
    )
    is_featured = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="is featured",
    )
    views_count = models.PositiveIntegerField(
        default=0,
        verbose_name="views count",
    )

    class Meta:
        verbose_name = "resume example"
        verbose_name_plural = "resume examples"
        ordering = ["-is_featured", "-created_at"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)

    def _generate_unique_slug(self) -> str:
        base_slug: str = slugify(self.title, allow_unicode=True)
        if not base_slug:
            base_slug = str(uuid.uuid4())[:8]

        slug = base_slug
        counter = 1
        queryset = ResumeExample.objects.all()
        if self.pk:
            queryset = queryset.exclude(pk=self.pk)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    def increment_views(self) -> None:
        """Atomically increment the views counter."""
        ResumeExample.objects.filter(pk=self.pk).update(
            views_count=models.F("views_count") + 1,
        )
        self.refresh_from_db(fields=["views_count"])
