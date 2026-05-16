"""Тесты сервиса feature flags."""

import pytest

from apps.feature_flags.models import FeatureFlag
from apps.feature_flags.services import FeatureFlagService


@pytest.mark.django_db
class TestFeatureFlagService:
    def test_flag_disabled(self):
        FeatureFlag.objects.create(key="test_flag", name="Test", is_enabled=False)
        assert FeatureFlagService.is_enabled("test_flag") is False

    def test_flag_enabled_full_rollout(self):
        FeatureFlag.objects.create(
            key="test_on",
            name="Test ON",
            is_enabled=True,
            rollout_percentage=100,
        )
        assert FeatureFlagService.is_enabled("test_on") is True

    def test_flag_missing_returns_false(self):
        assert FeatureFlagService.is_enabled("nonexistent") is False
