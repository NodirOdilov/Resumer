from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class NotificationType(models.TextChoices):
    EMAIL_VERIFICATION = "email_verification", _("Email Verification")
    WELCOME = "welcome", _("Welcome")
    PASSWORD_RESET = "password_reset", _("Password Reset")
    TRIAL_REMINDER = "trial_reminder", _("Trial Reminder")
    SUBSCRIPTION_CONFIRMED = "subscription_confirmed", _("Subscription Confirmed")
    DOWNLOAD_READY = "download_ready", _("Download Ready")


class Notification(models.Model):
    """A notification record targeting a specific user."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name=_("user"),
    )
    notification_type = models.CharField(
        _("notification type"),
        max_length=30,
        choices=NotificationType.choices,
        db_index=True,
    )
    subject = models.CharField(
        _("subject"),
        max_length=255,
    )
    body = models.TextField(
        _("body"),
        help_text=_("The notification message body (HTML or plain text)."),
    )
    is_read = models.BooleanField(
        _("is read"),
        default=False,
        db_index=True,
    )
    is_sent = models.BooleanField(
        _("is sent"),
        default=False,
        db_index=True,
    )
    sent_at = models.DateTimeField(
        _("sent at"),
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        _("created at"),
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        db_table = "notifications_notification"
        verbose_name = _("notification")
        verbose_name_plural = _("notifications")
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["user", "-created_at"],
                name="idx_notif_user_created",
            ),
            models.Index(
                fields=["user", "is_read"],
                name="idx_notif_user_read",
            ),
        ]

    def __str__(self) -> str:
        return f"[{self.get_notification_type_display()}] {self.subject}"


class NotificationPreference(models.Model):
    """Per-user notification preferences."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_preferences",
        verbose_name=_("user"),
    )
    email_marketing = models.BooleanField(
        _("email marketing"),
        default=True,
        help_text=_("Receive marketing and promotional emails."),
    )
    email_product_updates = models.BooleanField(
        _("email product updates"),
        default=True,
        help_text=_("Receive emails about product updates and new features."),
    )
    email_tips = models.BooleanField(
        _("email tips"),
        default=True,
        help_text=_("Receive resume writing tips and career advice emails."),
    )

    class Meta:
        db_table = "notifications_preference"
        verbose_name = _("notification preference")
        verbose_name_plural = _("notification preferences")

    def __str__(self) -> str:
        return f"Preferences for {self.user}"
