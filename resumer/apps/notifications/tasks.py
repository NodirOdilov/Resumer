from __future__ import annotations

import logging
from typing import Any

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(
    name="apps.notifications.tasks.send_email_notification",
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    acks_late=True,
)
def send_email_notification(self: Any, notification_id: str) -> dict[str, Any]:
    """Send an email for the given ``Notification`` record.

    Parameters
    ----------
    notification_id:
        UUID primary key of the ``Notification`` to send.

    Returns
    -------
    dict
        ``{"status": "sent" | "skipped" | "error", ...}``
    """
    from apps.notifications.models import Notification

    try:
        notification = Notification.objects.select_related("user").get(pk=notification_id)
    except Notification.DoesNotExist:
        logger.warning("Notification %s does not exist.", notification_id)
        return {"status": "not_found"}

    if notification.is_sent:
        logger.info("Notification %s already sent; skipping.", notification_id)
        return {"status": "skipped"}

    user = notification.user
    recipient_email: str = user.email

    if not recipient_email:
        logger.warning("User %s has no email address.", user.pk)
        return {"status": "error", "detail": "No email address"}

    # Check notification preferences for marketing-type notifications
    if notification.notification_type in ("trial_reminder",):
        prefs = getattr(user, "notification_preferences", None)
        if prefs and not prefs.email_marketing:
            logger.info(
                "User %s opted out of marketing emails; skipping notification %s.",
                user.pk,
                notification_id,
            )
            return {"status": "skipped", "detail": "User opted out"}

    try:
        send_mail(
            subject=notification.subject,
            message=notification.body,
            html_message=notification.body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.exception(
            "Failed to send email notification %s to %s",
            notification_id,
            recipient_email,
        )
        raise self.retry(exc=exc)

    notification.is_sent = True
    notification.sent_at = timezone.now()
    notification.save(update_fields=["is_sent", "sent_at"])

    logger.info(
        "Email notification %s sent to %s",
        notification_id,
        recipient_email,
    )
    return {"status": "sent", "recipient": recipient_email}


@shared_task(
    name="apps.notifications.tasks.send_push_notification",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
    acks_late=True,
)
def send_push_notification(self: Any, notification_id: str) -> dict[str, Any]:
    """Send a push notification for the given ``Notification`` record.

    This is a placeholder implementation.  Integrate with a push service
    (e.g. Firebase Cloud Messaging, OneSignal) as needed.

    Parameters
    ----------
    notification_id:
        UUID primary key of the ``Notification`` to send.

    Returns
    -------
    dict
        ``{"status": "sent" | "skipped" | "error", ...}``
    """
    from apps.notifications.models import Notification

    try:
        notification = Notification.objects.select_related("user").get(pk=notification_id)
    except Notification.DoesNotExist:
        logger.warning("Notification %s does not exist.", notification_id)
        return {"status": "not_found"}

    if notification.is_sent:
        logger.info("Notification %s already sent; skipping.", notification_id)
        return {"status": "skipped"}

    user = notification.user

    # Attempt delivery via configured push service.
    push_provider: str = getattr(settings, "PUSH_NOTIFICATION_PROVIDER", "")
    delivered = False

    if push_provider == "fcm":
        delivered = _send_via_fcm(user, notification)
    elif push_provider == "onesignal":
        delivered = _send_via_onesignal(user, notification)
    else:
        logger.info(
            "No push provider configured (PUSH_NOTIFICATION_PROVIDER='%s'). "
            "Notification %s logged only.",
            push_provider,
            notification_id,
        )

    notification.is_sent = True
    notification.sent_at = timezone.now()
    notification.save(update_fields=["is_sent", "sent_at"])

    detail = "delivered" if delivered else "logged (no provider)"
    return {"status": "sent", "detail": detail}


def _send_via_fcm(user: Any, notification: Any) -> bool:
    """Send a push notification via Firebase Cloud Messaging."""
    try:
        import firebase_admin  # noqa: F401
        from firebase_admin import messaging

        fcm_token: str = getattr(user, "fcm_token", "")
        if not fcm_token:
            logger.info("User %s has no FCM token; skipping push.", user.pk)
            return False

        message = messaging.Message(
            notification=messaging.Notification(
                title=notification.subject,
                body=notification.body[:200],
            ),
            token=fcm_token,
        )
        messaging.send(message)
        logger.info("FCM push sent for notification %s", notification.pk)
        return True
    except ImportError:
        logger.warning("firebase-admin not installed; FCM delivery skipped.")
        return False
    except Exception:
        logger.exception("FCM delivery failed for notification %s", notification.pk)
        return False


def _send_via_onesignal(user: Any, notification: Any) -> bool:
    """Send a push notification via OneSignal REST API."""
    import json
    from urllib.request import Request, urlopen

    onesignal_app_id: str = getattr(settings, "ONESIGNAL_APP_ID", "")
    onesignal_api_key: str = getattr(settings, "ONESIGNAL_API_KEY", "")

    if not onesignal_app_id or not onesignal_api_key:
        logger.warning("OneSignal credentials not configured; delivery skipped.")
        return False

    try:
        payload = json.dumps({
            "app_id": onesignal_app_id,
            "filters": [{"field": "tag", "key": "user_id", "value": str(user.pk)}],
            "headings": {"en": notification.subject},
            "contents": {"en": notification.body[:200]},
        }).encode()

        req = Request(
            "https://onesignal.com/api/v1/notifications",
            data=payload,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": f"Basic {onesignal_api_key}",
            },
            method="POST",
        )
        with urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                logger.info("OneSignal push sent for notification %s", notification.pk)
                return True
            logger.warning("OneSignal returned status %s", resp.status)
            return False
    except Exception:
        logger.exception("OneSignal delivery failed for notification %s", notification.pk)
        return False
