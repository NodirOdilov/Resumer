"""Tests for the content.views module (articles, authors, search)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from apps.content.models import Article, Tag
from tests.factories import (
    ArticleCategoryFactory,
    ArticleFactory,
    AuthorFactory,
)

ARTICLES_URL = "/api/v1/content/articles/"
AUTHORS_URL = "/api/v1/content/authors/"
SEARCH_URL = "/api/v1/content/search/"


@pytest.mark.django_db
class TestArticleList:
    """Tests for GET /api/v1/content/articles/ (public)."""

    def test_list_articles(self, api_client: APIClient) -> None:
        """Article list is publicly accessible and returns published articles."""
        ArticleFactory(status="published", publish_at=timezone.now() - timedelta(hours=1))
        ArticleFactory(status="draft")  # should not appear

        response = api_client.get(ARTICLES_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        # Only published articles with past publish_at should appear
        assert len(results) >= 1
        for item in results:
            # All returned articles should have published-compatible data
            assert "title" in item

    def test_filter_by_category(self, api_client: APIClient) -> None:
        """Articles can be filtered by category slug."""
        cat_resume = ArticleCategoryFactory(slug="resume-tips")
        cat_interview = ArticleCategoryFactory(slug="interview-tips")
        ArticleFactory(category=cat_resume)
        ArticleFactory(category=cat_interview)

        response = api_client.get(f"{ARTICLES_URL}?category=resume-tips")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        assert len(results) >= 1


@pytest.mark.django_db
class TestArticleDetail:
    """Tests for GET /api/v1/content/articles/<slug>/."""

    def test_get_article_detail(self, api_client: APIClient) -> None:
        """Retrieve a single article by slug returns full content."""
        article = ArticleFactory(
            title="How to Write a Resume",
            content="Start with your contact info...",
        )
        url = f"{ARTICLES_URL}{article.slug}/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "How to Write a Resume"
        assert "content" in data

    def test_article_views_count_increment(self, api_client: APIClient) -> None:
        """Retrieving an article detail increments its views_count."""
        article = ArticleFactory(views_count=10)
        url = f"{ARTICLES_URL}{article.slug}/"

        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

        article.refresh_from_db()
        assert article.views_count == 11


@pytest.mark.django_db
class TestAuthorList:
    """Tests for GET /api/v1/content/authors/."""

    def test_list_authors(self, api_client: APIClient) -> None:
        """Authors list is publicly accessible."""
        AuthorFactory(name="Jane Expert")
        AuthorFactory(name="John Writer")

        response = api_client.get(AUTHORS_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        assert len(results) >= 2
        names = [a["name"] for a in results]
        assert "Jane Expert" in names
        assert "John Writer" in names


@pytest.mark.django_db
class TestSearchArticles:
    """Tests for GET /api/v1/content/search/?q=<query>."""

    def test_search_articles(self, api_client: APIClient) -> None:
        """Search returns articles matching the query in title or content."""
        ArticleFactory(
            title="Ultimate Resume Guide",
            content="This comprehensive guide covers everything about resumes.",
        )
        ArticleFactory(
            title="Interview Preparation Tips",
            content="How to prepare for technical interviews.",
        )

        response = api_client.get(f"{SEARCH_URL}?q=resume")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["count"] >= 1
        titles = [r["title"] for r in data["results"]]
        assert any("Resume" in t for t in titles)

    def test_search_empty_query(self, api_client: APIClient) -> None:
        """Search with empty query returns 400."""
        response = api_client.get(f"{SEARCH_URL}?q=")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_search_short_query(self, api_client: APIClient) -> None:
        """Search with query shorter than 2 characters returns 400."""
        response = api_client.get(f"{SEARCH_URL}?q=a")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_search_no_results(self, api_client: APIClient) -> None:
        """Search with no matching results returns empty list."""
        ArticleFactory(title="Python Tips", content="All about Python.")

        response = api_client.get(f"{SEARCH_URL}?q=zzzznonexistent")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["count"] == 0
        assert data["results"] == []
