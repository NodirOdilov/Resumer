from __future__ import annotations

import logging
from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.resumes.models import Resume, ResumeVersion

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Resume)
def create_resume_version_on_save(
    sender: type[Resume],
    instance: Resume,
    created: bool,
    update_fields: frozenset[str] | None = None,
    **kwargs: Any,
) -> None:
    """Create a new ResumeVersion snapshot every time resume content is saved.

    Skips version creation when only metadata fields (is_deleted, deleted_at)
    are updated, such as during soft-delete/restore operations.
    """
    # Skip if this is a soft-delete or restore operation
    if update_fields is not None:
        metadata_fields = {"is_deleted", "deleted_at", "updated_at"}
        if set(update_fields).issubset(metadata_fields):
            return

    # Determine next version number
    last_version: ResumeVersion | None = (
        ResumeVersion.objects.filter(resume=instance)
        .order_by("-version_number")
        .first()
    )
    next_version_number: int = (last_version.version_number + 1) if last_version else 1

    ResumeVersion.objects.create(
        resume=instance,
        version_number=next_version_number,
        content=instance.content,
    )
    logger.debug(
        "Created version %d for resume %s",
        next_version_number,
        instance.pk,
    )

    # Отправка вебхука при создании/обновлении резюме.
    try:
        from apps.webhooks.models import WebhookEventType
        from apps.webhooks.services import WebhookService

        event = WebhookEventType.RESUME_CREATED if created else WebhookEventType.RESUME_UPDATED
        WebhookService.dispatch(
            event,
            {"resume_id": str(instance.pk), "title": instance.title},
            user_id=str(instance.user_id),
        )
    except Exception:
        logger.exception("Ошибка отправки вебхука для резюме %s", instance.pk)
