"""Тесты сервиса организаций."""

import pytest
from django.contrib.auth import get_user_model

from apps.organizations.models import OrganizationRole
from apps.organizations.services import OrganizationService

User = get_user_model()


@pytest.mark.django_db
class TestOrganizationService:
    def test_create_organization(self):
        user = User.objects.create_user(email="owner@test.com", password="pass12345")
        org = OrganizationService.create_organization(
            name="Test Corp",
            slug="test-corp",
            owner=user,
        )
        assert org.name == "Test Corp"
        assert org.members.filter(user=user, role=OrganizationRole.OWNER).exists()
