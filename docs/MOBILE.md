# Мобильное приложение Resumer

Техническое описание клиента `mobile/` на React Native (Expo).

---

## 1. Обзор

| Параметр | Значение |
|----------|----------|
| Framework | Expo SDK 52 |
| Навигация | expo-router (file-based) |
| Состояние | Zustand (`authStore`) |
| HTTP | axios + JWT interceptor |
| Хранение токенов | expo-secure-store |
| Платформы | iOS, Android |

---

## 2. Структура проекта

```text
mobile/
├── app/
│   ├── _layout.tsx           # Root layout, auth guard
│   ├── index.tsx             # Redirect: auth или tabs
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigator
│   │   ├── index.tsx         # Главная
│   │   ├── resumes.tsx       # Список резюме
│   │   ├── search.tsx        # Elasticsearch
│   │   └── profile.tsx       # Профиль, Telegram
│   └── resume/
│       ├── create.tsx
│       └── [id].tsx          # Детали, экспорт
├── src/
│   ├── api/client.ts         # Axios instance
│   ├── store/authStore.ts    # JWT, user, login/logout
│   ├── components/           # Button, Input, ResumeCard
│   └── constants/theme.ts    # Цвета, отступы
├── assets/                   # icon, splash (см. assets/README.md)
├── app.json
├── package.json
└── .env.example
```

---

## 3. Экраны и функции

| Экран | Маршрут | API |
|-------|---------|-----|
| Вход | `/(auth)/login` | `POST /auth/login/` |
| Регистрация | `/(auth)/register` | `POST /auth/register/` |
| Главная | `/(tabs)/` | — |
| Резюме | `/(tabs)/resumes` | `GET /resumes/` |
| Создание | `/resume/create` | `POST /resumes/` |
| Детали | `/resume/[id]` | `GET/PATCH /resumes/{id}/`, экспорт |
| Поиск | `/(tabs)/search` | `GET /search/?q=` |
| Профиль | `/(tabs)/profile` | `GET /auth/me/`, `GET /telegram/me/` |

---

## 4. Аутентификация

```text
[login]  POST /auth/login/  →  {access, refresh}
[authStore]  SecureStore.setItemAsync('access_token', ...)
[api/client]  interceptor  →  Authorization: Bearer <token>
[logout]  SecureStore.delete + redirect /(auth)/login
```

Refresh-токен сохраняется для будущего auto-refresh (при необходимости расширения).

---

## 5. Переменные окружения

| Переменная | Dev (симулятор) | Dev (Android эмулятор) |
|------------|-----------------|------------------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | `http://10.0.2.2:8000/api/v1` |
| `EXPO_PUBLIC_SITE_URL` | `http://localhost:3000` | `http://10.0.2.2:3000` |

Файл: `mobile/.env.example` → скопировать в `.env`.

---

## 6. Быстрый старт

```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

| Клавиша | Действие |
|---------|----------|
| `a` | Android эмулятор |
| `i` | iOS симулятор |
| QR | Expo Go на устройстве |

### Ресурсы (обязательно перед store-сборкой)

| Файл | Размер |
|------|--------|
| `assets/icon.png` | 1024×1024 |
| `assets/splash.png` | 1284×2778 |
| `assets/adaptive-icon.png` | 1024×1024 |

См. [mobile/assets/README.md](../mobile/assets/README.md).

---

## 7. Production-сборка

```bash
# Native prebuild
npx expo prebuild
npx expo run:android
npx expo run:ios

# EAS (рекомендуется)
eas build --platform all
eas submit --platform all
```

`EXPO_PUBLIC_API_URL` должен указывать на production API (`https://api.example.com/api/v1`).

---

## 8. Связанные документы

- [API](./API.md) — REST-справочник
- [Архитектура](./ARCHITECTURE.md) — место mobile в системе
- [mobile/README.md](../mobile/README.md) — краткий гайд
