"""Tests for the resumes app -- CRUD, duplication, versions, sections, downloads."""

from __future__ import annotations

import uuid

import pytest
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from unittest.mock import patch

from apps.resumes.models import Resume, ResumeSection, ResumeVersion
from tests.factories import (
    DocumentTemplateFactory,
    ResumeFactory,
    ResumeSectionFactory,
    ResumeVersionFactory,
    UserFactory,
)


def _make_auth_client(user) -> APIClient:
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.mark.django_db
class TestResumeCreate:
    URL = "/api/v1/resumes/"

    def test_create_resume(self, authenticated_client: APIClient, user, template):
        """POST creates a new resume with a title and template."""
        data = {
            "title": "My First Resume",
            "template_id": str(template.id),
            "language": "en-us",
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "My First Resume"
        assert Resume.objects.filter(user=user, title="My First Resume").exists()

    def test_create_resume_without_template(self, authenticated_client: APIClient, user):
        """POST creates a resume without a template."""
        data = {"title": "No Template Resume"}
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED

    def test_create_resume_blank_title_rejected(self, authenticated_client: APIClient):
        """POST with blank title returns 400."""
        data = {"title": "   "}
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestResumeList:
    URL = "/api/v1/resumes/"

    def test_list_resumes(self, authenticated_client: APIClient, user):
        """GET lists only the authenticated user's resumes."""
        ResumeFactory(user=user)
        ResumeFactory(user=user)
        # Another user's resume should not appear
        other = UserFactory()
        ResumeFactory(user=other)

        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2

    def test_list_resumes_unauthenticated(self, api_client: APIClient):
        """GET without auth returns 401."""
        response = api_client.get(self.URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestResumeDetail:
    URL = "/api/v1/resumes/"

    def test_get_resume_detail(self, authenticated_client: APIClient, resume):
        """GET /{id}/ returns full resume data."""
        url = f"{self.URL}{resume.pk}/"
        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == resume.title
        assert "content" in response.data
        assert "settings" in response.data
        assert "sections" in response.data

    def test_update_resume(self, authenticated_client: APIClient, resume):
        """PATCH /{id}/ updates resume fields."""
        url = f"{self.URL}{resume.pk}/"
        response = authenticated_client.patch(
            url,
            {"title": "Updated Title", "status": "complete"},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Title"
        assert response.data["status"] == "complete"

    def test_delete_resume(self, authenticated_client: APIClient, resume):
        """DELETE /{id}/ soft-deletes the resume and returns 204."""
        url = f"{self.URL}{resume.pk}/"
        response = authenticated_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify soft-deleted
        resume_obj = Resume.all_objects.get(pk=resume.pk)
        assert resume_obj.is_deleted is True

    def test_cannot_access_other_user_resume(self, user, resume):
        """A user cannot retrieve another user's resume."""
        other = UserFactory()
        client = _make_auth_client(other)

        url = f"{self.URL}{resume.pk}/"
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestResumeDuplicate:
    URL = "/api/v1/resumes/"

    def test_duplicate_resume(self, authenticated_client: APIClient, resume):
        """POST /{id}/duplicate/ creates a copy of the resume."""
        # Add sections to the original
        ResumeSectionFactory(resume=resume, section_type="summary", order=0)
        ResumeSectionFactory(resume=resume, section_type="experience", order=1)

        url = f"{self.URL}{resume.pk}/duplicate/"
        response = authenticated_client.post(url, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert "(Copy)" in response.data["title"]
        assert Resume.objects.filter(user=resume.user).count() == 2

        # Sections should be duplicated
        new_resume = Resume.objects.exclude(pk=resume.pk).get(user=resume.user)
        assert new_resume.sections.count() == 2


@pytest.mark.django_db
class TestResumeTemplate:
    URL = "/api/v1/resumes/"

    def test_change_template(self, authenticated_client: APIClient, resume):
        """PATCH /{id}/change-template/ changes the resume's template."""
        new_template = DocumentTemplateFactory()
        url = f"{self.URL}{resume.pk}/change-template/"

        response = authenticated_client.patch(
            url, {"template_id": str(new_template.id)}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK

        resume.refresh_from_db()
        assert resume.template_id == new_template.id


@pytest.mark.django_db
class TestResumeSettings:
    URL = "/api/v1/resumes/"

    def test_update_settings(self, authenticated_client: APIClient, resume):
        """PATCH /{id}/update-settings/ merges new settings."""
        url = f"{self.URL}{resume.pk}/update-settings/"
        response = authenticated_client.patch(
            url,
            {"settings": {"color": "#FF0000", "font": "Roboto"}},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK

        resume.refresh_from_db()
        assert resume.settings["color"] == "#FF0000"
        assert resume.settings["font"] == "Roboto"

    def test_update_settings_unknown_key(self, authenticated_client: APIClient, resume):
        """Settings with unknown keys are rejected."""
        url = f"{self.URL}{resume.pk}/update-settings/"
        response = authenticated_client.patch(
            url,
            {"settings": {"invalid_key": "value"}},
            format="json",
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestResumeVersions:
    URL = "/api/v1/resumes/"

    def test_list_versions(self, authenticated_client: APIClient, resume):
        """GET /{id}/versions/ lists version snapshots."""
        ResumeVersionFactory(resume=resume, version_number=1)
        ResumeVersionFactory(resume=resume, version_number=2)

        url = f"{self.URL}{resume.pk}/versions/"
        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2


@pytest.mark.django_db
class TestResumeSections:
    URL = "/api/v1/resumes/"

    def test_reorder_sections(self, authenticated_client: APIClient, resume):
        """POST /{id}/reorder-sections/ reorders sections by ID list."""
        s1 = ResumeSectionFactory(resume=resume, section_type="summary", order=0)
        s2 = ResumeSectionFactory(resume=resume, section_type="experience", order=1)
        s3 = ResumeSectionFactory(resume=resume, section_type="education", order=2)

        url = f"{self.URL}{resume.pk}/reorder-sections/"
        data = {"section_ids": [str(s3.id), str(s1.id), str(s2.id)]}
        response = authenticated_client.post(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK

        s1.refresh_from_db()
        s2.refresh_from_db()
        s3.refresh_from_db()
        assert s3.order == 0
        assert s1.order == 1
        assert s2.order == 2


@pytest.mark.django_db
class TestResumeDownload:
    URL = "/api/v1/resumes/"

    @patch("apps.resumes.tasks.generate_pdf.delay")
    def test_download_pdf_creates_task(self, mock_task, authenticated_client: APIClient, resume):
        """POST /{id}/download/ with format=pdf triggers async task."""
        mock_task.return_value.id = "mock-task-id"

        url = f"{self.URL}{resume.pk}/download/"
        response = authenticated_client.post(url, {"format": "pdf"}, format="json")

        assert response.status_code == status.HTTP_202_ACCEPTED
        assert response.data["format"] == "pdf"
        assert "task_id" in response.data
        mock_task.assert_called_once_with(str(resume.pk))


@pytest.mark.django_db
class TestResumePreview:
    URL = "/api/v1/resumes/"

    @patch("apps.resumes.views.render_to_string", return_value="<html>preview</html>")
    def test_preview_returns_html(self, mock_render, authenticated_client: APIClient, resume):
        """GET /{id}/preview/ returns HTML preview."""
        url = f"{self.URL}{resume.pk}/preview/"
        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert "html" in response.data
