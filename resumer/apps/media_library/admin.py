from __future__ import annotations

from django.contrib import admin
from django.utils.html import format_html

from apps.media_library.models import MediaFile


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin[MediaFile]):
    """Admin configuration for media library files with image preview."""

    list_display = (
        "original_filename",
        "file_type",
        "file_size_display",
        "dimensions",
        "image_preview",
        "uploaded_by",
        "created_at",
    )
    list_filter = ("file_type", "created_at")
    search_fields = ("original_filename", "alt_text")
    ordering = ("-created_at",)
    readonly_fields = (
        "id",
        "file_size",
        "width",
        "height",
        "created_at",
        "image_preview_large",
    )

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "file",
                    "file_type",
                    "original_filename",
                    "alt_text",
                ),
            },
        ),
        (
            "Preview",
            {
                "fields": ("image_preview_large",),
            },
        ),
        (
            "File Info",
            {
                "fields": ("file_size", "width", "height", "thumbnail"),
            },
        ),
        (
            "Ownership",
            {
                "fields": ("uploaded_by",),
            },
        ),
        (
            "Metadata",
            {
                "classes": ("collapse",),
                "fields": ("id", "created_at"),
            },
        ),
    )

    @admin.display(description="Size")
    def file_size_display(self, obj: MediaFile) -> str:
        if obj.file_size < 1024:
            return f"{obj.file_size} B"
        if obj.file_size < 1024 * 1024:
            return f"{obj.file_size / 1024:.1f} KB"
        return f"{obj.file_size / (1024 * 1024):.1f} MB"

    @admin.display(description="Dimensions")
    def dimensions(self, obj: MediaFile) -> str:
        if obj.width and obj.height:
            return f"{obj.width} x {obj.height}"
        return "-"

    @admin.display(description="Preview")
    def image_preview(self, obj: MediaFile) -> str:
        if obj.is_image and obj.thumbnail:
            return format_html(
                '<img src="{}" style="max-height:40px;max-width:60px;" />',
                obj.thumbnail.url,
            )
        if obj.is_image and obj.file:
            return format_html(
                '<img src="{}" style="max-height:40px;max-width:60px;" />',
                obj.file.url,
            )
        return "-"

    @admin.display(description="Image Preview")
    def image_preview_large(self, obj: MediaFile) -> str:
        if obj.is_image and obj.file:
            return format_html(
                '<img src="{}" style="max-height:300px;max-width:400px;" />',
                obj.file.url,
            )
        return "No preview available."
