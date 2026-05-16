<div align="center">

# Resumer

**Корпоративная платформа для создания резюме, CV и сопроводительных писем: конструктор документов, AI-подсказки, экспорт, подписки, поиск, аналитика и B2B-интеграции.**

<br>

![Python](https://img.shields.io/badge/Python-3.13%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.x-092E20?style=flat-square&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-3.15%2B-092E20?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-8-DC382D?style=flat-square&logo=redis&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-8.16-005571?style=flat-square&logo=elasticsearch&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-2.20%2B-2496ED?style=flat-square&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-ready-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![aiogram](https://img.shields.io/badge/Telegram_Bot-aiogram_3-26A5E4?style=flat-square&logo=telegram&logoColor=white)
![Expo](https://img.shields.io/badge/Mobile-Expo_52-000020?style=flat-square&logo=expo&logoColor=white)
![Version](https://img.shields.io/badge/Version-2.7.0-0D47A1?style=flat-square)

</div>

---

## Автор

**Nodir Odilov** — [GitHub](https://github.com/NodirOdilov)

---

## Содержание

1. [О проекте](#1-о-проекте)
2. [Ключевые возможности](#2-ключевые-возможности)
3. [Технологический стек](#3-технологический-стек)
4. [Структура репозитория](#4-структура-репозитория)
5. [Архитектура и принцип работы](#5-архитектура-и-принцип-работы)
6. [Доменная модель](#6-доменная-модель)
7. [Сервисы Docker Compose](#7-сервисы-docker-compose)
8. [Быстрый старт](#8-быстрый-старт)
9. [Команды разработки](#9-команды-разработки)
10. [Ручной запуск](#10-ручной-запуск)
11. [Конфигурация](#11-конфигурация)
12. [API и интеграции](#12-api-и-интеграции)
13. [Мониторинг](#13-мониторинг)
14. [CI/CD и деплой](#14-cicd-и-деплой)
15. [Enterprise-модули](#15-enterprise-модули)
16. [Роли в продакшене](#16-роли-в-продакшене)
17. [Документация](#17-документация)
18. [Лицензия](#18-лицензия)
19. [Поддержка](#19-поддержка)

---

## 1. О проекте

**Resumer** — SaaS-платформа для создания профессиональных резюме, CV и сопроводительных писем с упором на ATS-совместимость, SEO-контент и монетизацию через подписки.

Платформа объединяет:

- визуальный **конструктор документов** с предпросмотром в реальном времени (WebSocket);
- **библиотеку шаблонов и примеров** по отраслям и ролям;
- **контент-хаб** (статьи, руководства, карьерные советы);
- **платёжную подсистему** (Stripe);
- **корпоративный слой** (организации, API-ключи, вебхуки, аудит, функциональные флаги);
- **Telegram-бот** (aiogram 3) и **мобильное приложение** (React Native / Expo) как полноценные клиенты API.

### Тип системы

| Аспект | Описание |
|--------|----------|
| **Продукт** | B2C/B2B-сервис карьерных документов с тарифами, лимитами и премиум-шаблонами |
| **Архитектура** | Многосервисная распределённая платформа |
| **Backend** | Django 6 + DRF, Celery, Channels, 25+ приложений |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Данные** | PostgreSQL, Redis, Elasticsearch, S3 |
| **Интеграции** | Stripe, OpenAI, OAuth (Google/GitHub), Telegram, SendGrid, Sentry |
| **Клиенты** | Web (Next.js), Mobile (Expo), Telegram Bot (aiogram) |

---

## 2. Ключевые возможности

### Продуктовые

| Категория | Возможности |
|-----------|-------------|
| **Конструктор** | 3 шага: шаблон, редактирование, скачивание; drag-and-drop; отмена/повтор; автосохранение + IndexedDB |
| **Документы** | Резюме, CV, сопроводительные письма; версионирование; дублирование; мягкое удаление |
| **Шаблоны** | 34+ профессиональных шаблона; ATS-совместимость; премиум-флаг; цветовые схемы |
| **Контент** | 280+ примеров; 600+ статей; категории; 11 языков интерфейса |
| **AI** | Подсказки OpenAI: summary, опыт, навыки, письма; кеш 24 часа |
| **Экспорт** | PDF (WeasyPrint), DOCX (python-docx), TXT; единый Celery-пайплайн |
| **Поиск** | Elasticsearch: статьи, примеры резюме и писем |
| **Telegram** | Бот: вход, резюме, AI, поиск, экспорт; привязка через deep link |
| **Mobile** | iOS/Android: auth, CRUD резюме, поиск, экспорт, профиль |

### Корпоративные и безопасность

| Модуль | Назначение |
|--------|------------|
| **organizations** | Команды, роли (владелец/админ/участник/наблюдатель), приглашения |
| **api_keys** | Программный доступ (`Authorization: Api-Key ...`) |
| **webhooks** | Исходящие события с подписью HMAC-SHA256 |
| **audit** | Журнал действий и API-мутаций |
| **feature_flags** | Постепенный раскат функций (процент rollout) |
| **payments** | Stripe: пробный период, месяц, год; счета |
| **accounts** | JWT + ротация refresh; OAuth; верификация email; 2FA (OTP) |
| **telegram** | Привязка аккаунта, deep link, API для бота |

### Клиентские приложения

| Клиент | Путь | Возможности |
|--------|------|-------------|
| **Web** | `src/` | Builder, маркетинг, i18n, демо-режим |
| **Telegram Bot** | `telegram-bot/` | Резюме, AI, поиск, экспорт, привязка аккаунта |
| **Mobile** | `mobile/` | iOS/Android: auth, резюме, поиск, профиль, экспорт |

---

## 3. Технологический стек

### Backend

| Технология | Назначение |
|------------|------------|
| Python 3.13+ | Основной язык |
| Django 6 + DRF | REST API, ORM, админка |
| Celery 5.4 + Beat | Асинхронные задачи и cron |
| Django Channels | WebSocket-предпросмотр |
| PostgreSQL 18 | Основная БД |
| Redis 8 | Кеш, сессии, брокер, Channels |
| Elasticsearch 8.16 | Полнотекстовый поиск |
| WeasyPrint / python-docx | Генерация PDF/DOCX |
| OpenAI SDK | AI-подсказки |
| django-allauth | OAuth |
| drf-spectacular | OpenAPI / Swagger |
| Argon2 | Хеширование паролей |
| boto3 / django-storages | S3 |

### Frontend

| Технология | Назначение |
|------------|------------|
| React 19 + TypeScript 5.7 | Интерфейс |
| Next.js 15 (App Router) | SSR/SSG, маршрутизация |
| Tailwind CSS 4 | Стили |
| Zustand 5 | Клиентское состояние |
| TanStack Query 5 | Серверное состояние |
| Framer Motion 12 | Анимации |
| dnd-kit | Перетаскивание секций |
| i18next | 11 языков |
| Vitest + Playwright | Тесты |
| Storybook | UI-компоненты |

### Telegram Bot

| Технология | Назначение |
|------------|------------|
| aiogram 3 | Telegram Bot API, FSM, роутеры |
| httpx | Асинхронные запросы к Django API |
| Redis /4 | JWT-сессии и FSM storage |

### Mobile

| Технология | Назначение |
|------------|------------|
| Expo 52 | Сборка iOS/Android |
| expo-router | File-based навигация |
| Zustand | Состояние auth |
| axios | HTTP + JWT interceptor |
| expo-secure-store | Безопасное хранение токенов |

### DevOps

| Технология | Назначение |
|------------|------------|
| Docker Compose | Локальная и staging-среда |
| Nginx | Обратный прокси |
| PgBouncer | Пул соединений БД |
| Kubernetes (`k8s/`) | Оркестрация production |
| Terraform (`terraform/`) | Инфраструктура как код |
| GitHub Actions | CI/CD |
| Sentry | Мониторинг ошибок |
| Prometheus (`monitoring/`) | Метрики |

---

## 4. Структура репозитория

```text
Resumer/
├── docker-compose.yml          # Полный стек
├── package.json                # Next.js (корень)
├── telegram-bot/               # Telegram-бот (aiogram 3)
│   ├── bot/handlers/           # start, auth, resumes, ai, search
│   ├── bot/api/client.py       # HTTP-клиент к Django
│   └── bot/storage/            # Redis JWT-сессии
├── mobile/                     # React Native (Expo)
│   ├── app/(auth)/             # login, register
│   ├── app/(tabs)/             # home, resumes, search, profile
│   ├── app/resume/             # create, [id]
│   └── src/api/                # axios + authStore
├── src/                        # Web Frontend
│   ├── app/                    # App Router
│   ├── components/             # builder, templates, ui
│   ├── stores/                 # Zustand
│   ├── hooks/                  # React hooks
│   ├── lib/                    # API, mock-api
│   └── i18n/                   # 11 локалей
├── tests/                      # Vitest + Playwright
├── docs/                       # Техническая документация (RU)
├── resumer/                    # Django backend
│   ├── config/                 # settings, urls, celery
│   ├── apps/                   # 25 приложений
│   ├── scripts/                # seed-скрипты
│   └── requirements/           # зависимости
├── nginx/
├── k8s/
├── terraform/
└── monitoring/
```

---

## 5. Архитектура и принцип работы

Подробнее: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

```text
                         ┌─────────────────────────────────────┐
                         │           Nginx (:80)               │
                         └──────────┬──────────────┬───────────┘
                                    │              │
                         ┌──────────▼──┐    ┌──────▼──────────┐
                         │  Next.js    │    │  Django (DRF)   │
                         │  :3000      │    │  :8000          │
                         └──────┬──────┘    └──────┬──────────┘
                                │                  ├── PostgreSQL
         ┌──────────────────────┼──────────────────┼──────────────────┐
         │                      │                  ├── Redis
  ┌──────▼──────┐      ┌────────▼────────┐  ┌──────▼──────┐      ┌──────▼──────┐
  │  Браузер    │      │ Mobile (Expo)   │  │ Telegram Bot│      │ Celery / ES │
  └─────────────┘      └─────────────────┘  └─────────────┘      └─────────────┘
```

### Очереди Celery

| Очередь | Задачи |
|---------|--------|
| **high** | PDF/DOCX, Stripe webhooks |
| **default** | Email, уведомления, вебхуки |
| **low** | SEO sitemap, аналитика, переиндексация ES |

---

## 6. Доменная модель

| Домен | Сущности |
|-------|----------|
| **Идентификация** | User, EmailVerification, OAuthConnection, APIKey |
| **Профиль** | UserProfile, WorkExperience, Education, Skill |
| **Документы** | Resume, CV, CoverLetter + версии и загрузки |
| **Шаблоны** | DocumentTemplate, TemplateColorScheme |
| **Контент** | Article, Author, Tag, Category |
| **Биллинг** | Subscription, Payment, Invoice |
| **Enterprise** | Organization, Webhook, AuditLog, FeatureFlag |
| **Интеграции** | TelegramAccount, TelegramLinkToken |
| **Платформа** | Notification, Event, SEOMetadata, Review |

---

## 7. Сервисы Docker Compose

| Сервис | Порт | Назначение |
|--------|------|------------|
| `frontend` | 3000 | Next.js |
| `web` | 8000 | Django API |
| `db` | 5432 | PostgreSQL |
| `redis` | 6379 | Кеш, брокер |
| `celery` | — | Воркер |
| `celery-beat` | — | Периодические задачи |
| `elasticsearch` | 9200 | Поиск |
| `nginx` | 80 | Прокси |
| `pgbouncer` | 6432 | Пул БД |
| `telegram-bot` | — | Telegram-бот (aiogram, polling) |
| `telegram-bot` | — | Telegram-бот (aiogram, polling) |
| `mailhog` | 8025 | Dev-почта |

---

## 8. Быстрый старт

```bash
git clone https://github.com/NodirOdilov/Resumer.git
cd Resumer

cp .env.example .env
cp resumer/.env.example resumer/.env

docker compose up -d

docker compose exec web python manage.py migrate
docker compose exec web python manage.py init_platform
docker compose exec web python manage.py createsuperuser
docker compose exec web python scripts/seed_data.py
docker compose exec web python manage.py reindex_search
```

| Сервис | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| Admin | http://localhost:8000/admin/ |
| Swagger | http://localhost:8000/api/docs/ |
| Health | http://localhost:8000/api/v1/platform/health/ |

### Telegram Bot

```bash
# В .env указать BOT_TOKEN от @BotFather
docker compose up telegram-bot -d

# Или локально:
cd telegram-bot && pip install -r requirements.txt && python -m bot.main
```

### Mobile

```bash
cd mobile
npm install && cp .env.example .env
npx expo start
```

---

## 9. Команды разработки

### Backend

```bash
cd resumer
python manage.py migrate
python manage.py init_platform
python manage.py reindex_search
pytest
```

### Frontend

```bash
npm install
npm run dev
npm test
npm run test:e2e
```

### Telegram Bot

```bash
cd telegram-bot
pip install -r requirements.txt
python -m bot.main
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## 10. Ручной запуск

### Backend

```bash
cd resumer
python -m venv venv && venv\Scripts\activate
pip install -r requirements/base.txt
python manage.py migrate && python manage.py runserver
```

### Frontend

```bash
npm install
npm run dev
```

### Демо-режим (без backend)

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

Запросы обрабатываются mock-адаптером в браузере (`src/lib/mock-api/`).

### Telegram Bot

```bash
cd telegram-bot
cp .env.example .env
# BOT_TOKEN, API_BASE_URL=http://localhost:8000/api/v1
python -m bot.main
```

### Mobile

```bash
cd mobile
cp .env.example .env
# EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
npx expo start
```

---

## 11. Конфигурация

| Файл | Назначение |
|------|------------|
| `.env` | Docker Compose |
| `resumer/.env` | Django |
| `.env.local` | Next.js |
| `telegram-bot/.env` | Telegram-бот |
| `mobile/.env` | Expo (EXPO_PUBLIC_*) |

| Переменная | Где | Назначение |
|------------|-----|------------|
| `BOT_TOKEN` | `.env` / `telegram-bot/.env` | Токен @BotFather |
| `TELEGRAM_BOT_USERNAME` | `resumer/.env` | Username бота для deep link |
| `EXPO_PUBLIC_API_URL` | `mobile/.env` | URL Django API |

Подробнее: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 12. API и интеграции

Полный справочник: [docs/API.md](docs/API.md)

| Префикс | Модуль |
|---------|--------|
| `/api/v1/auth/` | Аутентификация |
| `/api/v1/resumes/` | Резюме |
| `/api/v1/documents/` | Экспорт |
| `/api/v1/search/` | Поиск |
| `/api/v1/organizations/` | Организации |
| `/api/v1/webhooks/` | Вебхуки |
| `/api/v1/api-keys/` | API-ключи |
| `/api/v1/platform/` | Статус и health |
| `/api/v1/telegram/` | Привязка Telegram-аккаунта |

Клиенты: Web → Next.js; Mobile → Expo; Telegram → aiogram. Все используют JWT.

---

## 13. Мониторинг

| Компонент | Инструмент |
|-----------|------------|
| Ошибки | Sentry |
| Метрики | Prometheus |
| Health | `/api/v1/platform/health/` |
| Аудит | Django Admin |

---

## 14. CI/CD и деплой

| Среда | Метод |
|-------|-------|
| Development | `docker compose up -d` |
| Staging | Docker Compose на VPS |
| Production | Kubernetes (`k8s/`) |

Подробнее: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 15. Enterprise-модули

```bash
python manage.py init_platform
python manage.py reindex_search --async
```

| Модуль | API |
|--------|-----|
| audit | `GET /api/v1/audit/logs/` |
| feature_flags | `GET /api/v1/feature-flags/evaluate/` |
| organizations | `POST /api/v1/organizations/` |
| webhooks | `POST /api/v1/webhooks/endpoints/` |
| api_keys | `POST /api/v1/api-keys/` |
| documents | `POST /api/v1/documents/export/` |
| telegram | `POST /api/v1/telegram/link-token/` |

---

## 16. Роли в продакшене

| Компонент | Роль |
|-----------|------|
| Nginx | TLS, статика, маршрутизация |
| Next.js | Маркетинг, builder, i18n |
| Django | REST API, админка, WebSocket |
| Celery | PDF, email, вебхуки, индексация |
| PostgreSQL | Источник истины |
| Redis | Кеш, брокер, Channels |
| Elasticsearch | Поисковый индекс |
| S3 | Media и экспорты |
| Telegram Bot | Мессенджер-клиент, deep link, Redis-сессии |
| Mobile (Expo) | iOS/Android-клиент, SecureStore JWT |

---

## 17. Документация

### Техническая документация

| Документ | Описание |
|----------|----------|
| [docs/README.md](docs/README.md) | Индекс документации |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Архитектура |
| [docs/API.md](docs/API.md) | REST и WebSocket |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Развёртывание |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | История изменений |
| [resumer/README.md](resumer/README.md) | Backend |
| [telegram-bot/README.md](telegram-bot/README.md) | Telegram-бот |
| [mobile/README.md](mobile/README.md) | Мобильное приложение |
| [docs/TELEGRAM.md](docs/TELEGRAM.md) | Telegram: API + бот |
| [docs/MOBILE.md](docs/MOBILE.md) | Mobile: архитектура и сборка |

### Сообщество и governance (вкладки GitHub)

| Документ | Описание |
|----------|----------|
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Кодекс поведения |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Участие в разработке |
| [LICENSE](LICENSE) | Проприетарная лицензия |
| [SECURITY.md](SECURITY.md) | Политика безопасности |

---

## 18. Лицензия

Проприетарное программное обеспечение. Все права защищены.

---

## 19. Поддержка

| Канал | Контакт |
|-------|---------|
| Автор | [Nodir Odilov](https://github.com/NodirOdilov) |
| Issues | GitHub Issues |
| API | http://localhost:8000/api/docs/ |

---

<div align="center">

**Resumer** — корпоративная платформа карьерных документов

Django 6 · Next.js 15 · Expo · aiogram · PostgreSQL · Redis · Elasticsearch · Celery · Stripe

</div>
