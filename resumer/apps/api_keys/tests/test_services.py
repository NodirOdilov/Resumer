"""Тесты сервиса API-ключей."""

import pytest
from django.contrib.auth import get_user_model

from apps.api_keys.services import APIKeyService

User = get_user_model()


@pytest.mark.django_db
class TestAPIKeyService:
    def test_generate_and_authenticate(self):
        user = User.objects.create_user(email="api@test.com", password="pass12345")
        api_key, raw_key = APIKeyService.generate_key(user, "Test Key", scopes=["read"])
        assert api_key.prefix in raw_key

        authenticated = APIKeyService.authenticate(raw_key)
        assert authenticated is not None
        assert authenticated.user_id == user.pk

    def test_invalid_key_returns_none(self):
        assert APIKeyService.authenticate("invalid-key") is None
