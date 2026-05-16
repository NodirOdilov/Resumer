"""Маршруты API организаций."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.organizations.views import OrganizationInviteViewSet, OrganizationViewSet

router = DefaultRouter()
router.register(r"", OrganizationViewSet, basename="organization")
router.register(r"invites", OrganizationInviteViewSet, basename="organization-invite")

urlpatterns = [
    path("", include(router.urls)),
]
