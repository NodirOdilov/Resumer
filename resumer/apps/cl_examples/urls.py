from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.cl_examples.views import CoverLetterExampleViewSet

app_name: str = "cl_examples"

router = DefaultRouter()
router.register("", CoverLetterExampleViewSet, basename="cover-letter-example")

urlpatterns: list[path] = [
    path("", include(router.urls)),
]
