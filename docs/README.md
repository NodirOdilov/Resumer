# Документация Resumer

Центральный индекс технической документации платформы Resumer: Web, Mobile, Telegram Bot и Django API.

---

## Навигация

| Документ | Описание |
|----------|----------|
| [Архитектура](./ARCHITECTURE.md) | Компоненты, клиенты, потоки данных, Redis DB |
| [API](./API.md) | REST, WebSocket, JWT, Telegram endpoints |
| [Telegram](./TELEGRAM.md) | Django `apps.telegram` + aiogram бот |
| [Mobile](./MOBILE.md) | Expo-приложение, экраны, сборка |
| [Развёртывание](./DEPLOYMENT.md) | Docker, K8s, bot, mobile production |
| [Участие в разработке](./CONTRIBUTING.md) | Стандарты кода, ветки, тестирование |
| [История изменений](./CHANGELOG.md) | Версии и релизы |

### Клиентские проекты

| Документ | Описание |
|----------|----------|
| [telegram-bot/README.md](../telegram-bot/README.md) | Краткий гайд Telegram-бота |
| [mobile/README.md](../mobile/README.md) | Краткий гайд мобильного приложения |
| [resumer/README.md](../resumer/README.md) | Django backend |

---

## Быстрые ссылки

| Ресурс | URL (локально) |
|--------|----------------|
| Главная документация | [README.md](../README.md) |
| Swagger UI | http://localhost:8000/api/docs/ |
| Django Admin | http://localhost:8000/admin/ |
| Web Frontend | http://localhost:3000 |
| Health Check | http://localhost:8000/api/v1/platform/health/ |
| Telegram Bot | `docker compose up telegram-bot` |
| Mobile | `cd mobile && npx expo start` |

---

## Аудитория

| Документ | Для кого |
|----------|----------|
| README.md | Все: обзор, быстрый старт |
| ARCHITECTURE.md | Архитекторы, backend/frontend |
| API.md | Интеграторы, mobile, bot |
| TELEGRAM.md | Разработчики Telegram-бота |
| MOBILE.md | React Native / Expo команда |
| DEPLOYMENT.md | DevOps, SRE |
| CONTRIBUTING.md | Контрибьюторы |
| CHANGELOG.md | PM, релиз-менеджеры |

---

<div align="center">

**Resumer** — Web · Mobile · Telegram · Django API

</div>
