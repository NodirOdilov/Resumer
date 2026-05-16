from __future__ import annotations

from rest_framework import serializers

from apps.seo.models import Redirect, SEOMetadata


class SEOMetadataSerializer(serializers.ModelSerializer[SEOMetadata]):
    """Read-only serializer for SEO metadata entries."""

    class Meta:
        model = SEOMetadata
        fields: list[str] = [
            "id",
            "path",
            "title",
            "description",
            "og_image",
            "canonical_url",
            "no_index",
        ]
        read_only_fields: list[str] = fields


class RedirectSerializer(serializers.ModelSerializer[Redirect]):
    """Read-only serializer for URL redirects."""

    class Meta:
        model = Redirect
        fields: list[str] = [
            "id",
            "old_path",
            "new_path",
            "is_permanent",
        ]
        read_only_fields: list[str] = fields
