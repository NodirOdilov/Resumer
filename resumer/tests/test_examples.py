"""Tests for the examples app -- categories and resume examples."""

from __future__ import annotations

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.examples.models import ExampleCategory, ResumeExample
from tests.factories import (
    DocumentTemplateFactory,
    ExampleCategoryFactory,
    ResumeExampleFactory,
)


# ---------------------------------------------------------------------------
# Example Categories
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestExampleCategories:
    URL = "/api/v1/examples/categories/"

    def test_list_categories(self, api_client: APIClient):
        """GET returns all active categories."""
        ExampleCategoryFactory.create_batch(5)
        ExampleCategoryFactory(is_active=False)

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 5

    def test_categories_ordered_by_order_field(self, api_client: APIClient):
        """Categories are returned sorted by the order field."""
        c2 = ExampleCategoryFactory(name="Bravo", order=2)
        c1 = ExampleCategoryFactory(name="Alpha", order=1)
        c3 = ExampleCategoryFactory(name="Charlie", order=3)

        response = api_client.get(self.URL)

        slugs = [c["slug"] for c in response.data["results"]]
        assert slugs == [c1.slug, c2.slug, c3.slug]

    def test_category_includes_example_count(self, api_client: APIClient):
        """Each category includes the count of its examples."""
        cat = ExampleCategoryFactory()
        ResumeExampleFactory.create_batch(3, category=cat)

        response = api_client.get(self.URL)

        assert response.data["results"][0]["examples_count"] == 3

    def test_inactive_categories_excluded(self, api_client: APIClient):
        """Inactive categories should not appear in the response."""
        ExampleCategoryFactory(is_active=True)
        ExampleCategoryFactory(is_active=False)

        response = api_client.get(self.URL)

        assert len(response.data["results"]) == 1


# ---------------------------------------------------------------------------
# Resume Examples
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestResumeExamples:
    URL = "/api/v1/examples/resumes/"

    def test_list_examples(self, api_client: APIClient):
        """GET returns all resume examples."""
        ResumeExampleFactory.create_batch(5)

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 5

    def test_filter_by_category(self, api_client: APIClient):
        """Filtering by category slug returns only matching examples."""
        cat_it = ExampleCategoryFactory(name="IT", slug="it")
        cat_hr = ExampleCategoryFactory(name="Healthcare", slug="healthcare")
        ResumeExampleFactory.create_batch(3, category=cat_it)
        ResumeExampleFactory.create_batch(2, category=cat_hr)

        response = api_client.get(self.URL, {"category": "it"})

        assert len(response.data["results"]) == 3

    def test_filter_by_experience_level(self, api_client: APIClient):
        """Filtering by experience_level returns only matching examples."""
        ResumeExampleFactory(experience_level="entry")
        ResumeExampleFactory(experience_level="senior")
        ResumeExampleFactory(experience_level="senior")

        response = api_client.get(self.URL, {"experience_level": "senior"})

        assert len(response.data["results"]) == 2

    def test_filter_by_industry(self, api_client: APIClient):
        """Filtering by industry (icontains) returns matches."""
        ResumeExampleFactory(industry="Software Engineering")
        ResumeExampleFactory(industry="Marketing")

        response = api_client.get(self.URL, {"industry": "software"})

        assert len(response.data["results"]) == 1

    def test_filter_featured_examples(self, api_client: APIClient):
        """Filtering by is_featured=true returns only featured."""
        ResumeExampleFactory(is_featured=True)
        ResumeExampleFactory(is_featured=False)
        ResumeExampleFactory(is_featured=False)

        response = api_client.get(self.URL, {"is_featured": "true"})

        assert len(response.data["results"]) == 1

    def test_retrieve_example_by_slug(self, api_client: APIClient):
        """GET by slug returns full example detail."""
        example = ResumeExampleFactory(slug="software-engineer-example")

        response = api_client.get(f"{self.URL}software-engineer-example/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["slug"] == "software-engineer-example"

    def test_retrieve_increments_view_count(self, api_client: APIClient):
        """Retrieving an example increments its views_count."""
        example = ResumeExampleFactory(views_count=10)

        api_client.get(f"{self.URL}{example.slug}/")

        example.refresh_from_db()
        assert example.views_count == 11

    def test_examples_accessible_without_auth(self, api_client: APIClient):
        """Examples are public and accessible without authentication."""
        ResumeExampleFactory()

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK


# ---------------------------------------------------------------------------
# Model Tests
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestExampleModels:

    def test_category_str(self):
        cat = ExampleCategoryFactory(name="Information Technology")
        assert str(cat) == "Information Technology"

    def test_resume_example_str(self):
        example = ResumeExampleFactory(title="Senior Software Engineer Resume")
        assert "Senior Software Engineer Resume" in str(example)

    def test_increment_views_atomic(self):
        """increment_views uses F() expression for atomic update."""
        example = ResumeExampleFactory(views_count=0)
        example.increment_views()
        example.refresh_from_db()
        assert example.views_count == 1

    def test_hierarchical_categories(self):
        """Categories support parent-child hierarchy."""
        parent = ExampleCategoryFactory(name="Engineering")
        child = ExampleCategoryFactory(name="Software Engineering", parent=parent)

        assert child.parent == parent
        assert parent.children.count() == 1
