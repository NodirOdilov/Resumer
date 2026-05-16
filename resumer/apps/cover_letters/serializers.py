from __future__ import annotations

from typing import Any

from rest_framework import serializers

from apps.cover_letters.models import CoverLetter, CoverLetterDownload, CoverLetterVersion


class CoverLetterVersionSerializer(serializers.ModelSerializer):
    """Read-only serializer for cover letter version snapshots."""

    class Meta:
        model = CoverLetterVersion
        fields = [
            "id",
            "version_number",
            "content",
            "created_at",
        ]
        read_only_fields = fields


class CoverLetterDownloadSerializer(serializers.ModelSerializer):
    """Read-only serializer for cover letter download records."""

    class Meta:
        model = CoverLetterDownload
        fields = [
            "id",
            "format",
            "file_url",
            "file_size",
            "created_at",
        ]
        read_only_fields = fields


class CoverLetterListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — omits heavy JSON fields."""

    versions_count: serializers.SerializerMethodField = serializers.SerializerMethodField()

    class Meta:
        model = CoverLetter
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "language",
            "template",
            "resume",
            "downloads_count",
            "versions_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "downloads_count",
            "versions_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]

    def get_versions_count(self, obj: CoverLetter) -> int:
        return obj.versions.count()


class CoverLetterDetailSerializer(serializers.ModelSerializer):
    """Full serializer for retrieve views — includes content and nested data."""

    versions_count: serializers.SerializerMethodField = serializers.SerializerMethodField()
    recent_versions: serializers.SerializerMethodField = serializers.SerializerMethodField()

    class Meta:
        model = CoverLetter
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "content",
            "settings",
            "language",
            "template",
            "resume",
            "downloads_count",
            "versions_count",
            "recent_versions",
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
            "last_edited",
            "created_at",
            "updated_at",
        ]

    def get_versions_count(self, obj: CoverLetter) -> int:
        return obj.versions.count()

    def get_recent_versions(self, obj: CoverLetter) -> list[dict[str, Any]]:
        versions = obj.versions.order_by("-version_number")[:5]
        return CoverLetterVersionSerializer(versions, many=True).data


class CoverLetterCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new cover letter."""

    class Meta:
        model = CoverLetter
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "content",
            "settings",
            "language",
            "template",
            "resume",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "created_at",
            "updated_at",
        ]

    def validate_content(self, value: dict[str, Any]) -> dict[str, Any]:
        allowed_keys = {"greeting", "opening", "body", "closing", "signature"}
        if value and not isinstance(value, dict):
            raise serializers.ValidationError("Content must be a JSON object.")
        unknown = set(value.keys()) - allowed_keys if value else set()
        if unknown:
            raise serializers.ValidationError(
                f"Unknown content keys: {', '.join(sorted(unknown))}. "
                f"Allowed: {', '.join(sorted(allowed_keys))}."
            )
        return value

    def create(self, validated_data: dict[str, Any]) -> CoverLetter:
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class CoverLetterUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an existing cover letter."""

    class Meta:
        model = CoverLetter
        fields = [
            "id",
            "title",
            "slug",
            "status",
            "content",
            "settings",
            "language",
            "template",
            "resume",
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

    def validate_content(self, value: dict[str, Any]) -> dict[str, Any]:
        allowed_keys = {"greeting", "opening", "body", "closing", "signature"}
        if value and not isinstance(value, dict):
            raise serializers.ValidationError("Content must be a JSON object.")
        unknown = set(value.keys()) - allowed_keys if value else set()
        if unknown:
            raise serializers.ValidationError(
                f"Unknown content keys: {', '.join(sorted(unknown))}. "
                f"Allowed: {', '.join(sorted(allowed_keys))}."
            )
        return value


class CoverLetterDownloadRequestSerializer(serializers.Serializer):
    """Input serializer for requesting a cover letter download."""

    format = serializers.ChoiceField(choices=CoverLetterDownload.Format.choices)
