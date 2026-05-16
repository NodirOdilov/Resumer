from __future__ import annotations

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest

from apps.templates_library.models import DocumentTemplate, TemplateColorScheme


class TemplateColorSchemeInline(admin.TabularInline):
    model = TemplateColorScheme
    extra = 1
    fields = (
        "name",
        "primary_color",
        "secondary_color",
        "accent_color",
        "text_color",
        "background_color",
        "is_default",
    )


@admin.register(DocumentTemplate)
class DocumentTemplateAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "skin_id",
        "type",
        "category",
        "is_active",
        "is_new",
        "is_premium",
        "popularity_score",
    )
    list_filter = (
        "type",
        "category",
        "is_active",
        "is_new",
        "is_premium",
    )
    search_fields = ("name", "skin_id", "slug")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-popularity_score",)
    inlines = [TemplateColorSchemeInline]

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "id",
                    "name",
                    "slug",
                    "skin_id",
                    "type",
                    "category",
                    "preview_image",
                ),
            },
        ),
        (
            "Template Files",
            {
                "fields": ("html_template", "css_styles"),
            },
        ),
        (
            "Flags",
            {
                "fields": (
                    "is_active",
                    "is_new",
                    "is_premium",
                    "is_ats_friendly",
                ),
            },
        ),
        (
            "Configuration",
            {
                "fields": (
                    "popularity_score",
                    "supported_sections",
                    "color_schemes",
                    "font_options",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    actions = [
        "toggle_active",
        "toggle_new",
        "toggle_premium",
    ]

    # ------------------------------------------------------------------
    # Bulk actions
    # ------------------------------------------------------------------

    @admin.action(description="Toggle active status")
    def toggle_active(
        self,
        request: HttpRequest,
        queryset: QuerySet[DocumentTemplate],
    ) -> None:
        for template in queryset:
            template.is_active = not template.is_active
            template.save(update_fields=["is_active", "updated_at"])
        self.message_user(request, f"Toggled active status for {queryset.count()} template(s).")

    @admin.action(description="Toggle new status")
    def toggle_new(
        self,
        request: HttpRequest,
        queryset: QuerySet[DocumentTemplate],
    ) -> None:
        for template in queryset:
            template.is_new = not template.is_new
            template.save(update_fields=["is_new", "updated_at"])
        self.message_user(request, f"Toggled new status for {queryset.count()} template(s).")

    @admin.action(description="Toggle premium status")
    def toggle_premium(
        self,
        request: HttpRequest,
        queryset: QuerySet[DocumentTemplate],
    ) -> None:
        for template in queryset:
            template.is_premium = not template.is_premium
            template.save(update_fields=["is_premium", "updated_at"])
        self.message_user(request, f"Toggled premium status for {queryset.count()} template(s).")


@admin.register(TemplateColorScheme)
class TemplateColorSchemeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "template",
        "primary_color",
        "is_default",
    )
    list_filter = ("is_default", "template")
    search_fields = ("name", "template__name")
    readonly_fields = ("id", "created_at", "updated_at")
