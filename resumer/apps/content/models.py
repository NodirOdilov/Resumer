from __future__ import annotations

import uuid
from typing import Any

from django.db import models
from django.utils import timezone

from apps.core.models import TimestampMixin


# ──────────────────────── Managers ────────────────────────


class PublishedArticleManager(models.Manager["Article"]):
    """Returns only published articles whose publish_at is in the past."""

    def get_queryset(self) -> models.QuerySet[Article]:
        now = timezone.now()
        return (
            super()
            .get_queryset()
            .filter(status=Article.Status.PUBLISHED, publish_at__lte=now)
        )


# ──────────────────── ArticleCategory ─────────────────────


class ArticleCategory(TimestampMixin):
    """Hierarchical category for blog articles."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    name = models.CharField(max_length=255, verbose_name="name")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="slug")
    description = models.TextField(blank=True, verbose_name="description")
    icon = models.CharField(max_length=50, blank=True, verbose_name="icon")
    order = models.PositiveIntegerField(default=0, db_index=True, verbose_name="order")
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="children",
        verbose_name="parent category",
    )
    is_active = models.BooleanField(default=True, db_index=True, verbose_name="is active")

    class Meta:
        verbose_name = "article category"
        verbose_name_plural = "article categories"
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name


# ─────────────────────── Author ───────────────────────────


class Author(TimestampMixin):
    """Blog article author / content contributor."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    name = models.CharField(max_length=255, verbose_name="name")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="slug")
    bio = models.TextField(verbose_name="biography")
    photo = models.ImageField(
        upload_to="authors/",
        null=True,
        blank=True,
        verbose_name="photo",
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="title",
        help_text='e.g. "Career Expert, CPRW"',
    )
    is_cprw_certified = models.BooleanField(
        default=False,
        verbose_name="CPRW certified",
    )
    linkedin_url = models.URLField(blank=True, verbose_name="LinkedIn URL")
    articles_count = models.PositiveIntegerField(
        default=0,
        verbose_name="articles count",
    )

    class Meta:
        verbose_name = "author"
        verbose_name_plural = "authors"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


# ──────────────────────── Tag ─────────────────────────────


class Tag(models.Model):
    """Lightweight tag for article classification."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    name = models.CharField(max_length=255, unique=True, verbose_name="name")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="slug")

    class Meta:
        verbose_name = "tag"
        verbose_name_plural = "tags"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


# ─────────────────────── Article ──────────────────────────


class Article(TimestampMixin):
    """Blog article with SEO fields and scheduled publishing."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    title = models.CharField(max_length=255, verbose_name="title")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="slug")
    category = models.ForeignKey(
        ArticleCategory,
        on_delete=models.PROTECT,
        related_name="articles",
        verbose_name="category",
    )
    author = models.ForeignKey(
        Author,
        on_delete=models.PROTECT,
        related_name="articles",
        verbose_name="author",
    )
    content = models.TextField(
        verbose_name="content",
        help_text="Rich text content (CKEditor).",
    )
    excerpt = models.TextField(max_length=500, verbose_name="excerpt")
    featured_image = models.ImageField(
        upload_to="articles/",
        null=True,
        blank=True,
        verbose_name="featured image",
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="articles",
        verbose_name="tags",
    )

    # Publishing
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
        verbose_name="status",
    )
    publish_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
        verbose_name="publish at",
        help_text="Leave blank for immediate publishing when status is set to published.",
    )

    # SEO
    meta_title = models.CharField(max_length=70, blank=True, verbose_name="meta title")
    meta_description = models.CharField(
        max_length=160,
        blank=True,
        verbose_name="meta description",
    )
    canonical_url = models.URLField(blank=True, verbose_name="canonical URL")
    faq = models.JSONField(
        default=list,
        blank=True,
        verbose_name="FAQ",
        help_text='List of {"question": "...", "answer": "..."} objects for FAQ schema.',
    )

    # Metrics
    reading_time = models.PositiveIntegerField(
        default=5,
        verbose_name="reading time (min)",
    )
    views_count = models.PositiveIntegerField(
        default=0,
        verbose_name="views count",
    )
    is_featured = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="is featured",
    )

    # Managers
    objects = models.Manager["Article"]()
    published = PublishedArticleManager()

    class Meta:
        verbose_name = "article"
        verbose_name_plural = "articles"
        ordering = ["-publish_at", "-created_at"]
        indexes = [
            models.Index(fields=["status", "publish_at"], name="content_art_status_pub"),
            models.Index(fields=["-created_at"], name="content_art_created"),
            models.Index(fields=["slug"], name="content_art_slug"),
        ]

    def __str__(self) -> str:
        return self.title

    @property
    def is_published(self) -> bool:
        """Return True if the article is live and visible to the public."""
        if self.status != self.Status.PUBLISHED:
            return False
        if self.publish_at and self.publish_at > timezone.now():
            return False
        return True

    def increment_views(self) -> None:
        """Atomically increment the view counter."""
        Article.objects.filter(pk=self.pk).update(
            views_count=models.F("views_count") + 1,
        )
        self.refresh_from_db(fields=["views_count"])
