"""Unified search view that queries multiple Elasticsearch indices."""

from __future__ import annotations

import logging
from typing import Any

from elasticsearch_dsl import Q as ESQ, Search
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.search.indexes import (
    ArticleDocument,
    CoverLetterExampleDocument,
    ResumeExampleDocument,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Response serializers
# ---------------------------------------------------------------------------


class SearchResultSerializer(serializers.Serializer):
    """Serializes a single search hit into a uniform envelope."""

    id = serializers.CharField()
    type = serializers.CharField(help_text="Result type: article, resume_example, cover_letter_example")
    title = serializers.CharField()
    excerpt = serializers.CharField(required=False, default="")
    score = serializers.FloatField()
    meta = serializers.DictField(required=False, default=dict)


# ---------------------------------------------------------------------------
# View
# ---------------------------------------------------------------------------


class UnifiedSearchView(APIView):
    """GET /api/v1/search/?q=<query>&type=articles|examples|all

    Searches across Elasticsearch indices and returns mixed, relevance-ranked
    results.

    Query parameters:
        q       -- search query (required, min 2 chars)
        type    -- filter to specific index: articles, examples, all (default all)
        limit   -- max results per index (default 20, max 50)
    """

    permission_classes = [AllowAny]

    VALID_TYPES = {"articles", "examples", "all"}
    DEFAULT_LIMIT = 20
    MAX_LIMIT = 50

    def get(self, request: Request) -> Response:
        query: str = request.query_params.get("q", "").strip()
        search_type: str = request.query_params.get("type", "all").lower()

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

        if search_type not in self.VALID_TYPES:
            return Response(
                {"detail": f"Invalid type. Must be one of: {', '.join(sorted(self.VALID_TYPES))}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            limit = min(int(request.query_params.get("limit", self.DEFAULT_LIMIT)), self.MAX_LIMIT)
        except (ValueError, TypeError):
            limit = self.DEFAULT_LIMIT

        results: list[dict[str, Any]] = []

        try:
            if search_type in ("articles", "all"):
                results.extend(self._search_articles(query, limit))

            if search_type in ("examples", "all"):
                results.extend(self._search_resume_examples(query, limit))
                results.extend(self._search_cover_letter_examples(query, limit))
        except Exception:
            logger.exception("Elasticsearch query failed for q=%s", query)
            return Response(
                {"detail": "Search service is temporarily unavailable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Sort all results by score descending
        results.sort(key=lambda r: r["score"], reverse=True)

        return Response(
            {
                "query": query,
                "type": search_type,
                "count": len(results),
                "results": results,
            },
            status=status.HTTP_200_OK,
        )

    # ------------------------------------------------------------------
    # Private search helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _search_articles(query: str, limit: int) -> list[dict[str, Any]]:
        """Search the articles index."""
        s = ArticleDocument.search()
        s = s.query(
            ESQ(
                "multi_match",
                query=query,
                fields=["title^3", "title.multilang^2", "content", "excerpt", "tags^2"],
                type="best_fields",
                fuzziness="AUTO",
            )
        )[:limit]

        response = s.execute()
        results: list[dict[str, Any]] = []
        for hit in response:
            results.append({
                "id": hit.meta.id,
                "type": "article",
                "title": getattr(hit, "title", ""),
                "excerpt": getattr(hit, "excerpt", ""),
                "score": hit.meta.score,
                "meta": {
                    "category": getattr(hit, "category_name", ""),
                    "author": getattr(hit, "author_name", ""),
                    "views_count": getattr(hit, "views_count", 0),
                    "publish_at": str(getattr(hit, "publish_at", "")),
                },
            })
        return results

    @staticmethod
    def _search_resume_examples(query: str, limit: int) -> list[dict[str, Any]]:
        """Search the resume_examples index."""
        s = ResumeExampleDocument.search()
        s = s.query(
            ESQ(
                "multi_match",
                query=query,
                fields=["title^3", "job_title^2", "industry", "category_name", "content"],
                type="best_fields",
                fuzziness="AUTO",
            )
        )[:limit]

        response = s.execute()
        results: list[dict[str, Any]] = []
        for hit in response:
            results.append({
                "id": hit.meta.id,
                "type": "resume_example",
                "title": getattr(hit, "title", ""),
                "excerpt": "",
                "score": hit.meta.score,
                "meta": {
                    "job_title": getattr(hit, "job_title", ""),
                    "industry": getattr(hit, "industry", ""),
                    "category": getattr(hit, "category_name", ""),
                    "experience_level": getattr(hit, "experience_level", ""),
                    "views_count": getattr(hit, "views_count", 0),
                },
            })
        return results

    @staticmethod
    def _search_cover_letter_examples(query: str, limit: int) -> list[dict[str, Any]]:
        """Search the cover_letter_examples index."""
        s = CoverLetterExampleDocument.search()
        s = s.query(
            ESQ(
                "multi_match",
                query=query,
                fields=["title^3", "job_title^2", "category_name", "content"],
                type="best_fields",
                fuzziness="AUTO",
            )
        )[:limit]

        response = s.execute()
        results: list[dict[str, Any]] = []
        for hit in response:
            results.append({
                "id": hit.meta.id,
                "type": "cover_letter_example",
                "title": getattr(hit, "title", ""),
                "excerpt": "",
                "score": hit.meta.score,
                "meta": {
                    "job_title": getattr(hit, "job_title", ""),
                    "category": getattr(hit, "category_name", ""),
                    "experience_level": getattr(hit, "experience_level", ""),
                },
            })
        return results
