from __future__ import annotations

import logging
from typing import Callable

from django.http import HttpRequest, HttpResponse

logger = logging.getLogger(__name__)

# Paths that should NOT be tracked automatically
EXCLUDED_PREFIXES: tuple[str, ...] = (
    "/api/",
    "/admin/",
    "/static/",
    "/media/",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap",
    "/health",
    "/__debug__/",
)


class AnalyticsMiddleware:
    """Automatically records ``page_view`` events for non-API, non-static
    requests.

    Only GET requests to paths that do not match any excluded prefix are
    tracked.  Event creation is deferred to avoid adding latency to the
    request cycle.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        response: HttpResponse = self.get_response(request)

        # Only track successful GET requests to non-excluded paths
        if request.method != "GET":
            return response

        if response.status_code >= 400:
            return response

        path: str = request.path
        if any(path.startswith(prefix) for prefix in EXCLUDED_PREFIXES):
            return response

        try:
            self._record_page_view(request)
        except Exception:
            # Never let analytics tracking break the response
            logger.exception("Failed to record page view for %s", path)

        return response

    @staticmethod
    def _record_page_view(request: HttpRequest) -> None:
        """Create an ``Event`` record for the page view.

        Uses ``.delay()`` via Celery when available; falls back to synchronous
        creation otherwise.
        """
        from apps.analytics.models import Event

        user = request.user if hasattr(request, "user") and request.user.is_authenticated else None
        ip_address: str | None = _get_client_ip(request)
        user_agent: str = request.META.get("HTTP_USER_AGENT", "")
        session_id: str | None = request.session.session_key if hasattr(request, "session") else None

        Event.objects.create(
            user=user,
            event_type="page_view",
            metadata={
                "path": request.path,
                "query_string": request.META.get("QUERY_STRING", ""),
                "referer": request.META.get("HTTP_REFERER", ""),
            },
            ip_address=ip_address,
            user_agent=user_agent,
            session_id=session_id,
        )


def _get_client_ip(request: HttpRequest) -> str | None:
    """Extract the client IP address from the request, respecting ``X-Forwarded-For``."""
    x_forwarded_for: str | None = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
