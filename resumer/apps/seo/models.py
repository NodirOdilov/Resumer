from __future__ import annotations

import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import TimestampMixin


class SEOMetadata(TimestampMixin):
    """Per-path SEO metadata for any public URL on the site."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    path = models.CharField(
        _("URL path"),
        max_length=500,
        unique=True,
        db_index=True,
        help_text=_("The URL path this metadata applies to (e.g. /resume-templates/)."),
    )
    title = models.CharField(
        _("title"),
        max_length=70,
        help_text=_("SEO page title (max 70 characters)."),
    )
    description = models.CharField(
        _("description"),
        max_length=160,
        blank=True,
        default="",
        help_text=_("Meta description (max 160 characters)."),
    )
    og_image = models.ImageField(
        _("OG image"),
        upload_to="seo/og-images/",
        null=True,
        blank=True,
        help_text=_("Open Graph image for social sharing."),
    )
    canonical_url = models.URLField(
        _("canonical URL"),
        blank=True,
        default="",
        help_text=_("Canonical URL if this page has a preferred version."),
    )
    no_index = models.BooleanField(
        _("no index"),
        default=False,
        help_text=_("If True, the page will include a noindex robots directive."),
    )

    class Meta:
        db_table = "seo_metadata"
        verbose_name = _("SEO metadata")
        verbose_name_plural = _("SEO metadata")
        ordering = ["path"]

    def __str__(self) -> str:
        return f"{self.path} — {self.title}"


class Redirect(models.Model):
    """URL redirect mapping for moved or renamed pages."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    old_path = models.CharField(
        _("old path"),
        max_length=500,
        unique=True,
        db_index=True,
        help_text=_("The old URL path to redirect from."),
    )
    new_path = models.CharField(
        _("new path"),
        max_length=500,
        help_text=_("The new URL path to redirect to."),
    )
    is_permanent = models.BooleanField(
        _("permanent redirect"),
        default=True,
        help_text=_("If True, a 301 redirect is used; otherwise 302."),
    )
    created_at = models.DateTimeField(
        _("created at"),
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        db_table = "seo_redirect"
        verbose_name = _("redirect")
        verbose_name_plural = _("redirects")
        ordering = ["old_path"]

    def __str__(self) -> str:
        status_code = "301" if self.is_permanent else "302"
        return f"[{status_code}] {self.old_path} → {self.new_path}"
