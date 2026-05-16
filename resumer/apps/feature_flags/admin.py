"""Административная панель feature flags."""

from django.contrib import admin

from apps.feature_flags.models import FeatureFlag
from apps.feature_flags.services import FeatureFlagService


@admin.register(FeatureFlag)
class FeatureFlagAdmin(admin.ModelAdmin):
    """Управление функциональными флагами."""

    list_display = ["key", "name", "is_enabled", "rollout_percentage", "updated_at"]
    list_filter = ["is_enabled"]
    search_fields = ["key", "name"]
    readonly_fields = ["id", "created_at", "updated_at"]

    def save_model(self, request, obj, form, change) -> None:
        super().save_model(request, obj, form, change)
        FeatureFlagService.invalidate_cache(obj.key)
