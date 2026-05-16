from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Event(models.Model):
    """Analytics event record.

    Stores page views, user actions, and system events for reporting
    and product analytics.

    .. note::

        In production this table should be partitioned by month on the
        ``created_at`` column for query performance.  Apply the partition
        via a migration or database-level DDL::

            -- PostgreSQL range partitioning by month
            CREATE TABLE analytics_event (...) PARTITION BY RANGE (created_at);
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="analytics_events",
        verbose_name=_("user"),
    )
    event_type = models.CharField(
        _("event type"),
        max_length=50,
        db_index=True,
        help_text=_(
            "Event identifier, e.g. page_view, resume_created, "
            "resume_downloaded, template_selected, signup, login."
        ),
    )
    metadata = models.JSONField(
        _("metadata"),
        default=dict,
        blank=True,
        help_text=_("Arbitrary key-value data associated with the event."),
    )
    ip_address = models.GenericIPAddressField(
        _("IP address"),
        null=True,
        blank=True,
    )
    user_agent = models.TextField(
        _("user agent"),
        blank=True,
        default="",
    )
    session_id = models.CharField(
        _("session ID"),
        max_length=255,
        null=True,
        blank=True,
        db_index=True,
    )
    created_at = models.DateTimeField(
        _("created at"),
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        db_table = "analytics_event"
        verbose_name = _("event")
        verbose_name_plural = _("events")
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["event_type", "-created_at"],
                name="idx_event_type_created",
            ),
            models.Index(
                fields=["user", "-created_at"],
                name="idx_event_user_created",
            ),
            models.Index(
                fields=["session_id"],
                name="idx_event_session",
            ),
        ]

    def __str__(self) -> str:
        user_label: str = str(self.user_id) if self.user_id else "anon"
        return f"{self.event_type} ({user_label}) @ {self.created_at:%Y-%m-%d %H:%M}"
