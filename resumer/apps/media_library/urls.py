from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.media_library.views import MediaFileViewSet

router = DefaultRouter()
router.register("", MediaFileViewSet, basename="media")

app_name = "media_library"

urlpatterns = [
    path("", include(router.urls)),
]
