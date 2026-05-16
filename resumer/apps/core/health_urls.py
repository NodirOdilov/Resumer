from __future__ import annotations

from django.http import JsonResponse
from django.urls import URLPattern, path
from django.utils import timezone

from apps.core.version import __version__


def health_check(request: object) -> JsonResponse:
    """Return a simple health check response with current server timestamp."""
    return JsonResponse(
        {
            "status": "ok",
            "version": __version__,
            "timestamp": timezone.now().isoformat(),
        },
        status=200,
    )


urlpatterns: list[URLPattern] = [
    path("", health_check, name="health-check"),
]
