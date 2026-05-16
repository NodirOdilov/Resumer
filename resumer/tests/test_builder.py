"""Tests for the builder app -- AI suggestions and content endpoints."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import UserFactory


@pytest.mark.django_db
class TestBuilderSuggestions:
    BASE_URL = "/api/v1/suggestions/"

    def test_skill_suggestions(self, authenticated_client: APIClient):
        """GET /suggestions/skills/ returns skill autocomplete results."""
        response = authenticated_client.get(
            f"{self.BASE_URL}skills/", {"q": "python"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, (list, dict))

    def test_job_title_suggestions(self, authenticated_client: APIClient):
        """GET /suggestions/job-titles/ returns job title autocomplete."""
        response = authenticated_client.get(
            f"{self.BASE_URL}job-titles/", {"q": "engineer"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_company_suggestions(self, authenticated_client: APIClient):
        """GET /suggestions/companies/ returns company autocomplete."""
        response = authenticated_client.get(
            f"{self.BASE_URL}companies/", {"q": "google"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_content_suggestions_by_section(self, authenticated_client: APIClient):
        """GET /suggestions/content/{section}/{job_title}/ returns pre-written content."""
        response = authenticated_client.get(
            f"{self.BASE_URL}content/summary/software-engineer/"
        )
        assert response.status_code == status.HTTP_200_OK

    def test_suggestions_require_auth(self, api_client: APIClient):
        """Suggestion endpoints require authentication."""
        response = api_client.get(f"{self.BASE_URL}skills/", {"q": "python"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestAIRewrite:
    URL = "/api/v1/suggestions/ai-rewrite/"

    @patch("apps.builder.ai_service.ai_rewrite")
    def test_ai_rewrite(self, mock_rewrite, authenticated_client: APIClient):
        """POST /suggestions/ai-rewrite/ returns rewritten text."""
        mock_rewrite.return_value = "Improved professional summary text."

        response = authenticated_client.post(
            self.URL,
            {
                "text": "I am a good worker",
                "section": "summary",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK

    def test_ai_rewrite_requires_auth(self, api_client: APIClient):
        """AI rewrite requires authentication."""
        response = api_client.post(
            self.URL,
            {"text": "Test", "section": "summary"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestAIGenerate:
    URL = "/api/v1/suggestions/ai-generate/"

    @patch("apps.builder.ai_service.ai_generate")
    def test_ai_generate(self, mock_generate, authenticated_client: APIClient):
        """POST /suggestions/ai-generate/ returns generated content."""
        mock_generate.return_value = "Generated professional summary."

        response = authenticated_client.post(
            self.URL,
            {
                "section": "summary",
                "job_title": "Software Engineer",
                "years_experience": 5,
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
