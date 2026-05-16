# Участие в разработке Resumer

Стандарты и процесс для разработчиков Web, Backend, Telegram Bot и Mobile.

---

## 1. Начало работы

```bash
git clone https://github.com/NodirOdilov/Resumer.git
cd Resumer

cp .env.example .env
cp resumer/.env.example resumer/.env

docker compose up -d
docker compose exec web python manage.py migrate
docker compose exec web python manage.py init_platform
```

Подробнее: [README.md](../README.md), раздел «Быстрый старт».

### Опционально: Telegram Bot и Mobile

```bash
# Bot (локально)
cd telegram-bot && pip install -r requirements.txt && cp .env.example .env

# Mobile
cd mobile && npm install && cp .env.example .env
```

---

## 2. Ветвление

| Тип ветки | Шаблон | Пример |
|-----------|--------|--------|
| Функция | `feature/<описание>` | `feature/telegram-export` |
| Исправление | `fix/<описание>` | `fix/mobile-login-refresh` |
| Документация | `docs/<описание>` | `docs/mobile-guide` |
| Рефакторинг | `refactor/<описание>` | `refactor/bot-handlers` |

Базовая ветка: `main`.

---

## 3. Стандарты кода

### Backend (Python / Django)

| Правило | Описание |
|---------|----------|
| Типизация | `from __future__ import annotations` |
| Docstrings | На русском для публичных методов |
| API | DRF ViewSet + serializers |
| Тесты | pytest, `@pytest.mark.django_db` |

### Frontend Web (TypeScript / React)

| Правило | Описание |
|---------|----------|
| Стиль | ESLint + Prettier |
| Состояние | Zustand + React Query |
| i18n | Строки через i18next |

### Telegram Bot (Python / aiogram)

| Правило | Описание |
|---------|----------|
| Handlers | Один файл на домен (`resumes.py`, `auth.py`) |
| API | Только через `ResumerAPIClient` |
| Секреты | `BOT_TOKEN` только в `.env` |
| Сессии | JWT в Redis, не в коде |

### Mobile (TypeScript / Expo)

| Правило | Описание |
|---------|----------|
| Навигация | expo-router, file-based |
| API | Только через `src/api/client.ts` |
| Токены | expo-secure-store, не AsyncStorage |
| Env | Префикс `EXPO_PUBLIC_` |

---

## 4. Коммиты

```text
<type>: <краткое описание на русском>
```

| type | Назначение |
|------|------------|
| `feat` | Новая функциональность |
| `fix` | Исправление |
| `docs` | Документация |
| `refactor` | Рефакторинг |
| `test` | Тесты |
| `chore` | Инфраструктура |

---

## 5. Тестирование

### Backend

```bash
cd resumer
pytest
pytest apps/telegram/tests/  # при наличии
```

### Frontend Web

```bash
npm test
npm run test:e2e
```

### Telegram Bot

```bash
cd telegram-bot
# Ручное тестирование с тестовым BOT_TOKEN
python -m bot.main
```

### Mobile

```bash
cd mobile
npx expo start
# Тест на эмуляторе / Expo Go
```

---

## 6. Миграции

```bash
cd resumer
python manage.py makemigrations
python manage.py migrate
```

При изменении `apps.telegram` — отдельная миграция в PR.

---

## 7. Документация

При изменении API обновите:

| Файл | Когда |
|------|-------|
| `docs/API.md` | Новые endpoint |
| `docs/TELEGRAM.md` | Telegram API или бот |
| `docs/MOBILE.md` | Mobile экраны или API |
| `docs/ARCHITECTURE.md` | Архитектурные изменения |
| `docs/CHANGELOG.md` | Пользовательские изменения |
| `telegram-bot/README.md` | Команды бота |
| `mobile/README.md` | Mobile quick start |

Комментарии в коде — на русском.

---

## 8. Code Review

| Критерий | Ожидание |
|----------|----------|
| Тесты | Покрытие новой логики |
| Безопасность | Нет `BOT_TOKEN`, JWT в diff |
| Mobile | Токены в SecureStore |
| Bot | Нет хардкода API URL |
| Audit | Критичные действия логируются |

---

## 9. Контакты

| Канал | Ссылка |
|-------|--------|
| Автор | [Nodir Odilov](https://github.com/NodirOdilov) |
| Issues | GitHub Issues |
