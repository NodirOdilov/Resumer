"""Tests for the accounts.views module (auth endpoints)."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import UserFactory

User = get_user_model()

REGISTER_URL = "/api/v1/auth/register/"
LOGIN_URL = "/api/v1/auth/login/"
LOGOUT_URL = "/api/v1/auth/logout/"
ME_URL = "/api/v1/auth/me/"
PASSWORD_CHANGE_URL = "/api/v1/auth/password/change/"


@pytest.mark.django_db
class TestRegister:
    """Tests for POST /api/v1/auth/register/."""

    @patch("apps.accounts.signals.send_verification_email.delay")
    @patch("apps.accounts.views.send_verification_email.delay")
    def test_register_success(
        self,
        mock_view_email: Any,
        mock_signal_email: Any,
        api_client: APIClient,
    ) -> None:
        """Successful registration returns 201 with user data and tokens."""
        payload = {
            "email": "newuser@example.com",
            "password": "SecurePass123!",
            "password_confirm": "SecurePass123!",
            "first_name": "New",
            "last_name": "User",
        }
        response = api_client.post(REGISTER_URL, payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["user"]["email"] == "newuser@example.com"
        assert "tokens" in data
        assert "access" in data["tokens"]
        assert "refresh" in data["tokens"]
        assert User.objects.filter(email="newuser@example.com").exists()

    @patch("apps.accounts.signals.send_verification_email.delay")
    @patch("apps.accounts.views.send_verification_email.delay")
    def test_register_duplicate_email(
        self,
        mock_view_email: Any,
        mock_signal_email: Any,
        api_client: APIClient,
    ) -> None:
        """Registration with an existing email returns 400."""
        UserFactory(email="taken@example.com")
        payload = {
            "email": "taken@example.com",
            "password": "SecurePass123!",
            "password_confirm": "SecurePass123!",
            "first_name": "Another",
            "last_name": "User",
        }
        response = api_client.post(REGISTER_URL, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @patch("apps.accounts.signals.send_verification_email.delay")
    def test_register_weak_password(
        self,
        mock_signal_email: Any,
        api_client: APIClient,
    ) -> None:
        """Registration with a weak password returns 400."""
        payload = {
            "email": "weak@example.com",
            "password": "123",
            "password_confirm": "123",
            "first_name": "Weak",
            "last_name": "Pass",
        }
        response = api_client.post(REGISTER_URL, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogin:
    """Tests for POST /api/v1/auth/login/."""

    def test_login_success(self, api_client: APIClient) -> None:
        """Login with correct credentials returns 200 with tokens."""
        user = UserFactory(email="login@example.com", is_verified=True)
        payload = {
            "email": "login@example.com",
            "password": "TestPass123!",
        }
        response = api_client.post(LOGIN_URL, payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "tokens" in data
        assert data["user"]["email"] == "login@example.com"

    def test_login_wrong_password(self, api_client: APIClient) -> None:
        """Login with wrong password returns 401."""
        UserFactory(email="wrong@example.com")
        payload = {
            "email": "wrong@example.com",
            "password": "WrongPassword!",
        }
        response = api_client.post(LOGIN_URL, payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_unverified_email(self, api_client: APIClient) -> None:
        """Login with unverified email still succeeds (verification not blocking login)."""
        UserFactory(email="unverified@example.com", is_verified=False)
        payload = {
            "email": "unverified@example.com",
            "password": "TestPass123!",
        }
        response = api_client.post(LOGIN_URL, payload, format="json")
        # The login view checks is_active, not is_verified
        assert response.status_code == status.HTTP_200_OK

    def test_login_deactivated_user(self, api_client: APIClient) -> None:
        """Login to a deactivated account returns 401 (authenticate returns None)."""
        user = UserFactory(email="deactivated@example.com")
        user.is_active = False
        user.save(update_fields=["is_active"])
        payload = {
            "email": "deactivated@example.com",
            "password": "TestPass123!",
        }
        response = api_client.post(LOGIN_URL, payload, format="json")
        # authenticate() returns None for inactive users via ModelBackend
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestMe:
    """Tests for GET /api/v1/auth/me/."""

    def test_me_authenticated(
        self,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """Authenticated request to /me returns the current user's data."""
        response = authenticated_client.get(ME_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == user.email
        assert data["id"] == str(user.pk)

    def test_me_unauthenticated(self, api_client: APIClient) -> None:
        """Unauthenticated request to /me returns 401."""
        response = api_client.get(ME_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestPasswordChange:
    """Tests for POST /api/v1/auth/password/change/."""

    def test_password_change(
        self,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """Changing password with correct old password succeeds."""
        payload = {
            "old_password": "TestPass123!",
            "new_password": "NewSecure456!",
            "new_password_confirm": "NewSecure456!",
        }
        response = authenticated_client.post(PASSWORD_CHANGE_URL, payload, format="json")
        assert response.status_code == status.HTTP_200_OK

        # Verify the new password works
        user.refresh_from_db()
        assert user.check_password("NewSecure456!")

    def test_password_change_wrong_old(
        self,
        authenticated_client: APIClient,
    ) -> None:
        """Changing password with incorrect old password returns 400."""
        payload = {
            "old_password": "WrongOldPass!",
            "new_password": "NewSecure456!",
            "new_password_confirm": "NewSecure456!",
        }
        response = authenticated_client.post(PASSWORD_CHANGE_URL, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogout:
    """Tests for POST /api/v1/auth/logout/."""

    def test_logout(self, authenticated_client: APIClient, user: Any) -> None:
        """Logout with a valid refresh token returns 200."""
        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        payload = {"refresh": str(refresh)}
        response = authenticated_client.post(LOGOUT_URL, payload, format="json")
        assert response.status_code == status.HTTP_200_OK

    def test_logout_missing_token(self, authenticated_client: APIClient) -> None:
        """Logout without refresh token returns 400."""
        response = authenticated_client.post(LOGOUT_URL, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
