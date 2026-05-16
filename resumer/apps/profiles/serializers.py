from __future__ import annotations

from typing import Any

from rest_framework import serializers

from apps.profiles.models import (
    Award,
    Certificate,
    Education,
    Interest,
    Language,
    Project,
    Skill,
    UserProfile,
    Volunteer,
    WorkExperience,
)


# ──────────────────────────── Sub-model Serializers ────────────────────────────


class EducationSerializer(serializers.ModelSerializer[Education]):
    """Serializer for Education model."""

    class Meta:
        model = Education
        fields = [
            "id",
            "institution",
            "degree",
            "field_of_study",
            "start_date",
            "end_date",
            "is_current",
            "gpa",
            "description",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        start_date = attrs.get("start_date") or getattr(self.instance, "start_date", None)
        end_date = attrs.get("end_date") or getattr(self.instance, "end_date", None)
        is_current = attrs.get("is_current", getattr(self.instance, "is_current", False))

        if is_current and end_date:
            raise serializers.ValidationError(
                {"end_date": "End date must be empty when 'is_current' is checked."}
            )
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be before start date."}
            )
        return attrs


class WorkExperienceSerializer(serializers.ModelSerializer[WorkExperience]):
    """Serializer for WorkExperience model."""

    class Meta:
        model = WorkExperience
        fields = [
            "id",
            "company",
            "position",
            "location",
            "start_date",
            "end_date",
            "is_current",
            "description",
            "achievements",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_achievements(self, value: Any) -> list[str]:
        if not isinstance(value, list):
            raise serializers.ValidationError("Achievements must be a list of strings.")
        for item in value:
            if not isinstance(item, str):
                raise serializers.ValidationError("Each achievement must be a string.")
        return value

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        start_date = attrs.get("start_date") or getattr(self.instance, "start_date", None)
        end_date = attrs.get("end_date") or getattr(self.instance, "end_date", None)
        is_current = attrs.get("is_current", getattr(self.instance, "is_current", False))

        if is_current and end_date:
            raise serializers.ValidationError(
                {"end_date": "End date must be empty when 'is_current' is checked."}
            )
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be before start date."}
            )
        return attrs


class SkillSerializer(serializers.ModelSerializer[Skill]):
    """Serializer for Skill model."""

    class Meta:
        model = Skill
        fields = [
            "id",
            "name",
            "level",
            "category",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_level(self, value: int) -> int:
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Skill level must be between 1 and 5.")
        return value


class LanguageSerializer(serializers.ModelSerializer[Language]):
    """Serializer for Language model."""

    class Meta:
        model = Language
        fields = [
            "id",
            "name",
            "level",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CertificateSerializer(serializers.ModelSerializer[Certificate]):
    """Serializer for Certificate model."""

    class Meta:
        model = Certificate
        fields = [
            "id",
            "name",
            "issuer",
            "issue_date",
            "expiry_date",
            "credential_id",
            "credential_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        issue_date = attrs.get("issue_date") or getattr(self.instance, "issue_date", None)
        expiry_date = attrs.get("expiry_date") or getattr(self.instance, "expiry_date", None)

        if expiry_date and issue_date and expiry_date < issue_date:
            raise serializers.ValidationError(
                {"expiry_date": "Expiry date cannot be before issue date."}
            )
        return attrs


class ProjectSerializer(serializers.ModelSerializer[Project]):
    """Serializer for Project model."""

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "url",
            "technologies",
            "start_date",
            "end_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_technologies(self, value: Any) -> list[str]:
        if not isinstance(value, list):
            raise serializers.ValidationError("Technologies must be a list of strings.")
        for item in value:
            if not isinstance(item, str):
                raise serializers.ValidationError("Each technology must be a string.")
        return value

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        start_date = attrs.get("start_date") or getattr(self.instance, "start_date", None)
        end_date = attrs.get("end_date") or getattr(self.instance, "end_date", None)

        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be before start date."}
            )
        return attrs


class AwardSerializer(serializers.ModelSerializer[Award]):
    """Serializer for Award model."""

    class Meta:
        model = Award
        fields = [
            "id",
            "title",
            "issuer",
            "date",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class VolunteerSerializer(serializers.ModelSerializer[Volunteer]):
    """Serializer for Volunteer model."""

    class Meta:
        model = Volunteer
        fields = [
            "id",
            "organization",
            "role",
            "start_date",
            "end_date",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        start_date = attrs.get("start_date") or getattr(self.instance, "start_date", None)
        end_date = attrs.get("end_date") or getattr(self.instance, "end_date", None)

        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be before start date."}
            )
        return attrs


class InterestSerializer(serializers.ModelSerializer[Interest]):
    """Serializer for Interest model."""

    class Meta:
        model = Interest
        fields = [
            "id",
            "name",
            "category",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# ──────────────────────────── Nested Profile Serializer ────────────────────────────


class ProfileSerializer(serializers.ModelSerializer[UserProfile]):
    """Full profile serializer with nested read-only sub-model lists."""

    educations = EducationSerializer(many=True, read_only=True)
    work_experiences = WorkExperienceSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    certificates = CertificateSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    awards = AwardSerializer(many=True, read_only=True)
    volunteers = VolunteerSerializer(many=True, read_only=True)
    interests = InterestSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "phone",
            "address",
            "city",
            "state",
            "zip_code",
            "country",
            "linkedin_url",
            "website_url",
            "github_url",
            "bio",
            "headline",
            "years_experience",
            "industry",
            # nested read-only
            "educations",
            "work_experiences",
            "skills",
            "languages",
            "certificates",
            "projects",
            "awards",
            "volunteers",
            "interests",
            # timestamps
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_linkedin_url(self, value: str) -> str:
        if value and "linkedin.com" not in value.lower():
            raise serializers.ValidationError("URL must be a valid LinkedIn profile link.")
        return value

    def validate_github_url(self, value: str) -> str:
        if value and "github.com" not in value.lower():
            raise serializers.ValidationError("URL must be a valid GitHub profile link.")
        return value


# ──────────────────────────── Reorder Serializer ────────────────────────────


class ReorderSerializer(serializers.Serializer):  # type: ignore[type-arg]
    """Generic serializer for reordering items.

    Expects a list of objects with ``id`` and ``order``.
    """

    id = serializers.UUIDField()
    order = serializers.IntegerField(min_value=0)
