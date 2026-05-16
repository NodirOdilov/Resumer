from __future__ import annotations

import uuid
from typing import Any, ClassVar

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from apps.core.models import ActiveManager, AllObjectsManager, BaseModel, TimestampMixin


class CoverLetter(BaseModel):
    """A user's cover letter document."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        COMPLETE = "complete", "Complete"
        DOWNLOADED = "downloaded", "Downloaded"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cover_letters",
        verbose_name="user",
    )
    title = models.CharField(
        max_length=255,
        verbose_name="title",
    )
    slug = models.SlugField(
        max_length=255,
        blank=True,
        db_index=True,
        verbose_name="slug",
    )
    template = models.ForeignKey(
        "templates_library.DocumentTemplate",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cover_letters",
        verbose_name="template",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
        verbose_name="status",
    )
    content = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="content",
        help_text="Structured content: greeting, opening, body, closing, signature.",
    )
    settings = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="settings",
        help_text="Display and formatting settings.",
    )
    language = models.CharField(
        max_length=10,
        default="en-us",
        db_index=True,
        verbose_name="language",
    )
    resume = models.ForeignKey(
        "resumes.Resume",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cover_letters",
        verbose_name="matching resume",
    )
    downloads_count = models.PositiveIntegerField(
        default=0,
        verbose_name="downloads count",
    )
    last_edited = models.DateTimeField(
        auto_now=True,
        verbose_name="last edited",
    )

    objects: ClassVar[ActiveManager] = ActiveManager()
    all_objects: ClassVar[AllObjectsManager] = AllObjectsManager()

    class Meta:
        verbose_name = "cover letter"
        verbose_name_plural = "cover letters"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "slug"],
                condition=models.Q(is_deleted=False),
                name="unique_cover_letter_slug_per_user",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "status"], name="cl_user_status_idx"),
            models.Index(fields=["user", "-created_at"], name="cl_user_created_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.title} ({self.user})"

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
        queryset = CoverLetter.objects.filter(user=self.user)
        if self.pk:
            queryset = queryset.exclude(pk=self.pk)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    def duplicate(self) -> CoverLetter:
        """Create an exact copy of this cover letter for the same user."""
        return CoverLetter.objects.create(
            user=self.user,
            title=f"{self.title} (Copy)",
            template=self.template,
            status=self.Status.DRAFT,
            content=self.content.copy() if self.content else {},
            settings=self.settings.copy() if self.settings else {},
            language=self.language,
            resume=self.resume,
        )

    @property
    def current_version_number(self) -> int:
        latest = self.versions.order_by("-version_number").values_list(
            "version_number", flat=True
        ).first()
        return latest or 0


class CoverLetterVersion(TimestampMixin):
    """Immutable snapshot of a cover letter's content at a point in time."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    cover_letter = models.ForeignKey(
        CoverLetter,
        on_delete=models.CASCADE,
        related_name="versions",
        verbose_name="cover letter",
    )
    version_number = models.PositiveIntegerField(
        verbose_name="version number",
    )
    content = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="content",
    )

    class Meta:
        verbose_name = "cover letter version"
        verbose_name_plural = "cover letter versions"
        ordering = ["-version_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["cover_letter", "version_number"],
                name="unique_cl_version_number",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.cover_letter.title} v{self.version_number}"


class CoverLetterDownload(TimestampMixin):
    """Record of a cover letter file download."""

    class Format(models.TextChoices):
        PDF = "pdf", "PDF"
        DOCX = "docx", "DOCX"
        TXT = "txt", "TXT"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    cover_letter = models.ForeignKey(
        CoverLetter,
        on_delete=models.CASCADE,
        related_name="downloads",
        verbose_name="cover letter",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cover_letter_downloads",
        verbose_name="user",
    )
    format = models.CharField(
        max_length=10,
        choices=Format.choices,
        verbose_name="format",
    )
    file_url = models.URLField(
        max_length=1024,
        blank=True,
        verbose_name="file URL",
    )
    file_size = models.PositiveIntegerField(
        default=0,
        verbose_name="file size (bytes)",
    )

    class Meta:
        verbose_name = "cover letter download"
        verbose_name_plural = "cover letter downloads"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.cover_letter.title} - {self.format} ({self.user})"
