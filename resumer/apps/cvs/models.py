from __future__ import annotations

import uuid
from typing import Any, ClassVar

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from apps.core.models import ActiveManager, AllObjectsManager, BaseModel, OrderableMixin, TimestampMixin


class CV(BaseModel):
    """A user's curriculum vitae document with academic-oriented sections."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        COMPLETE = "complete", "Complete"
        DOWNLOADED = "downloaded", "Downloaded"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cvs",
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
        related_name="cvs",
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
        help_text=(
            "Full CV content as JSON. Supports academic sections: "
            "publications, conferences, research, teaching, grants, etc."
        ),
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
        verbose_name = "CV"
        verbose_name_plural = "CVs"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "slug"],
                condition=models.Q(is_deleted=False),
                name="unique_cv_slug_per_user",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "status"], name="cv_user_status_idx"),
            models.Index(fields=["user", "-created_at"], name="cv_user_created_idx"),
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
        queryset = CV.objects.filter(user=self.user)
        if self.pk:
            queryset = queryset.exclude(pk=self.pk)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    def duplicate(self) -> CV:
        """Create an exact copy of this CV for the same user, including sections."""
        new_cv = CV.objects.create(
            user=self.user,
            title=f"{self.title} (Copy)",
            template=self.template,
            status=self.Status.DRAFT,
            content=self.content.copy() if self.content else {},
            settings=self.settings.copy() if self.settings else {},
            language=self.language,
        )
        for section in self.sections.all():
            CVSection.objects.create(
                cv=new_cv,
                section_type=section.section_type,
                content=section.content.copy() if section.content else {},
                order=section.order,
                is_visible=section.is_visible,
            )
        return new_cv

    @property
    def current_version_number(self) -> int:
        latest = self.versions.order_by("-version_number").values_list(
            "version_number", flat=True
        ).first()
        return latest or 0


class CVVersion(TimestampMixin):
    """Immutable snapshot of a CV's content at a point in time."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    cv = models.ForeignKey(
        CV,
        on_delete=models.CASCADE,
        related_name="versions",
        verbose_name="CV",
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
        verbose_name = "CV version"
        verbose_name_plural = "CV versions"
        ordering = ["-version_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["cv", "version_number"],
                name="unique_cv_version_number",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.cv.title} v{self.version_number}"


class CVSection(OrderableMixin):
    """An individual section within a CV, ordered and togglable."""

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
        PUBLICATIONS = "publications", "Publications"
        CONFERENCES = "conferences", "Conferences"
        RESEARCH = "research", "Research"
        TEACHING = "teaching", "Teaching"
        GRANTS = "grants", "Grants"
        CUSTOM = "custom", "Custom"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    cv = models.ForeignKey(
        CV,
        on_delete=models.CASCADE,
        related_name="sections",
        verbose_name="CV",
    )
    section_type = models.CharField(
        max_length=30,
        choices=SectionType.choices,
        db_index=True,
        verbose_name="section type",
    )
    content = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="content",
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name="is visible",
    )

    class Meta:
        verbose_name = "CV section"
        verbose_name_plural = "CV sections"
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.cv.title} - {self.get_section_type_display()}"


class CVDownload(TimestampMixin):
    """Record of a CV file download."""

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
    cv = models.ForeignKey(
        CV,
        on_delete=models.CASCADE,
        related_name="downloads",
        verbose_name="CV",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cv_downloads",
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
        verbose_name = "CV download"
        verbose_name_plural = "CV downloads"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.cv.title} - {self.format} ({self.user})"
