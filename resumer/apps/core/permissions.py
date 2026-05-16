from __future__ import annotations

from typing import Any

from django.utils import timezone
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwnerPermission(BasePermission):
    """Grants access only if object.user matches the requesting user."""

    message = "You do not have permission to access this resource."

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if not hasattr(obj, "user"):
            return False
        return obj.user == request.user


class IsPremiumPermission(BasePermission):
    """Grants access only to users with an active premium subscription."""

    message = "A premium subscription is required to access this resource."

    def has_permission(self, request: Request, view: APIView) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if not getattr(user, "is_premium", False):
            return False
        premium_expiry = getattr(user, "premium_expires_at", None)
        if premium_expiry is not None and premium_expiry < timezone.now():
            return False
        return True


class IsVerifiedPermission(BasePermission):
    """Grants access only to users whose account has been verified."""

    message = "Account verification is required to access this resource."

    def has_permission(self, request: Request, view: APIView) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(getattr(user, "is_verified", False))


class IsSuperAdmin(BasePermission):
    """Grants access only to superuser accounts."""

    message = "Superadmin privileges are required to access this resource."

    def has_permission(self, request: Request, view: APIView) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(user.is_superuser)
