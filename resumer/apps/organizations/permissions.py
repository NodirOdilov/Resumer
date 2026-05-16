"""Права доступа для модуля организаций."""

from rest_framework import permissions

from apps.organizations.models import OrganizationMember, OrganizationRole
from apps.organizations.services import OrganizationService


class IsOrganizationMember(permissions.BasePermission):
    """Пользователь является активным участником организации."""

    def has_object_permission(self, request, view, obj) -> bool:
        org = getattr(obj, "organization", obj)
        return OrganizationMember.objects.filter(
            organization=org,
            user=request.user,
            is_active=True,
        ).exists()


class IsOrganizationAdmin(permissions.BasePermission):
    """Пользователь — владелец или администратор организации."""

    def has_object_permission(self, request, view, obj) -> bool:
        org = getattr(obj, "organization", obj)
        return OrganizationService.user_has_role(
            org,
            request.user,
            [OrganizationRole.OWNER, OrganizationRole.ADMIN],
        )
