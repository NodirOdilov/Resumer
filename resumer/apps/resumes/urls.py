from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.resumes.views import ResumeViewSet

app_name = "resumes"

router = DefaultRouter()
router.register(r"", ResumeViewSet, basename="resume")

urlpatterns = [
    path("", include(router.urls)),
]
