from __future__ import annotations

from typing import Any

from django.db.models import Q, QuerySet
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.content.models import Article, ArticleCategory, Author, Tag
from apps.content.serializers import (
    ArticleCategorySerializer,
    ArticleDetailSerializer,
    ArticleListSerializer,
    ArticleSearchSerializer,
    AuthorDetailSerializer,
    AuthorListSerializer,
    TagSerializer,
)


# ──────────────────── ArticleCategory ─────────────────────


class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet[ArticleCategory]):
    """Read-only viewset for article categories."""

    serializer_class = ArticleCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self) -> QuerySet[ArticleCategory]:
        return (
            ArticleCategory.objects.filter(is_active=True)
            .select_related("parent")
            .prefetch_related("children")
        )


# ──────────────────────── Tag ─────────────────────────────


class TagViewSet(viewsets.ReadOnlyModelViewSet[Tag]):
    """Read-only viewset for tags."""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


# ─────────────────────── Author ───────────────────────────


class AuthorViewSet(viewsets.ReadOnlyModelViewSet[Author]):
    """Read-only viewset for authors. Detail includes recent articles."""

    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self) -> QuerySet[Author]:
        return Author.objects.all()

    def get_serializer_class(self) -> type[AuthorListSerializer] | type[AuthorDetailSerializer]:  # type: ignore[override]
        if self.action == "retrieve":
            return AuthorDetailSerializer
        return AuthorListSerializer

    @action(detail=True, methods=["get"], url_path="articles")
    def articles(self, request: Request, slug: str | None = None) -> Response:
        """List all published articles by this author."""
        author = self.get_object()
        articles = (
            Article.published.filter(author=author)
            .select_related("author", "category")
            .prefetch_related("tags")
        )
        page = self.paginate_queryset(articles)
        if page is not None:
            serializer = ArticleListSerializer(page, many=True, context=self.get_serializer_context())
            return self.get_paginated_response(serializer.data)
        serializer = ArticleListSerializer(articles, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


# ─────────────────────── Article ──────────────────────────


class ArticleViewSet(viewsets.ReadOnlyModelViewSet[Article]):
    """
    Read-only viewset for articles.

    Supports filtering by:
    - category (slug): ?category=resume-tips
    - author (slug):   ?author=john-doe
    - tag (slug):      ?tag=interviews
    - featured only:   ?featured=true
    """

    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self) -> QuerySet[Article]:
        qs = (
            Article.published.select_related("author", "category")
            .prefetch_related("tags")
            .all()
        )

        # Filter by category slug
        category_slug: str | None = self.request.query_params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        # Filter by author slug
        author_slug: str | None = self.request.query_params.get("author")
        if author_slug:
            qs = qs.filter(author__slug=author_slug)

        # Filter by tag slug
        tag_slug: str | None = self.request.query_params.get("tag")
        if tag_slug:
            qs = qs.filter(tags__slug=tag_slug)

        # Filter featured
        featured: str | None = self.request.query_params.get("featured")
        if featured and featured.lower() in ("true", "1", "yes"):
            qs = qs.filter(is_featured=True)

        return qs.distinct()

    def get_serializer_class(self) -> type[ArticleListSerializer] | type[ArticleDetailSerializer]:  # type: ignore[override]
        if self.action == "retrieve":
            return ArticleDetailSerializer
        return ArticleListSerializer

    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Retrieve article detail and increment view count."""
        instance: Article = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# ─────────────────────── Search ───────────────────────────


class SearchView(APIView):
    """
    GET /api/v1/content/search/?q=<query>

    Search published articles by title and content (case-insensitive contains).
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        query: str = request.query_params.get("q", "").strip()
        if not query:
            return Response(
                {"detail": "Query parameter 'q' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(query) < 2:
            return Response(
                {"detail": "Query must be at least 2 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        articles = (
            Article.published.filter(
                Q(title__icontains=query) | Q(content__icontains=query),
            )
            .select_related("author", "category")
            .order_by("-publish_at")[:50]
        )

        serializer = ArticleSearchSerializer(articles, many=True)
        return Response(
            {
                "query": query,
                "count": len(serializer.data),
                "results": serializer.data,
            },
        )
