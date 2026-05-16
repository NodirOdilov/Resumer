"""Маршруты API ядра платформы."""

from django.urls import path

from apps.core.views import PlatformHealthView, PlatformStatusView

urlpatterns = [
    path("status/", PlatformStatusView.as_view(), name="platform-status"),
    path("health/", PlatformHealthView.as_view(), name="platform-health"),
]
