from __future__ import annotations

from typing import Any

from rest_framework import serializers

from apps.examples.models import ExampleCategory, ResumeExample


# ──────────────────────────── Category ────────────────────────────


class ExampleCategorySerializer(serializers.ModelSerializer[ExampleCategory]):
    """Serializer for example categories with annotated examples count."""

    examples_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = ExampleCategory
        fields: list[str] = [
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "order",
            "parent",
            "is_active",
            "examples_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields: list[str] = fields


# ──────────────────────────── Resume Example – List ────────────────────────────


class ResumeExampleListSerializer(serializers.ModelSerializer[ResumeExample]):
    """Lightweight serializer for resume example list views (no content)."""

    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = ResumeExample
        fields: list[str] = [
            "id",
            "title",
            "slug",
            "category",
            "category_name",
            "subcategory",
            "job_title",
            "industry",
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


# ──────────────────────────── Resume Example – Detail ────────────────────────────


class ResumeExampleDetailSerializer(serializers.ModelSerializer[ResumeExample]):
    """Full serializer for a single resume example including content and related examples."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    related_examples = serializers.SerializerMethodField()

    class Meta:
        model = ResumeExample
        fields: list[str] = [
            "id",
            "title",
            "slug",
            "category",
            "category_name",
            "subcategory",
            "job_title",
            "industry",
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

    def get_related_examples(self, obj: ResumeExample) -> list[dict[str, Any]]:
        """Return up to 5 related examples from the same category, excluding the current one."""
        related_qs = (
            ResumeExample.objects.filter(category=obj.category)
            .exclude(pk=obj.pk)
            .select_related("category")
            .order_by("-is_featured", "-created_at")[:5]
        )
        return ResumeExampleListSerializer(related_qs, many=True).data  # type: ignore[no-any-return]
