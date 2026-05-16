"""Tests for the analytics app -- event tracking model and tasks."""

from __future__ import annotations

import pytest
from django.utils import timezone

from apps.analytics.models import Event
from tests.factories import UserFactory


@pytest.mark.django_db
class TestEventModel:

    def test_create_event_with_user(self):
        """An event can be associated with an authenticated user."""
        user = UserFactory()
        event = Event.objects.create(
            user=user,
            event_type="page_view",
            metadata={"path": "/resume-templates/"},
            ip_address="192.168.1.1",
            user_agent="Mozilla/5.0",
        )
        assert event.user == user
        assert event.event_type == "page_view"
        assert event.metadata["path"] == "/resume-templates/"

    def test_create_anonymous_event(self):
        """An event can be created without a user (anonymous visitor)."""
        event = Event.objects.create(
            event_type="page_view",
            metadata={"path": "/"},
            ip_address="10.0.0.1",
        )
        assert event.user is None
        assert event.event_type == "page_view"

    def test_event_str(self):
        event = Event.objects.create(
            event_type="resume_created",
            metadata={},
        )
        assert "resume_created" in str(event)

    def test_event_ordering(self):
        """Events should be ordered by created_at descending by default."""
        e1 = Event.objects.create(event_type="first", metadata={})
        e2 = Event.objects.create(event_type="second", metadata={})

        events = list(Event.objects.all())
        assert events[0].pk == e2.pk  # most recent first

    def test_event_metadata_json(self):
        """Metadata field stores arbitrary JSON."""
        event = Event.objects.create(
            event_type="template_selected",
            metadata={
                "template_id": "abc-123",
                "template_name": "Cascade",
                "category": "professional",
                "tags": ["premium", "new"],
            },
        )
        event.refresh_from_db()
        assert event.metadata["template_name"] == "Cascade"
        assert "premium" in event.metadata["tags"]

    def test_event_session_id(self):
        """Events can track session IDs for anonymous analytics."""
        event = Event.objects.create(
            event_type="page_view",
            metadata={},
            session_id="sess_abc123",
        )
        assert event.session_id == "sess_abc123"

    def test_multiple_events_same_user(self):
        """Multiple events can be associated with the same user."""
        user = UserFactory()
        Event.objects.create(user=user, event_type="login", metadata={})
        Event.objects.create(user=user, event_type="resume_created", metadata={})
        Event.objects.create(user=user, event_type="resume_downloaded", metadata={})

        assert Event.objects.filter(user=user).count() == 3

    def test_event_types_for_analytics(self):
        """Common event types can be created without errors."""
        event_types = [
            "page_view", "signup", "login", "resume_created",
            "resume_downloaded", "template_selected", "cover_letter_created",
            "cv_created", "subscription_started", "payment_succeeded",
        ]
        for et in event_types:
            Event.objects.create(event_type=et, metadata={})

        assert Event.objects.count() == len(event_types)
