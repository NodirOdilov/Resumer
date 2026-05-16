from __future__ import annotations

from rest_framework import serializers

from apps.categories.models import Category


class CategorySerializer(serializers.ModelSerializer[Category]):
    """Read-only serializer for public category listings."""

    children_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields: list[str] = [
            "id",
            "name",
            "slug",
            "icon",
            "parent",
            "order",
            "is_active",
            "children_count",
        ]
        read_only_fields: list[str] = fields

    def get_children_count(self, obj: Category) -> int:
        return obj.children.filter(is_active=True).count()


class CategoryTreeSerializer(serializers.ModelSerializer[Category]):
    """Recursive serializer that nests child categories."""

    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields: list[str] = [
            "id",
            "name",
            "slug",
            "icon",
            "order",
            "is_active",
            "children",
        ]
        read_only_fields: list[str] = fields

    def get_children(self, obj: Category) -> list[dict]:
        qs = obj.children.filter(is_active=True).order_by("order", "name")
        return CategoryTreeSerializer(qs, many=True, context=self.context).data
