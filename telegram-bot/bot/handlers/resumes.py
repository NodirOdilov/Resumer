"""Обработчики резюме."""

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, CallbackQuery

from bot.api.client import ResumerAPIError
from bot.keyboards.menus import main_menu, cancel_kb, resume_list_kb, resume_actions_kb
from bot.states.auth import CreateResumeStates

router = Router(name="resumes")


@router.message(Command("resumes"))
@router.message(F.text == "Мои резюме")
async def list_resumes(message: Message, session_storage, api) -> None:
    if not await session_storage.get_access_token(message.from_user.id):
        await message.answer("Сначала войдите: /login")
        return
    try:
        resumes = await api.list_resumes()
        if not resumes:
            await message.answer("У вас пока нет резюме. Создайте: /create")
            return
        await message.answer(
            f"Ваши резюме ({len(resumes)}):",
            reply_markup=resume_list_kb(resumes),
        )
    except ResumerAPIError as exc:
        await message.answer(f"Ошибка: {exc}")


@router.callback_query(F.data == "resumes:refresh")
async def refresh_resumes(callback: CallbackQuery, session_storage, api) -> None:
    try:
        resumes = await api.list_resumes()
        await callback.message.edit_text(
            f"Ваши резюме ({len(resumes)}):",
            reply_markup=resume_list_kb(resumes),
        )
    except ResumerAPIError as exc:
        await callback.answer(str(exc), show_alert=True)
    await callback.answer()


@router.callback_query(F.data.startswith("resume:"))
async def show_resume(callback: CallbackQuery, api) -> None:
    resume_id = callback.data.split(":", 1)[1]
    try:
        resume = await api.get_resume(resume_id)
        status = resume.get("status", "draft")
        title = resume.get("title", "—")
        await callback.message.edit_text(
            f"<b>{title}</b>\n"
            f"Статус: {status}\n"
            f"ID: <code>{resume_id}</code>",
            reply_markup=resume_actions_kb(resume_id),
            parse_mode="HTML",
        )
    except ResumerAPIError as exc:
        await callback.answer(str(exc), show_alert=True)
    await callback.answer()


@router.message(Command("create"))
@router.message(F.text == "Создать резюме")
async def create_start(message: Message, state: FSMContext, session_storage) -> None:
    if not await session_storage.get_access_token(message.from_user.id):
        await message.answer("Сначала войдите: /login")
        return
    await state.set_state(CreateResumeStates.waiting_title)
    await message.answer("Введите название резюме:", reply_markup=cancel_kb)


@router.message(CreateResumeStates.waiting_title)
async def create_title(message: Message, state: FSMContext, api) -> None:
    if message.text == "Отмена":
        await state.clear()
        await message.answer("Отменено.", reply_markup=main_menu)
        return
    await state.clear()
    try:
        resume = await api.create_resume(message.text.strip())
        await message.answer(
            f"Резюме создано: <b>{resume.get('title')}</b>\n"
            f"ID: <code>{resume.get('id')}</code>",
            reply_markup=main_menu,
            parse_mode="HTML",
        )
    except ResumerAPIError as exc:
        await message.answer(f"Ошибка: {exc}")


@router.callback_query(F.data.startswith("export:"))
async def export_resume(callback: CallbackQuery, api) -> None:
    parts = callback.data.split(":")
    resume_id, fmt = parts[1], parts[2]
    try:
        result = await api.export_resume(resume_id, fmt)
        task_id = result.get("task_id", "")
        await callback.message.answer(
            f"Экспорт {fmt.upper()} запущен.\n"
            f"Task ID: <code>{task_id}</code>\n"
            "Файл будет доступен в веб-кабинете.",
            parse_mode="HTML",
        )
    except ResumerAPIError as exc:
        await callback.answer(str(exc), show_alert=True)
    await callback.answer("Экспорт запущен")


@router.callback_query(F.data.startswith("delete:"))
async def delete_resume(callback: CallbackQuery, api) -> None:
    resume_id = callback.data.split(":", 1)[1]
    try:
        await api.delete_resume(resume_id)
        await callback.message.edit_text("Резюме удалено.")
    except ResumerAPIError as exc:
        await callback.answer(str(exc), show_alert=True)
    await callback.answer()
