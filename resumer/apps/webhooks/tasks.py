"""Celery-задачи доставки вебхуков."""

from __future__ import annotations

import logging
from typing import Any

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    name="apps.webhooks.tasks.deliver_webhook",
    max_retries=5,
    default_retry_delay=60,
    acks_late=True,
)
def deliver_webhook(self: Any, delivery_id: str) -> dict[str, Any]:
    """Доставить вебхук с повторными попытками."""
    from apps.webhooks.services import WebhookService

    success = WebhookService.deliver_sync(delivery_id)
    if not success:
        raise self.retry()
    return {"delivery_id": delivery_id, "status": "success"}
