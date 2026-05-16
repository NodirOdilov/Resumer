from __future__ import annotations

from typing import Any

from django.contrib import admin, messages
from django.db.models import QuerySet
from django.http import HttpRequest

from apps.resumes.models import (
    Resume,
    ResumeDownload,
    ResumeSection,
    ResumeVersion,
)


class ResumeVersionInline(admin.TabularInline):  # type: ignore[type-arg]
    model = ResumeVersion
    extra = 0
    readonly_fields = ("id", "version_number", "content", "created_at")
    ordering = ("-version_number",)
    show_change_link = True

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False

    def has_delete_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


class ResumeSectionInline(admin.TabularInline):  # type: ignore[type-arg]
    model = ResumeSection
    extra = 0
    fields = ("section_type", "order", "is_visible", "content")
    ordering = ("order",)
    show_change_link = True


class ResumeDownloadInline(admin.TabularInline):  # type: ignore[type-arg]
    model = ResumeDownload
    extra = 0
    readonly_fields = ("id", "user", "format", "file_url", "file_size", "created_at")
    ordering = ("-created_at",)
    show_change_link = True

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False

    def has_delete_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = (
        "title",
        "user",
        "template",
        "status",
        "language",
        "is_primary",
        "downloads_count",
        "is_deleted",
        "created_at",
        "updated_at",
    )
    list_filter = (
        "status",
        "template",
        "language",
        "is_primary",
        "is_deleted",
    )
    search_fields = (
        "title",
        "slug",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    readonly_fields = (
        "id",
        "slug",
        "downloads_count",
        "last_edited",
        "created_at",
        "updated_at",
        "deleted_at",
    )
    list_select_related = ("user", "template")
    raw_id_fields = ("user", "template")
    date_hierarchy = "created_at"
    ordering = ("-updated_at",)
    inlines = [ResumeSectionInline, ResumeVersionInline, ResumeDownloadInline]
    actions = ["restore_selected", "soft_delete_selected"]

    def get_queryset(self, request: HttpRequest) -> QuerySet[Resume]:
        """Show all objects including soft-deleted ones in admin."""
        return Resume.all_objects.select_related("user", "template")

    @admin.action(description="Restore selected soft-deleted resumes")
    def restore_selected(self, request: HttpRequest, queryset: QuerySet[Resume]) -> None:
        restored_count = 0
        for resume in queryset.filter(is_deleted=True):
            resume.restore()
            restored_count += 1
        self.message_user(
            request,
            f"{restored_count} resume(s) successfully restored.",
            messages.SUCCESS,
        )

    @admin.action(description="Soft-delete selected resumes")
    def soft_delete_selected(self, request: HttpRequest, queryset: QuerySet[Resume]) -> None:
        deleted_count = 0
        for resume in queryset.filter(is_deleted=False):
            resume.soft_delete()
            deleted_count += 1
        self.message_user(
            request,
            f"{deleted_count} resume(s) soft-deleted.",
            messages.SUCCESS,
        )


@admin.register(ResumeVersion)
class ResumeVersionAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("resume", "version_number", "created_at")
    list_filter = ("created_at",)
    search_fields = ("resume__title",)
    readonly_fields = ("id", "resume", "version_number", "content", "created_at")
    list_select_related = ("resume",)
    ordering = ("-created_at",)

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False


@admin.register(ResumeSection)
class ResumeSectionAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("resume", "section_type", "order", "is_visible")
    list_filter = ("section_type", "is_visible")
    search_fields = ("resume__title",)
    list_select_related = ("resume",)
    ordering = ("resume", "order")


@admin.register(ResumeDownload)
class ResumeDownloadAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("resume", "user", "format", "file_size", "created_at")
    list_filter = ("format", "created_at")
    search_fields = ("resume__title", "user__email")
    readonly_fields = ("id", "resume", "user", "format", "file_url", "file_size", "created_at")
    list_select_related = ("resume", "user")
    ordering = ("-created_at",)

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False
