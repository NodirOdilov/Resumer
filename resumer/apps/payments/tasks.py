"""Celery tasks for the payments app."""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    acks_late=True,
    name="payments.process_subscription",
)
def process_subscription(self: Any, event_data: dict[str, Any]) -> None:
    """Process a subscription-related Stripe event asynchronously.

    This task is intended for heavy or non-critical post-processing
    that should not block the webhook response.
    """
    from apps.payments.webhooks import (
        handle_checkout_completed,
        handle_subscription_deleted,
        handle_subscription_updated,
    )

    event_type: str = event_data.get("type", "")
    data: dict[str, Any] = event_data.get("data", {})

    handlers: dict[str, Any] = {
        "checkout.session.completed": handle_checkout_completed,
        "customer.subscription.updated": handle_subscription_updated,
        "customer.subscription.deleted": handle_subscription_deleted,
    }

    handler = handlers.get(event_type)
    if handler is None:
        logger.info("process_subscription: no handler for event type %s.", event_type)
        return

    try:
        handler(data)
    except Exception as exc:
        logger.exception(
            "process_subscription failed for event type %s.", event_type
        )
        raise self.retry(exc=exc)


@shared_task(
    bind=True,
    max_retries=2,
    default_retry_delay=120,
    acks_late=True,
    name="payments.send_trial_reminders",
)
def send_trial_reminders(self: Any) -> int:
    """Find users whose trial ends in ~2 days and send a reminder email.

    Should be scheduled to run daily via Celery Beat.
    Returns the number of reminders sent.
    """
    from apps.payments.models import Subscription, SubscriptionStatus

    now = timezone.now()
    reminder_window_start = now + timedelta(days=1, hours=20)
    reminder_window_end = now + timedelta(days=2, hours=4)

    expiring_subscriptions = (
        Subscription.objects.select_related("user")
        .filter(
            status=SubscriptionStatus.TRIALING,
            trial_end__gte=reminder_window_start,
            trial_end__lte=reminder_window_end,
        )
    )

    sent_count = 0
    from_email: str = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@resumer.com")
    frontend_url: str = getattr(settings, "FRONTEND_URL", "https://resumer.com")

    for subscription in expiring_subscriptions:
        user = subscription.user
        if not user.email or not user.is_active:
            continue

        context = {
            "user": user,
            "subscription": subscription,
            "trial_end": subscription.trial_end,
            "upgrade_url": f"{frontend_url}/pricing",
        }

        try:
            html_message = render_to_string(
                "payments/emails/trial_reminder.html", context
            )
        except Exception:
            html_message = ""

        subject = "Your Resumer trial ends in 2 days"
        plain_message = (
            f"Hi {user.first_name or 'there'},\n\n"
            f"Your Resumer trial ends on {subscription.trial_end:%B %d, %Y}. "
            f"Upgrade now to keep your premium features:\n"
            f"{frontend_url}/pricing\n\n"
            f"— The Resumer Team"
        )

        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[user.email],
                html_message=html_message or None,
                fail_silently=False,
            )
            sent_count += 1
        except Exception as exc:
            logger.exception(
                "Failed to send trial reminder to %s.", user.email
            )
            # Do not retry the whole task for individual email failures
            continue

    logger.info("send_trial_reminders: sent %d reminders.", sent_count)
    return sent_count
