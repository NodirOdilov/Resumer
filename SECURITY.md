# Политика безопасности

## Поддерживаемые версии

| Версия | Поддержка |
|--------|-----------|
| `main` (latest) | Активная |
| Стабильные релизы | 90 дней после следующего релиза |

---

## Сообщение об уязвимости

Безопасность платформы **Resumer** и данных пользователей — приоритет.

| Канал | Адрес |
|-------|-------|
| Email (предпочтительно) | security@resumer.com |
| GitHub | Личное сообщение [Nodir Odilov](https://github.com/NodirOdilov) |

**Не создавайте публичный issue** для уязвимостей до получения подтверждения.

### Что включить в отчёт

| Поле | Описание |
|------|----------|
| Описание | Суть уязвимости |
| Шаги воспроизведения | Пошаговая инструкция |
| Влияние | Какие данные затронуты |
| Версия | Коммит, ветка, клиент (Web/Mobile/Bot) |
| PoC | Proof of concept (если есть) |

---

## Сроки ответа

| Этап | Срок |
|------|------|
| Подтверждение | 48 часов |
| Первичная оценка | 5 рабочих дней |
| Исправление (критичные) | 14 рабочих дней |
| Исправление (некритичные) | 30 рабочих дней |

---

## Область действия

### В scope

| Компонент | Примеры |
|-----------|---------|
| Backend API | JWT, API-ключи, IDOR |
| Telegram API | link-token TTL, replay привязки |
| Telegram Bot | Утечка JWT из Redis, подмена telegram_id |
| Mobile | Небезопасное хранение токенов, MITM при HTTP |
| Аутентификация | OAuth, 2FA, сброс пароля |
| Платежи | Stripe webhooks |
| Webhooks | HMAC, replay attacks |
| Frontend Web | XSS, CSRF |
| Инфраструктура | Misconfiguration в официальных манифестах |

### Вне scope

| Категория | Причина |
|-----------|---------|
| Социальная инженерия | Не техническая уязвимость |
| DoS без эксплуатации | Отдельное согласование |
| Сканирование без разрешения | Только с письменного согласия |

---

## Рекомендации по безопасной эксплуатации

### Production checklist

- [ ] `DEBUG=False`
- [ ] Уникальный `DJANGO_SECRET_KEY`
- [ ] HTTPS на всех endpoint
- [ ] `BOT_TOKEN` только в secrets (не в git)
- [ ] Mobile: `EXPO_PUBLIC_API_URL` только HTTPS
- [ ] Telegram link-token: короткий TTL, одноразовость
- [ ] Rate limiting (Redis throttling)
- [ ] Sentry DSN настроен

### Секреты по компонентам

| Компонент | Секреты |
|-----------|---------|
| Backend | `DJANGO_SECRET_KEY`, `STRIPE_*`, `OPENAI_API_KEY` |
| Telegram Bot | `BOT_TOKEN` |
| Mobile | Не встраивать секреты в APK (только `EXPO_PUBLIC_*`) |
| Web | `NEXT_PUBLIC_*` — только публичные ключи |

---

## Благодарности

Исследователям может быть предоставлено публичное признание в [CHANGELOG.md](docs/CHANGELOG.md) после исправления.

---

## Связанные документы

| Документ | Ссылка |
|----------|--------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Процесс разработки |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production checklist |
| [docs/TELEGRAM.md](docs/TELEGRAM.md) | Безопасность Telegram |
| [docs/API.md](docs/API.md) | Аутентификация API |

---

## Контакты

| Роль | Контакт |
|------|---------|
| Ответственный | [Nodir Odilov](https://github.com/NodirOdilov) |
| Email | security@resumer.com |
