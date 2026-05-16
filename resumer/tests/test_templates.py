"""Tests for the templates_library app -- template browsing and filtering."""

from __future__ import annotations

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import DocumentTemplateFactory


@pytest.mark.django_db
class TestTemplateList:
    URL = "/api/v1/templates/"

    def test_list_templates(self, api_client: APIClient):
        """GET /templates/ returns active templates without authentication."""
        DocumentTemplateFactory(is_active=True, name="Alpha")
        DocumentTemplateFactory(is_active=True, name="Beta")
        DocumentTemplateFactory(is_active=False, name="Hidden")

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        # Only active templates should be returned
        names = [t["name"] for t in results]
        assert "Alpha" in names
        assert "Beta" in names
        assert "Hidden" not in names

    def test_filter_templates_by_category(self, api_client: APIClient):
        """GET /templates/?category=modern filters by category."""
        DocumentTemplateFactory(category="modern", is_active=True)
        DocumentTemplateFactory(category="professional", is_active=True)
        DocumentTemplateFactory(category="modern", is_active=True)

        response = api_client.get(self.URL, {"category": "modern"})

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert all(t["category"] == "modern" for t in results)
        assert len(results) == 2

    def test_filter_templates_by_type(self, api_client: APIClient):
        """GET /templates/?type=cv filters by type."""
        DocumentTemplateFactory(type="resume", is_active=True)
        DocumentTemplateFactory(type="cv", is_active=True)

        response = api_client.get(self.URL, {"type": "cv"})

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert all(t["type"] == "cv" for t in results)

    def test_filter_templates_by_premium(self, api_client: APIClient):
        """GET /templates/?is_premium=true filters premium templates."""
        DocumentTemplateFactory(is_premium=True, is_active=True)
        DocumentTemplateFactory(is_premium=False, is_active=True)

        response = api_client.get(self.URL, {"is_premium": "true"})

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert all(t["is_premium"] is True for t in results)

    def test_search_templates(self, api_client: APIClient):
        """GET /templates/?search=modern searches by name."""
        DocumentTemplateFactory(name="Modern Clean", is_active=True)
        DocumentTemplateFactory(name="Classic Resume", is_active=True)

        response = api_client.get(self.URL, {"search": "Modern"})

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 1
        assert results[0]["name"] == "Modern Clean"


@pytest.mark.django_db
class TestTemplateDetail:
    URL = "/api/v1/templates/"

    def test_get_template_detail(self, api_client: APIClient):
        """GET /templates/{slug}/ returns full template details."""
        template = DocumentTemplateFactory(is_active=True)

        url = f"{self.URL}{template.slug}/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == template.name
        assert response.data["slug"] == template.slug
        assert "supported_sections" in response.data
        assert "font_options" in response.data

    def test_template_detail_inactive_404(self, api_client: APIClient):
        """GET /templates/{slug}/ for inactive template returns 404."""
        template = DocumentTemplateFactory(is_active=False)

        url = f"{self.URL}{template.slug}/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestTemplatesReadonly:
    URL = "/api/v1/templates/"

    def test_templates_are_readonly(self, api_client: APIClient):
        """POST/PUT/PATCH/DELETE to templates returns 405."""
        response = api_client.post(self.URL, {"name": "New"}, format="json")
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_template_detail_readonly(self, api_client: APIClient):
        """PATCH/DELETE on template detail returns 405."""
        template = DocumentTemplateFactory(is_active=True)
        url = f"{self.URL}{template.slug}/"

        response = api_client.patch(url, {"name": "Changed"}, format="json")
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

        response = api_client.delete(url)
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
class TestTemplateCategories:
    URL = "/api/v1/templates/categories/"

    def test_list_template_categories(self, api_client: APIClient):
        """GET /templates/categories/ returns category counts."""
        DocumentTemplateFactory(category="modern", is_active=True)
        DocumentTemplateFactory(category="modern", is_active=True)
        DocumentTemplateFactory(category="professional", is_active=True)

        response = api_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        categories = {item["category"]: item["count"] for item in response.data}
        assert categories["modern"] == 2
        assert categories["professional"] == 1
