"""Обработчики /start и помощи."""

from aiogram import Router, F
from aiogram.filters import Command, CommandStart
from aiogram.types import Message

from bot.api.client import ResumerAPIError
from bot.config import settings
from bot.keyboards.menus import auth_menu, main_menu

router = Router(name="start")


@router.message(CommandStart())
async def cmd_start(message: Message, session_storage, api) -> None:
    """Приветствие и deep link привязки."""
    args = message.text.split(maxsplit=1)
    payload = args[1] if len(args) > 1 else ""

    if payload.startswith("link_"):
        token = payload.removeprefix("link_")
        try:
            await api.link_telegram(
                telegram_id=message.from_user.id,
                link_token=token,
                username=message.from_user.username or "",
                first_name=message.from_user.first_name or "",
                last_name=message.from_user.last_name or "",
                language_code=message.from_user.language_code or "ru",
            )
            await message.answer(
                "Аккаунт Resumer успешно привязан к Telegram.\n"
                "Теперь вы можете управлять резюме из бота.",
                reply_markup=main_menu,
            )
            return
        except ResumerAPIError as exc:
            await message.answer(f"Ошибка привязки: {exc}")
            return

    token = await session_storage.get_access_token(message.from_user.id)
    kb = main_menu if token else auth_menu

    await message.answer(
        f"Добро пожаловать в <b>Resumer Bot</b> v{settings.app_version}, "
        f"{message.from_user.first_name}.\n\n"
        "Создавайте и управляйте резюме прямо в Telegram:\n"
        "— просмотр и создание резюме\n"
        "— экспорт в PDF/DOCX\n"
        "— AI-подсказки для секций\n"
        "— поиск статей и примеров\n\n"
        "Для начала войдите или привяжите существующий аккаунт.",
        reply_markup=kb,
        parse_mode="HTML",
    )


@router.message(Command("help"))
@router.message(F.text == "Помощь")
async def cmd_help(message: Message) -> None:
    await message.answer(
        "<b>Команды Resumer Bot</b>\n\n"
        "/start — главное меню\n"
        "/login — войти в аккаунт\n"
        "/resumes — мои резюме\n"
        "/create — создать резюме\n"
        "/templates — шаблоны\n"
        "/search — поиск\n"
        "/ai — AI-помощник\n"
        "/profile — профиль\n"
        "/logout — выйти\n\n"
        "Или используйте кнопки меню.",
        parse_mode="HTML",
    )
