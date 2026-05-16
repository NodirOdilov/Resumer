"""API представления Telegram-интеграции."""

from __future__ import annotations

import os

from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.telegram.models import TelegramAccount, TelegramLinkToken
from apps.telegram.serializers import (
    LinkTokenResponseSerializer,
    TelegramAccountSerializer,
    TelegramLinkSerializer,
)


class TelegramMeView(APIView):
    """GET /api/v1/telegram/me/ — статус привязки Telegram."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request) -> Response:
        try:
            account = request.user.telegram_account
            return Response(TelegramAccountSerializer(account).data)
        except TelegramAccount.DoesNotExist:
            return Response({"linked": False}, status=status.HTTP_200_OK)


class TelegramLinkTokenView(APIView):
    """POST /api/v1/telegram/link-token/ — создать токен привязки."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        link = TelegramLinkToken.create_for_user(request.user)
        bot_username = os.environ.get("TELEGRAM_BOT_USERNAME", "ResumerBot")
        deep_link = f"https://t.me/{bot_username}?start=link_{link.token}"
        return Response(
            LinkTokenResponseSerializer(
                {
                    "token": link.token,
                    "expires_at": link.expires_at,
                    "bot_deep_link": deep_link,
                }
            ).data,
            status=status.HTTP_201_CREATED,
        )


class TelegramLinkView(APIView):
    """POST /api/v1/telegram/link/ — привязать Telegram (вызывается ботом)."""

    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = TelegramLinkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            link = TelegramLinkToken.objects.get(token=data["link_token"])
        except TelegramLinkToken.DoesNotExist:
            return Response(
                {"error": "Недействительный токен привязки."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not link.is_valid:
            return Response(
                {"error": "Токен истёк или уже использован."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if TelegramAccount.objects.filter(telegram_id=data["telegram_id"]).exists():
            return Response(
                {"error": "Этот Telegram уже привязан к другому аккаунту."},
                status=status.HTTP_409_CONFLICT,
            )

        account, _ = TelegramAccount.objects.update_or_create(
            user=link.user,
            defaults={
                "telegram_id": data["telegram_id"],
                "telegram_username": data.get("telegram_username", ""),
                "first_name": data.get("first_name", ""),
                "last_name": data.get("last_name", ""),
                "language_code": data.get("language_code", "ru"),
                "is_active": True,
                "last_interaction_at": timezone.now(),
            },
        )

        link.used_at = timezone.now()
        link.save(update_fields=["used_at", "updated_at"])

        return Response(TelegramAccountSerializer(account).data, status=status.HTTP_200_OK)


class TelegramUnlinkView(APIView):
    """DELETE /api/v1/telegram/unlink/ — отвязать Telegram."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request: Request) -> Response:
        deleted, _ = TelegramAccount.objects.filter(user=request.user).delete()
        if not deleted:
            return Response(
                {"error": "Telegram не привязан."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)
