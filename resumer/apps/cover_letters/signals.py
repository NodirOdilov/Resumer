from __future__ import annotations

import logging
from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.cover_letters.models import CoverLetter, CoverLetterVersion

logger = logging.getLogger(__name__)


@receiver(post_save, sender=CoverLetter)
def create_cover_letter_version(
    sender: type[CoverLetter],
    instance: CoverLetter,
    created: bool,
    raw: bool = False,
    update_fields: frozenset[str] | None = None,
    **kwargs: Any,
) -> None:
    """Auto-create a new version snapshot whenever cover letter content changes."""
    if raw:
        return

    # Skip version creation when only metadata fields are updated (e.g. downloads_count).
    if update_fields is not None:
        updated = set(update_fields)
        if "content" not in updated and not created:
            return

    content = instance.content
    if not content:
        return

    # Avoid duplicate version if content is identical to the latest.
    latest_version = (
        instance.versions.order_by("-version_number").values_list("content", flat=True).first()
    )
    if latest_version == content and not created:
        return

    next_number: int = instance.current_version_number + 1
    CoverLetterVersion.objects.create(
        cover_letter=instance,
        version_number=next_number,
        content=content,
    )
    logger.debug(
        "Created version %d for cover letter %s",
        next_number,
        instance.id,
    )
