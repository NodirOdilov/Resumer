from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(
    name="apps.analytics.tasks.update_analytics",
    bind=True,
    max_retries=2,
    default_retry_delay=120,
)
def update_analytics(self: Any) -> dict[str, Any]:
    """Hourly aggregation task for analytics data.

    Aggregates raw ``Event`` rows from the past hour into summary
    counters that power dashboards and reports.  The aggregated data
    is stored in the Django cache for fast retrieval.

    Returns
    -------
    dict
        ``{"status": "ok", "period_start": str, "period_end": str, "aggregations": dict}``
    """
    from django.core.cache import cache
    from django.db.models import Count, Q

    from apps.analytics.models import Event

    now = timezone.now()
    period_start = now - timedelta(hours=1)

    events_qs = Event.objects.filter(created_at__gte=period_start, created_at__lt=now)

    # ── Aggregate counts by event_type ──────────────────────────
    type_counts: dict[str, int] = {}
    for row in events_qs.values("event_type").annotate(count=Count("id")).order_by("-count"):
        type_counts[row["event_type"]] = row["count"]

    total_events: int = sum(type_counts.values())

    # ── Unique users / sessions ─────────────────────────────────
    unique_users: int = (
        events_qs.filter(user__isnull=False)
        .values("user")
        .distinct()
        .count()
    )
    unique_sessions: int = (
        events_qs.filter(session_id__isnull=False)
        .values("session_id")
        .distinct()
        .count()
    )

    # ── Top pages ───────────────────────────────────────────────
    page_views_qs = events_qs.filter(event_type="page_view")
    top_pages: list[dict[str, Any]] = []
    # Extract paths from metadata JSONField
    for row in (
        page_views_qs.values("metadata__path")
        .annotate(count=Count("id"))
        .order_by("-count")[:20]
    ):
        path = row.get("metadata__path", "unknown")
        top_pages.append({"path": path, "count": row["count"]})

    aggregations: dict[str, Any] = {
        "total_events": total_events,
        "event_types": type_counts,
        "unique_users": unique_users,
        "unique_sessions": unique_sessions,
        "top_pages": top_pages,
    }

    # Cache results for 2 hours so dashboards can read them instantly
    cache_key = f"analytics:hourly:{period_start:%Y%m%d%H}"
    cache.set(cache_key, aggregations, timeout=7200)

    # Also keep a "latest" pointer
    cache.set("analytics:latest", aggregations, timeout=7200)

    logger.info(
        "Analytics aggregation complete: %d events, %d unique users, %d sessions (%s to %s)",
        total_events,
        unique_users,
        unique_sessions,
        period_start.isoformat(),
        now.isoformat(),
    )

    return {
        "status": "ok",
        "period_start": period_start.isoformat(),
        "period_end": now.isoformat(),
        "aggregations": aggregations,
    }
