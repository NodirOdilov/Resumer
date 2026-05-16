from __future__ import annotations

from django.db.models import QuerySet
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from apps.categories.models import Category
from apps.categories.serializers import CategorySerializer, CategoryTreeSerializer


class CategoryViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet[Category],
):
    """Read-only viewset for browsing categories.

    * **list** — Flat list of active categories.
    * **retrieve** — Single category by slug.
    * **tree** — Hierarchical tree of root categories with nested children.
    """

    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self) -> QuerySet[Category]:
        return Category.objects.filter(is_active=True).order_by("order", "name")

    @action(detail=False, methods=["get"], url_path="tree")
    def tree(self, request: Request) -> Response:
        """Return categories as a nested tree starting from root nodes."""
        roots = self.get_queryset().filter(parent__isnull=True)
        serializer = CategoryTreeSerializer(roots, many=True, context={"request": request})
        return Response(serializer.data)
