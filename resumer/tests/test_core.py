"""Tests for the core app -- mixins, managers, permissions, and utilities."""

from __future__ import annotations

import pytest
from django.utils import timezone

from apps.resumes.models import Resume
from tests.factories import DocumentTemplateFactory, ResumeFactory, UserFactory


@pytest.mark.django_db
class TestSoftDeleteMixin:
    """Test the SoftDeleteMixin via the Resume model (which uses it)."""

    def test_soft_delete_marks_as_deleted(self):
        """soft_delete() sets is_deleted=True and deleted_at."""
        resume = ResumeFactory()
        resume.soft_delete()
        resume.refresh_from_db()

        assert resume.is_deleted is True
        assert resume.deleted_at is not None

    def test_soft_deleted_excluded_from_default_manager(self):
        """Default manager (objects) excludes soft-deleted records."""
        resume = ResumeFactory()
        resume.soft_delete()

        assert Resume.objects.filter(pk=resume.pk).count() == 0

    def test_soft_deleted_included_in_all_objects_manager(self):
        """all_objects manager includes soft-deleted records."""
        resume = ResumeFactory()
        resume.soft_delete()

        assert Resume.all_objects.filter(pk=resume.pk).count() == 1

    def test_restore_reverses_soft_delete(self):
        """restore() sets is_deleted=False and deleted_at=None."""
        resume = ResumeFactory()
        resume.soft_delete()
        resume.restore()
        resume.refresh_from_db()

        assert resume.is_deleted is False
        assert resume.deleted_at is None
        assert Resume.objects.filter(pk=resume.pk).exists()

    def test_hard_delete_removes_from_database(self):
        """hard_delete() permanently removes the record."""
        resume = ResumeFactory()
        pk = resume.pk
        resume.hard_delete()

        assert Resume.objects.filter(pk=pk).count() == 0
        assert Resume.all_objects.filter(pk=pk).count() == 0


@pytest.mark.django_db
class TestTimestampMixin:
    """Test the TimestampMixin via Resume."""

    def test_created_at_auto_set(self):
        resume = ResumeFactory()
        assert resume.created_at is not None

    def test_updated_at_auto_set(self):
        resume = ResumeFactory()
        assert resume.updated_at is not None

    def test_updated_at_changes_on_save(self):
        resume = ResumeFactory()
        old_updated = resume.updated_at

        resume.title = "Updated Title"
        resume.save()
        resume.refresh_from_db()

        assert resume.updated_at >= old_updated


@pytest.mark.django_db
class TestSlugGeneration:
    """Test slug auto-generation."""

    def test_resume_auto_generates_slug(self):
        """Resume auto-generates a slug from its title."""
        resume = ResumeFactory(title="My Professional Resume")
        assert resume.slug is not None
        assert len(resume.slug) > 0

    def test_unique_slugs_for_same_title(self):
        """Two resumes with the same title get different slugs."""
        user = UserFactory()
        r1 = ResumeFactory(user=user, title="My Resume")
        r2 = ResumeFactory(user=user, title="My Resume")

        assert r1.slug != r2.slug


@pytest.mark.django_db
class TestUUIDPrimaryKey:
    """All models should use UUID primary keys."""

    def test_user_has_uuid_pk(self):
        user = UserFactory()
        assert len(str(user.pk)) == 36  # UUID format: 8-4-4-4-12

    def test_resume_has_uuid_pk(self):
        resume = ResumeFactory()
        assert len(str(resume.pk)) == 36

    def test_template_has_uuid_pk(self):
        template = DocumentTemplateFactory()
        assert len(str(template.pk)) == 36
