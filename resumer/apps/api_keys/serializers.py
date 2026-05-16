"""Сериализаторы API-ключей."""

from rest_framework import serializers

from apps.api_keys.models import APIKey


class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = [
            "id", "name", "prefix", "scopes", "is_active",
            "expires_at", "last_used_at", "rate_limit", "created_at",
        ]
        read_only_fields = fields


class APIKeyCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=128)
    scopes = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=["read"],
    )


class APIKeyCreateResponseSerializer(serializers.Serializer):
    api_key = APIKeySerializer()
    raw_key = serializers.CharField(help_text="Показывается только один раз при создании.")
