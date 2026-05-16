from __future__ import annotations

import uuid
from typing import Any

from django.conf import settings
from django.db import models
from django.utils.text import slugify

from apps.core.models import (
    ActiveManager,
    AllObjectsManager,
    SoftDeleteMixin,
    TimestampMixin,
)


class Resume(TimestampMixin, SoftDeleteMixin):
    """Primary resume model holding full resume data and rendering settings."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        COMPLETE = "complete", "Complete"
        DOWNLOADED = "downloaded", "Downloaded"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
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
        related_name="resumes",
        null=True,
        blank=True,
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
        help_text="Full resume data as JSON.",
    )
    settings = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="settings",
        help_text="Rendering settings: color, font, spacing, margins.",
    )
    language = models.CharField(
        max_length=10,
        default="en-us",
        db_index=True,
        verbose_name="language",
    )
    is_primary = models.BooleanField(
        default=False,
        verbose_name="is primary",
    )
    downloads_count = models.PositiveIntegerField(
        default=0,
        verbose_name="downloads count",
    )
    last_edited = models.DateTimeField(
        auto_now=True,
        verbose_name="last edited",
    )

    objects = ActiveManager()
    all_objects = AllObjectsManager()

    class Meta:
        unique_together = [("user", "slug")]
        ordering = ["-updated_at"]
        verbose_name = "resume"
        verbose_name_plural = "resumes"

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
        qs = Resume.all_objects.filter(user=self.user)
        if self.pk:
            qs = qs.exclude(pk=self.pk)

        while qs.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug


class ResumeVersion(models.Model):
    """Immutable snapshot of resume content at a point in time."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="versions",
        verbose_name="resume",
    )
    version_number = models.PositiveIntegerField(
        verbose_name="version number",
    )
    content = models.JSONField(
        default=dict,
        verbose_name="content",
        help_text="Snapshot of resume content at this version.",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name="created at",
    )

    class Meta:
        ordering = ["-version_number"]
        unique_together = [("resume", "version_number")]
        verbose_name = "resume version"
        verbose_name_plural = "resume versions"

    def __str__(self) -> str:
        return f"{self.resume.title} v{self.version_number}"


class ResumeSection(models.Model):
    """Individual section within a resume, orderable and toggleable."""

    class SectionType(models.TextChoices):
        SUMMARY = "summary", "Summary"
        EXPERIENCE = "experience", "Experience"
        EDUCATION = "education", "Education"
        SKILLS = "skills", "Skills"
        LANGUAGES = "languages", "Languages"
        CERTIFICATES = "certificates", "Certificates"
        PROJECTS = "projects", "Projects"
        AWARDS = "awards", "Awards"
        VOLUNTEER = "volunteer", "Volunteer"
        HOBBIES = "hobbies", "Hobbies"
        CUSTOM = "custom", "Custom"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="sections",
        verbose_name="resume",
    )
    section_type = models.CharField(
        max_length=20,
        choices=SectionType.choices,
        db_index=True,
        verbose_name="section type",
    )
    content = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="content",
    )
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="order",
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name="is visible",
    )

    class Meta:
        ordering = ["order"]
        verbose_name = "resume section"
        verbose_name_plural = "resume sections"

    def __str__(self) -> str:
        return f"{self.resume.title} - {self.get_section_type_display()}"


class ResumeDownload(models.Model):
    """Record of a resume download event with file metadata."""

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
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="downloads",
        verbose_name="resume",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resume_downloads",
        verbose_name="user",
    )
    format = models.CharField(
        max_length=10,
        choices=Format.choices,
        verbose_name="format",
    )
    file_url = models.URLField(
        max_length=1024,
        verbose_name="file URL",
        help_text="S3 path to the generated file.",
    )
    file_size = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="file size",
        help_text="File size in bytes.",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name="created at",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "resume download"
        verbose_name_plural = "resume downloads"

    def __str__(self) -> str:
        return f"{self.resume.title} - {self.format} ({self.created_at:%Y-%m-%d})"
