from __future__ import annotations

import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class Review(models.Model):
    """User-submitted review / testimonial for the platform."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviews",
        verbose_name=_("user"),
    )
    name = models.CharField(
        _("name"),
        max_length=255,
        help_text=_("Display name of the reviewer."),
    )
    rating = models.IntegerField(
        _("rating"),
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text=_("Rating from 1 to 5."),
    )
    text = models.TextField(
        _("review text"),
    )
    is_featured = models.BooleanField(
        _("featured"),
        default=False,
        db_index=True,
        help_text=_("Featured reviews appear prominently on the site."),
    )
    is_approved = models.BooleanField(
        _("approved"),
        default=False,
        db_index=True,
        help_text=_("Only approved reviews are publicly visible."),
    )
    created_at = models.DateTimeField(
        _("created at"),
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        db_table = "reviews_review"
        verbose_name = _("review")
        verbose_name_plural = _("reviews")
        ordering = ["-is_featured", "-created_at"]
        indexes = [
            models.Index(
                fields=["is_approved", "is_featured", "-created_at"],
                name="idx_review_approved_feat",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.name} — {self.rating}/5"
