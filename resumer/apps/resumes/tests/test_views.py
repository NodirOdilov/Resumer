"""Tests for the resumes.views module."""

from __future__ import annotations

from typing import Any

import pytest
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.resumes.models import Resume, ResumeVersion
from apps.templates_library.models import DocumentTemplate
from tests.factories import (
    DocumentTemplateFactory,
    ResumeFactory,
    UserFactory,
)

RESUMES_URL = "/api/v1/resumes/"


def _detail_url(resume_pk: Any) -> str:
    return f"{RESUMES_URL}{resume_pk}/"


@pytest.mark.django_db
class TestListResumes:
    """Tests for GET /api/v1/resumes/."""

    def test_list_resumes_only_own(
        self,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """User only sees their own resumes."""
        ResumeFactory(user=user)
        ResumeFactory(user=user)
        other_user = UserFactory()
        ResumeFactory(user=other_user)

        response = authenticated_client.get(RESUMES_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        assert len(results) == 2

    def test_filter_by_status(
        self,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """Resumes can be filtered by status."""
        ResumeFactory(user=user, status="draft")
        ResumeFactory(user=user, status="complete")

        response = authenticated_client.get(f"{RESUMES_URL}?status=draft")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        for item in results:
            assert item["status"] == "draft"


@pytest.mark.django_db
class TestCreateResume:
    """Tests for POST /api/v1/resumes/."""

    def test_create_resume(self, authenticated_client: APIClient, user: Any) -> None:
        """Creating a resume returns 201 with auto-generated slug."""
        template = DocumentTemplateFactory()
        payload = {
            "title": "Backend Developer Resume",
            "template_id": str(template.pk),
            "language": "en-us",
        }
        response = authenticated_client.post(RESUMES_URL, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "Backend Developer Resume"
        assert data["slug"] != ""


@pytest.mark.django_db
class TestResumeDetail:
    """Tests for GET/PATCH/DELETE on a single resume."""

    def test_get_resume_detail(
        self,
        authenticated_client: APIClient,
        resume: Resume,
    ) -> None:
        """Retrieve a single resume returns full data."""
        url = _detail_url(resume.pk)
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == str(resume.pk)
        assert "content" in data
        assert "settings" in data

    def test_update_resume(
        self,
        authenticated_client: APIClient,
        resume: Resume,
    ) -> None:
        """PATCH updates resume fields."""
        url = _detail_url(resume.pk)
        response = authenticated_client.patch(
            url,
            {"title": "Updated Title", "status": "complete"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["status"] == "complete"

    def test_delete_resume_soft(
        self,
        authenticated_client: APIClient,
        resume: Resume,
    ) -> None:
        """DELETE performs a soft delete."""
        url = _detail_url(resume.pk)
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Not visible via active manager
        assert not Resume.objects.filter(pk=resume.pk).exists()
        # Still in all_objects
        assert Resume.all_objects.filter(pk=resume.pk).exists()

    def test_cannot_access_other_user_resume(
        self,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """User cannot access a resume belonging to another user."""
        other_user = UserFactory()
        other_resume = ResumeFactory(user=other_user)
        url = _detail_url(other_resume.pk)
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestResumeDuplicate:
    """Tests for POST /api/v1/resumes/<pk>/duplicate/."""

    def test_duplicate_resume(
        self,
        authenticated_client: APIClient,
        resume: Resume,
    ) -> None:
        """Duplicating a resume creates a new one with '(Copy)' in the title."""
        url = f"{_detail_url(resume.pk)}duplicate/"
        response = authenticated_client.post(url)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "(Copy)" in data["title"]
        assert data["id"] != str(resume.pk)
        assert data["status"] == "draft"


@pytest.mark.django_db
class TestChangeTemplate:
    """Tests for PATCH /api/v1/resumes/<pk>/change-template/."""

    def test_change_template(
        self,
        authenticated_client: APIClient,
        resume: Resume,
    ) -> None:
        """Changing template updates the resume's template."""
        new_template = DocumentTemplateFactory()
        url = f"{_detail_url(resume.pk)}change-template/"
        response = authenticated_client.patch(
            url,
            {"template_id": str(new_template.pk)},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        resume.refresh_from_db()
        assert resume.template_id == new_template.pk


@pytest.mark.django_db
class TestUpdateSettings:
    """Tests for PATCH /api/v1/resumes/<pk>/update-settings/."""

    def test_update_settings(
        self,
        authenticated_client: APIClient,
        resume: Resume,
    ) -> None:
        """Partial settings update merges with existing settings."""
        url = f"{_detail_url(resume.pk)}update-settings/"
        response = authenticated_client.patch(
            url,
            {"settings": {"font": "Roboto", "spacing": 1.5}},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        resume.refresh_from_db()
        assert resume.settings["font"] == "Roboto"
        assert resume.settings["spacing"] == 1.5


@pytest.mark.django_db
class TestListVersions:
    """Tests for GET /api/v1/resumes/<pk>/versions/."""

    def test_list_versions(
        self,
        authenticated_client: APIClient,
        resume: Resume,
    ) -> None:
        """Versions endpoint returns all versions for the resume."""
        ResumeVersion.objects.create(resume=resume, version_number=1, content={"v": 1})
        ResumeVersion.objects.create(resume=resume, version_number=2, content={"v": 2})

        url = f"{_detail_url(resume.pk)}versions/"
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        assert len(results) == 2
