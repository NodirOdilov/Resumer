from __future__ import annotations

from typing import Any

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils.html import format_html

from apps.cover_letters.models import CoverLetter, CoverLetterDownload, CoverLetterVersion


class CoverLetterVersionInline(admin.TabularInline):
    model = CoverLetterVersion
    extra = 0
    readonly_fields = ["id", "version_number", "content", "created_at"]
    ordering = ["-version_number"]

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


class CoverLetterDownloadInline(admin.TabularInline):
    model = CoverLetterDownload
    extra = 0
    readonly_fields = ["id", "user", "format", "file_url", "file_size", "created_at"]
    ordering = ["-created_at"]

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


@admin.register(CoverLetter)
class CoverLetterAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "user",
        "status_badge",
        "language",
        "downloads_count",
        "is_deleted",
        "last_edited",
        "created_at",
    ]
    list_filter = [
        "status",
        "language",
        "is_deleted",
        "created_at",
    ]
    search_fields = [
        "title",
        "slug",
        "user__email",
    ]
    readonly_fields = [
        "id",
        "slug",
        "downloads_count",
        "last_edited",
        "created_at",
        "updated_at",
        "deleted_at",
    ]
    list_select_related = ["user", "template"]
    raw_id_fields = ["user", "template", "resume"]
    inlines = [CoverLetterVersionInline, CoverLetterDownloadInline]
    ordering = ["-created_at"]
    list_per_page = 25
    date_hierarchy = "created_at"
    actions = ["soft_delete_selected", "restore_selected", "hard_delete_selected"]

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "id",
                    "user",
                    "title",
                    "slug",
                    "status",
                    "language",
                ),
            },
        ),
        (
            "Relations",
            {
                "fields": ("template", "resume"),
            },
        ),
        (
            "Content",
            {
                "classes": ("collapse",),
                "fields": ("content", "settings"),
            },
        ),
        (
            "Metadata",
            {
                "fields": (
                    "downloads_count",
                    "last_edited",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
        (
            "Soft Delete",
            {
                "fields": ("is_deleted", "deleted_at"),
            },
        ),
    )

    def get_queryset(self, request: HttpRequest) -> QuerySet[CoverLetter]:
        return CoverLetter.all_objects.select_related("user", "template")

    @admin.display(description="Status")
    def status_badge(self, obj: CoverLetter) -> str:
        colours: dict[str, str] = {
            "draft": "#999",
            "complete": "#28a745",
            "downloaded": "#007bff",
        }
        colour = colours.get(obj.status, "#999")
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;">{}</span>',
            colour,
            obj.get_status_display(),
        )

    @admin.action(description="Soft-delete selected cover letters")
    def soft_delete_selected(self, request: HttpRequest, queryset: QuerySet[CoverLetter]) -> None:
        for obj in queryset:
            obj.soft_delete()
        self.message_user(request, f"{queryset.count()} cover letter(s) soft-deleted.")

    @admin.action(description="Restore selected cover letters")
    def restore_selected(self, request: HttpRequest, queryset: QuerySet[CoverLetter]) -> None:
        for obj in queryset:
            obj.restore()
        self.message_user(request, f"{queryset.count()} cover letter(s) restored.")

    @admin.action(description="Hard-delete selected cover letters (PERMANENT)")
    def hard_delete_selected(self, request: HttpRequest, queryset: QuerySet[CoverLetter]) -> None:
        count = queryset.count()
        for obj in queryset:
            obj.hard_delete()
        self.message_user(request, f"{count} cover letter(s) permanently deleted.")


@admin.register(CoverLetterVersion)
class CoverLetterVersionAdmin(admin.ModelAdmin):
    list_display = ["cover_letter", "version_number", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["cover_letter__title"]
    readonly_fields = ["id", "cover_letter", "version_number", "content", "created_at"]
    ordering = ["-created_at"]
    list_per_page = 50

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


@admin.register(CoverLetterDownload)
class CoverLetterDownloadAdmin(admin.ModelAdmin):
    list_display = ["cover_letter", "user", "format", "file_size", "created_at"]
    list_filter = ["format", "created_at"]
    search_fields = ["cover_letter__title", "user__email"]
    readonly_fields = ["id", "cover_letter", "user", "format", "file_url", "file_size", "created_at"]
    ordering = ["-created_at"]
    list_per_page = 50

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False
