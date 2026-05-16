from __future__ import annotations

import uuid

from django.db import models
from django.utils.text import slugify

from apps.core.models import TimestampMixin


class DocumentTemplate(TimestampMixin):
    """A resume / CV / cover-letter template available in the library."""

    class TemplateType(models.TextChoices):
        RESUME = "resume", "Resume"
        CV = "cv", "CV"
        COVER_LETTER = "cover_letter", "Cover Letter"

    class TemplateCategory(models.TextChoices):
        PROFESSIONAL = "professional", "Professional"
        SIMPLE = "simple", "Simple"
        MODERN = "modern", "Modern"
        CREATIVE = "creative", "Creative"
        BUSINESS = "business", "Business"
        CLASSIC = "classic", "Classic"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    name = models.CharField(
        max_length=100,
        verbose_name="name",
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
        db_index=True,
        verbose_name="slug",
    )
    skin_id = models.CharField(
        max_length=10,
        unique=True,
        verbose_name="skin ID",
        help_text='Short unique identifier, e.g. "srz4".',
    )
    type = models.CharField(
        max_length=20,
        choices=TemplateType.choices,
        default=TemplateType.RESUME,
        db_index=True,
        verbose_name="type",
    )
    category = models.CharField(
        max_length=20,
        choices=TemplateCategory.choices,
        db_index=True,
        verbose_name="category",
    )
    preview_image = models.ImageField(
        upload_to="templates/previews/",
        blank=True,
        verbose_name="preview image",
    )
    html_template = models.TextField(
        blank=True,
        verbose_name="HTML template path",
        help_text="Path to the HTML template file.",
    )
    css_styles = models.TextField(
        blank=True,
        verbose_name="CSS styles path",
        help_text="Path to the CSS stylesheet file.",
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name="active",
    )
    is_new = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="new",
    )
    is_premium = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name="premium",
    )
    is_ats_friendly = models.BooleanField(
        default=True,
        verbose_name="ATS friendly",
    )
    popularity_score = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="popularity score",
    )
    supported_sections = models.JSONField(
        default=list,
        blank=True,
        verbose_name="supported sections",
        help_text="List of section keys this template supports.",
    )
    color_schemes = models.JSONField(
        default=list,
        blank=True,
        verbose_name="color schemes",
        help_text="Inline colour-scheme definitions.",
    )
    font_options = models.JSONField(
        default=list,
        blank=True,
        verbose_name="font options",
        help_text="Available font families for this template.",
    )

    class Meta:
        ordering = ["-popularity_score"]
        verbose_name = "document template"
        verbose_name_plural = "document templates"

    def __str__(self) -> str:
        return f"{self.name} ({self.skin_id})"

    def save(self, *args: object, **kwargs: object) -> None:
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)  # type: ignore[misc]

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _generate_unique_slug(self) -> str:
        base_slug = slugify(self.name, allow_unicode=True)
        if not base_slug:
            base_slug = str(uuid.uuid4())[:8]

        slug = base_slug
        counter = 1
        qs = DocumentTemplate.objects.all()
        if self.pk:
            qs = qs.exclude(pk=self.pk)

        while qs.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug


class TemplateColorScheme(TimestampMixin):
    """A named colour scheme linked to a specific document template."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID",
    )
    template = models.ForeignKey(
        DocumentTemplate,
        on_delete=models.CASCADE,
        related_name="color_scheme_set",
        verbose_name="template",
    )
    name = models.CharField(
        max_length=60,
        verbose_name="name",
    )
    primary_color = models.CharField(
        max_length=7,
        verbose_name="primary colour",
        help_text="Hex colour, e.g. #3498DB.",
    )
    secondary_color = models.CharField(
        max_length=7,
        verbose_name="secondary colour",
    )
    accent_color = models.CharField(
        max_length=7,
        verbose_name="accent colour",
    )
    text_color = models.CharField(
        max_length=7,
        verbose_name="text colour",
    )
    background_color = models.CharField(
        max_length=7,
        verbose_name="background colour",
    )
    is_default = models.BooleanField(
        default=False,
        verbose_name="default",
    )

    class Meta:
        ordering = ["-is_default", "name"]
        verbose_name = "template colour scheme"
        verbose_name_plural = "template colour schemes"
        constraints = [
            models.UniqueConstraint(
                fields=["template", "name"],
                name="unique_scheme_name_per_template",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.template.name} - {self.name}"
