"""Tests for the templates_library.views module."""

from __future__ import annotations

from typing import Any

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import DocumentTemplateFactory

TEMPLATES_URL = "/api/v1/templates/"


@pytest.mark.django_db
class TestTemplateList:
    """Tests for GET /api/v1/templates/ (public, no auth required)."""

    def test_list_templates(self, api_client: APIClient) -> None:
        """Templates list is publicly accessible and returns active templates."""
        DocumentTemplateFactory(is_active=True, name="Active Template")
        DocumentTemplateFactory(is_active=False, name="Inactive Template")

        response = api_client.get(TEMPLATES_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        # Only active templates returned
        names = [t["name"] for t in results]
        assert "Active Template" in names
        assert "Inactive Template" not in names

    def test_filter_by_category(self, api_client: APIClient) -> None:
        """Templates can be filtered by category."""
        DocumentTemplateFactory(category="modern", is_active=True)
        DocumentTemplateFactory(category="professional", is_active=True)

        response = api_client.get(f"{TEMPLATES_URL}?category=modern")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        for item in results:
            assert item["category"] == "modern"

    def test_filter_by_type(self, api_client: APIClient) -> None:
        """Templates can be filtered by type."""
        DocumentTemplateFactory(type="resume", is_active=True)
        DocumentTemplateFactory(type="cover_letter", is_active=True)

        response = api_client.get(f"{TEMPLATES_URL}?type=resume")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        for item in results:
            assert item["type"] == "resume"


@pytest.mark.django_db
class TestTemplateDetail:
    """Tests for GET /api/v1/templates/<slug>/."""

    def test_get_template_detail(self, api_client: APIClient) -> None:
        """Retrieve a single template by slug returns full details."""
        tpl = DocumentTemplateFactory(is_active=True)
        url = f"{TEMPLATES_URL}{tpl.slug}/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["slug"] == tpl.slug
        assert data["name"] == tpl.name
        assert "supported_sections" in data
        assert "font_options" in data


@pytest.mark.django_db
class TestTemplatePreview:
    """Tests for GET /api/v1/templates/<slug>/preview/."""

    def test_template_preview(self, api_client: APIClient) -> None:
        """Preview endpoint returns template data plus demo_data."""
        tpl = DocumentTemplateFactory(is_active=True)
        url = f"{TEMPLATES_URL}{tpl.slug}/preview/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "template" in data
        assert "demo_data" in data
        assert "personal_info" in data["demo_data"]
        assert "experience" in data["demo_data"]
        assert "skills" in data["demo_data"]
