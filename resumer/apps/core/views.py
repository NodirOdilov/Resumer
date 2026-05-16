"""API представления ядра платформы."""

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.services.platform import PlatformService
from apps.core.version import __version__


class PlatformStatusView(APIView):
    """GET /api/v1/platform/status/ — публичный статус платформы."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = PlatformService.get_public_settings()
        maintenance = PlatformService.get("platform.maintenance_mode", False)
        return Response(
            {
                "status": "maintenance" if maintenance else "operational",
                "version": __version__,
                "settings": settings,
            }
        )


class PlatformHealthView(APIView):
    """GET /api/v1/platform/health/ — расширенная проверка здоровья."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        checks = {
            "database": self._check_database(),
            "redis": self._check_redis(),
            "elasticsearch": self._check_elasticsearch(),
        }
        all_ok = all(checks.values())
        return Response(
            {
                "status": "healthy" if all_ok else "degraded",
                "version": __version__,
                "checks": checks,
            },
            status=200 if all_ok else 503,
        )

    @staticmethod
    def _check_database() -> bool:
        try:
            from django.db import connection
            connection.ensure_connection()
            return True
        except Exception:
            return False

    @staticmethod
    def _check_redis() -> bool:
        try:
            from django.core.cache import cache
            cache.set("_health", "1", 5)
            return cache.get("_health") == "1"
        except Exception:
            return False

    @staticmethod
    def _check_elasticsearch() -> bool:
        try:
            from elasticsearch import Elasticsearch
            from django.conf import settings
            hosts = settings.ELASTICSEARCH_DSL["default"]["hosts"]
            es = Elasticsearch(hosts)
            return es.ping()
        except Exception:
            return False
