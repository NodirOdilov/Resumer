from __future__ import annotations

from typing import Any

from django.contrib import admin, messages
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils import timezone
from django.utils.html import format_html
from django.utils.safestring import SafeString

from apps.content.models import Article, ArticleCategory, Author, Tag


# ──────────────────── ArticleCategory ─────────────────────


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin[ArticleCategory]):
    list_display = ["name", "slug", "parent", "order", "is_active", "created_at"]
    list_filter = ["is_active", "parent"]
    list_editable = ["order", "is_active"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["order", "name"]


# ──────────────────────── Tag ─────────────────────────────


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin[Tag]):
    list_display = ["name", "slug"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


# ─────────────────────── Author ───────────────────────────


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin[Author]):
    list_display = [
        "name",
        "slug",
        "title",
        "is_cprw_certified",
        "articles_count",
        "photo_preview",
        "created_at",
    ]
    list_filter = ["is_cprw_certified"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ["photo_preview_large", "articles_count", "created_at", "updated_at"]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "slug",
                    "title",
                    "bio",
                    "is_cprw_certified",
                ),
            },
        ),
        (
            "Photo",
            {
                "fields": ("photo", "photo_preview_large"),
            },
        ),
        (
            "Links",
            {
                "fields": ("linkedin_url",),
            },
        ),
        (
            "Stats & Timestamps",
            {
                "fields": ("articles_count", "created_at", "updated_at"),
            },
        ),
    )

    @admin.display(description="Photo")
    def photo_preview(self, obj: Author) -> SafeString | str:
        if obj.photo:
            return format_html(
                '<img src="{}" style="width:40px;height:40px;object-fit:cover;border-radius:50%;" />',
                obj.photo.url,
            )
        return "-"

    @admin.display(description="Photo preview")
    def photo_preview_large(self, obj: Author) -> SafeString | str:
        if obj.photo:
            return format_html(
                '<img src="{}" style="max-width:200px;max-height:200px;border-radius:8px;" />',
                obj.photo.url,
            )
        return "No photo uploaded."


# ─────────────────────── Article ──────────────────────────


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin[Article]):
    list_display = [
        "title",
        "author",
        "category",
        "status",
        "is_featured",
        "publish_at",
        "views_count",
        "reading_time",
        "created_at",
    ]
    list_filter = [
        "status",
        "is_featured",
        "category",
        "author",
        "tags",
        "created_at",
        "publish_at",
    ]
    list_editable = ["status", "is_featured"]
    search_fields = ["title", "slug", "excerpt", "content"]
    prepopulated_fields = {"slug": ("title",)}
    raw_id_fields = ["author", "category"]
    filter_horizontal = ["tags"]
    date_hierarchy = "created_at"
    readonly_fields = ["views_count", "created_at", "updated_at"]
    actions = ["make_published", "make_draft", "make_archived"]

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "slug",
                    "author",
                    "category",
                    "tags",
                    "status",
                    "publish_at",
                    "is_featured",
                ),
            },
        ),
        (
            "Content",
            {
                "fields": ("content", "excerpt", "featured_image", "reading_time"),
                "classes": ("wide",),
            },
        ),
        (
            "SEO",
            {
                "fields": (
                    "meta_title",
                    "meta_description",
                    "canonical_url",
                    "faq",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Metrics & Timestamps",
            {
                "fields": ("views_count", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def get_queryset(self, request: HttpRequest) -> QuerySet[Article]:
        return (
            super()
            .get_queryset(request)
            .select_related("author", "category")
            .prefetch_related("tags")
        )

    # ── Bulk actions ──────────────────────────────────────

    @admin.action(description="Publish selected articles")
    def make_published(
        self,
        request: HttpRequest,
        queryset: QuerySet[Article],
    ) -> None:
        now = timezone.now()
        updated = queryset.update(
            status=Article.Status.PUBLISHED,
            publish_at=now,
        )
        messages.success(
            request,
            f"{updated} article(s) successfully published.",
        )

    @admin.action(description="Revert selected articles to draft")
    def make_draft(
        self,
        request: HttpRequest,
        queryset: QuerySet[Article],
    ) -> None:
        updated = queryset.update(status=Article.Status.DRAFT)
        messages.success(
            request,
            f"{updated} article(s) reverted to draft.",
        )

    @admin.action(description="Archive selected articles")
    def make_archived(
        self,
        request: HttpRequest,
        queryset: QuerySet[Article],
    ) -> None:
        updated = queryset.update(status=Article.Status.ARCHIVED)
        messages.success(
            request,
            f"{updated} article(s) archived.",
        )
