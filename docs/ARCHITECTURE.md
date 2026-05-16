# Архитектура платформы Resumer

Техническое описание компонентов, потоков данных и принципов проектирования.

---

## 1. Обзор

Resumer — многосервисная SaaS-платформа с тремя клиентскими приложениями (Web, Mobile, Telegram), единым Django API и общей инфраструктурой данных.

| Принцип | Реализация |
|---------|------------|
| Разделение ответственности | 26 Django-приложений по доменам |
| Единый API | REST v1 + WebSocket для всех клиентов |
| Асинхронность | Celery для тяжёлых операций |
| Реальное время | Django Channels + Redis (Web builder) |
| Масштабирование | Горизонтальное: web, celery, frontend, bot |
| Наблюдаемость | Sentry, Prometheus, audit log |

---

## 2. Компонентная схема

```text
                    ┌─────────────────────────────────────────┐
                    │              Nginx (:80)                │
                    │   TLS · static · rate limit · routing   │
                    └────────────────┬───────────────┬────────┘
                                     │               │
                          ┌──────────▼─────┐  ┌──────▼────────────┐
                          │   Next.js      │  │  Django + DRF     │
                          │   :3000        │  │  :8000 (Gunicorn) │
                          └──────────┬─────┘  └──────┬────────────┘
                                     │               │
         ┌───────────────────────────┼───────────────┼───────────────────────────┐
         │                           │               │                           │
  ┌──────▼──────┐           ┌────────▼────────┐  ┌──▼────────────┐    ┌───────▼───────┐
  │  Браузер    │           │ Mobile (Expo)   │  │ Telegram Bot  │    │ Celery Workers│
  │ Zustand+RQ  │           │ SecureStore JWT │  │ aiogram+Redis │    │ PDF, webhooks │
  └─────────────┘           └─────────────────┘  └───────────────┘    └───────────────┘
                                     │               │                           │
                                     └───────────────┴───────────────────────────┘
                                                     │
                              PostgreSQL · Redis · Elasticsearch · S3
```

---

## 3. Клиентские приложения

| Клиент | Каталог | Стек | Аутентификация |
|--------|---------|------|----------------|
| **Web** | `src/` | Next.js 15, React 19 | JWT + cookies / localStorage |
| **Mobile** | `mobile/` | Expo 52, expo-router | JWT в expo-secure-store |
| **Telegram** | `telegram-bot/` | aiogram 3, httpx | JWT в Redis (per telegram_id) |

Все клиенты обращаются к одному REST API: `/api/v1/`.

---

## 4. Backend: слои

### 4.1. Django-приложения

| Слой | Приложения |
|------|------------|
| **Идентификация** | accounts, profiles, api_keys, telegram |
| **Документы** | resumes, cvs, cover_letters, documents, builder |
| **Контент** | templates_library, examples, cl_examples, content, categories |
| **Монетизация** | payments |
| **Платформа** | core, search, seo, analytics, notifications, media_library, reviews |
| **Enterprise** | audit, feature_flags, organizations, webhooks |

### 4.2. Сервисный слой

| Сервис | Модуль | Назначение |
|--------|--------|------------|
| AuditService | apps.audit | Запись событий аудита |
| FeatureFlagService | apps.feature_flags | Проверка флагов с rollout |
| OrganizationService | apps.organizations | CRUD организаций, приглашения |
| WebhookService | apps.webhooks | Доставка исходящих событий |
| APIKeyService | apps.api_keys | Генерация и проверка ключей |
| PlatformService | apps.core | Системные настройки |

### 4.3. Telegram (`apps.telegram`)

| Сущность | Назначение |
|----------|------------|
| `TelegramAccount` | Связь User ↔ telegram_id |
| `TelegramLinkToken` | Одноразовый deep link токен (TTL 15 мин) |

API: `/api/v1/telegram/me/`, `link-token/`, `link/`, `unlink/`.

---

## 5. Frontend (Web): слои

