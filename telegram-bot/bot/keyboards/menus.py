"""Клавиатуры Telegram-бота."""

from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardMarkup,
)

# --- Reply ---

main_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Мои резюме"), KeyboardButton(text="Создать резюме")],
        [KeyboardButton(text="Шаблоны"), KeyboardButton(text="Поиск")],
        [KeyboardButton(text="AI-помощник"), KeyboardButton(text="Профиль")],
        [KeyboardButton(text="Помощь")],
    ],
    resize_keyboard=True,
)

auth_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Войти"), KeyboardButton(text="Регистрация")],
        [KeyboardButton(text="Привязать аккаунт")],
        [KeyboardButton(text="Назад")],
    ],
    resize_keyboard=True,
)

cancel_kb = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="Отмена")]],
    resize_keyboard=True,
)


# --- Inline ---

def resume_list_kb(resumes: list[dict]) -> InlineKeyboardMarkup:
    buttons = []
    for r in resumes[:10]:
        title = r.get("title", "Без названия")[:40]
        rid = r.get("id", "")
        buttons.append(
            [InlineKeyboardButton(text=title, callback_data=f"resume:{rid}")]
        )
    buttons.append([InlineKeyboardButton(text="Обновить", callback_data="resumes:refresh")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def resume_actions_kb(resume_id: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="PDF", callback_data=f"export:{resume_id}:pdf"),
                InlineKeyboardButton(text="DOCX", callback_data=f"export:{resume_id}:docx"),
            ],
            [
                InlineKeyboardButton(text="Удалить", callback_data=f"delete:{resume_id}"),
            ],
            [InlineKeyboardButton(text="Назад к списку", callback_data="resumes:refresh")],
        ]
    )


def ai_sections_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="Summary", callback_data="ai:summary"),
                InlineKeyboardButton(text="Опыт", callback_data="ai:experience"),
            ],
            [
                InlineKeyboardButton(text="Навыки", callback_data="ai:skills"),
                InlineKeyboardButton(text="Письмо", callback_data="ai:cover_letter"),
            ],
        ]
    )
