from __future__ import annotations

from django.contrib import admin
from django.utils.html import format_html

from apps.seo.models import Redirect, SEOMetadata


@admin.register(SEOMetadata)
class SEOMetadataAdmin(admin.ModelAdmin[SEOMetadata]):
    """Admin configuration for SEO metadata entries."""

    list_display = (
        "path",
        "title",
        "description_preview",
        "no_index",
        "has_canonical",
        "updated_at",
    )
    list_filter = ("no_index",)
    search_fields = ("path", "title", "description")
    ordering = ("path",)
    readonly_fields = ("id", "created_at", "updated_at")

    fieldsets = (
        (
            None,
            {
                "fields": ("path", "title", "description"),
            },
        ),
        (
            "Open Graph",
            {
                "fields": ("og_image",),
            },
        ),
        (
            "Advanced",
            {
                "fields": ("canonical_url", "no_index"),
            },
        ),
        (
            "Metadata",
            {
                "classes": ("collapse",),
                "fields": ("id", "created_at", "updated_at"),
            },
        ),
    )

    @admin.display(description="Description")
    def description_preview(self, obj: SEOMetadata) -> str:
        text = obj.description
        if len(text) > 80:
            return f"{text[:80]}..."
        return text

    @admin.display(boolean=True, description="Canonical?")
    def has_canonical(self, obj: SEOMetadata) -> bool:
        return bool(obj.canonical_url)


@admin.register(Redirect)
class RedirectAdmin(admin.ModelAdmin[Redirect]):
    """Admin configuration for URL redirects."""

    list_display = ("old_path", "new_path", "redirect_type", "created_at")
    list_filter = ("is_permanent",)
    search_fields = ("old_path", "new_path")
    ordering = ("old_path",)
    readonly_fields = ("id", "created_at")

    @admin.display(description="Type")
    def redirect_type(self, obj: Redirect) -> str:
        return "301 Permanent" if obj.is_permanent else "302 Temporary"
