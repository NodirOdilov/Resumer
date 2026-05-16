# Resumer Mobile

**Версия: 2.7.0**

Нативное мобильное приложение **React Native (Expo 52)** для iOS и Android. Клиент единого Django REST API: аутентификация, резюме, поиск, экспорт, профиль.

---

## Возможности

| Экран | Маршрут | Функции |
|-------|---------|---------|
| Вход | `/(auth)/login` | JWT, SecureStore |
| Регистрация | `/(auth)/register` | Создание аккаунта |
| Главная | `/(tabs)/` | Быстрые действия |
| Резюме | `/(tabs)/resumes` | Список, переход к деталям |
| Создание | `/resume/create` | POST `/resumes/` |
| Детали | `/resume/[id]` | Просмотр, экспорт PDF/DOCX |
| Поиск | `/(tabs)/search` | Elasticsearch |
| Профиль | `/(tabs)/profile` | Аккаунт, Telegram-статус |

---

## Быстрый старт

```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

| Среда | `EXPO_PUBLIC_API_URL` |
|-------|------------------------|
| iOS симулятор | `http://localhost:8000/api/v1` |
| Android эмулятор | `http://10.0.2.2:8000/api/v1` |
| Физическое устройство | IP хоста в локальной сети |

Сканируйте QR в **Expo Go** или нажмите `a` (Android) / `i` (iOS).

---

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `EXPO_PUBLIC_API_URL` | Backend API |
| `EXPO_PUBLIC_SITE_URL` | URL веб-сайта |

Файл: `.env.example` → `.env`

---

## Структура

```text
mobile/
├── app/
│   ├── _layout.tsx           # Root, auth guard
│   ├── index.tsx
│   ├── (auth)/login.tsx, register.tsx
│   ├── (tabs)/index, resumes, search, profile
│   └── resume/create.tsx, [id].tsx
├── src/
│   ├── api/client.ts         # axios + JWT interceptor
│   ├── store/authStore.ts    # Zustand + SecureStore
│   ├── components/           # Button, Input, ResumeCard
│   └── constants/theme.ts
├── assets/                   # icon, splash (см. assets/README.md)
├── app.json
└── package.json
```

---

## Технологии

| Технология | Назначение |
|------------|------------|
| Expo 52 | Сборка iOS/Android |
| expo-router | File-based навигация |
| Zustand | Состояние auth |
| axios | HTTP-клиент |
| expo-secure-store | Безопасное хранение JWT |

---

## API

| Действие | Endpoint |
|----------|----------|
| Вход | `POST /auth/login/` |
| Регистрация | `POST /auth/register/` |
| Профиль | `GET /auth/me/` |
| Резюме | `GET/POST /resumes/` |
| Экспорт | `POST /documents/export/` |
| Поиск | `GET /search/?q=` |
| Telegram | `GET /telegram/me/` |

Справочник: [docs/API.md](../docs/API.md)  
Архитектура: [docs/MOBILE.md](../docs/MOBILE.md)

---

## Ресурсы (перед store-сборкой)

| Файл | Размер |
|------|--------|
| `assets/icon.png` | 1024×1024 |
| `assets/splash.png` | 1284×2778 |
| `assets/adaptive-icon.png` | 1024×1024 |

См. [assets/README.md](assets/README.md).

---

## Сборка

```bash
# Development native
npx expo prebuild
npx expo run:android
npx expo run:ios

# Production (EAS)
eas build --platform all
eas submit --platform all
```

Production: `EXPO_PUBLIC_API_URL=https://api.example.com/api/v1`

---

## Связанные проекты

| Проект | Путь |
|--------|------|
| Backend API | [../resumer](../resumer) |
| Web Frontend | [../src](../src) |
| Telegram Bot | [../telegram-bot](../telegram-bot) |
| Документация | [../docs/MOBILE.md](../docs/MOBILE.md) |

---

## Лицензия

Проприетарное ПО. Все права защищены.
