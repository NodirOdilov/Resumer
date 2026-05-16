from __future__ import annotations

from rest_framework.routers import DefaultRouter

from apps.cvs.views import CVViewSet

router = DefaultRouter()
router.register("", CVViewSet, basename="cv")

app_name = "cvs"
urlpatterns = router.urls
