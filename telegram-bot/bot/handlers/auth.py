"""Обработчики аутентификации."""

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message

from bot.api.client import ResumerAPIError
from bot.keyboards.menus import auth_menu, main_menu, cancel_kb
from bot.states.auth import AuthStates

router = Router(name="auth")


async def _require_auth(message: Message, session_storage) -> bool:
    token = await session_storage.get_access_token(message.from_user.id)
    if not token:
        await message.answer("Сначала войдите: /login", reply_markup=auth_menu)
        return False
    return True


@router.message(Command("login"))
@router.message(F.text == "Войти")
async def login_start(message: Message, state: FSMContext) -> None:
    await state.set_state(AuthStates.waiting_email)
    await message.answer("Введите email:", reply_markup=cancel_kb)


@router.message(AuthStates.waiting_email)
async def login_email(message: Message, state: FSMContext) -> None:
    if message.text == "Отмена":
        await state.clear()
        await message.answer("Отменено.", reply_markup=auth_menu)
        return
    await state.update_data(email=message.text.strip())
    await state.set_state(AuthStates.waiting_password)
    await message.answer("Введите пароль:")


@router.message(AuthStates.waiting_password)
async def login_password(
    message: Message,
    state: FSMContext,
    session_storage,
    api,
) -> None:
    if message.text == "Отмена":
        await state.clear()
        await message.answer("Отменено.", reply_markup=auth_menu)
        return

    data = await state.get_data()
    await state.clear()

    try:
        result = await api.login(data["email"], message.text)
        await session_storage.save(
            message.from_user.id,
            access=result["access"],
            refresh=result["refresh"],
            email=data["email"],
        )
        await message.answer(
            f"Вы вошли как <b>{data['email']}</b>",
            reply_markup=main_menu,
            parse_mode="HTML",
        )
    except ResumerAPIError as exc:
        await message.answer(f"Ошибка входа: {exc}", reply_markup=auth_menu)


@router.message(F.text == "Привязать аккаунт")
async def link_hint(message: Message) -> None:
    await message.answer(
        "Привязка через сайт:\n"
        "1. Войдите на resumer.com\n"
        "2. Настройки → Telegram → Получить ссылку\n"
        "3. Откройте ссылку в Telegram\n\n"
        "Или войдите через /login в боте."
    )


@router.message(Command("logout"))
async def logout(message: Message, session_storage) -> None:
    await session_storage.delete(message.from_user.id)
    await message.answer("Вы вышли из аккаунта.", reply_markup=auth_menu)


@router.message(Command("profile"))
@router.message(F.text == "Профиль")
async def profile(message: Message, session_storage, api) -> None:
    if not await _require_auth(message, session_storage):
        return
    session = await session_storage.get(message.from_user.id)
    try:
        user = await api.me()
        email = user.get("email", session.get("email", ""))
        premium = "Да" if user.get("is_premium") else "Нет"
        await message.answer(
            f"<b>Профиль</b>\n"
            f"Email: {email}\n"
            f"Premium: {premium}\n"
            f"Telegram ID: {message.from_user.id}",
            parse_mode="HTML",
        )
    except ResumerAPIError as exc:
        await message.answer(f"Ошибка: {exc}")
