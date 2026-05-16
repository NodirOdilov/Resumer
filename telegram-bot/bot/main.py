"""Точка входа Telegram-бота Resumer."""

import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.redis import RedisStorage

from bot.config import settings
from bot.handlers import router
from bot.middlewares.auth import AuthMiddleware
from bot.storage.session import SessionStorage


async def main() -> None:
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        stream=sys.stdout,
    )

    bot = Bot(
        token=settings.bot_token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )

    storage = RedisStorage.from_url(settings.redis_url)
    dp = Dispatcher(storage=storage)

    session_storage = SessionStorage()
    dp.update.middleware(AuthMiddleware(session_storage))

    dp.include_router(router)

    try:
        if settings.bot_mode == "webhook" and settings.webhook_url:
            await bot.set_webhook(
                url=settings.webhook_url,
                secret_token=settings.webhook_secret or None,
            )
            logging.info("Webhook установлен: %s", settings.webhook_url)
        else:
            await bot.delete_webhook(drop_pending_updates=True)
            logging.info("Запуск polling...")
            await dp.start_polling(bot)
    finally:
        await session_storage.close()
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
