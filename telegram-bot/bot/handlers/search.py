"""Поиск по платформе."""

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message

from bot.api.client import ResumerAPIError
from bot.states.auth import SearchStates

router = Router(name="search")


@router.message(Command("search"))
@router.message(F.text == "Поиск")
async def search_start(message: Message, state: FSMContext) -> None:
    await state.set_state(SearchStates.waiting_query)
    await message.answer("Введите поисковый запрос (min 2 символа):")


@router.message(SearchStates.waiting_query)
async def search_query(message: Message, state: FSMContext, api) -> None:
    await state.clear()
    query = message.text.strip()
    if len(query) < 2:
        await message.answer("Запрос слишком короткий.")
        return
    try:
        data = await api.search(query)
        results = data.get("results", [])
        if not results:
            await message.answer("Ничего не найдено.")
            return
        lines = [f"<b>Результаты по «{query}»</b>\n"]
        for i, r in enumerate(results[:8], 1):
            lines.append(f"{i}. [{r.get('type')}] {r.get('title')}")
        await message.answer("\n".join(lines), parse_mode="HTML")
    except ResumerAPIError as exc:
        await message.answer(f"Ошибка поиска: {exc}")
