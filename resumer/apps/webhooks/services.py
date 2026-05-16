"""Сервис доставки исходящих вебхуков."""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import time
from typing import Any

from apps.webhooks.models import WebhookDelivery, WebhookEndpoint

logger = logging.getLogger(__name__)


class WebhookService:
    """Постановка и доставка вебхуков."""

    @staticmethod
    def dispatch(
        event_type: str,
        payload: dict[str, Any],
        *,
        user_id: str | None = None,
        organization_id: str | None = None,
    ) -> list[str]:
        """Создать записи доставки для всех подходящих конечных точек."""
        qs = WebhookEndpoint.objects.filter(is_active=True, events__contains=[event_type])

        if user_id:
            qs = qs.filter(user_id=user_id)
        if organization_id:
            qs = qs.filter(organization_id=organization_id)

        delivery_ids: list[str] = []
        for endpoint in qs:
            delivery = WebhookDelivery.objects.create(
                endpoint=endpoint,
                event_type=event_type,
                payload={
                    "event": event_type,
                    "timestamp": int(time.time()),
                    "data": payload,
                },
            )
            delivery_ids.append(str(delivery.pk))
            # Асинхронная доставка через Celery.
            from apps.webhooks.tasks import deliver_webhook

            deliver_webhook.delay(str(delivery.pk))

        return delivery_ids

    @staticmethod
    def sign_payload(secret: str, payload_bytes: bytes) -> str:
        """Создать HMAC-SHA256 подпись payload."""
        return hmac.new(
            secret.encode(),
            payload_bytes,
            hashlib.sha256,
        ).hexdigest()

    @staticmethod
    def deliver_sync(delivery_id: str) -> bool:
        """Синхронная доставка вебхука (вызывается из Celery task)."""
        import requests

        try:
            delivery = WebhookDelivery.objects.select_related("endpoint").get(pk=delivery_id)
        except WebhookDelivery.DoesNotExist:
            logger.error("Доставка вебхука %s не найдена.", delivery_id)
            return False

        endpoint = delivery.endpoint
        payload_bytes = json.dumps(delivery.payload, sort_keys=True).encode()
        signature = WebhookService.sign_payload(endpoint.secret, payload_bytes)

        delivery.attempt_count += 1
        delivery.save(update_fields=["attempt_count"])

        try:
            response = requests.post(
                endpoint.url,
                data=payload_bytes,
                headers={
                    "Content-Type": "application/json",
                    "X-Webhook-Signature": f"sha256={signature}",
                    "X-Webhook-Event": delivery.event_type,
                    "User-Agent": "Resumer-Webhook/1.0",
                },
                timeout=15,
            )
            delivery.response_status = response.status_code
            delivery.response_body = response.text[:5000]

            if 200 <= response.status_code < 300:
                from django.utils import timezone

                delivery.status = WebhookDelivery.Status.SUCCESS
                delivery.delivered_at = timezone.now()
                delivery.save()
                endpoint.failure_count = 0
                endpoint.save(update_fields=["failure_count", "updated_at"])
                return True

            delivery.status = WebhookDelivery.Status.FAILED
            delivery.save()
            endpoint.failure_count += 1
            endpoint.save(update_fields=["failure_count", "updated_at"])
            return False

        except Exception as exc:
            logger.exception("Ошибка доставки вебхука %s: %s", delivery_id, exc)
            delivery.status = WebhookDelivery.Status.FAILED
            delivery.response_body = str(exc)[:2000]
            delivery.save()
            endpoint.failure_count += 1
            if endpoint.failure_count >= 10:
                endpoint.is_active = False
            endpoint.save(update_fields=["failure_count", "is_active", "updated_at"])
            return False
