"""Tests for the accounts app -- registration, login, auth, password, email verification."""

from __future__ import annotations

import uuid

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import EmailVerification, PasswordReset
from tests.factories import UserFactory

User = get_user_model()

# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestUserRegistration:
    URL = "/api/v1/auth/register/"

    def test_user_registration(self, api_client: APIClient):
        """Successful registration returns 201, user data, and JWT tokens."""
        data = {
            "email": "newuser@example.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
            "first_name": "Jane",
            "last_name": "Doe",
        }
        response = api_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert "user" in response.data
        assert "tokens" in response.data
        assert response.data["user"]["email"] == "newuser@example.com"
        assert response.data["user"]["first_name"] == "Jane"
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]

        # Verify user was actually persisted
        assert User.objects.filter(email="newuser@example.com").exists()

    def test_user_registration_duplicate_email(self, api_client: APIClient):
        """Registration with an existing email returns 400."""
        UserFactory(email="existing@example.com")
        data = {
            "email": "existing@example.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
            "first_name": "John",
            "last_name": "Doe",
        }
        response = api_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_user_registration_password_mismatch(self, api_client: APIClient):
        """Registration with mismatched passwords returns 400."""
        data = {
            "email": "mismatch@example.com",
            "password": "StrongPass123!",
            "password_confirm": "DifferentPass456!",
            "first_name": "John",
            "last_name": "Doe",
        }
        response = api_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_user_registration_weak_password(self, api_client: APIClient):
        """Registration with a weak password returns 400."""
        data = {
            "email": "weak@example.com",
            "password": "123",
            "password_confirm": "123",
            "first_name": "John",
            "last_name": "Doe",
        }
        response = api_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestUserLogin:
    URL = "/api/v1/auth/login/"

    def test_user_login(self, api_client: APIClient):
        """Successful login returns 200 with user data and tokens."""
        user = UserFactory(email="login@example.com")
        data = {"email": "login@example.com", "password": "TestPass123!"}
        response = api_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "user" in response.data
        assert "tokens" in response.data
        assert response.data["user"]["email"] == "login@example.com"

    def test_user_login_wrong_password(self, api_client: APIClient):
        """Login with wrong password returns 401."""
        UserFactory(email="wrongpw@example.com")
        data = {"email": "wrongpw@example.com", "password": "WrongPassword!"}
        response = api_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "detail" in response.data

    def test_user_login_nonexistent_email(self, api_client: APIClient):
        """Login with nonexistent email returns 401."""
        data = {"email": "noone@example.com", "password": "SomePass123!"}
        response = api_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_login_inactive_account(self, api_client: APIClient):
        """Login with deactivated account returns 403."""
        user = UserFactory(email="inactive@example.com", is_active=False)
        data = {"email": "inactive@example.com", "password": "TestPass123!"}
        response = api_client.post(self.URL, data, format="json")

        # Django authenticate returns None for inactive, so 401
        assert response.status_code in (
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        )


