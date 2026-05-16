from __future__ import annotations

from typing import Any

from rest_framework import serializers

from apps.cl_examples.models import CoverLetterExample


# ──────────────────────────── List ────────────────────────────


class CoverLetterExampleListSerializer(serializers.ModelSerializer[CoverLetterExample]):
    """Lightweight serializer for cover-letter example list views (no content)."""

    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = CoverLetterExample
        fields: list[str] = [
            "id",
            "title",
            "slug",
            "category",
            "category_name",
            "job_title",
            "experience_level",
            "template",
            "preview_image",
            "meta_title",
            "meta_description",
            "is_featured",
            "views_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields: list[str] = fields


# ──────────────────────────── Detail ────────────────────────────


class CoverLetterExampleDetailSerializer(serializers.ModelSerializer[CoverLetterExample]):
    """Full serializer for a single cover-letter example including content and related examples."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    related_examples = serializers.SerializerMethodField()

    class Meta:
        model = CoverLetterExample
        fields: list[str] = [
            "id",
            "title",
            "slug",
            "category",
            "category_name",
            "job_title",
            "experience_level",
            "content",
            "template",
            "preview_image",
            "meta_title",
            "meta_description",
            "is_featured",
            "views_count",
            "created_at",
            "updated_at",
            "related_examples",
        ]
        read_only_fields: list[str] = fields

    def get_related_examples(self, obj: CoverLetterExample) -> list[dict[str, Any]]:
        """Return up to 5 related cover-letter examples from the same category."""
        related_qs = (
            CoverLetterExample.objects.filter(category=obj.category)
            .exclude(pk=obj.pk)
            .select_related("category")
            .order_by("-is_featured", "-created_at")[:5]
        )
        return CoverLetterExampleListSerializer(related_qs, many=True).data  # type: ignore[no-any-return]
