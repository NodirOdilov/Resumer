"""Middleware: инъекция API-клиента и сессии."""

from __future__ import annotations

from typing import Any, Awaitable, Callable

from aiogram import BaseMiddleware
from aiogram.types import TelegramObject

from bot.api.client import ResumerAPIClient
from bot.storage.session import SessionStorage


class AuthMiddleware(BaseMiddleware):
    """Добавляет session_storage и api_client в handler data."""

    def __init__(self, storage: SessionStorage) -> None:
        self.storage = storage

    async def __call__(
        self,
        handler: Callable[[TelegramObject, dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: dict[str, Any],
    ) -> Any:
        data["session_storage"] = self.storage

        telegram_id = None
        user = data.get("event_from_user")
        if user:
            telegram_id = user.id

        api = ResumerAPIClient()
        if telegram_id:
            token = await self.storage.get_access_token(telegram_id)
            if token:
                api = ResumerAPIClient(access_token=token)

        data["api"] = api
        try:
            return await handler(event, data)
        finally:
            await api.close()
