"""Tests for the accounts.models module."""

from __future__ import annotations

import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError

from tests.factories import UserFactory

User = get_user_model()


@pytest.mark.django_db
class TestUserCreation:
    """Tests for user creation via the custom manager."""

    def test_create_user_with_email(self) -> None:
        """Creating a user with email sets the email and hashes the password."""
        user = User.objects.create_user(
            email="test@example.com",
            password="StrongPass123!",
            first_name="Test",
            last_name="User",
        )
        assert user.email == "test@example.com"
        assert user.check_password("StrongPass123!")
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False
        assert user.pk is not None

    def test_create_superuser(self) -> None:
        """Creating a superuser sets is_staff, is_superuser, and is_verified."""
        admin = User.objects.create_superuser(
            email="admin@example.com",
            password="AdminPass123!",
            first_name="Admin",
            last_name="User",
        )
        assert admin.is_staff is True
        assert admin.is_superuser is True
        assert admin.is_verified is True
        assert admin.is_active is True

    def test_create_user_without_email_raises(self) -> None:
        """Attempting to create a user without an email raises ValueError."""
        with pytest.raises(ValueError, match="email"):
            User.objects.create_user(email="", password="SomePass123!")

    def test_create_superuser_not_staff_raises(self) -> None:
        """Superuser with is_staff=False raises ValueError."""
        with pytest.raises(ValueError, match="is_staff"):
            User.objects.create_superuser(
                email="bad@example.com",
                password="Pass123!",
                is_staff=False,
            )

    def test_create_superuser_not_superuser_raises(self) -> None:
        """Superuser with is_superuser=False raises ValueError."""
        with pytest.raises(ValueError, match="is_superuser"):
            User.objects.create_superuser(
                email="bad2@example.com",
                password="Pass123!",
                is_superuser=False,
            )


@pytest.mark.django_db
class TestUserStr:
    """Test the string representation of User."""

    def test_user_str(self) -> None:
        """User.__str__ returns the email address."""
        user = UserFactory(email="display@example.com")
        assert str(user) == "display@example.com"


@pytest.mark.django_db
class TestEmailUniqueness:
    """Test that email uniqueness is enforced at the database level."""

    def test_email_is_unique(self) -> None:
        """Creating two users with the same email raises IntegrityError."""
        UserFactory(email="dupe@example.com")
        with pytest.raises(IntegrityError):
            User.objects.create_user(
                email="dupe@example.com",
                password="AnotherPass123!",
            )


@pytest.mark.django_db
class TestSoftDelete:
    """Test soft-delete and restore on the User model."""

    def test_soft_delete_user(self) -> None:
        """soft_delete marks the user as deleted and inactive."""
        user = UserFactory()
        assert user.is_deleted is False
        assert user.is_active is True

        user.soft_delete()
        user.refresh_from_db()

        assert user.is_deleted is True
        assert user.is_active is False
        assert user.deleted_at is not None

    def test_restore_user(self) -> None:
        """restore reverses a soft-delete."""
        user = UserFactory()
        user.soft_delete()
        user.refresh_from_db()
        assert user.is_deleted is True

        user.restore()
        user.refresh_from_db()

        assert user.is_deleted is False
        assert user.is_active is True
        assert user.deleted_at is None


@pytest.mark.django_db
class TestUserProperties:
    """Test computed properties on the User model."""

    def test_full_name(self) -> None:
        """full_name returns first + last name."""
        user = UserFactory(first_name="John", last_name="Doe")
        assert user.full_name == "John Doe"

    def test_full_name_empty(self) -> None:
        """full_name returns empty string if no names set."""
        user = UserFactory(first_name="", last_name="")
        assert user.full_name == ""

    def test_is_premium_active_without_premium(self) -> None:
        """is_premium_active returns False when is_premium is False."""
        user = UserFactory(is_premium=False)
        assert user.is_premium_active is False

    def test_is_premium_active_with_premium_no_expiry(self) -> None:
        """is_premium_active returns True when premium without expiry."""
        user = UserFactory(is_premium=True, premium_until=None)
        assert user.is_premium_active is True
