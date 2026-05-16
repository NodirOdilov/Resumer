from __future__ import annotations

import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    name="apps.accounts.tasks.send_verification_email",
)
def send_verification_email(self: object, user_id: str) -> None:
    """Create an EmailVerification token and send the verification link."""
    from django.contrib.auth import get_user_model

    from apps.accounts.models import EmailVerification

    User = get_user_model()

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        logger.warning("send_verification_email: user %s not found", user_id)
        return

    if user.is_verified:
        return

    verification = EmailVerification.objects.create(user=user)

    frontend_base = getattr(settings, "FRONTEND_URL", "https://resumer.com")
    verify_url = f"{frontend_base}/verify-email?token={verification.token}"

    subject = str(_("Verify your Resumer account"))
    plain_message = (
        f"Hi {user.first_name or 'there'},\n\n"
        f"Please verify your email by clicking the link below:\n\n"
        f"{verify_url}\n\n"
        f"This link will expire in 24 hours.\n\n"
        f"— The Resumer Team"
    )

    try:
        html_message = render_to_string(
            "accounts/emails/verify_email.html",
            {"user": user, "verify_url": verify_url},
        )
    except Exception:  # noqa: BLE001
        html_message = None

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )
    logger.info("Verification email sent to %s", user.email)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    name="apps.accounts.tasks.send_password_reset_email",
)
def send_password_reset_email(self: object, user_id: str, token: str) -> None:
    """Send a password-reset email containing the provided token."""
    from django.contrib.auth import get_user_model

    User = get_user_model()

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        logger.warning("send_password_reset_email: user %s not found", user_id)
        return

    frontend_base = getattr(settings, "FRONTEND_URL", "https://resumer.com")
    reset_url = f"{frontend_base}/reset-password?token={token}"

    subject = str(_("Reset your Resumer password"))
    plain_message = (
        f"Hi {user.first_name or 'there'},\n\n"
        f"We received a request to reset your password. "
        f"Click the link below to choose a new one:\n\n"
        f"{reset_url}\n\n"
        f"This link will expire in 1 hour.\n\n"
        f"If you didn't request a password reset, you can safely ignore this email.\n\n"
        f"— The Resumer Team"
    )

    try:
        html_message = render_to_string(
            "accounts/emails/password_reset.html",
            {"user": user, "reset_url": reset_url},
        )
    except Exception:  # noqa: BLE001
        html_message = None

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )
    logger.info("Password reset email sent to %s", user.email)


@shared_task(name="apps.accounts.tasks.cleanup_expired_tokens")
def cleanup_expired_tokens() -> dict[str, int]:
    """Delete expired and used verification / password-reset tokens."""
    from apps.accounts.models import EmailVerification, PasswordReset

    now = timezone.now()

    verifications_deleted, _ = EmailVerification.objects.filter(
        expires_at__lt=now,
    ).delete()

    used_verifications_deleted, _ = EmailVerification.objects.filter(
        is_used=True,
    ).delete()

    resets_deleted, _ = PasswordReset.objects.filter(
        expires_at__lt=now,
    ).delete()

    used_resets_deleted, _ = PasswordReset.objects.filter(
        is_used=True,
    ).delete()

    totals = {
        "expired_verifications": verifications_deleted,
        "used_verifications": used_verifications_deleted,
        "expired_resets": resets_deleted,
        "used_resets": used_resets_deleted,
    }
    logger.info("Token cleanup complete: %s", totals)
    return totals
