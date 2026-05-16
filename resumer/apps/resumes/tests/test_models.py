"""Tests for the resumes.models module."""

from __future__ import annotations

from typing import Any

import pytest
from django.db import IntegrityError

from apps.resumes.models import Resume, ResumeVersion
from tests.factories import DocumentTemplateFactory, ResumeFactory, UserFactory


@pytest.mark.django_db
class TestResumeCreation:
    """Tests for Resume model creation and slug generation."""

    def test_create_resume(self) -> None:
        """A resume is created with correct defaults."""
        user = UserFactory()
        template = DocumentTemplateFactory()
        resume = Resume(
            user=user,
            title="My First Resume",
            template=template,
        )
        resume.save()

        assert resume.pk is not None
        assert resume.title == "My First Resume"
        assert resume.status == Resume.Status.DRAFT
        assert resume.slug != ""
        assert resume.is_deleted is False

    def test_resume_slug_unique_per_user(self) -> None:
        """Two resumes with the same title for the same user get different slugs."""
        user = UserFactory()
        r1 = Resume(user=user, title="Developer Resume")
        r1.save()
        r2 = Resume(user=user, title="Developer Resume")
        r2.save()

        assert r1.slug != r2.slug

    def test_resume_slug_same_title_different_users(self) -> None:
        """Two users can have resumes with the same slug (scoped to user)."""
        u1 = UserFactory()
        u2 = UserFactory()
        r1 = Resume(user=u1, title="Same Title")
        r1.save()
        r2 = Resume(user=u2, title="Same Title")
        r2.save()

        # Slugs can be the same across different users
        assert r1.slug == r2.slug


@pytest.mark.django_db
class TestResumeSoftDelete:
    """Tests for soft-delete behavior on Resume."""

    def test_soft_delete_resume(self) -> None:
        """soft_delete marks the resume as deleted."""
        resume = ResumeFactory()
        assert resume.is_deleted is False

        resume.soft_delete()
        resume.refresh_from_db()

        assert resume.is_deleted is True
        assert resume.deleted_at is not None

    def test_active_manager_excludes_deleted(self) -> None:
        """The default (active) manager excludes soft-deleted resumes."""
        user = UserFactory()
        r1 = ResumeFactory(user=user)
        r2 = ResumeFactory(user=user)

        r1.soft_delete()

        active_resumes = Resume.objects.filter(user=user)
        all_resumes = Resume.all_objects.filter(user=user)

        assert active_resumes.count() == 1
        assert all_resumes.count() == 2
        assert r2.pk in list(active_resumes.values_list("pk", flat=True))


@pytest.mark.django_db
class TestResumeVersion:
    """Tests for ResumeVersion creation."""

    def test_resume_version_auto_created(self) -> None:
        """ResumeVersion can be created and linked to a resume."""
        resume = ResumeFactory()
        version = ResumeVersion.objects.create(
            resume=resume,
            version_number=1,
            content={"snapshot": "data"},
        )
        assert version.pk is not None
        assert version.version_number == 1
        assert version.content == {"snapshot": "data"}
        assert version.resume == resume

    def test_resume_version_unique_per_resume(self) -> None:
        """Duplicate version numbers on the same resume raise IntegrityError."""
        resume = ResumeFactory()
        ResumeVersion.objects.create(resume=resume, version_number=1, content={})

        with pytest.raises(IntegrityError):
            ResumeVersion.objects.create(resume=resume, version_number=1, content={})


@pytest.mark.django_db
class TestResumeStr:
    """Test string representations."""

    def test_resume_str(self) -> None:
        """Resume.__str__ includes the title and user."""
        user = UserFactory(email="strtest@example.com")
        resume = ResumeFactory(user=user, title="Dev Resume")
        result = str(resume)
        assert "Dev Resume" in result
        assert "strtest@example.com" in result
