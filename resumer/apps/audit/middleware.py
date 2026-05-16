"""Middleware для автоматического аудита мутационных API-запросов."""

from __future__ import annotations

import logging
from typing import Callable

from django.http import HttpRequest, HttpResponse

from apps.audit.models import AuditAction
from apps.audit.services import AuditService

logger = logging.getLogger(__name__)

# HTTP-методы, которые изменяют состояние системы.
_MUTATION_METHODS = frozenset({"POST", "PUT", "PATCH", "DELETE"})

# Префиксы путей, которые не нужно аудировать (health, static, schema).
_SKIP_PREFIXES = (
    "/health/",
    "/admin/",
    "/static/",
    "/media/",
    "/api/schema/",
    "/api/docs/",
)


class AuditMiddleware:
    """Фиксирует мутационные API-запросы в журнале аудита."""

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)
        self._maybe_audit(request, response)
        return response

    def _maybe_audit(self, request: HttpRequest, response: HttpResponse) -> None:
        """Записать событие аудита при успешном мутационном запросе."""
        if request.method not in _MUTATION_METHODS:
            return

        path = request.path
        if any(path.startswith(prefix) for prefix in _SKIP_PREFIXES):
            return

        if not path.startswith("/api/"):
            return

        # Аудируем только успешные ответы (2xx).
        if response.status_code >= 300:
            return

        user = request.user if getattr(request, "user", None) and request.user.is_authenticated else None
        request_id = getattr(request, "request_id", "")

        try:
            AuditService.log(
                action=AuditAction.API,
                resource_type="api",
                resource_id=path,
                user=user,
                description=f"{request.method} {path}",
                metadata={
                    "method": request.method,
                    "status_code": response.status_code,
                    "query": dict(request.GET),
                },
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                request_id=request_id,
            )
        except Exception:
            # Аудит не должен ломать основной запрос.
            logger.exception("Ошибка записи аудита для %s %s", request.method, path)

    @staticmethod
    def _get_client_ip(request: HttpRequest) -> str | None:
        """Извлечь IP клиента с учётом прокси."""
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
