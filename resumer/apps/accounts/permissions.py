from __future__ import annotations

from typing import Any

from django.utils import timezone
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwner(BasePermission):
    """Grants access only when ``obj.user`` matches the requesting user."""

    message = "You do not have permission to access this resource."

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        user_attr = getattr(obj, "user", None)
        if user_attr is None:
            return False
        return user_attr == request.user


class IsPremium(BasePermission):
    """Grants access only to users with an active premium subscription."""

    message = "A premium subscription is required to access this resource."

    def has_permission(self, request: Request, view: APIView) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if not getattr(user, "is_premium", False):
            return False
        premium_until = getattr(user, "premium_until", None)
        if premium_until is not None and premium_until < timezone.now():
            return False
        return True


class IsVerified(BasePermission):
    """Grants access only to users who have verified their email."""

    message = "Account verification is required to access this resource."

    def has_permission(self, request: Request, view: APIView) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(getattr(user, "is_verified", False))
