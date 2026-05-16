from __future__ import annotations

import django_filters

from apps.cover_letters.models import CoverLetter


class CoverLetterFilter(django_filters.FilterSet):
    """Filter set for CoverLetter list views."""

    status = django_filters.ChoiceFilter(choices=CoverLetter.Status.choices)
    language = django_filters.CharFilter(lookup_expr="exact")
    title = django_filters.CharFilter(lookup_expr="icontains")
    created_after = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )
    created_before = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )
    has_template = django_filters.BooleanFilter(
        field_name="template",
        lookup_expr="isnull",
        exclude=True,
    )
    has_resume = django_filters.BooleanFilter(
        field_name="resume",
        lookup_expr="isnull",
        exclude=True,
    )

    class Meta:
        model = CoverLetter
        fields = [
            "status",
            "language",
            "title",
            "created_after",
            "created_before",
            "has_template",
            "has_resume",
        ]
