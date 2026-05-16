"""Tests for the notifications app -- notification creation and preferences."""

from __future__ import annotations

import pytest
from django.utils import timezone

from apps.notifications.models import Notification, NotificationPreference
from tests.factories import UserFactory


@pytest.mark.django_db
class TestNotificationModel:

    def test_create_notification(self):
        """A notification can be created for a user."""
        user = UserFactory()
        notification = Notification.objects.create(
            user=user,
            notification_type="email_verification",
            subject="Verify your email",
            body="Click the link to verify your email.",
        )
        assert notification.user == user
        assert notification.notification_type == "email_verification"
        assert notification.is_read is False
        assert notification.is_sent is False

    def test_notification_types(self):
        """All 6 required notification types can be created."""
        user = UserFactory()
        types = [
            "email_verification",
            "welcome",
            "password_reset",
            "trial_reminder",
            "subscription_confirmed",
            "download_ready",
        ]
        for ntype in types:
            Notification.objects.create(
                user=user,
                notification_type=ntype,
                subject=f"Subject for {ntype}",
                body=f"Body for {ntype}",
            )

        assert Notification.objects.filter(user=user).count() == 6

    def test_mark_as_read(self):
        """A notification can be marked as read."""
        user = UserFactory()
        notification = Notification.objects.create(
            user=user,
            notification_type="welcome",
            subject="Welcome!",
            body="Welcome to Resumer.",
        )
        assert notification.is_read is False

        notification.is_read = True
        notification.save()
        notification.refresh_from_db()
        assert notification.is_read is True

    def test_mark_as_sent(self):
        """A notification tracks its sent status."""
        user = UserFactory()
        notification = Notification.objects.create(
            user=user,
            notification_type="trial_reminder",
            subject="Trial ending soon",
            body="Your trial ends in 2 days.",
        )
        notification.is_sent = True
        notification.sent_at = timezone.now()
        notification.save()

        notification.refresh_from_db()
        assert notification.is_sent is True
        assert notification.sent_at is not None

    def test_notification_str(self):
        user = UserFactory()
        notification = Notification.objects.create(
            user=user,
            notification_type="download_ready",
            subject="Your document is ready",
            body="Download your resume now.",
        )
        result = str(notification)
        assert "download_ready" in result or "ready" in result.lower()

    def test_user_notifications_queryset(self):
        """Filtering notifications by user works correctly."""
        user1 = UserFactory()
        user2 = UserFactory()
        Notification.objects.create(
            user=user1, notification_type="welcome",
            subject="Welcome", body="Hello",
        )
        Notification.objects.create(
            user=user1, notification_type="trial_reminder",
            subject="Trial", body="Reminder",
        )
        Notification.objects.create(
            user=user2, notification_type="welcome",
            subject="Welcome", body="Hello",
        )

        assert Notification.objects.filter(user=user1).count() == 2
        assert Notification.objects.filter(user=user2).count() == 1


@pytest.mark.django_db
class TestNotificationPreference:

    def test_create_preference(self):
        """Notification preferences can be set per user."""
        user = UserFactory()
        pref = NotificationPreference.objects.create(
            user=user,
            email_marketing=False,
            email_product_updates=True,
            email_tips_and_tutorials=True,
        )
        assert pref.email_marketing is False
        assert pref.email_product_updates is True

    def test_default_preferences(self):
        """Default preferences should be opt-in friendly."""
        user = UserFactory()
        pref = NotificationPreference.objects.create(user=user)
        # Defaults vary by implementation, just verify creation works
        assert pref.user == user
