"""Сигналы аудита для критичных моделей."""

from __future__ import annotations

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.audit.models import AuditAction
from apps.audit.services import AuditService


@receiver(post_save, sender="accounts.User")
def audit_user_save(sender, instance, created, **kwargs) -> None:
    """Аудит создания и обновления пользователя."""
    action = AuditAction.CREATE if created else AuditAction.UPDATE
    AuditService.log(
        action=action,
        resource_type="user",
        resource_id=str(instance.pk),
        user=instance if not created else None,
        description="Пользователь создан" if created else "Пользователь обновлён",
    )


@receiver(post_delete, sender="accounts.User")
def audit_user_delete(sender, instance, **kwargs) -> None:
    """Аудит удаления пользователя."""
    AuditService.log(
        action=AuditAction.DELETE,
        resource_type="user",
        resource_id=str(instance.pk),
        description="Пользователь удалён",
    )
