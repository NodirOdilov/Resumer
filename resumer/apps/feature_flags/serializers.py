"""Сериализаторы API feature flags."""

from rest_framework import serializers

from apps.feature_flags.models import FeatureFlag


class FeatureFlagSerializer(serializers.ModelSerializer):
    """Полная сериализация флага (только для администраторов)."""

    class Meta:
        model = FeatureFlag
        fields = [
            "id",
            "key",
            "name",
            "description",
            "is_enabled",
            "rollout_percentage",
            "whitelist",
            "blacklist",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class FeatureFlagPublicSerializer(serializers.Serializer):
    """Публичный ответ — только ключ и состояние для текущего пользователя."""

    key = serializers.CharField()
    enabled = serializers.BooleanField()
