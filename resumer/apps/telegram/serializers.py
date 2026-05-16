"""Сериализаторы API Telegram."""

from rest_framework import serializers

from apps.telegram.models import TelegramAccount, TelegramLinkToken


class TelegramAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramAccount
        fields = [
            "id",
            "telegram_id",
            "telegram_username",
            "first_name",
            "last_name",
            "language_code",
            "is_active",
            "notifications_enabled",
            "last_interaction_at",
            "created_at",
        ]
        read_only_fields = fields


class TelegramLinkSerializer(serializers.Serializer):
    """Привязка Telegram из бота."""

    telegram_id = serializers.IntegerField()
    telegram_username = serializers.CharField(required=False, allow_blank=True, default="")
    first_name = serializers.CharField(required=False, allow_blank=True, default="")
    last_name = serializers.CharField(required=False, allow_blank=True, default="")
    language_code = serializers.CharField(required=False, default="ru")
    link_token = serializers.CharField()


class TelegramBotAuthSerializer(serializers.Serializer):
    """Аутентификация бота по email/password от имени пользователя."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class LinkTokenResponseSerializer(serializers.Serializer):
    token = serializers.CharField()
    expires_at = serializers.DateTimeField()
    bot_deep_link = serializers.CharField()
