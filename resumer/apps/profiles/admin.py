from __future__ import annotations

from typing import Any

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest

from apps.profiles.models import (
    Award,
    Certificate,
    Education,
    Interest,
    Language,
    Project,
    Skill,
    UserProfile,
    Volunteer,
    WorkExperience,
)


# ──────────────────────────── Inlines ────────────────────────────


class EducationInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Education
    extra = 0
    fields = ("institution", "degree", "field_of_study", "start_date", "end_date", "is_current", "gpa", "order")
    ordering = ("order", "-start_date")


class WorkExperienceInline(admin.TabularInline):  # type: ignore[type-arg]
    model = WorkExperience
    extra = 0
    fields = ("company", "position", "location", "start_date", "end_date", "is_current", "order")
    ordering = ("order", "-start_date")


class SkillInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Skill
    extra = 0
    fields = ("name", "level", "category", "order")
    ordering = ("order",)


class LanguageInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Language
    extra = 0
    fields = ("name", "level")


class CertificateInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Certificate
    extra = 0
    fields = ("name", "issuer", "issue_date", "expiry_date", "credential_id")
    ordering = ("-issue_date",)


class ProjectInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Project
    extra = 0
    fields = ("name", "url", "start_date", "end_date")
    ordering = ("-start_date",)


class AwardInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Award
    extra = 0
    fields = ("title", "issuer", "date")
    ordering = ("-date",)


class VolunteerInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Volunteer
    extra = 0
    fields = ("organization", "role", "start_date", "end_date")
    ordering = ("-start_date",)


class InterestInline(admin.TabularInline):  # type: ignore[type-arg]
    model = Interest
    extra = 0
    fields = ("name", "category")


# ──────────────────────────── Profile Admin ────────────────────────────


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("user", "headline", "city", "country", "years_experience", "created_at")
    list_filter = ("country", "industry", "is_deleted")
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "headline",
        "city",
        "country",
        "industry",
    )
    readonly_fields = ("id", "created_at", "updated_at")
    fieldsets = (
        (None, {
            "fields": ("id", "user", "headline", "bio"),
        }),
        ("Contact", {
            "fields": ("phone", "address", "city", "state", "zip_code", "country"),
        }),
        ("Links", {
            "fields": ("linkedin_url", "website_url", "github_url"),
        }),
        ("Professional", {
            "fields": ("years_experience", "industry"),
        }),
        ("Metadata", {
            "fields": ("created_at", "updated_at", "is_deleted", "deleted_at"),
            "classes": ("collapse",),
        }),
    )
    inlines = [
        EducationInline,
        WorkExperienceInline,
        SkillInline,
        LanguageInline,
        CertificateInline,
        ProjectInline,
        AwardInline,
        VolunteerInline,
        InterestInline,
    ]

    def get_queryset(self, request: HttpRequest) -> QuerySet[UserProfile]:
        return UserProfile.all_objects.select_related("user")


# ──────────────────────────── Standalone Admins (optional) ────────────────────────────


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("institution", "degree", "field_of_study", "profile", "start_date", "end_date")
    list_filter = ("degree", "is_current", "is_deleted")
    search_fields = ("institution", "field_of_study", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("company", "position", "profile", "start_date", "end_date", "is_current")
    list_filter = ("is_current", "is_deleted")
    search_fields = ("company", "position", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("name", "level", "category", "profile")
    list_filter = ("category", "level", "is_deleted")
    search_fields = ("name", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("name", "level", "profile")
    list_filter = ("level", "is_deleted")
    search_fields = ("name", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("name", "issuer", "issue_date", "expiry_date", "profile")
    list_filter = ("is_deleted",)
    search_fields = ("name", "issuer", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("name", "profile", "start_date", "end_date")
    list_filter = ("is_deleted",)
    search_fields = ("name", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("title", "issuer", "date", "profile")
    list_filter = ("is_deleted",)
    search_fields = ("title", "issuer", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("organization", "role", "profile", "start_date", "end_date")
    list_filter = ("is_deleted",)
    search_fields = ("organization", "role", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("name", "category", "profile")
    list_filter = ("category", "is_deleted")
    search_fields = ("name", "profile__user__email")
    readonly_fields = ("id", "created_at", "updated_at")
