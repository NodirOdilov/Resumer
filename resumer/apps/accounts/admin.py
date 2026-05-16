from __future__ import annotations

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from apps.accounts.models import (
    EmailVerification,
    LoginHistory,
    OAuthConnection,
    PasswordReset,
    User,
)


# ---------------------------------------------------------------------------
# Inlines
# ---------------------------------------------------------------------------

class OAuthConnectionInline(admin.TabularInline):
    model = OAuthConnection
    extra = 0
    readonly_fields = ("provider", "provider_uid", "created_at")
    fields = ("provider", "provider_uid", "created_at")


class LoginHistoryInline(admin.TabularInline):
    model = LoginHistory
    extra = 0
    readonly_fields = ("ip_address", "user_agent", "device_type", "country", "created_at")
    fields = ("ip_address", "device_type", "country", "created_at")
    ordering = ("-created_at",)
    max_num = 20


# ---------------------------------------------------------------------------
# User admin
# ---------------------------------------------------------------------------

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "is_verified",
        "is_premium",
        "language",
        "country",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_filter = (
        "is_premium",
        "is_verified",
        "is_active",
        "is_staff",
        "is_superuser",
        "is_deleted",
        "language",
        "country",
    )
    search_fields = ("email", "first_name", "last_name")
    ordering = ("-created_at",)
    readonly_fields = ("id", "created_at", "updated_at", "last_login", "last_login_ip", "date_joined")

    inlines = [OAuthConnectionInline, LoginHistoryInline]

    fieldsets = (
        (None, {"fields": ("id", "email", "password")}),
        (
            _("Personal info"),
            {"fields": ("first_name", "last_name", "avatar")},
        ),
        (
            _("Preferences"),
            {"fields": ("language", "country", "timezone")},
        ),
        (
            _("Subscription"),
            {"fields": ("is_premium", "premium_until")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_verified",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (
            _("Soft delete"),
            {"fields": ("is_deleted", "deleted_at")},
        ),
        (
            _("Important dates"),
            {"fields": ("last_login", "last_login_ip", "date_joined", "created_at", "updated_at")},
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


# ---------------------------------------------------------------------------
# Supporting models
# ---------------------------------------------------------------------------

@admin.register(OAuthConnection)
class OAuthConnectionAdmin(admin.ModelAdmin):
    list_display = ("user", "provider", "provider_uid", "created_at")
    list_filter = ("provider",)
    search_fields = ("user__email", "provider_uid")
    raw_id_fields = ("user",)
    readonly_fields = ("created_at",)


@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ("user", "token", "is_used", "expires_at", "created_at")
    list_filter = ("is_used",)
    search_fields = ("user__email",)
    raw_id_fields = ("user",)
    readonly_fields = ("token", "created_at")


@admin.register(PasswordReset)
class PasswordResetAdmin(admin.ModelAdmin):
    list_display = ("user", "token", "is_used", "expires_at", "created_at")
    list_filter = ("is_used",)
    search_fields = ("user__email",)
    raw_id_fields = ("user",)
    readonly_fields = ("token", "created_at")


@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "ip_address", "device_type", "country", "created_at")
    list_filter = ("device_type", "country")
    search_fields = ("user__email", "ip_address")
    raw_id_fields = ("user",)
    readonly_fields = ("ip_address", "user_agent", "device_type", "country", "created_at")
    date_hierarchy = "created_at"
