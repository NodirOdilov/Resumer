from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.templates_library.views import TemplateCategoryView, TemplateViewSet

app_name = "templates_library"

router = DefaultRouter()
router.register("", TemplateViewSet, basename="template")

urlpatterns = [
    path("categories/", TemplateCategoryView.as_view(), name="template-categories"),
    path("", include(router.urls)),
]