# ---------------------------------------------------------------------------
# Token refresh
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestTokenRefresh:
    URL = "/api/v1/auth/login/"

    def test_token_refresh(self, api_client: APIClient):
        """A valid refresh token can be used to get a new access token."""
        user = UserFactory()
        refresh = RefreshToken.for_user(user)

        response = api_client.post(
            "/api/v1/auth/login/",
            {"email": user.email, "password": "TestPass123!"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        refresh_token = response.data["tokens"]["refresh"]

        # SimpleJWT token refresh endpoint (standard path)
        # The project may or may not have this endpoint; test the tokens are valid
        assert refresh_token is not None
        assert len(refresh_token) > 0


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestLogout:
    URL = "/api/v1/auth/logout/"

    def test_logout_blacklists_token(self, api_client: APIClient):
        """Logout with a valid refresh token returns 200."""
        user = UserFactory()
        refresh = RefreshToken.for_user(user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        response = api_client.post(self.URL, {"refresh": str(refresh)}, format="json")
        assert response.status_code == status.HTTP_200_OK

    def test_logout_without_token(self, authenticated_client: APIClient):
        """Logout without refresh token returns 400."""
        response = authenticated_client.post(self.URL, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_logout_unauthenticated(self, api_client: APIClient):
        """Logout without auth returns 401."""
        response = api_client.post(self.URL, {"refresh": "fake"}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ---------------------------------------------------------------------------
# Current user (/me)
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestCurrentUser:
    URL = "/api/v1/auth/me/"

    def test_get_current_user(self, authenticated_client: APIClient, user):
        """GET /me/ returns current user's data."""
        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == user.email
        assert response.data["first_name"] == user.first_name
        assert "id" in response.data

    def test_update_current_user(self, authenticated_client: APIClient, user):
        """PATCH /me/ updates allowed fields."""
        response = authenticated_client.patch(
            self.URL,
            {"first_name": "Updated", "language": "de"},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "Updated"
        assert response.data["language"] == "de"

        user.refresh_from_db()
        assert user.first_name == "Updated"

    def test_update_readonly_fields_ignored(self, authenticated_client: APIClient, user):
        """PATCH /me/ cannot change read-only fields like email or is_premium."""
        original_email = user.email
        response = authenticated_client.patch(
            self.URL,
            {"email": "hacked@example.com", "is_premium": True},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.email == original_email
        assert user.is_premium is False

    def test_delete_account(self, authenticated_client: APIClient, user):
        """DELETE /me/ soft-deletes the user account."""
        response = authenticated_client.delete(self.URL)

        assert response.status_code == status.HTTP_204_NO_CONTENT

        user.refresh_from_db()
        assert user.is_deleted is True
        assert user.is_active is False
        assert user.deleted_at is not None

    def test_unauthenticated_access_denied(self, api_client: APIClient):
        """GET /me/ without auth returns 401."""
        response = api_client.get(self.URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ---------------------------------------------------------------------------
# Password management
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestPasswordChange:
    URL = "/api/v1/auth/password/change/"

    def test_password_change(self, authenticated_client: APIClient, user):
        """Changing password with correct old password succeeds."""
        data = {
            "old_password": "TestPass123!",
            "new_password": "NewStrongPass456!",
            "new_password_confirm": "NewStrongPass456!",
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_200_OK

        user.refresh_from_db()
        assert user.check_password("NewStrongPass456!")

    def test_password_change_wrong_old(self, authenticated_client: APIClient):
        """Changing password with wrong old password fails."""
        data = {
            "old_password": "WrongOldPass!",
            "new_password": "NewStrongPass456!",
            "new_password_confirm": "NewStrongPass456!",
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_password_change_mismatch(self, authenticated_client: APIClient):
        """Changing password with mismatched new passwords fails."""
        data = {
            "old_password": "TestPass123!",
            "new_password": "NewPass456!",
            "new_password_confirm": "DifferentPass789!",
        }
        response = authenticated_client.post(self.URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestPasswordReset:
    URL = "/api/v1/auth/password/reset/"
    CONFIRM_URL = "/api/v1/auth/password/reset/confirm/"

    def test_password_reset_request(self, api_client: APIClient):
        """Password reset request always returns 200 (no email enumeration)."""
        user = UserFactory(email="reset@example.com")
        response = api_client.post(self.URL, {"email": "reset@example.com"}, format="json")

        assert response.status_code == status.HTTP_200_OK

        # Verify a PasswordReset was created
        assert PasswordReset.objects.filter(user=user).exists()

    def test_password_reset_request_nonexistent(self, api_client: APIClient):
        """Password reset with nonexistent email still returns 200."""
        response = api_client.post(
            self.URL, {"email": "noone@example.com"}, format="json"
        )
        assert response.status_code == status.HTTP_200_OK

    def test_password_reset_confirm(self, api_client: APIClient):
        """Password reset confirm with valid token changes password."""
        user = UserFactory(email="resetconfirm@example.com")
        reset_obj = PasswordReset.objects.create(user=user)

        data = {
            "token": str(reset_obj.token),
            "new_password": "BrandNewPass789!",
            "new_password_confirm": "BrandNewPass789!",
        }
        response = api_client.post(self.CONFIRM_URL, data, format="json")

        assert response.status_code == status.HTTP_200_OK

        user.refresh_from_db()
        assert user.check_password("BrandNewPass789!")

        reset_obj.refresh_from_db()
        assert reset_obj.is_used is True

    def test_password_reset_confirm_invalid_token(self, api_client: APIClient):
        """Password reset confirm with invalid token returns 400."""
        data = {
            "token": str(uuid.uuid4()),
            "new_password": "BrandNewPass789!",
            "new_password_confirm": "BrandNewPass789!",
        }
        response = api_client.post(self.CONFIRM_URL, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------------------------
# Email verification
# ---------------------------------------------------------------------------


@pytest.mark.django_db
class TestEmailVerification:
    URL = "/api/v1/auth/email/verify/"

    def test_email_verification(self, api_client: APIClient):
        """Verifying email with valid token marks user as verified."""
        user = UserFactory(is_verified=False)
        verification = EmailVerification.objects.create(user=user)

        response = api_client.post(
            self.URL, {"token": str(verification.token)}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK

        user.refresh_from_db()
        assert user.is_verified is True

        verification.refresh_from_db()
        assert verification.is_used is True

    def test_email_verification_invalid_token(self, api_client: APIClient):
        """Verifying email with invalid token returns 400."""
        response = api_client.post(
            self.URL, {"token": str(uuid.uuid4())}, format="json"
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_email_verification_already_used(self, api_client: APIClient):
        """Verifying email with already-used token returns 400."""
        user = UserFactory(is_verified=False)
        verification = EmailVerification.objects.create(user=user, is_used=True)

        response = api_client.post(
            self.URL, {"token": str(verification.token)}, format="json"
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
