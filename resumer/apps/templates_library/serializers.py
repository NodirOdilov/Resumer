from __future__ import annotations

from rest_framework import serializers

from apps.templates_library.models import DocumentTemplate, TemplateColorScheme


class TemplateColorSchemeSerializer(serializers.ModelSerializer):
    """Serializer for :model:`TemplateColorScheme`."""

    class Meta:
        model = TemplateColorScheme
        fields = [
            "id",
            "name",
            "primary_color",
            "secondary_color",
            "accent_color",
            "text_color",
            "background_color",
            "is_default",
        ]
        read_only_fields = fields


class TemplateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer used on the template-list endpoint."""

    class Meta:
        model = DocumentTemplate
        fields = [
            "id",
            "name",
            "slug",
            "skin_id",
            "type",
            "category",
            "preview_image",
            "is_new",
            "is_premium",
            "is_ats_friendly",
        ]
        read_only_fields = fields


class TemplateDetailSerializer(serializers.ModelSerializer):
    """Full serializer with nested colour schemes for the detail endpoint."""

    color_scheme_set = TemplateColorSchemeSerializer(many=True, read_only=True)

    class Meta:
        model = DocumentTemplate
        fields = [
            "id",
            "name",
            "slug",
            "skin_id",
            "type",
            "category",
            "preview_image",
            "html_template",
            "css_styles",
            "is_active",
            "is_new",
            "is_premium",
            "is_ats_friendly",
            "popularity_score",
            "supported_sections",
            "color_schemes",
            "font_options",
            "color_scheme_set",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class TemplateCategorySerializer(serializers.Serializer):
    """Serializer for the category-aggregation endpoint."""

    category = serializers.CharField()
    category_display = serializers.CharField()
    count = serializers.IntegerField()
