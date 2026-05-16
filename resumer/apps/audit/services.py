"""Сервисный слой журнала аудита."""

from __future__ import annotations

import logging
from typing import Any

from django.contrib.auth.models import AbstractBaseUser

from apps.audit.models import AuditAction, AuditLog

logger = logging.getLogger(__name__)


class AuditService:
    """Централизованная запись событий аудита."""

    @staticmethod
    def log(
        *,
        action: str,
        resource_type: str,
        resource_id: str = "",
        user: AbstractBaseUser | None = None,
        description: str = "",
        changes: dict[str, Any] | None = None,
        metadata: dict[str, Any] | None = None,
        ip_address: str | None = None,
        user_agent: str = "",
        request_id: str = "",
        organization_id: str | None = None,
    ) -> AuditLog:
        """Создать запись в журнале аудита."""
        entry = AuditLog.objects.create(
            user=user,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            changes=changes or {},
            metadata=metadata or {},
            ip_address=ip_address,
            user_agent=user_agent[:2000] if user_agent else "",
            request_id=request_id,
            organization_id=organization_id,
        )
        logger.debug(
            "Аудит: action=%s resource=%s:%s user=%s",
            action,
            resource_type,
            resource_id,
            getattr(user, "pk", None),
        )
        return entry

    @staticmethod
    def log_create(
        user: AbstractBaseUser | None,
        resource_type: str,
        resource_id: str,
        **kwargs: Any,
    ) -> AuditLog:
        """Зафиксировать создание ресурса."""
        return AuditService.log(
            action=AuditAction.CREATE,
            resource_type=resource_type,
            resource_id=resource_id,
            user=user,
            **kwargs,
        )

    @staticmethod
    def log_update(
        user: AbstractBaseUser | None,
        resource_type: str,
        resource_id: str,
        changes: dict[str, Any],
        **kwargs: Any,
    ) -> AuditLog:
        """Зафиксировать обновление ресурса."""
        return AuditService.log(
            action=AuditAction.UPDATE,
            resource_type=resource_type,
            resource_id=resource_id,
            user=user,
            changes=changes,
            **kwargs,
        )

    @staticmethod
    def log_delete(
        user: AbstractBaseUser | None,
        resource_type: str,
        resource_id: str,
        **kwargs: Any,
    ) -> AuditLog:
        """Зафиксировать удаление ресурса."""
        return AuditService.log(
            action=AuditAction.DELETE,
            resource_type=resource_type,
            resource_id=resource_id,
            user=user,
            **kwargs,
        )
