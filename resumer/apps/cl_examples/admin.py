from __future__ import annotations

from typing import Any

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest

from apps.cl_examples.models import CoverLetterExample
from apps.examples.models import ExampleCategory


# ──────────────────────────── Bulk Actions ────────────────────────────


@admin.action(description="Mark selected cover-letter examples as featured")
def activate_cl_examples(
    modeladmin: admin.ModelAdmin[CoverLetterExample],
    request: HttpRequest,
    queryset: QuerySet[CoverLetterExample],
) -> None:
    queryset.update(is_featured=True)


@admin.action(description="Unmark selected cover-letter examples as featured")
def deactivate_cl_examples(
    modeladmin: admin.ModelAdmin[CoverLetterExample],
    request: HttpRequest,
    queryset: QuerySet[CoverLetterExample],
) -> None:
    queryset.update(is_featured=False)


class ChangeCLCategoryAction:
    """Factory for a bulk action that reassigns cover-letter examples to a given category."""

    @staticmethod
    def make_action(
        category: ExampleCategory,
    ) -> Any:
        def action(
            modeladmin: admin.ModelAdmin[CoverLetterExample],
            request: HttpRequest,
            queryset: QuerySet[CoverLetterExample],
        ) -> None:
            queryset.update(category=category)

        action.__name__ = f"change_cl_category_to_{category.slug}"
        action.short_description = f"Move to category: {category.name}"  # type: ignore[attr-defined]
        return action


# ──────────────────────────── Cover Letter Example Admin ────────────────────────────


@admin.register(CoverLetterExample)
class CoverLetterExampleAdmin(admin.ModelAdmin[CoverLetterExample]):
    """Admin configuration for CoverLetterExample."""

    list_display: list[str] = [
        "title",
        "slug",
        "category",
        "job_title",
        "experience_level",
        "is_featured",
        "views_count",
        "created_at",
    ]
    list_filter: list[str] = [
        "category",
        "experience_level",
        "is_featured",
    ]
    search_fields: list[str] = [
        "title",
        "slug",
        "job_title",
    ]
    prepopulated_fields: dict[str, tuple[str, ...]] = {"slug": ("title",)}
    list_editable: list[str] = ["is_featured"]
    ordering: list[str] = ["-is_featured", "-created_at"]
    readonly_fields: list[str] = ["id", "views_count", "created_at", "updated_at"]
    actions: list[Any] = [activate_cl_examples, deactivate_cl_examples]
    autocomplete_fields: list[str] = ["category", "template"]

    def get_actions(
        self, request: HttpRequest
    ) -> dict[str, tuple[Any, str, str]]:
        """Extend default actions with per-category bulk-move actions."""
        actions = super().get_actions(request)
        for category in ExampleCategory.objects.filter(is_active=True).order_by("order", "name"):
            action_func = ChangeCLCategoryAction.make_action(category)
            name: str = action_func.__name__
            actions[name] = (
                action_func,
                name,
                action_func.short_description,  # type: ignore[attr-defined]
            )
        return actions
