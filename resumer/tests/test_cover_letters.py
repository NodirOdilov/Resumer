"""Tests for the cover_letters app -- CRUD, duplication, matching resume."""

from __future__ import annotations

import pytest
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.cover_letters.models import CoverLetter
from tests.factories import (
    CoverLetterFactory,
    DocumentTemplateFactory,
    ResumeFactory,
    UserFactory,
)


def _make_auth_client(user) -> APIClient:
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.mark.django_db
class TestCoverLetterCreate:
    URL = "/api/v1/cover-letters/"

    def test_create_cover_letter(self, authenticated_client: APIClient, user):
        """POST creates a new cover letter."""
        data = {
            "title": "Application for SWE",
            "content": {
                "greeting": "Dear Hiring Manager,",
                "opening": "I am thrilled to apply.",
                "body": "My experience includes...",
                "closing": "Thank you.",
                "signature": "John Doe",
            },
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "Application for SWE"
        assert CoverLetter.objects.filter(user=user).count() == 1

    def test_create_cover_letter_with_template(self, authenticated_client: APIClient, user):
        """POST creates a cover letter with a template."""
        template = DocumentTemplateFactory(type="cover_letter")
        data = {
            "title": "Templated Letter",
            "template": str(template.id),
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
class TestCoverLetterList:
    URL = "/api/v1/cover-letters/"

    def test_list_cover_letters(self, authenticated_client: APIClient, user):
        """GET lists only the user's cover letters."""
        CoverLetterFactory(user=user)
        CoverLetterFactory(user=user)
        # Another user's cover letter
        other = UserFactory()
        CoverLetterFactory(user=other)

        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2


@pytest.mark.django_db
class TestCoverLetterUpdate:
    URL = "/api/v1/cover-letters/"

    def test_update_cover_letter(self, authenticated_client: APIClient, cover_letter):
        """PATCH updates cover letter fields."""
        url = f"{self.URL}{cover_letter.id}/"
        data = {
            "title": "Updated Title",
            "status": "complete",
        }
        response = authenticated_client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Title"
        assert response.data["status"] == "complete"

    def test_update_cover_letter_content(self, authenticated_client: APIClient, cover_letter):
        """PATCH updates cover letter content."""
        url = f"{self.URL}{cover_letter.id}/"
        data = {
            "content": {
                "greeting": "Dear Team,",
                "opening": "Updated opening.",
                "body": "Updated body.",
                "closing": "Best regards.",
                "signature": "Jane Doe",
            }
        }
        response = authenticated_client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["content"]["greeting"] == "Dear Team,"

    def test_update_content_invalid_keys_rejected(self, authenticated_client: APIClient, cover_letter):
        """Content with unknown keys is rejected."""
        url = f"{self.URL}{cover_letter.id}/"
        data = {
            "content": {"invalid_section": "data"}
        }
        response = authenticated_client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestCoverLetterDelete:
    URL = "/api/v1/cover-letters/"

    def test_delete_cover_letter(self, authenticated_client: APIClient, cover_letter):
        """DELETE soft-deletes the cover letter."""
        url = f"{self.URL}{cover_letter.id}/"
        response = authenticated_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT

        cl = CoverLetter.all_objects.get(pk=cover_letter.pk)
        assert cl.is_deleted is True


@pytest.mark.django_db
class TestCoverLetterWithResume:
    URL = "/api/v1/cover-letters/"

    def test_cover_letter_with_matching_resume(self, authenticated_client: APIClient, user):
        """A cover letter can be linked to a matching resume."""
        resume = ResumeFactory(user=user)
        data = {
            "title": "Matched Cover Letter",
            "resume": str(resume.id),
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert str(response.data["resume"]) == str(resume.id)


@pytest.mark.django_db
class TestCoverLetterDuplicate:
    URL = "/api/v1/cover-letters/"

    def test_duplicate_cover_letter(self, authenticated_client: APIClient, cover_letter):
        """POST /{id}/duplicate/ creates a copy."""
        url = f"{self.URL}{cover_letter.id}/duplicate/"
        response = authenticated_client.post(url, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert "(Copy)" in response.data["title"]
        assert CoverLetter.objects.filter(user=cover_letter.user).count() == 2


@pytest.mark.django_db
class TestCoverLetterIsolation:
    URL = "/api/v1/cover-letters/"

    def test_cannot_access_other_user_cover_letter(self, user, cover_letter):
        """A user cannot retrieve another user's cover letter."""
        other = UserFactory()
        client = _make_auth_client(other)

        url = f"{self.URL}{cover_letter.id}/"
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
