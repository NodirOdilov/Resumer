# Resumer — Backend

**Версия: 2.7.0**

Django 6 backend платформы Resumer: REST API для Web, Mobile и Telegram Bot; WebSocket; Celery; Elasticsearch.

---

## Стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| Python | 3.13+ | Язык |
| Django | 6.x | Framework |
| DRF | 3.15+ | REST API |
| Celery | 5.4+ | Async tasks |
| Channels | 4.x | WebSocket (Web builder) |
| PostgreSQL | 18 | БД |
| Redis | 8 | Cache, broker, bot sessions |
| Elasticsearch | 8.16 | Поиск |

---

## Структура

```text
resumer/
├── config/           # settings, urls, asgi, celery
├── apps/             # 26 Django-приложений
│   ├── telegram/     # TelegramAccount, link API
│   ├── audit/        # AuditLog
│   ├── organizations/
│   └── ...
├── scripts/          # seed-скрипты
├── requirements/     # base, dev, prod, test
└── manage.py
```

---

## Быстрый старт

```bash
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux

pip install -r requirements/base.txt

cp .env.example .env
# POSTGRES_*, REDIS_URL, TELEGRAM_BOT_USERNAME

python manage.py migrate
python manage.py init_platform
python manage.py runserver
```

Celery:

```bash
celery -A config worker -l info -Q high,default,low
celery -A config beat -l info
```

---

## Приложения

| Приложение | Назначение |
|------------|------------|
| accounts | Auth, JWT, OAuth |
| resumes / cvs / cover_letters | Документы |
| documents | Unified PDF/DOCX export |
| builder | AI + WebSocket |
| templates_library | Шаблоны |
| content / examples | Контент |
| payments | Stripe |
| search | Elasticsearch |
| **telegram** | Привязка Telegram, deep link |
| audit | Журнал аудита |
| feature_flags | Feature flags |
| organizations | B2B команды |
| webhooks | Исходящие события |
| api_keys | API-ключи |
| core | Platform, health |

---

## Telegram API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/v1/telegram/me/` | Статус привязки |
| POST | `/api/v1/telegram/link-token/` | Deep link токен |
| POST | `/api/v1/telegram/link/` | Привязка (бот) |
| POST | `/api/v1/telegram/unlink/` | Отвязка |

Переменная: `TELEGRAM_BOT_USERNAME` в `.env`.

Подробнее: [docs/TELEGRAM.md](../docs/TELEGRAM.md)

---

## Команды

```bash
python manage.py migrate
python manage.py init_platform
python manage.py reindex_search
python manage.py makemigrations telegram
python manage.py createsuperuser
python scripts/seed_data.py
pytest
```

---

## Клиенты API

| Клиент | Каталог | Документация |
|--------|---------|--------------|
| Web | `../src/` | [README](../README.md) |
| Mobile | `../mobile/` | [mobile/README](../mobile/README.md) |
| Telegram Bot | `../telegram-bot/` | [telegram-bot/README](../telegram-bot/README.md) |

---

## Документация

| Документ | Путь |
|----------|------|
| Главный README | [../README.md](../README.md) |
| Архитектура | [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) |
| API | [../docs/API.md](../docs/API.md) |
| Swagger | http://localhost:8000/api/docs/ |

---

## Переменные окружения

См. `.env.example` в этом каталоге.

---

## Лицензия

Проприетарное ПО. Все права защищены.
