from __future__ import annotations

from django.contrib import admin

from apps.categories.models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin[Category]):
    """Admin configuration for categories."""

    list_display = ("name", "slug", "parent", "order", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    ordering = ("order", "name")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("id", "created_at", "updated_at")
    raw_id_fields = ("parent",)

    fieldsets = (
        (
            None,
            {
                "fields": ("name", "slug", "icon", "parent", "order", "is_active"),
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
