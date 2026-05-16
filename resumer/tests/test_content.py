"""Tests for the content app -- articles, categories, authors, search."""

from __future__ import annotations

from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import (
    ArticleCategoryFactory,
    ArticleFactory,
    AuthorFactory,
    TagFactory,
)


@pytest.mark.django_db
class TestArticleList:
    URL = "/api/v1/content/articles/"

    def test_list_articles(self, api_client: APIClient):
        """GET /articles/ returns published articles without auth."""
        ArticleFactory(status="published", publish_at=timezone.now() - timedelta(hours=1))
        ArticleFactory(status="published", publish_at=timezone.now() - timedelta(hours=2))
        # Draft should not appear
        ArticleFactory(status="draft")

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2

    def test_list_articles_by_category(self, api_client: APIClient):
        """GET /articles/?category=<slug> filters by category."""
        cat = ArticleCategoryFactory(slug="resume-tips")
        other_cat = ArticleCategoryFactory(slug="interviews")
        ArticleFactory(category=cat)
        ArticleFactory(category=other_cat)

        response = api_client.get(self.URL, {"category": "resume-tips"})

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 1

    def test_list_articles_by_author(self, api_client: APIClient):
        """GET /articles/?author=<slug> filters by author."""
        author = AuthorFactory(slug="john-doe")
        ArticleFactory(author=author)
        ArticleFactory()

        response = api_client.get(self.URL, {"author": "john-doe"})

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 1

    def test_list_featured_articles(self, api_client: APIClient):
        """GET /articles/?featured=true filters featured articles."""
        ArticleFactory(is_featured=True)
        ArticleFactory(is_featured=False)

        response = api_client.get(self.URL, {"featured": "true"})

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 1
        assert results[0]["is_featured"] is True

    def test_future_articles_not_listed(self, api_client: APIClient):
        """Articles with future publish_at are not listed."""
        ArticleFactory(status="published", publish_at=timezone.now() + timedelta(days=7))

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 0


@pytest.mark.django_db
class TestArticleDetail:
    URL = "/api/v1/content/articles/"

    def test_get_article_detail(self, api_client: APIClient):
        """GET /articles/{slug}/ returns article with full content."""
        article = ArticleFactory(slug="test-article")

        url = f"{self.URL}test-article/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["slug"] == "test-article"
        assert "content" in response.data
        assert "author" in response.data
        assert "category" in response.data
        assert "tags" in response.data
        assert "faq" in response.data
        assert "related_articles" in response.data

    def test_article_detail_increments_views(self, api_client: APIClient):
        """Retrieving an article increments its view count."""
        article = ArticleFactory(slug="views-test", views_count=0)

        url = f"{self.URL}views-test/"
        api_client.get(url)
        api_client.get(url)

        article.refresh_from_db()
        assert article.views_count == 2


@pytest.mark.django_db
class TestArticleCategories:
    URL = "/api/v1/content/categories/"

    def test_list_categories(self, api_client: APIClient):
        """GET /categories/ returns active categories."""
        ArticleCategoryFactory(is_active=True)
        ArticleCategoryFactory(is_active=True)
        ArticleCategoryFactory(is_active=False)

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2


@pytest.mark.django_db
class TestAuthors:
    URL = "/api/v1/content/authors/"

    def test_list_authors(self, api_client: APIClient):
        """GET /authors/ returns author list."""
        AuthorFactory()
        AuthorFactory()

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2

    def test_get_author_detail(self, api_client: APIClient):
        """GET /authors/{slug}/ returns author with recent articles."""
        author = AuthorFactory(slug="jane-doe")

        url = f"{self.URL}jane-doe/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["slug"] == "jane-doe"
        assert "bio" in response.data
        assert "recent_articles" in response.data


@pytest.mark.django_db
class TestSearch:
    URL = "/api/v1/content/search/"

    def test_search_articles(self, api_client: APIClient):
        """GET /search/?q=<query> searches articles by title and content."""
        ArticleFactory(title="Django REST Framework Guide")
        ArticleFactory(title="Python Tips for Interviews")
        ArticleFactory(title="React Best Practices")

        response = api_client.get(self.URL, {"q": "Django"})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["query"] == "Django"
        assert len(response.data["results"]) == 1

    def test_search_requires_query(self, api_client: APIClient):
        """GET /search/ without q returns 400."""
        response = api_client.get(self.URL)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_search_minimum_length(self, api_client: APIClient):
        """GET /search/?q=a with too-short query returns 400."""
        response = api_client.get(self.URL, {"q": "a"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
