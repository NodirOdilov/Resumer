from __future__ import annotations

from typing import Any

from django.db.models import Count, QuerySet
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from apps.examples.models import ExampleCategory, ResumeExample
from apps.examples.serializers import (
    ExampleCategorySerializer,
    ResumeExampleDetailSerializer,
    ResumeExampleListSerializer,
)


# ──────────────────────────── Category ViewSet ────────────────────────────


class ExampleCategoryViewSet(viewsets.ReadOnlyModelViewSet[ExampleCategory]):
    """Read-only viewset for example categories.

    Returns all active categories annotated with the number of resume examples.
    """

    serializer_class = ExampleCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self) -> QuerySet[ExampleCategory]:
        return (
            ExampleCategory.objects.filter(is_active=True)
            .annotate(examples_count=Count("resume_examples"))
            .select_related("parent")
            .order_by("order", "name")
        )


# ──────────────────────────── Resume Example ViewSet ────────────────────────────


class ResumeExampleViewSet(viewsets.ReadOnlyModelViewSet[ResumeExample]):
    """Read-only viewset for resume examples.

    Supports filtering by category slug, industry, and experience_level query params.
    Detail lookup is by slug. Retrieving a detail increments views_count.
    """

    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_serializer_class(self) -> type[BaseSerializer[Any]]:
        if self.action == "retrieve":
            return ResumeExampleDetailSerializer
        return ResumeExampleListSerializer

    def get_queryset(self) -> QuerySet[ResumeExample]:
        queryset: QuerySet[ResumeExample] = (
            ResumeExample.objects.select_related("category", "template")
            .order_by("-is_featured", "-created_at")
        )

        # --- Filters ---
        category_slug: str | None = self.request.query_params.get("category")
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        industry: str | None = self.request.query_params.get("industry")
        if industry:
            queryset = queryset.filter(industry__icontains=industry)

        experience_level: str | None = self.request.query_params.get("experience_level")
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)

        is_featured: str | None = self.request.query_params.get("is_featured")
        if is_featured is not None and is_featured.lower() in ("true", "1"):
            queryset = queryset.filter(is_featured=True)

        return queryset

    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Retrieve a single resume example and increment its views counter."""
        instance: ResumeExample = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
