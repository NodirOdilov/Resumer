"""Маршруты API feature flags."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.feature_flags.views import FeatureFlagViewSet

router = DefaultRouter()
router.register(r"", FeatureFlagViewSet, basename="feature-flag")

urlpatterns = [
    path("", include(router.urls)),
]
