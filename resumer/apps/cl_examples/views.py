from __future__ import annotations

from typing import Any

from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from apps.cl_examples.models import CoverLetterExample
from apps.cl_examples.serializers import (
    CoverLetterExampleDetailSerializer,
    CoverLetterExampleListSerializer,
)


class CoverLetterExampleViewSet(viewsets.ReadOnlyModelViewSet[CoverLetterExample]):
    """Read-only viewset for cover-letter examples.

    Supports filtering by category slug, experience_level query params.
    Detail lookup is by slug. Retrieving a detail increments views_count.
    """

    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_serializer_class(self) -> type[BaseSerializer[Any]]:
        if self.action == "retrieve":
            return CoverLetterExampleDetailSerializer
        return CoverLetterExampleListSerializer

    def get_queryset(self) -> QuerySet[CoverLetterExample]:
        queryset: QuerySet[CoverLetterExample] = (
            CoverLetterExample.objects.select_related("category", "template")
            .order_by("-is_featured", "-created_at")
        )

        # --- Filters ---
        category_slug: str | None = self.request.query_params.get("category")
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        experience_level: str | None = self.request.query_params.get("experience_level")
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)

        is_featured: str | None = self.request.query_params.get("is_featured")
        if is_featured is not None and is_featured.lower() in ("true", "1"):
            queryset = queryset.filter(is_featured=True)

        return queryset

    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Retrieve a single cover-letter example and increment its views counter."""
        instance: CoverLetterExample = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
