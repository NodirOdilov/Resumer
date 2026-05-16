"""Сериализаторы API организаций."""

from rest_framework import serializers

from apps.organizations.models import Organization, OrganizationInvite, OrganizationMember


class OrganizationSerializer(serializers.ModelSerializer):
    """Сериализация организации."""

    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "logo",
            "website",
            "is_active",
            "max_members",
            "max_documents",
            "settings",
            "members_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "members_count"]

    def get_members_count(self, obj: Organization) -> int:
        return obj.members.filter(is_active=True).count()


class OrganizationMemberSerializer(serializers.ModelSerializer):
    """Сериализация участника организации."""

    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationMember
        fields = [
            "id",
            "organization",
            "user",
            "user_email",
            "user_name",
            "role",
            "is_active",
            "joined_at",
        ]
        read_only_fields = ["id", "joined_at", "user_email", "user_name"]

    def get_user_name(self, obj: OrganizationMember) -> str:
        return obj.user.get_full_name() or obj.user.email


class OrganizationInviteSerializer(serializers.ModelSerializer):
    """Сериализация приглашения."""

    class Meta:
        model = OrganizationInvite
        fields = [
            "id",
            "organization",
            "email",
            "role",
            "token",
            "expires_at",
            "accepted_at",
            "is_revoked",
            "created_at",
        ]
        read_only_fields = ["id", "token", "accepted_at", "created_at"]


class CreateOrganizationSerializer(serializers.Serializer):
    """Входные данные для создания организации."""

    name = serializers.CharField(max_length=255)
    slug = serializers.SlugField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, default="")


class InviteMemberSerializer(serializers.Serializer):
    """Входные данные для приглашения участника."""

    email = serializers.EmailField()
    role = serializers.ChoiceField(
        choices=["admin", "member", "viewer"],
        default="member",
    )
