# История изменений

Все значимые изменения платформы Resumer документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).
Версионирование следует [Semantic Versioning](https://semver.org/lang/ru/).

---

## [Unreleased]

---

## [2.7.0] — 2026-05-16

### Добавлено

- **Telegram Bot** (`telegram-bot/`): aiogram 3, auth, резюме, AI, поиск, экспорт PDF/DOCX
- **Mobile App** (`mobile/`): Expo 52, expo-router, auth, резюме, поиск, профиль
- **Django `apps.telegram`**: `TelegramAccount`, `TelegramLinkToken`, API `/api/v1/telegram/`
- Docker Compose: сервис `telegram-bot`
- Документация: `docs/TELEGRAM.md`, `docs/MOBILE.md`
- Enterprise-модули: `audit`, `feature_flags`, `organizations`, `webhooks`, `api_keys`
- Унифицированный API экспорта (`/api/v1/documents/export/`)
- Elasticsearch search (`/api/v1/search/`)
- Platform health API (`/api/v1/platform/`)
- Management-команды: `init_platform`, `reindex_search`
- AuditMiddleware, сигналы индексации ES
- Миграции для всех Django-приложений

### Изменено

- Экспорт PDF/DOCX на единый Celery-пайплайн `documents.tasks`
- README, ARCHITECTURE, API, DEPLOYMENT — описание трёх клиентов
- `INSTALLED_APPS` расширен enterprise и telegram
- `default_auto_field` → `BigAutoField` во всех apps

### Документация

- Все `.md` обновлены: Web + Mobile + Telegram
- README premium-формат (русский)
- GitHub: CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, issue templates

### Версия

- Единая версия платформы **2.7.0** (Web, Backend, Mobile, Telegram Bot)
- `VERSION`, `apps/core/version.py`, health/status API возвращают `version`

---

## [0.1.0] — 2026-05-16

### Добавлено

- Начальная версия платформы Resumer
- Django 6 backend: 20+ приложений
- Next.js 15 frontend: builder, templates, marketing
- Docker Compose: полный локальный стек
- 34 шаблона, примеры, контент-хаб
- Stripe подписки, OAuth, JWT
- WebSocket live-preview builder
- AI-подсказки (OpenAI)
- 11 языков интерфейса
- Kubernetes, Terraform, monitoring

---

## Типы изменений

| Тип | Описание |
|-----|----------|
| **Добавлено** | Новая функциональность |
| **Изменено** | Изменения существующей функциональности |
| **Устарело** | Функции, которые будут удалены |
| **Удалено** | Удалённые функции |
| **Исправлено** | Исправления ошибок |
| **Безопасность** | Исправления уязвимостей |
