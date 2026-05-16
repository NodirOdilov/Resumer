from __future__ import annotations

from typing import Any

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest

from apps.examples.models import ExampleCategory, ResumeExample


# ──────────────────────────── Category Admin ────────────────────────────


@admin.register(ExampleCategory)
class ExampleCategoryAdmin(admin.ModelAdmin[ExampleCategory]):
    """Admin configuration for ExampleCategory."""

    list_display: list[str] = [
        "name",
        "slug",
        "icon",
        "order",
        "parent",
        "is_active",
        "created_at",
    ]
    list_filter: list[str] = ["is_active", "parent"]
    search_fields: list[str] = ["name", "slug", "description"]
    prepopulated_fields: dict[str, tuple[str, ...]] = {"slug": ("name",)}
    list_editable: list[str] = ["order", "is_active"]
    ordering: list[str] = ["order", "name"]
    readonly_fields: list[str] = ["id", "created_at", "updated_at"]


# ──────────────────────────── Bulk Actions ────────────────────────────


@admin.action(description="Activate selected resume examples")
def activate_examples(
    modeladmin: admin.ModelAdmin[ResumeExample],
    request: HttpRequest,
    queryset: QuerySet[ResumeExample],
) -> None:
    queryset.update(is_featured=True)


@admin.action(description="Deactivate selected resume examples")
def deactivate_examples(
    modeladmin: admin.ModelAdmin[ResumeExample],
    request: HttpRequest,
    queryset: QuerySet[ResumeExample],
) -> None:
    queryset.update(is_featured=False)


class ChangeCategoryAction:
    """Factory for a bulk action that reassigns examples to a given category."""

    @staticmethod
    def make_action(
        category: ExampleCategory,
    ) -> Any:
        def action(
            modeladmin: admin.ModelAdmin[ResumeExample],
            request: HttpRequest,
            queryset: QuerySet[ResumeExample],
        ) -> None:
            queryset.update(category=category)

        action.__name__ = f"change_category_to_{category.slug}"
        action.short_description = f"Move to category: {category.name}"  # type: ignore[attr-defined]
        return action


# ──────────────────────────── Resume Example Admin ────────────────────────────


@admin.register(ResumeExample)
class ResumeExampleAdmin(admin.ModelAdmin[ResumeExample]):
    """Admin configuration for ResumeExample."""

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
        "industry",
    ]
    prepopulated_fields: dict[str, tuple[str, ...]] = {"slug": ("title",)}
    list_editable: list[str] = ["is_featured"]
    ordering: list[str] = ["-is_featured", "-created_at"]
    readonly_fields: list[str] = ["id", "views_count", "created_at", "updated_at"]
    actions: list[Any] = [activate_examples, deactivate_examples]
    autocomplete_fields: list[str] = ["category", "template"]

    def get_actions(
        self, request: HttpRequest
    ) -> dict[str, tuple[Any, str, str]]:
        """Extend default actions with per-category bulk-move actions."""
        actions = super().get_actions(request)
        for category in ExampleCategory.objects.filter(is_active=True).order_by("order", "name"):
            action_func = ChangeCategoryAction.make_action(category)
            name: str = action_func.__name__
            actions[name] = (
                action_func,
                name,
                action_func.short_description,  # type: ignore[attr-defined]
            )
        return actions
