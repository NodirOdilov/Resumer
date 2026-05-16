"""Маршруты API-ключей."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.api_keys.views import APIKeyViewSet

router = DefaultRouter()
router.register(r"", APIKeyViewSet, basename="api-key")

urlpatterns = [path("", include(router.urls))]
