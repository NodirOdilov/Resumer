from __future__ import annotations

from typing import Any

from rest_framework import serializers

from apps.cvs.models import CV, CVDownload, CVSection, CVVersion


class CVVersionSerializer(serializers.ModelSerializer):
    """Read-only serializer for CV version snapshots."""

    class Meta:
        model = CVVersion
        fields = [
            "id",
            "version_number",
            "content",
            "created_at",
        ]
        read_only_fields = fields


class CVDownloadSerializer(serializers.ModelSerializer):
    """Read-only serializer for CV download records."""

    class Meta:
        model = CVDownload
        fields = [
            "id",
            "format",
            "file_url",
            "file_size",
            "created_at",
        ]
        read_only_fields = fields


class CVSectionSerializer(serializers.ModelSerializer):
    """Serializer for individual CV sections."""

    class Meta:
        model = CVSection
        fields = [
            "id",
            "section_type",
            "content",
            "order",
            "is_visible",
        ]
        read_only_fields = ["id"]


class CVListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""

    versions_count: serializers.SerializerMethodField = serializers.SerializerMethodField()
    sections_count: serializers.SerializerMethodField = serializers.SerializerMethodField()

    class Meta:
        model = CV
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "language",
            "template",
            "downloads_count",
            "versions_count",
            "sections_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "downloads_count",
            "versions_count",
            "sections_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]

    def get_versions_count(self, obj: CV) -> int:
        return obj.versions.count()

    def get_sections_count(self, obj: CV) -> int:
        return obj.sections.count()


class CVDetailSerializer(serializers.ModelSerializer):
    """Full serializer for retrieve views — includes content, sections, and versions."""

    versions_count: serializers.SerializerMethodField = serializers.SerializerMethodField()
    recent_versions: serializers.SerializerMethodField = serializers.SerializerMethodField()
    sections = CVSectionSerializer(many=True, read_only=True)

    class Meta:
        model = CV
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "content",
            "settings",
            "language",
            "template",
            "downloads_count",
            "versions_count",
            "recent_versions",
            "sections",
            "last_edited",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "downloads_count",
            "versions_count",
            "recent_versions",
            "sections",
            "last_edited",
            "created_at",
            "updated_at",
        ]

    def get_versions_count(self, obj: CV) -> int:
        return obj.versions.count()

    def get_recent_versions(self, obj: CV) -> list[dict[str, Any]]:
        versions = obj.versions.order_by("-version_number")[:5]
        return CVVersionSerializer(versions, many=True).data


class CVCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new CV."""

    sections = CVSectionSerializer(many=True, required=False)

    class Meta:
        model = CV
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "content",
            "settings",
            "language",
            "template",
            "sections",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data: dict[str, Any]) -> CV:
        sections_data: list[dict[str, Any]] = validated_data.pop("sections", [])
        validated_data["user"] = self.context["request"].user
        cv = super().create(validated_data)
        for section_data in sections_data:
            CVSection.objects.create(cv=cv, **section_data)
        return cv


class CVUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an existing CV."""

    sections = CVSectionSerializer(many=True, required=False)

    class Meta:
        model = CV
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "content",
            "settings",
            "language",
            "template",
            "sections",
            "downloads_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "downloads_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]

    def update(self, instance: CV, validated_data: dict[str, Any]) -> CV:
        sections_data: list[dict[str, Any]] | None = validated_data.pop("sections", None)
        instance = super().update(instance, validated_data)

        if sections_data is not None:
            instance.sections.all().delete()
            for section_data in sections_data:
                CVSection.objects.create(cv=instance, **section_data)

        return instance


class CVDownloadRequestSerializer(serializers.Serializer):
    """Input serializer for requesting a CV download."""

    format = serializers.ChoiceField(choices=CVDownload.Format.choices)
