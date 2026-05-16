"""Tests for the cvs app -- CRUD, academic sections, duplication."""

from __future__ import annotations

import pytest
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.cvs.models import CV, CVSection
from tests.factories import (
    CVFactory,
    CVSectionFactory,
    DocumentTemplateFactory,
    UserFactory,
)


def _make_auth_client(user) -> APIClient:
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.mark.django_db
class TestCVCreate:
    URL = "/api/v1/cvs/"

    def test_create_cv(self, authenticated_client: APIClient, user):
        """POST creates a new CV."""
        data = {
            "title": "Academic CV",
            "language": "en-us",
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "Academic CV"
        assert CV.objects.filter(user=user).count() == 1

    def test_create_cv_with_sections(self, authenticated_client: APIClient, user):
        """POST creates a CV with inline sections."""
        data = {
            "title": "Research CV",
            "sections": [
                {"section_type": "publications", "content": {"entries": []}, "order": 0, "is_visible": True},
                {"section_type": "research", "content": {"focus": "ML"}, "order": 1, "is_visible": True},
            ],
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        cv = CV.objects.get(user=user, title="Research CV")
        assert cv.sections.count() == 2

    def test_create_cv_with_template(self, authenticated_client: APIClient, user):
        """POST creates a CV with a linked template."""
        template = DocumentTemplateFactory(type="cv")
        data = {
            "title": "Templated CV",
            "template": str(template.id),
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
class TestCVList:
    URL = "/api/v1/cvs/"

    def test_list_cvs(self, authenticated_client: APIClient, user):
        """GET lists only the authenticated user's CVs."""
        CVFactory(user=user)
        CVFactory(user=user)
        # Another user's CV
        other = UserFactory()
        CVFactory(user=other)

        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2

    def test_list_cvs_unauthenticated(self, api_client: APIClient):
        """GET without auth returns 401."""
        response = api_client.get(self.URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestCVDetail:
    URL = "/api/v1/cvs/"

    def test_get_cv_detail(self, authenticated_client: APIClient, cv):
        """GET /{id}/ returns full CV data with sections."""
        CVSectionFactory(cv=cv, section_type="publications", order=0)
        CVSectionFactory(cv=cv, section_type="research", order=1)

        url = f"{self.URL}{cv.id}/"
        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == cv.title
        assert "content" in response.data
        assert "sections" in response.data
        assert len(response.data["sections"]) == 2

    def test_update_cv(self, authenticated_client: APIClient, cv):
        """PATCH /{id}/ updates CV fields."""
        url = f"{self.URL}{cv.id}/"
        response = authenticated_client.patch(
            url,
            {"title": "Updated CV", "status": "complete"},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated CV"
        assert response.data["status"] == "complete"

    def test_delete_cv(self, authenticated_client: APIClient, cv):
        """DELETE /{id}/ soft-deletes the CV."""
        url = f"{self.URL}{cv.id}/"
        response = authenticated_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT

        cv_obj = CV.all_objects.get(pk=cv.pk)
        assert cv_obj.is_deleted is True


@pytest.mark.django_db
class TestCVAcademicSections:
    URL = "/api/v1/cvs/"

    def test_cv_has_academic_sections(self, authenticated_client: APIClient, cv):
        """A CV can include academic-specific section types."""
        academic_types = ["publications", "conferences", "research", "teaching", "grants"]

        for i, section_type in enumerate(academic_types):
            CVSectionFactory(cv=cv, section_type=section_type, order=i)

        url = f"{self.URL}{cv.id}/sections/"
        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        section_types = [s["section_type"] for s in response.data]
        for st in academic_types:
            assert st in section_types

    def test_cv_sections_ordered(self, authenticated_client: APIClient, cv):
        """Sections are returned ordered by their 'order' field."""
        CVSectionFactory(cv=cv, section_type="grants", order=2)
        CVSectionFactory(cv=cv, section_type="publications", order=0)
        CVSectionFactory(cv=cv, section_type="teaching", order=1)

        url = f"{self.URL}{cv.id}/sections/"
        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        types_in_order = [s["section_type"] for s in response.data]
        assert types_in_order == ["publications", "teaching", "grants"]


@pytest.mark.django_db
class TestCVDuplicate:
    URL = "/api/v1/cvs/"

    def test_duplicate_cv(self, authenticated_client: APIClient, cv):
        """POST /{id}/duplicate/ creates a copy including sections."""
        CVSectionFactory(cv=cv, section_type="publications", order=0)
        CVSectionFactory(cv=cv, section_type="research", order=1)

        url = f"{self.URL}{cv.id}/duplicate/"
        response = authenticated_client.post(url, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert "(Copy)" in response.data["title"]
        assert CV.objects.filter(user=cv.user).count() == 2

        # Sections should be duplicated
        new_cv = CV.objects.exclude(pk=cv.pk).get(user=cv.user)
        assert new_cv.sections.count() == 2


@pytest.mark.django_db
class TestCVIsolation:
    URL = "/api/v1/cvs/"

    def test_cannot_access_other_user_cv(self, user, cv):
        """A user cannot retrieve another user's CV."""
        other = UserFactory()
        client = _make_auth_client(other)

        url = f"{self.URL}{cv.id}/"
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
