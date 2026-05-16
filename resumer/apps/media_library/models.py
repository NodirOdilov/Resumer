from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class FileType(models.TextChoices):
    IMAGE = "image", _("Image")
    DOCUMENT = "document", _("Document")
    AVATAR = "avatar", _("Avatar")


class MediaFile(models.Model):
    """An uploaded media file with optional thumbnail and metadata."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    file = models.FileField(
        _("file"),
        upload_to="media_library/files/%Y/%m/",
        help_text=_("The uploaded file."),
    )
    thumbnail = models.ImageField(
        _("thumbnail"),
        upload_to="media_library/thumbnails/%Y/%m/",
        null=True,
        blank=True,
        help_text=_("Auto-generated thumbnail (images only)."),
    )
    alt_text = models.CharField(
        _("alt text"),
        max_length=255,
        blank=True,
        default="",
        help_text=_("Alternative text for accessibility."),
    )
    file_type = models.CharField(
        _("file type"),
        max_length=20,
        choices=FileType.choices,
        db_index=True,
    )
    original_filename = models.CharField(
        _("original filename"),
        max_length=500,
        help_text=_("The original name of the uploaded file."),
    )
    file_size = models.PositiveIntegerField(
        _("file size"),
        help_text=_("File size in bytes."),
    )
    width = models.PositiveIntegerField(
        _("width"),
        null=True,
        blank=True,
        help_text=_("Image width in pixels (images only)."),
    )
    height = models.PositiveIntegerField(
        _("height"),
        null=True,
        blank=True,
        help_text=_("Image height in pixels (images only)."),
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="media_files",
        verbose_name=_("uploaded by"),
    )
    created_at = models.DateTimeField(
        _("created at"),
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        db_table = "media_library_file"
        verbose_name = _("media file")
        verbose_name_plural = _("media files")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["file_type"], name="idx_media_file_type"),
            models.Index(fields=["uploaded_by"], name="idx_media_uploaded_by"),
        ]

    def __str__(self) -> str:
        return self.original_filename

    @property
    def is_image(self) -> bool:
        return self.file_type in (FileType.IMAGE, FileType.AVATAR)
