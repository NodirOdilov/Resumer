# Telegram-интеграция Resumer

Техническое описание Django-модуля `apps.telegram` и клиента `telegram-bot/`.

---

## 1. Обзор

| Компонент | Путь | Назначение |
|-----------|------|------------|
| Django API | `resumer/apps/telegram/` | Привязка аккаунта, токены deep link |
| Telegram Bot | `telegram-bot/` | aiogram 3, FSM, Redis-сессии |
| Docker | `docker-compose.yml` → `telegram-bot` | Контейнер бота в dev-стеке |

---

## 2. Django: модели

| Модель | Поля | Назначение |
|--------|------|------------|
| `TelegramAccount` | `user`, `telegram_id`, `username`, `linked_at` | Связь User ↔ Telegram |
| `TelegramLinkToken` | `user`, `token`, `expires_at` | Одноразовый токен для `/start link_<token>` |

---

## 3. REST API

Базовый префикс: `/api/v1/telegram/`

| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| GET | `/me/` | JWT | Статус привязки Telegram |
| POST | `/link-token/` | JWT | Создать токен deep link (TTL 15 мин) |
| POST | `/link/` | — | Привязать по `token` + `telegram_id` (вызывается ботом) |
| POST | `/unlink/` | JWT | Отвязать Telegram |

### Пример: получение ссылки привязки

```http
POST /api/v1/telegram/link-token/
Authorization: Bearer <access_token>
```

Ответ:

```json
{
  "token": "abc123...",
  "deep_link": "https://t.me/ResumerBot?start=link_abc123...",
  "expires_at": "2026-05-16T12:30:00Z"
}
```

Пользователь открывает deep link → бот вызывает `POST /telegram/link/`.

---

## 4. Telegram Bot (aiogram 3)

### Стек

| Технология | Назначение |
|------------|------------|
| aiogram 3 | Обработчики, FSM, роутеры |
| httpx | Асинхронный HTTP-клиент к Django API |
| Redis DB /4 | JWT-сессии и FSM storage |

### Структура

```text
telegram-bot/
├── bot/
│   ├── main.py              # Точка входа, polling/webhook
│   ├── config.py            # Pydantic settings
│   ├── api/client.py        # ResumerAPIClient
│   ├── handlers/            # start, auth, resumes, ai, search
│   ├── keyboards/menus.py   # Inline и reply-клавиатуры
│   ├── middlewares/auth.py  # Проверка JWT в Redis
│   ├── states/auth.py       # FSM для login
│   └── storage/session.py   # RedisSessionStorage
├── requirements.txt
├── Dockerfile
└── .env.example
```

### Команды бота

| Команда | Действие |
|---------|----------|
| `/start` | Меню; `start=link_<token>` — привязка аккаунта |
| `/login` | Вход email + password |
| `/resumes` | Список резюме |
| `/create` | Создание резюме |
| `/ai` | AI-подсказки для секций |
| `/search` | Поиск по платформе |
| `/profile` | Профиль и статус привязки |
| `/logout` | Выход, очистка сессии |

### Переменные окружения

| Переменная | Описание |
|------------|----------|
| `BOT_TOKEN` | Токен от @BotFather |
| `API_BASE_URL` | `http://web:8000/api/v1` (Docker) |
| `REDIS_URL` | `redis://redis:6379/4` |
| `BOT_MODE` | `polling` или `webhook` |
| `WEBHOOK_URL` | URL для webhook-режима |

### Запуск

```bash
# Локально
cd telegram-bot
pip install -r requirements.txt
cp .env.example .env
python -m bot.main

# Docker Compose
docker compose up telegram-bot -d
```

---

## 5. Поток привязки аккаунта

```text
[Web/Mobile]  POST /telegram/link-token/  →  token
[Пользователь]  t.me/Bot?start=link_<token>
[Bot]  /start handler  →  POST /telegram/link/  {token, telegram_id}
[Django]  TelegramAccount создан
[Bot]  JWT login (если нужно)  →  Redis session
```

---

## 6. Безопасность

| Механизм | Описание |
|----------|----------|
| TTL токена | `TelegramLinkToken` истекает через 15 минут |
| Одноразовость | Токен удаляется после успешной привязки |
| JWT в Redis | Access token хранится per `telegram_id`, TTL 7 дней |
| Секреты | `BOT_TOKEN` только в env, не в репозитории |

---

## 7. Связанные документы

- [API](./API.md) — полный справочник REST
- [Развёртывание](./DEPLOYMENT.md) — Docker и production
- [telegram-bot/README.md](../telegram-bot/README.md) — краткий гайд бота
