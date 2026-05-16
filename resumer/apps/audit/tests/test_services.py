"""Тесты сервиса аудита."""

import pytest

from apps.audit.models import AuditAction, AuditLog
from apps.audit.services import AuditService


@pytest.mark.django_db
class TestAuditService:
    def test_log_create(self):
        entry = AuditService.log_create(
            user=None,
            resource_type="resume",
            resource_id="test-uuid",
            description="Тестовое создание",
        )
        assert entry.action == AuditAction.CREATE
        assert AuditLog.objects.count() == 1

    def test_log_update_with_changes(self):
        entry = AuditService.log_update(
            user=None,
            resource_type="resume",
            resource_id="test-uuid",
            changes={"title": {"old": "A", "new": "B"}},
        )
        assert entry.changes["title"]["new"] == "B"
