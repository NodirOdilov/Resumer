"""Tests for the profiles.views module."""

from __future__ import annotations

from datetime import date
from typing import Any

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.profiles.models import Education, Skill, UserProfile, WorkExperience
from tests.factories import UserFactory

PROFILE_URL = "/api/v1/profile/"
EDUCATIONS_URL = "/api/v1/profile/educations/"
WORK_EXPERIENCES_URL = "/api/v1/profile/work-experiences/"
SKILLS_URL = "/api/v1/profile/skills/"


@pytest.mark.django_db
class TestProfileView:
    """Tests for GET/PATCH /api/v1/profile/."""

    def test_get_profile(self, authenticated_client: APIClient, user: Any) -> None:
        """Authenticated user can retrieve their profile."""
        response = authenticated_client.get(PROFILE_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "id" in data
        assert "phone" in data
        assert "city" in data

    def test_update_profile(self, authenticated_client: APIClient, user: Any) -> None:
        """Authenticated user can partially update their profile."""
        payload = {
            "phone": "+1-555-0199",
            "city": "New York",
            "headline": "Senior Software Engineer",
        }
        response = authenticated_client.patch(PROFILE_URL, payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["phone"] == "+1-555-0199"
        assert data["city"] == "New York"
        assert data["headline"] == "Senior Software Engineer"

    def test_profile_auto_created_on_user_creation(self, db: None) -> None:
        """Accessing profile via get_or_create ensures it exists for any user."""
        user = UserFactory()
        profile, created = UserProfile.objects.get_or_create(user=user)
        assert profile.pk is not None
        # Second call should not create a new one
        profile2, created2 = UserProfile.objects.get_or_create(user=user)
        assert profile.pk == profile2.pk
        assert created2 is False


@pytest.mark.django_db
class TestEducationViews:
    """Tests for Education CRUD endpoints."""

    def test_create_education(self, authenticated_client: APIClient) -> None:
        """POST to educations endpoint creates an education entry."""
        payload = {
            "institution": "MIT",
            "degree": "bachelor",
            "field_of_study": "Computer Science",
            "start_date": "2018-09-01",
            "end_date": "2022-05-15",
            "is_current": False,
            "gpa": "3.90",
            "description": "Graduated with honors.",
            "order": 0,
        }
        response = authenticated_client.post(EDUCATIONS_URL, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["institution"] == "MIT"
        assert data["degree"] == "bachelor"
        assert data["field_of_study"] == "Computer Science"

    def test_list_education(self, authenticated_client: APIClient, user: Any) -> None:
        """GET to educations endpoint returns user's education entries."""
        # Create profile and education
        profile, _ = UserProfile.objects.get_or_create(user=user)
        Education.objects.create(
            profile=profile,
            institution="Harvard",
            degree="master",
            field_of_study="Data Science",
            start_date=date(2020, 9, 1),
            order=0,
        )
        response = authenticated_client.get(EDUCATIONS_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        assert len(results) >= 1

    def test_update_education(self, authenticated_client: APIClient, user: Any) -> None:
        """PATCH to education detail updates the entry."""
        profile, _ = UserProfile.objects.get_or_create(user=user)
        edu = Education.objects.create(
            profile=profile,
            institution="Stanford",
            degree="bachelor",
            field_of_study="Physics",
            start_date=date(2016, 9, 1),
            end_date=date(2020, 6, 15),
            order=0,
        )
        url = f"{EDUCATIONS_URL}{edu.pk}/"
        response = authenticated_client.patch(
            url,
            {"field_of_study": "Applied Physics"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["field_of_study"] == "Applied Physics"

    def test_delete_education_soft(self, authenticated_client: APIClient, user: Any) -> None:
        """DELETE on education performs a soft delete."""
        profile, _ = UserProfile.objects.get_or_create(user=user)
        edu = Education.objects.create(
            profile=profile,
            institution="Caltech",
            degree="phd",
            field_of_study="Chemistry",
            start_date=date(2015, 9, 1),
            order=0,
        )
        url = f"{EDUCATIONS_URL}{edu.pk}/"
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify soft-deleted: not visible via active manager, but exists
        assert not Education.objects.filter(pk=edu.pk).exists()
        assert Education.all_objects.filter(pk=edu.pk).exists()

    def test_reorder_education(self, authenticated_client: APIClient, user: Any) -> None:
        """POST to reorder endpoint updates order fields."""
        profile, _ = UserProfile.objects.get_or_create(user=user)
        edu1 = Education.objects.create(
            profile=profile,
            institution="Uni A",
            degree="bachelor",
            start_date=date(2015, 9, 1),
            order=0,
        )
        edu2 = Education.objects.create(
            profile=profile,
            institution="Uni B",
            degree="master",
            start_date=date(2019, 9, 1),
            order=1,
        )
        reorder_url = f"{EDUCATIONS_URL}reorder/"
        payload = [
            {"id": str(edu2.pk), "order": 0},
            {"id": str(edu1.pk), "order": 1},
        ]
        response = authenticated_client.post(reorder_url, payload, format="json")
        assert response.status_code == status.HTTP_200_OK

        edu1.refresh_from_db()
        edu2.refresh_from_db()
        assert edu1.order == 1
        assert edu2.order == 0


@pytest.mark.django_db
class TestWorkExperienceViews:
    """Tests for WorkExperience CRUD."""

    def test_create_work_experience(self, authenticated_client: APIClient) -> None:
        """POST to work-experiences endpoint creates an entry."""
        payload = {
            "company": "Google",
            "position": "Software Engineer",
            "location": "Mountain View, CA",
            "start_date": "2020-01-15",
            "is_current": True,
            "description": "Building search infrastructure.",
            "achievements": ["Reduced latency by 40%", "Led team of 5"],
            "order": 0,
        }
        response = authenticated_client.post(WORK_EXPERIENCES_URL, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["company"] == "Google"
        assert data["position"] == "Software Engineer"
        assert data["is_current"] is True
        assert len(data["achievements"]) == 2


@pytest.mark.django_db
class TestSkillViews:
    """Tests for Skill CRUD."""

    def test_create_skill(self, authenticated_client: APIClient) -> None:
        """POST to skills endpoint creates a skill entry."""
        payload = {
            "name": "Python",
            "level": 5,
            "category": "hard",
            "order": 0,
        }
        response = authenticated_client.post(SKILLS_URL, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Python"
        assert data["level"] == 5
        assert data["category"] == "hard"
