"""Tests for the profiles app -- profile CRUD and sub-model management."""

from __future__ import annotations

from datetime import date

import pytest
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.profiles.models import (
    Certificate,
    Education,
    Language,
    Project,
    Skill,
    UserProfile,
    WorkExperience,
)
from tests.factories import (
    CertificateFactory,
    EducationFactory,
    LanguageProfileFactory,
    ProjectFactory,
    SkillFactory,
    UserFactory,
    UserProfileFactory,
    WorkExperienceFactory,
)


def _make_auth_client(user) -> APIClient:
    """Create an authenticated APIClient for the given user."""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestProfile:
    URL = "/api/v1/profile/"

    def test_get_profile(self, authenticated_client: APIClient, user):
        """GET /profile/ returns the user's profile (auto-created)."""
        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        assert "id" in response.data
        assert "phone" in response.data
        assert "educations" in response.data
        assert "work_experiences" in response.data
        assert "skills" in response.data

    def test_update_profile(self, authenticated_client: APIClient, user):
        """PATCH /profile/ updates profile fields."""
        data = {
            "phone": "+1-555-9999",
            "headline": "Senior Developer",
            "city": "San Francisco",
            "linkedin_url": "https://linkedin.com/in/testuser",
        }
        response = authenticated_client.patch(self.URL, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["phone"] == "+1-555-9999"
        assert response.data["headline"] == "Senior Developer"
        assert response.data["city"] == "San Francisco"

    def test_cannot_access_other_user_profile(self, user):
        """A user can only access their own profile via GET /profile/."""
        other_user = UserFactory()
        client = _make_auth_client(other_user)

        # The profile endpoint always returns the authenticated user's profile
        response = client.get(self.URL)
        assert response.status_code == status.HTTP_200_OK

        # Verify it's the other user's profile, not the fixture user's
        profile = UserProfile.objects.get(user=other_user)
        assert str(response.data["id"]) == str(profile.id)


# ---------------------------------------------------------------------------
# Education
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestEducation:
    URL = "/api/v1/profile/educations/"

    def test_create_education(self, authenticated_client: APIClient, user):
        """POST creates a new education entry."""
        data = {
            "institution": "MIT",
            "degree": "master",
            "field_of_study": "Computer Science",
            "start_date": "2018-09-01",
            "end_date": "2020-06-01",
            "is_current": False,
            "gpa": "3.90",
            "description": "Focused on AI and ML.",
            "order": 0,
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["institution"] == "MIT"
        assert response.data["degree"] == "master"
        assert Education.objects.filter(profile__user=user).count() == 1

    def test_list_education(self, authenticated_client: APIClient, user):
        """GET lists the user's education entries."""
        profile, _ = UserProfile.objects.get_or_create(user=user)
        EducationFactory(profile=profile)
        EducationFactory(profile=profile)

        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        # Response may be paginated or a list
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2

    def test_update_education(self, authenticated_client: APIClient, user):
        """PATCH updates an existing education entry."""
        profile, _ = UserProfile.objects.get_or_create(user=user)
        edu = EducationFactory(profile=profile, institution="Old University")

        url = f"{self.URL}{edu.id}/"
        response = authenticated_client.patch(
            url, {"institution": "New University"}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["institution"] == "New University"

    def test_delete_education(self, authenticated_client: APIClient, user):
        """DELETE soft-deletes an education entry."""
        profile, _ = UserProfile.objects.get_or_create(user=user)
        edu = EducationFactory(profile=profile)

        url = f"{self.URL}{edu.id}/"
        response = authenticated_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify soft-deleted (should not appear in default queryset)
        edu.refresh_from_db()
        assert edu.is_deleted is True

    def test_reorder_education(self, authenticated_client: APIClient, user):
        """POST /educations/reorder/ reorders items."""
        profile, _ = UserProfile.objects.get_or_create(user=user)
        edu1 = EducationFactory(profile=profile, order=0)
        edu2 = EducationFactory(profile=profile, order=1)

        url = f"{self.URL}reorder/"
        data = [
            {"id": str(edu2.id), "order": 0},
            {"id": str(edu1.id), "order": 1},
        ]
        response = authenticated_client.post(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK

        edu1.refresh_from_db()
        edu2.refresh_from_db()
        assert edu2.order == 0
        assert edu1.order == 1


# ---------------------------------------------------------------------------
# Work Experience
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestWorkExperience:
    URL = "/api/v1/profile/work-experiences/"

    def test_create_work_experience(self, authenticated_client: APIClient, user):
        """POST creates a new work experience entry."""
        data = {
            "company": "Acme Corp",
            "position": "Software Engineer",
            "location": "NYC",
            "start_date": "2020-01-01",
            "is_current": True,
            "description": "Building scalable systems.",
            "achievements": ["Led migration to microservices", "Reduced latency by 40%"],
            "order": 0,
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["company"] == "Acme Corp"
        assert response.data["position"] == "Software Engineer"
        assert len(response.data["achievements"]) == 2


# ---------------------------------------------------------------------------
# Skill
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestSkill:
    URL = "/api/v1/profile/skills/"

    def test_create_skill(self, authenticated_client: APIClient, user):
        """POST creates a new skill entry."""
        data = {
            "name": "Python",
            "level": 5,
            "category": "hard",
            "order": 0,
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "Python"
        assert response.data["level"] == 5
        assert response.data["category"] == "hard"

    def test_create_skill_invalid_level(self, authenticated_client: APIClient, user):
        """Skill level outside 1-5 returns 400."""
        data = {
            "name": "Python",
            "level": 10,
            "category": "hard",
            "order": 0,
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------------------------
# Language
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestLanguage:
    URL = "/api/v1/profile/languages/"

    def test_create_language(self, authenticated_client: APIClient, user):
        """POST creates a new language entry."""
        data = {"name": "Spanish", "level": "intermediate"}
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "Spanish"
        assert response.data["level"] == "intermediate"


# ---------------------------------------------------------------------------
# Certificate
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCertificate:
    URL = "/api/v1/profile/certificates/"

    def test_create_certificate(self, authenticated_client: APIClient, user):
        """POST creates a new certificate entry."""
        data = {
            "name": "AWS Solutions Architect",
            "issuer": "Amazon Web Services",
            "issue_date": "2023-06-01",
            "credential_id": "AWS-12345",
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "AWS Solutions Architect"
        assert response.data["issuer"] == "Amazon Web Services"


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestProject:
    URL = "/api/v1/profile/projects/"

    def test_create_project(self, authenticated_client: APIClient, user):
        """POST creates a new project entry."""
        data = {
            "name": "MyResumer",
            "description": "A resume builder platform.",
            "url": "https://github.com/example/myresumer",
            "technologies": ["Python", "Django", "React"],
            "start_date": "2023-01-01",
            "end_date": "2023-12-31",
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "MyResumer"
        assert "Python" in response.data["technologies"]


# ---------------------------------------------------------------------------
# Cross-user isolation
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestProfileIsolation:
    def test_cannot_access_other_user_education(self, user):
        """A user cannot see another user's education entries."""
        other_user = UserFactory()
        other_profile = UserProfileFactory(user=other_user)
        EducationFactory(profile=other_profile)

        client = _make_auth_client(user)
        response = client.get("/api/v1/profile/educations/")

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 0