| Слой | Каталог | Назначение |
|------|---------|------------|
| Маршрутизация | `src/app/` | App Router, route groups |
| Компоненты | `src/components/` | UI, builder, templates |
| Состояние | `src/stores/` | Zustand (builder, auth, ui) |
| Серверное состояние | TanStack Query | Кеш API-ответов |
| API | `src/lib/api.ts` | Axios + JWT interceptor |
| Demo | `src/lib/mock-api/` | In-browser mock без backend |

---

## 6. Mobile (Expo): слои

| Слой | Каталог | Назначение |
|------|---------|------------|
| Маршрутизация | `mobile/app/` | expo-router, (auth), (tabs) |
| API | `mobile/src/api/client.ts` | axios + JWT |
| Состояние | `mobile/src/store/authStore.ts` | Zustand + SecureStore |
| UI | `mobile/src/components/` | Button, Input, ResumeCard |

Подробнее: [MOBILE.md](./MOBILE.md).

---

## 7. Telegram Bot: слои

| Слой | Каталог | Назначение |
|------|---------|------------|
| Точка входа | `bot/main.py` | polling / webhook |
| Handlers | `bot/handlers/` | start, auth, resumes, ai, search |
| API-клиент | `bot/api/client.py` | ResumerAPIClient (httpx) |
| Сессии | `bot/storage/session.py` | Redis JWT per telegram_id |
| FSM | `bot/states/` | Login flow |

Подробнее: [TELEGRAM.md](./TELEGRAM.md).

---

## 8. Потоки данных

### 8.1. Создание и экспорт резюме

```text
[Клиент: Web | Mobile | Bot]  POST /resumes/     →  Resume
[Клиент]                      PATCH /resumes/{id}/ →  auto-save
[Web only]                    WS builder/{id}/    →  Channels preview
[Клиент]                      POST /documents/export/ → Celery → S3 → PDF/DOCX
```

### 8.2. Привязка Telegram

```text
[Web/Mobile]  POST /telegram/link-token/  →  deep_link
[User]        t.me/Bot?start=link_<token>
[Bot]         POST /telegram/link/  →  TelegramAccount
```

### 8.3. Индексация поиска

```text
[Article.save]  →  signal  →  Celery index_article  →  Elasticsearch
[reindex_search]  →  management command  →  полная переиндексация
```

---

## 9. Очереди Celery

| Очередь | Приоритет | Задачи |
|---------|-----------|--------|
| `high` | Высокий | PDF/DOCX, Stripe webhooks |
| `default` | Средний | Email, notifications, webhooks |
| `low` | Низкий | SEO sitemap, analytics, ES reindex |

---

## 10. Кеширование (Redis)

| Redis DB | Назначение |
|----------|------------|
| /0 | Celery broker + result |
| /1 | Django cache (default) |
| /2 | Sessions |
| /3 | Throttling |
| /4 | Telegram Bot: JWT-сессии и FSM |

---

## 11. Безопасность

| Механизм | Реализация |
|----------|------------|
| Пароли | Argon2 |
| API | JWT (15 мин) + refresh (7 дней) + blacklist |
| B2B | API-ключи с scopes |
| Telegram | TTL link-token, одноразовая привязка |
| Mobile | SecureStore (не AsyncStorage) для токенов |
| OAuth | django-allauth (Google, GitHub) |
| 2FA | django-otp |
| Аудит | AuditMiddleware + AuditService |
| Webhooks | HMAC-SHA256 подпись payload |

---

## 12. Масштабирование

| Компонент | Стратегия |
|-----------|-----------|
| Django web | HPA по CPU/RAM |
| Celery | Отдельные worker pools по очередям |
| Next.js | HPA, CDN для static |
| Telegram Bot | Отдельный контейнер; webhook в production |
| Mobile | EAS Build; статический клиент |
| PostgreSQL | PgBouncer + read replicas |
| Elasticsearch | Sharded indices |

---

## 13. Связанные документы

- [API](./API.md)
- [Telegram](./TELEGRAM.md)
- [Mobile](./MOBILE.md)
- [Развёртывание](./DEPLOYMENT.md)
- [Главный README](../README.md)
