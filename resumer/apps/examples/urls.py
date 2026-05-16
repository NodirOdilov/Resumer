from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.examples.views import ExampleCategoryViewSet, ResumeExampleViewSet

app_name: str = "examples"

router = DefaultRouter()
router.register("categories", ExampleCategoryViewSet, basename="example-category")
router.register("resumes", ResumeExampleViewSet, basename="resume-example")

urlpatterns: list[path] = [
    path("", include(router.urls)),
    path("cover-letters/", include("apps.cl_examples.urls")),
]
