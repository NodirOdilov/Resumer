from __future__ import annotations

import logging

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_verification_on_user_create(
    sender: type,
    instance: object,
    created: bool,
    **kwargs: object,
) -> None:
    """Queue a verification email whenever a new user is created."""
    if not created:
        return

    # Avoid circular import at module level
    from apps.accounts.tasks import send_verification_email

    try:
        send_verification_email.delay(str(instance.pk))  # type: ignore[attr-defined]
    except Exception:  # noqa: BLE001
        logger.exception(
            "Failed to queue verification email for user %s",
            instance.pk,  # type: ignore[attr-defined]
        )
