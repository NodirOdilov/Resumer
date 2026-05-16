from __future__ import annotations

from django.contrib import admin

from apps.reviews.models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin[Review]):
    """Admin configuration for reviews with bulk approve action."""

    list_display = (
        "name",
        "rating",
        "text_preview",
        "is_featured",
        "is_approved",
        "created_at",
    )
    list_filter = ("is_approved", "is_featured", "rating")
    search_fields = ("name", "text")
    ordering = ("-created_at",)
    readonly_fields = ("id", "created_at")
    raw_id_fields = ("user",)
    actions = ("approve_reviews", "feature_reviews")

    fieldsets = (
        (
            None,
            {
                "fields": ("user", "name", "rating", "text"),
            },
        ),
        (
            "Status",
            {
                "fields": ("is_approved", "is_featured"),
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

    @admin.display(description="Text")
    def text_preview(self, obj: Review) -> str:
        if len(obj.text) > 100:
            return f"{obj.text[:100]}..."
        return obj.text

    @admin.action(description="Approve selected reviews")
    def approve_reviews(self, request: object, queryset: object) -> None:
        queryset.update(is_approved=True)  # type: ignore[union-attr]

    @admin.action(description="Feature selected reviews")
    def feature_reviews(self, request: object, queryset: object) -> None:
        queryset.update(is_featured=True, is_approved=True)  # type: ignore[union-attr]
