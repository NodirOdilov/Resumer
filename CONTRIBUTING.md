# Участие в разработке

Спасибо за интерес к проекту **Resumer**. Ниже описан процесс участия в разработке Web, Backend, Telegram Bot и Mobile.

Расширенная документация: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

## Содержание

1. [Как начать](#1-как-начать)
2. [Процесс разработки](#2-процесс-разработки)
3. [Стандарты кода](#3-стандарты-кода)
4. [Коммиты и PR](#4-коммиты-и-pr)
5. [Тестирование](#5-тестирование)
6. [Документация](#6-документация)
7. [Кодекс поведения](#7-кодекс-поведения)

---

## 1. Как начать

### Требования

| Инструмент | Версия | Для |
|------------|--------|-----|
| Docker | 24+ | Полный стек |
| Docker Compose | 2.20+ | web, bot, redis |
| Git | 2.x | Все |
| Node.js | 22+ | Mobile, Web (без Docker) |
| Python | 3.13+ | Backend, Bot (без Docker) |

### Настройка окружения

```bash
git clone https://github.com/NodirOdilov/Resumer.git
cd Resumer

cp .env.example .env
cp resumer/.env.example resumer/.env

docker compose up -d
docker compose exec web python manage.py migrate
docker compose exec web python manage.py init_platform
```

Полная инструкция: [README.md](README.md#8-быстрый-старт).

### Telegram Bot и Mobile

```bash
# Bot
cd telegram-bot && cp .env.example .env && pip install -r requirements.txt

# Mobile
cd mobile && npm install && cp .env.example .env
```

---

## 2. Процесс разработки

### Ветки

| Тип | Шаблон | Пример |
|-----|--------|--------|
| Функция | `feature/<описание>` | `feature/mobile-profile` |
| Исправление | `fix/<описание>` | `fix/bot-session-expiry` |
| Документация | `docs/<описание>` | `docs/telegram-api` |

Базовая ветка: `main`.

### Pull Request

1. Создайте issue или согласуйте задачу.
2. Форкните репозиторий, ветка от `main`.
3. Внесите изменения, добавьте тесты.
4. Откройте PR с описанием и ссылкой на issue.

Шаблон: [.github/pull_request_template.md](.github/pull_request_template.md)

---

## 3. Стандарты кода

### Backend (Django)

- Типизация, docstrings на русском
- Бизнес-логика в `services.py`
- `AuditService` для критичных действий

### Frontend Web (Next.js)

- ESLint + Prettier
- Zustand + React Query
- i18next для строк UI

### Telegram Bot (aiogram)

- Handlers в `bot/handlers/`
- HTTP только через `ResumerAPIClient`
- `BOT_TOKEN` не в коде

### Mobile (Expo)

- expo-router, file-based routes
- JWT в expo-secure-store
- API через `src/api/client.ts`

### Общие правила

- Не коммитить секреты
- Минимальный diff
- Комментарии на русском

---

## 4. Коммиты и PR

```text
<type>: <краткое описание на русском>
```

### Checklist для PR

- [ ] Код соответствует стандартам
- [ ] Тесты добавлены или обновлены
- [ ] Документация обновлена (API, bot, mobile)
- [ ] Миграции созданы (если модели)
- [ ] `CHANGELOG.md` обновлён
- [ ] Нет секретов в diff

---

## 5. Тестирование

```bash
# Backend
cd resumer && pytest

# Web
npm test && npm run test:e2e

# Bot (ручное)
cd telegram-bot && python -m bot.main

# Mobile
cd mobile && npx expo start
```

---

## 6. Документация

| Файл | Когда обновлять |
|------|-----------------|
| [docs/API.md](docs/API.md) | Изменения REST API |
| [docs/TELEGRAM.md](docs/TELEGRAM.md) | Telegram модуль или бот |
| [docs/MOBILE.md](docs/MOBILE.md) | Mobile приложение |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Релизные изменения |
| [README.md](README.md) | Значимые изменения платформы |

---

## 7. Кодекс поведения

Участвуя в проекте, вы соглашаетесь соблюдать [Кодекс поведения](CODE_OF_CONDUCT.md).

---

## Контакты

| Канал | Ссылка |
|-------|--------|
| Автор | [Nodir Odilov](https://github.com/NodirOdilov) |
| Issues | GitHub Issues |
| Безопасность | [SECURITY.md](SECURITY.md) |
