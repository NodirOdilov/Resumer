from __future__ import annotations

import uuid
from typing import Any

from django.db import models
from django.utils.text import slugify

from apps.core.models import TimestampMixin
from apps.examples.models import ExperienceLevel


class CoverLetterExample(TimestampMixin):
    """A curated cover-letter example used for inspiration and SEO content."""

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
        "examples.ExampleCategory",
        on_delete=models.CASCADE,
        related_name="cover_letter_examples",
        verbose_name="category",
    )
    job_title = models.CharField(
        max_length=255,
        verbose_name="job title",
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
        help_text="Full cover letter content stored as structured JSON.",
    )
    template = models.ForeignKey(
        "templates_library.DocumentTemplate",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cover_letter_examples",
        verbose_name="template",
    )
    preview_image = models.ImageField(
        upload_to="examples/cover-letters/previews/",
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
        verbose_name = "cover letter example"
        verbose_name_plural = "cover letter examples"
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
        queryset = CoverLetterExample.objects.all()
        if self.pk:
            queryset = queryset.exclude(pk=self.pk)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    def increment_views(self) -> None:
        """Atomically increment the views counter."""
        CoverLetterExample.objects.filter(pk=self.pk).update(
            views_count=models.F("views_count") + 1,
        )
        self.refresh_from_db(fields=["views_count"])
