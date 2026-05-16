# Resumer Telegram Bot

**Версия: 2.7.0**

Официальный Telegram-бот платформы Resumer на базе **aiogram 3**. Полноценный клиент Django REST API: аутентификация, резюме, AI, поиск, экспорт.

---

## Возможности

| Функция | Описание |
|---------|----------|
| Аутентификация | Вход email/password; JWT в Redis (7 дней) |
| Привязка аккаунта | Deep link `t.me/Bot?start=link_<token>` |
| Резюме | Список, создание, удаление |
| Экспорт | PDF и DOCX через `/documents/export/` |
| AI | Генерация текста секций (`/suggestions/generate/`) |
| Поиск | Elasticsearch (`/search/?q=`) |
| Профиль | Статус привязки Telegram |

---

## Быстрый старт

```bash
cd telegram-bot
cp .env.example .env
# BOT_TOKEN от @BotFather
# API_BASE_URL=http://localhost:8000/api/v1

pip install -r requirements.txt
python -m bot.main
```

### Docker Compose (из корня репозитория)

```bash
# В корневом .env указать BOT_TOKEN
docker compose up telegram-bot -d
docker compose logs -f telegram-bot
```

---

## Переменные окружения

| Переменная | Описание | Пример |
|------------|----------|--------|
| `BOT_TOKEN` | Токен @BotFather | — |
| `API_BASE_URL` | Django API | `http://web:8000/api/v1` |
| `REDIS_URL` | FSM + JWT сессии | `redis://redis:6379/4` |
| `BOT_MODE` | `polling` / `webhook` | `polling` |
| `WEBHOOK_URL` | Для webhook-режима | `https://...` |
| `WEBHOOK_SECRET` | Секрет webhook | — |

В Django (`resumer/.env`): `TELEGRAM_BOT_USERNAME=YourBotName`.

---

## Команды бота

| Команда | Действие |
|---------|----------|
| `/start` | Главное меню; `start=link_<token>` — привязка |
| `/login` | Вход (FSM: email → password) |
| `/resumes` | Список резюме |
| `/create` | Создать резюме |
| `/ai` | AI-помощник для секций |
| `/search` | Поиск по платформе |
| `/profile` | Профиль и Telegram-статус |
| `/logout` | Выход, очистка Redis-сессии |

---

## Структура

```text
telegram-bot/
├── bot/
│   ├── main.py              # polling / webhook
│   ├── config.py            # Pydantic settings
│   ├── api/
│   │   └── client.py        # ResumerAPIClient (httpx)
│   ├── handlers/
│   │   ├── start.py
│   │   ├── auth.py
│   │   ├── resumes.py
│   │   ├── ai.py
│   │   └── search.py
│   ├── keyboards/menus.py
│   ├── middlewares/auth.py
│   ├── states/auth.py
│   └── storage/session.py   # Redis JWT
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

---

## API интеграция

| Endpoint | Использование |
|----------|---------------|
| `POST /auth/login/` | Вход |
| `GET /auth/me/` | Профиль |
| `GET /resumes/` | Список |
| `POST /resumes/` | Создание |
| `DELETE /resumes/{id}/` | Удаление |
| `POST /documents/export/` | PDF/DOCX |
| `POST /suggestions/generate/` | AI |
| `GET /search/?q=` | Поиск |
| `POST /telegram/link/` | Привязка по token |

Полный справочник: [docs/API.md](../docs/API.md)  
Telegram-модуль Django: [docs/TELEGRAM.md](../docs/TELEGRAM.md)

---

## Архитектура

```text
[Telegram] → [aiogram Bot] → [Redis: JWT + FSM]
                  ↓
            [httpx → Django API :8000]
                  ↓
            [PostgreSQL, Celery, ES, S3]
```

---

## Связанные проекты

| Проект | Путь |
|--------|------|
| Backend | [../resumer](../resumer) |
| Web | [../src](../src) |
| Mobile | [../mobile](../mobile) |
| Документация | [../docs/TELEGRAM.md](../docs/TELEGRAM.md) |

---

## Лицензия

Проприетарное ПО. Все права защищены.
