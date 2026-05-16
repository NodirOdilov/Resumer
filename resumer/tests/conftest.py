"""Shared pytest fixtures for the Resumer test suite."""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories import (
    ArticleCategoryFactory,
    ArticleFactory,
    AuthorFactory,
    CoverLetterFactory,
    CVFactory,
    DocumentTemplateFactory,
    ExampleCategoryFactory,
    ResumeFactory,
    SubscriptionFactory,
    UserFactory,
    UserProfileFactory,
)

if TYPE_CHECKING:
    from apps.accounts.models import User
    from apps.cover_letters.models import CoverLetter
    from apps.cvs.models import CV
    from apps.profiles.models import UserProfile
    from apps.resumes.models import Resume
    from apps.templates_library.models import DocumentTemplate


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


@pytest.fixture()
def user(db: None) -> User:
    """Return a regular verified user."""
    return UserFactory(is_verified=True)


@pytest.fixture()
def premium_user(db: None) -> User:
    """Return a verified user with active premium subscription."""
    return UserFactory(is_verified=True, is_premium=True)


@pytest.fixture()
def admin_user(db: None) -> User:
    """Return a superuser."""
    return UserFactory(
        is_verified=True,
        is_staff=True,
        is_superuser=True,
    )


@pytest.fixture()
def superadmin(db: None) -> User:
    """Alias for admin_user -- Return a superuser."""
    return UserFactory(
        is_verified=True,
        is_staff=True,
        is_superuser=True,
    )


# ---------------------------------------------------------------------------
# API Clients
# ---------------------------------------------------------------------------


@pytest.fixture()
def api_client() -> APIClient:
    """Return an unauthenticated DRF APIClient."""
    return APIClient()


@pytest.fixture()
def authenticated_client(user: User) -> APIClient:
    """Return a DRF APIClient authenticated via JWT for the regular user."""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.fixture()
def premium_client(premium_user: User) -> APIClient:
    """Return a DRF APIClient authenticated via JWT for the premium user."""
    client = APIClient()
    refresh = RefreshToken.for_user(premium_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.fixture()
def admin_client(admin_user: User) -> APIClient:
    """Return a DRF APIClient authenticated via JWT for the admin user."""
    client = APIClient()
    refresh = RefreshToken.for_user(admin_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


# ---------------------------------------------------------------------------
# Profiles
# ---------------------------------------------------------------------------


@pytest.fixture()
def profile(user: User) -> UserProfile:
    """Return a UserProfile for the regular user."""
    return UserProfileFactory(user=user)


# ---------------------------------------------------------------------------
# Domain objects
# ---------------------------------------------------------------------------


@pytest.fixture()
def template(db: None) -> DocumentTemplate:
    """Return a sample DocumentTemplate."""
    return DocumentTemplateFactory()


@pytest.fixture()
def resume(user: User, template: DocumentTemplate) -> Resume:
    """Return a sample Resume belonging to ``user``."""
    return ResumeFactory(user=user, template=template)


@pytest.fixture()
def cover_letter(user: User, template: DocumentTemplate) -> CoverLetter:
    """Return a sample CoverLetter belonging to ``user``."""
    return CoverLetterFactory(user=user, template=template)


@pytest.fixture()
def cv(user: User, template: DocumentTemplate) -> CV:
    """Return a sample CV belonging to ``user``."""
    return CVFactory(user=user, template=template)
