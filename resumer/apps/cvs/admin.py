from __future__ import annotations

from typing import Any

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils.html import format_html

from apps.cvs.models import CV, CVDownload, CVSection, CVVersion


class CVVersionInline(admin.TabularInline):
    model = CVVersion
    extra = 0
    readonly_fields = ["id", "version_number", "content", "created_at"]
    ordering = ["-version_number"]

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


class CVSectionInline(admin.TabularInline):
    model = CVSection
    extra = 0
    fields = ["section_type", "order", "is_visible", "content"]
    ordering = ["order"]


class CVDownloadInline(admin.TabularInline):
    model = CVDownload
    extra = 0
    readonly_fields = ["id", "user", "format", "file_url", "file_size", "created_at"]
    ordering = ["-created_at"]

    def has_add_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "user",
        "status_badge",
        "language",
        "sections_count",
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
    raw_id_fields = ["user", "template"]
    inlines = [CVSectionInline, CVVersionInline, CVDownloadInline]
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
                "fields": ("template",),
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

    def get_queryset(self, request: HttpRequest) -> QuerySet[CV]:
        return CV.all_objects.select_related("user", "template").prefetch_related("sections")

    @admin.display(description="Status")
    def status_badge(self, obj: CV) -> str:
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

    @admin.display(description="Sections")
    def sections_count(self, obj: CV) -> int:
        return obj.sections.count()

    @admin.action(description="Soft-delete selected CVs")
    def soft_delete_selected(self, request: HttpRequest, queryset: QuerySet[CV]) -> None:
        for obj in queryset:
            obj.soft_delete()
        self.message_user(request, f"{queryset.count()} CV(s) soft-deleted.")

    @admin.action(description="Restore selected CVs")
    def restore_selected(self, request: HttpRequest, queryset: QuerySet[CV]) -> None:
        for obj in queryset:
            obj.restore()
        self.message_user(request, f"{queryset.count()} CV(s) restored.")

    @admin.action(description="Hard-delete selected CVs (PERMANENT)")
    def hard_delete_selected(self, request: HttpRequest, queryset: QuerySet[CV]) -> None:
        count = queryset.count()
        for obj in queryset:
            obj.hard_delete()
        self.message_user(request, f"{count} CV(s) permanently deleted.")


@admin.register(CVVersion)
class CVVersionAdmin(admin.ModelAdmin):
    list_display = ["cv", "version_number", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["cv__title"]
    readonly_fields = ["id", "cv", "version_number", "content", "created_at"]
    ordering = ["-created_at"]
    list_per_page = 50

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False


@admin.register(CVSection)
class CVSectionAdmin(admin.ModelAdmin):
    list_display = ["cv", "section_type", "order", "is_visible"]
    list_filter = ["section_type", "is_visible"]
    search_fields = ["cv__title"]
    list_editable = ["order", "is_visible"]
    raw_id_fields = ["cv"]
    ordering = ["cv", "order"]
    list_per_page = 50


@admin.register(CVDownload)
class CVDownloadAdmin(admin.ModelAdmin):
    list_display = ["cv", "user", "format", "file_size", "created_at"]
    list_filter = ["format", "created_at"]
    search_fields = ["cv__title", "user__email"]
    readonly_fields = ["id", "cv", "user", "format", "file_url", "file_size", "created_at"]
    ordering = ["-created_at"]
    list_per_page = 50

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Any = None) -> bool:
        return False
