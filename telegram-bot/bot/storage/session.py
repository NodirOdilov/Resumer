"""Хранение JWT-сессий пользователей бота в Redis."""

from __future__ import annotations

import json
from typing import Any

import redis.asyncio as redis

from bot.config import settings

SESSION_TTL = 60 * 60 * 24 * 7  # 7 дней
PREFIX = "tg:session:"


class SessionStorage:
    """Redis-хранилище токенов по telegram_id."""

    def __init__(self) -> None:
        self._redis = redis.from_url(settings.redis_url, decode_responses=True)

    async def close(self) -> None:
        await self._redis.aclose()

    def _key(self, telegram_id: int) -> str:
        return f"{PREFIX}{telegram_id}"

    async def save(
        self,
        telegram_id: int,
        *,
        access: str,
        refresh: str,
        email: str,
    ) -> None:
        data = {"access": access, "refresh": refresh, "email": email}
        await self._redis.setex(self._key(telegram_id), SESSION_TTL, json.dumps(data))

    async def get(self, telegram_id: int) -> dict[str, Any] | None:
        raw = await self._redis.get(self._key(telegram_id))
        if not raw:
            return None
        return json.loads(raw)

    async def delete(self, telegram_id: int) -> None:
        await self._redis.delete(self._key(telegram_id))

    async def get_access_token(self, telegram_id: int) -> str | None:
        session = await self.get(telegram_id)
        return session.get("access") if session else None
