"""AI-подсказки."""

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, CallbackQuery

from bot.api.client import ResumerAPIError
from bot.keyboards.menus import ai_sections_kb
from bot.states.auth import AIStates

router = Router(name="ai")


@router.message(Command("ai"))
@router.message(F.text == "AI-помощник")
async def ai_menu(message: Message, session_storage) -> None:
    if not await session_storage.get_access_token(message.from_user.id):
        await message.answer("Сначала войдите: /login")
        return
    await message.answer("Выберите секцию для AI-генерации:", reply_markup=ai_sections_kb())


@router.callback_query(F.data.startswith("ai:"))
async def ai_section(callback: CallbackQuery, state: FSMContext) -> None:
    section = callback.data.split(":", 1)[1]
    await state.update_data(ai_section=section)
    await state.set_state(AIStates.waiting_job_title)
    await callback.message.answer("Введите желаемую должность (job title):")
    await callback.answer()


@router.message(AIStates.waiting_job_title)
async def ai_generate(message: Message, state: FSMContext, api) -> None:
    data = await state.get_data()
    section = data.get("ai_section", "summary")
    await state.clear()
    try:
        result = await api.ai_generate(section=section, job_title=message.text)
        text = result.get("content") or result.get("text") or str(result)
        await message.answer(f"<b>AI ({section})</b>\n\n{text[:4000]}", parse_mode="HTML")
    except ResumerAPIError as exc:
        await message.answer(f"Ошибка AI: {exc}")
