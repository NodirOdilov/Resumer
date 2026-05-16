# Ресурсы мобильного приложения Resumer

Перед сборкой для App Store / Google Play добавьте графические ресурсы.

---

## Обязательные файлы

| Файл | Размер | Назначение |
|------|--------|------------|
| `icon.png` | 1024×1024 | Иконка приложения (iOS + Android) |
| `splash.png` | 1284×2778 | Splash screen при запуске |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon (foreground) |

---

## Рекомендации

| Параметр | Значение |
|----------|----------|
| Цвет фона | `#0D47A1` (бренд Resumer) |
| Формат | PNG, без прозрачности для splash |
| Safe area | Центрировать логотип в splash |

---

## Конфигурация

Пути указаны в `mobile/app.json`:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png" },
    "android": { "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png" } }
  }
}
```

---

## Dev-режим

Для `npx expo start` (Expo Go) иконки не обязательны — Expo использует заглушку. Для `eas build` и `expo prebuild` файлы **обязательны**.

---

## Связанные документы

- [mobile/README.md](../README.md)
- [docs/MOBILE.md](../../docs/MOBILE.md)
