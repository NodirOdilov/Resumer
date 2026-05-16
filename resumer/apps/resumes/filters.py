from __future__ import annotations

import django_filters

from apps.resumes.models import Resume


class ResumeFilter(django_filters.FilterSet):
    """Filter set for resume list queries."""

    status = django_filters.ChoiceFilter(
        choices=Resume.Status.choices,
    )
    template = django_filters.UUIDFilter(
        field_name="template_id",
    )
    language = django_filters.CharFilter(
        field_name="language",
        lookup_expr="exact",
    )
    created_after = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )
    created_before = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )

    class Meta:
        model = Resume
        fields = [
            "status",
            "template",
            "language",
            "created_after",
            "created_before",
        ]
