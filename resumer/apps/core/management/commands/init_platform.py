"""Инициализация enterprise-платформы: флаги, настройки, индексы."""

from django.core.management.base import BaseCommand

from apps.core.services.platform import PlatformService
from apps.core.version import __version__
from apps.feature_flags.models import FeatureFlag


class Command(BaseCommand):
    help = "Инициализировать системные настройки и feature flags платформы."

    def handle(self, *args, **options) -> None:
        self.stdout.write("Инициализация платформы Resumer...")

        # Системные настройки.
        defaults = {
            "platform.name": ("Resumer", "Название платформы", True),
            "platform.version": (__version__, "Версия платформы", True),
            "platform.maintenance_mode": (False, "Режим обслуживания", True),
            "limits.free_resumes": (3, "Лимит резюме на free-плане", False),
            "limits.free_exports_per_day": (5, "Лимит экспортов в день", False),
            "ai.enabled": (True, "AI-подсказки включены", True),
        }
        for key, (value, desc, is_public) in defaults.items():
            PlatformService.set(key, value, description=desc, is_public=is_public)
            self.stdout.write(f"  Настройка: {key}")

        # Feature flags.
        flags = [
            ("ai_suggestions", "AI-подсказки", True, 100),
            ("realtime_preview", "Превью в реальном времени", True, 100),
            ("organizations", "Организации и команды", True, 50),
            ("webhooks", "Исходящие вебхуки", True, 100),
            ("api_keys", "API-ключи", True, 100),
            ("advanced_analytics", "Расширенная аналитика", False, 0),
            ("premium_templates", "Premium-шаблоны", True, 100),
        ]
        for key, name, enabled, rollout in flags:
            FeatureFlag.objects.update_or_create(
                key=key,
                defaults={
                    "name": name,
                    "is_enabled": enabled,
                    "rollout_percentage": rollout,
                },
            )
            self.stdout.write(f"  Feature flag: {key} = {enabled}")

        self.stdout.write(self.style.SUCCESS("Платформа инициализирована."))
        self.stdout.write("Запустите: python manage.py reindex_search --async")
