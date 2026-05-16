"""Регистрация всех роутеров."""

from aiogram import Router

from bot.handlers import ai, auth, resumes, search, start

router = Router(name="root")
router.include_router(start.router)
router.include_router(auth.router)
router.include_router(resumes.router)
router.include_router(ai.router)
router.include_router(search.router)
