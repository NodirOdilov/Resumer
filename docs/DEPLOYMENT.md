# Развёртывание Resumer

Руководство по запуску в development, staging и production: Web, Backend, Telegram Bot, Mobile.

---

## 1. Среды

| Среда | Метод | Компоненты |
|-------|-------|------------|
| Development | Docker Compose | web, frontend, bot, redis, db, ES |
| Staging | Docker Compose на VPS | Production-like secrets |
| Production | Kubernetes + Terraform | HPA, TLS, managed DB |

---

## 2. Development (Docker Compose)

### Предварительные требования

- Docker 24+
- Docker Compose 2.20+
- 8 GB RAM (рекомендуется для Elasticsearch)
- Node.js 22+ (для mobile, опционально)
- Python 3.13+ (для bot без Docker, опционально)

### Запуск полного стека

```bash
git clone https://github.com/NodirOdilov/Resumer.git
cd Resumer

cp .env.example .env
cp resumer/.env.example resumer/.env

# Указать BOT_TOKEN в .env (от @BotFather)
# TELEGRAM_BOT_USERNAME в resumer/.env

docker compose up -d

docker compose exec web python manage.py migrate
docker compose exec web python manage.py init_platform
docker compose exec web python manage.py createsuperuser
docker compose exec web python scripts/seed_data.py
docker compose exec web python manage.py reindex_search
```

### Сервисы

| Контейнер | Порт | Назначение |
|-----------|------|------------|
| frontend | 3000 | Next.js |
| web | 8000 | Django API |
| telegram-bot | — | aiogram 3, polling |
| db | 5432 | PostgreSQL |
| redis | 6379 | Cache, broker, bot sessions |
| celery | — | Async worker |
| celery-beat | — | Cron tasks |
| elasticsearch | 9200 | Search |
| nginx | 80 | Proxy |
| pgbouncer | 6432 | Pool |
| mailhog | 8025 | Dev email |

### Только Telegram Bot

```bash
docker compose up telegram-bot -d
docker compose logs -f telegram-bot
```

### Mobile (вне Docker)

```bash
cd mobile
npm install
cp .env.example .env
# EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
# Android эмулятор: http://10.0.2.2:8000/api/v1
npx expo start
```

---

## 3. Telegram Bot (production)

| Режим | `BOT_MODE` | Описание |
|-------|------------|----------|
| Polling | `polling` | Dev и простой VPS |
| Webhook | `webhook` | Production за HTTPS |

Переменные:

| Переменная | Описание |
|------------|----------|
| `BOT_TOKEN` | Токен @BotFather |
| `API_BASE_URL` | `https://api.example.com/api/v1` |
| `REDIS_URL` | Managed Redis, DB /4 |
| `WEBHOOK_URL` | `https://bot.example.com/webhook` |
| `TELEGRAM_BOT_USERNAME` | В `resumer/.env` для deep link |

---

## 4. Mobile (production)

| Этап | Команда |
|------|---------|
| Конфигурация | `EXPO_PUBLIC_API_URL=https://api.example.com/api/v1` |
| Сборка | `eas build --platform all` |
| Публикация | `eas submit --platform all` |

Ресурсы: `mobile/assets/icon.png`, `splash.png`, `adaptive-icon.png` (см. `mobile/assets/README.md`).

---

## 5. Production (Kubernetes)

Манифесты: каталог `k8s/`.

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/elasticsearch-statefulset.yaml
kubectl apply -f k8s/jobs/migrate.yaml
kubectl apply -f k8s/django-deployment.yaml
kubectl apply -f k8s/celery-deployment.yaml
kubectl apply -f k8s/nextjs-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

Telegram Bot — отдельный Deployment (не в базовых манифестах; добавить при необходимости).

---

## 6. Terraform

Каталог `terraform/`: VPC, RDS, ElastiCache, S3, CloudFront, EKS.

---

## 7. Переменные окружения (production)

### Backend (обязательные)

| Переменная | Описание |
|------------|----------|
| `DJANGO_SECRET_KEY` | Min 50 символов |
| `DEBUG` | `False` |
| `POSTGRES_*` | Managed PostgreSQL |
| `REDIS_URL` | Managed Redis |
| `AWS_*` | S3 media и exports |
| `STRIPE_*` | Live keys |
| `ELASTICSEARCH_URL` | ES cluster |
| `OPENAI_API_KEY` | AI-функции |
| `TELEGRAM_BOT_USERNAME` | Username бота |

### Frontend (build-time)

| Переменная | Описание |
|------------|----------|
| `NEXT_PUBLIC_API_URL` | Production API |
| `NEXT_PUBLIC_DEMO_MODE` | `false` |

### Telegram Bot

| Переменная | Описание |
|------------|----------|
| `BOT_TOKEN` | Секрет бота |
| `API_BASE_URL` | Production API |
| `REDIS_URL` | Redis /4 |

### Mobile (build-time)

| Переменная | Описание |
|------------|----------|
| `EXPO_PUBLIC_API_URL` | Production API |
| `EXPO_PUBLIC_SITE_URL` | Production site |

---

## 8. Production checklist

### Безопасность

- [ ] `DEBUG=False`
- [ ] Уникальный `DJANGO_SECRET_KEY`
- [ ] HTTPS на всех endpoint
- [ ] `BOT_TOKEN` не в репозитории
- [ ] CORS/CSRF только production-домены
- [ ] Stripe webhook verification

### Инфраструктура

- [ ] PostgreSQL + PgBouncer
- [ ] Redis AOF
- [ ] Elasticsearch cluster
- [ ] Celery: min 2 worker
- [ ] Telegram Bot: webhook + TLS
- [ ] Backup PostgreSQL

### После деплоя

- [ ] `migrate`, `init_platform`, `reindex_search`
- [ ] Health: `/api/v1/platform/health/`
- [ ] Bot: `/start` отвечает
- [ ] Mobile: login на production API

---

## 9. Мониторинг

| Инструмент | Назначение |
|------------|------------|
| Sentry | Ошибки web, api, bot |
| Prometheus | Метрики |
| Audit log | Django Admin |

---

## 10. Откат (rollback)

```bash
kubectl rollout undo deployment/django
docker compose up -d --no-deps web telegram-bot
```

---

## 11. Связанные документы

- [Архитектура](./ARCHITECTURE.md)
- [Telegram](./TELEGRAM.md)
- [Mobile](./MOBILE.md)
- [API](./API.md)
