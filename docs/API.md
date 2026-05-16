# API платформы Resumer

Справочник по REST API v1, WebSocket и способам аутентификации. Используется Web, Mobile и Telegram Bot.

---

## 1. Базовые сведения

| Параметр | Значение |
|----------|----------|
| Базовый URL | `http://localhost:8000/api/v1` |
| Формат | JSON |
| Версия API | v1 (платформа 2.7.0) |
| Документация | Swagger UI: `/api/docs/` |
| Схема | OpenAPI: `/api/schema/` |

### Клиенты

| Клиент | Базовый URL (dev) |
|--------|-------------------|
| Web (Next.js) | `NEXT_PUBLIC_API_URL` или proxy |
| Mobile (Expo) | `EXPO_PUBLIC_API_URL` |
| Telegram Bot | `API_BASE_URL` в `telegram-bot/.env` |

### Формат ошибок

```json
{
  "error": "Человекочитаемое сообщение",
  "details": { "field": ["описание ошибки"] },
  "code": "bad_request"
}
```

---

## 2. Аутентификация

### 2.1. JWT (Web, Mobile, Telegram Bot)

```http
POST /api/v1/auth/login/
Content-Type: application/json

{"email": "user@example.com", "password": "secret"}
```

Ответ:

```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

Далее:

```http
Authorization: Bearer <access_token>
```

Обновление:

```http
POST /api/v1/auth/token/refresh/
{"refresh": "<refresh_token>"}
```

Профиль текущего пользователя:

```http
GET /api/v1/auth/me/
Authorization: Bearer <access_token>
```

### 2.2. API-ключ (B2B интеграции)

```http
Authorization: Api-Key rsr_live_xxxx.<secret>
```

| Scope | Доступ |
|-------|--------|
| `read` | Чтение ресурсов |
| `write` | Создание и изменение |
| `documents` | Экспорт документов |
| `full` | Полный доступ |

### 2.3. Сессия

Используется для Django Admin (`/admin/`).

---

## 3. Эндпоинты по модулям

### Идентификация и профиль

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/auth/register/` | Регистрация |
| POST | `/auth/login/` | Вход |
| POST | `/auth/logout/` | Выход (blacklist refresh) |
| POST | `/auth/token/refresh/` | Обновление access |
| GET | `/auth/me/` | Текущий пользователь |
| GET/PATCH | `/profile/me/` | Профиль пользователя |

### Документы

| Метод | Путь | Описание |
|-------|------|----------|
| GET/POST | `/resumes/` | Список / создание резюме |
| GET/PATCH/DELETE | `/resumes/{id}/` | CRUD резюме |
| POST | `/resumes/{id}/duplicate/` | Дублирование |
| POST | `/resumes/{id}/download/` | Запуск экспорта (legacy) |
| GET/POST | `/cvs/` | CV документы |
| GET/POST | `/cover-letters/` | Сопроводительные письма |
| POST | `/documents/export/` | Унифицированный экспорт |
| GET | `/documents/export/{task_id}/status/` | Статус Celery-задачи |

Тело экспорта:

```json
{
  "document_type": "resume",
  "document_id": "uuid",
  "format": "pdf"
}
```

### Конструктор и AI

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/suggestions/generate/` | AI-генерация текста секции |
| POST | `/suggestions/rewrite/` | AI-переписывание текста |

### Контент и шаблоны

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/templates/` | Библиотека шаблонов |
| GET | `/examples/` | Примеры резюме |
| GET | `/examples/cover-letters/` | Примеры писем |
| GET | `/content/articles/` | Статьи блога |
| GET | `/categories/` | Категории (дерево) |
| GET | `/search/?q=...` | Полнотекстовый поиск |

### Telegram

| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| GET | `/telegram/me/` | JWT | Статус привязки Telegram |
| POST | `/telegram/link-token/` | JWT | Создать deep link токен |
| POST | `/telegram/link/` | — | Привязать (бот) |
| POST | `/telegram/unlink/` | JWT | Отвязать Telegram |

Пример `link-token`:

```json
{
  "token": "abc123",
  "deep_link": "https://t.me/ResumerBot?start=link_abc123",
  "expires_at": "2026-05-16T12:30:00Z"
}
```

### Платежи

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/payments/subscription/` | Текущая подписка |
| POST | `/payments/checkout/` | Stripe Checkout Session |
| POST | `/payments/webhook/` | Stripe webhook (server-to-server) |

### Enterprise

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/audit/logs/` | Журнал аудита (admin) |
| GET | `/feature-flags/evaluate/` | Флаги для текущего пользователя |
| GET/POST | `/organizations/` | Организации |
| POST | `/organizations/{slug}/invite/` | Приглашение участника |
| POST | `/organizations/invites/accept/` | Принятие приглашения |
| GET/POST | `/webhooks/endpoints/` | Конечные точки вебхуков |
| GET/POST | `/api-keys/` | API-ключи |
| GET | `/platform/status/` | Статус платформы |
| GET | `/platform/health/` | Health check |

---

## 4. WebSocket

```text
ws://localhost:8000/ws/builder/<resume_id>/
```

Используется только Web-клиентом (builder live-preview).

```json
{
  "type": "update",
  "resume_data": {},
  "template_slug": "modern-pro",
  "settings": { "color": "#2563eb", "font": "Inter" }
}
```

---

## 5. Пагинация

`?page=1&page_size=20` — стандарт DRF.

---

## 6. Throttling

| Класс | Лимит |
|-------|-------|
| Anonymous | 30 запросов / мин |
| Authenticated | 100 запросов / мин |
| Login | 5 попыток / 15 мин |
| Register | 3 попытки / час |

---

## 7. Webhooks (исходящие)

| Событие | Когда |
|---------|-------|
| `resume.created` | Создано резюме |
| `resume.updated` | Обновлено резюме |
| `resume.deleted` | Удалено резюме |
| `payment.succeeded` | Успешный платёж |
| `subscription.updated` | Изменена подписка |

```http
X-Webhook-Signature: sha256=<hmac>
X-Webhook-Event: resume.created
```

---

## 8. Связанные документы

- [Архитектура](./ARCHITECTURE.md)
- [Telegram](./TELEGRAM.md)
- [Mobile](./MOBILE.md)
- [Развёртывание](./DEPLOYMENT.md)
