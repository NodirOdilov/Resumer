from __future__ import annotations

from typing import Any

from django.utils.text import slugify
from rest_framework import serializers

from apps.resumes.models import (
    Resume,
    ResumeDownload,
    ResumeSection,
    ResumeVersion,
)


# ────────────────────────── Section ──────────────────────────


class ResumeSectionSerializer(serializers.ModelSerializer[ResumeSection]):
    """Full serializer for resume sections."""

    class Meta:
        model = ResumeSection
        fields = [
            "id",
            "resume",
            "section_type",
            "content",
            "order",
            "is_visible",
        ]
        read_only_fields = ["id", "resume"]

    def validate_section_type(self, value: str) -> str:
        valid_types = {choice[0] for choice in ResumeSection.SectionType.choices}
        if value not in valid_types:
            raise serializers.ValidationError(
                f"Invalid section type '{value}'. Must be one of: {', '.join(sorted(valid_types))}."
            )
        return value


# ────────────────────────── Version ──────────────────────────


class ResumeVersionSerializer(serializers.ModelSerializer[ResumeVersion]):
    """Read-only serializer for resume version snapshots."""

    class Meta:
        model = ResumeVersion
        fields = [
            "id",
            "resume",
            "version_number",
            "content",
            "created_at",
        ]
        read_only_fields = fields


# ────────────────────────── Download ──────────────────────────


class ResumeDownloadSerializer(serializers.ModelSerializer[ResumeDownload]):
    """Read-only serializer for resume download records."""

    class Meta:
        model = ResumeDownload
        fields = [
            "id",
            "resume",
            "user",
            "format",
            "file_url",
            "file_size",
            "created_at",
        ]
        read_only_fields = fields


# ────────────────────────── Resume List ──────────────────────────


class ResumeListSerializer(serializers.ModelSerializer[Resume]):
    """Lightweight serializer for list views — defers heavy content/settings fields."""

    sections_count = serializers.SerializerMethodField()
    template_name = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "slug",
            "template",
            "template_name",
            "status",
            "language",
            "is_primary",
            "downloads_count",
            "sections_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_sections_count(self, obj: Resume) -> int:
        return obj.sections.count()  # type: ignore[return-value]

    def get_template_name(self, obj: Resume) -> str | None:
        if obj.template_id is not None:
            return str(obj.template)
        return None


# ────────────────────────── Resume Detail ──────────────────────────


class ResumeDetailSerializer(serializers.ModelSerializer[Resume]):
    """Full serializer including content, settings, and nested sections."""

    sections = ResumeSectionSerializer(many=True, read_only=True)
    template_name = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            "id",
            "user",
            "title",
            "slug",
            "template",
            "template_name",
            "status",
            "content",
            "settings",
            "language",
            "is_primary",
            "downloads_count",
            "sections",
            "last_edited",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "slug",
            "downloads_count",
            "last_edited",
            "created_at",
            "updated_at",
        ]

    def get_template_name(self, obj: Resume) -> str | None:
        if obj.template_id is not None:
            return str(obj.template)
        return None


# ────────────────────────── Resume Create ──────────────────────────


class ResumeCreateSerializer(serializers.ModelSerializer[Resume]):
    """Serializer for creating a new resume (minimal required fields)."""

    template_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "slug",
            "template_id",
            "language",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]

    def validate_title(self, value: str) -> str:
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title must not be blank.")
        if len(value) > 255:
            raise serializers.ValidationError("Title must be at most 255 characters.")
        return value

    def validate_template_id(self, value: Any) -> Any:
        if value is not None:
            from apps.templates_library.models import DocumentTemplate  # noqa: WPS433

            if not DocumentTemplate.objects.filter(pk=value).exists():
                raise serializers.ValidationError("Template with this ID does not exist.")
        return value

    def create(self, validated_data: dict[str, Any]) -> Resume:
        template_id = validated_data.pop("template_id", None)
        user = self.context["request"].user
        resume = Resume(
            user=user,
            template_id=template_id,
            **validated_data,
        )
        resume.save()
        return resume


# ────────────────────────── Resume Update ──────────────────────────


class ResumeUpdateSerializer(serializers.ModelSerializer[Resume]):
    """Serializer for updating an existing resume."""

    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "slug",
            "template",
            "status",
            "content",
            "settings",
            "language",
            "is_primary",
            "last_edited",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "last_edited", "updated_at"]

    def validate_title(self, value: str) -> str:
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title must not be blank.")
        return value

    def validate_status(self, value: str) -> str:
        valid_statuses = {choice[0] for choice in Resume.Status.choices}
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status '{value}'. Must be one of: {', '.join(sorted(valid_statuses))}."
            )
        return value

    def update(self, instance: Resume, validated_data: dict[str, Any]) -> Resume:
        # If title changed, regenerate slug
        new_title = validated_data.get("title")
        if new_title and new_title != instance.title:
            instance.slug = ""  # Force slug regeneration in save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# ────────────────────────── Utility serializers ──────────────────────────


class ResumeSettingsSerializer(serializers.Serializer):
    """Serializer for partial settings update."""

    settings = serializers.JSONField(required=True)

    def validate_settings(self, value: Any) -> dict[str, Any]:
        if not isinstance(value, dict):
            raise serializers.ValidationError("Settings must be a JSON object.")
        allowed_keys = {"color", "font", "spacing", "margins", "font_size", "line_height", "theme"}
        unknown_keys = set(value.keys()) - allowed_keys
        if unknown_keys:
            raise serializers.ValidationError(
                f"Unknown settings keys: {', '.join(sorted(unknown_keys))}. "
                f"Allowed: {', '.join(sorted(allowed_keys))}."
            )
        return value


class ResumeDownloadRequestSerializer(serializers.Serializer):
    """Serializer for download request validation."""

    format = serializers.ChoiceField(choices=ResumeDownload.Format.choices)


class ReorderSectionsSerializer(serializers.Serializer):
    """Serializer for reordering resume sections."""

    section_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False,
    )

    def validate_section_ids(self, value: list[Any]) -> list[Any]:
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate section IDs are not allowed.")
        return value


class ChangeTemplateSerializer(serializers.Serializer):
    """Serializer for changing a resume's template."""

    template_id = serializers.UUIDField(required=True)

    def validate_template_id(self, value: Any) -> Any:
        from apps.templates_library.models import DocumentTemplate  # noqa: WPS433

        if not DocumentTemplate.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Template with this ID does not exist.")
        return value


class RestoreVersionSerializer(serializers.Serializer):
    """Serializer for restoring a resume to a previous version."""

    version_id = serializers.UUIDField(required=True)
