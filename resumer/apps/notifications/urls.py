from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.notifications.views import NotificationPreferenceView, NotificationViewSet

router = DefaultRouter()
router.register("", NotificationViewSet, basename="notifications")

app_name = "notifications"

urlpatterns = [
    path("preferences/", NotificationPreferenceView.as_view(), name="notification-preferences"),
    path("", include(router.urls)),
]
