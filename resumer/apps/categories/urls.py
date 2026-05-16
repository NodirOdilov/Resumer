from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.categories.views import CategoryViewSet

router = DefaultRouter()
router.register("", CategoryViewSet, basename="categories")

app_name = "categories"

urlpatterns = [
    path("", include(router.urls)),
]
