from __future__ import annotations

from typing import Any

from django.db.models import QuerySet
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.serializers import BaseSerializer

from apps.reviews.models import Review
from apps.reviews.serializers import ReviewSerializer


class ReviewViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet[Review],
):
    """ViewSet for platform reviews.

    * **list** — Returns approved, featured reviews (public).
    * **create** — Authenticated (or anonymous with name) users can submit a
      review.  Reviews require admin approval before they appear publicly.
    """

    serializer_class = ReviewSerializer

    def get_permissions(self) -> list[Any]:
        if self.action == "list":
            return [AllowAny()]
        return [AllowAny()]  # Allow anonymous reviews; user is attached if authed

    def get_queryset(self) -> QuerySet[Review]:
        return (
            Review.objects.filter(is_approved=True)
            .order_by("-is_featured", "-created_at")
        )
