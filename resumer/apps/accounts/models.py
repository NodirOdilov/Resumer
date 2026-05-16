from __future__ import annotations

import uuid
from datetime import timedelta
from typing import Any

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.accounts.managers import CustomUserManager
from apps.core.models import TimestampMixin


# ---------------------------------------------------------------------------
# Language choices (sourced from settings.LANGUAGES)
# ---------------------------------------------------------------------------

LANGUAGE_CHOICES: list[tuple[str, str]] = [
    ("en-us", _("English (US)")),
    ("en-gb", _("English (UK)")),
    ("en-in", _("English (IN)")),
    ("de", _("Deutsch")),
    ("fr", _("Français")),
    ("es", _("Español")),
    ("it", _("Italiano")),
    ("pt-br", _("Português (BR)")),
    ("ru", _("Русский")),
    ("tr", _("Türkçe")),
    ("uz", _("Oʻzbekcha")),
]


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------

class User(AbstractUser):
    """Custom user model with email as the primary login field."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )

    # Remove the default username field
    username = None  # type: ignore[assignment]

    email = models.EmailField(
        _("email address"),
        unique=True,
        db_index=True,
    )
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)

    # Verification & premium
    is_verified = models.BooleanField(
        _("verified"),
        default=False,
        help_text=_("Designates whether the user has verified their email."),
    )
    is_premium = models.BooleanField(
        _("premium"),
        default=False,
        help_text=_("Designates whether the user has an active premium subscription."),
    )
    premium_until = models.DateTimeField(
        _("premium until"),
        null=True,
        blank=True,
        help_text=_("Premium subscription expiration date."),
    )

    # Preferences
    language = models.CharField(
        _("language"),
        max_length=10,
        choices=LANGUAGE_CHOICES,
        default="en-us",
        db_index=True,
    )
    country = models.CharField(
        _("country"),
        max_length=100,
        blank=True,
        default="",
    )
    timezone = models.CharField(
        _("timezone"),
        max_length=63,
        blank=True,
        default="UTC",
    )
    avatar = models.ImageField(
        _("avatar"),
        upload_to="avatars/%Y/%m/",
        blank=True,
        default="",
    )

    # 2FA (TOTP)
    is_2fa_enabled = models.BooleanField(
        _("2FA enabled"),
        default=False,
        help_text=_("Whether two-factor authentication is enabled."),
    )
    totp_secret = models.CharField(
        _("TOTP secret"),
        max_length=64,
        blank=True,
        default="",
        help_text=_("Base32-encoded TOTP secret key."),
    )

    # Soft delete
    is_deleted = models.BooleanField(
        _("deleted"),
        default=False,
        db_index=True,
    )
    deleted_at = models.DateTimeField(
        _("deleted at"),
        null=True,
        blank=True,
    )

    # Timestamps
    created_at = models.DateTimeField(_("created at"), auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(_("updated at"), auto_now=True)

    # Tracking
    last_login_ip = models.GenericIPAddressField(
        _("last login IP"),
        null=True,
        blank=True,
    )

    USERNAME_FIELD: str = "email"
    REQUIRED_FIELDS: list[str] = ["first_name", "last_name"]

    objects = CustomUserManager()  # type: ignore[assignment]

    class Meta:
        db_table = "accounts_user"
        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email"], name="idx_user_email"),
            models.Index(fields=["is_premium"], name="idx_user_premium"),
            models.Index(fields=["is_verified"], name="idx_user_verified"),
            models.Index(fields=["language"], name="idx_user_language"),
            models.Index(fields=["country"], name="idx_user_country"),
        ]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_premium_active(self) -> bool:
        """Return True if the user has a currently-active premium subscription."""
        if not self.is_premium:
            return False
        if self.premium_until is None:
            return True
        return self.premium_until > timezone.now()

    def soft_delete(self) -> None:
        """Mark the user as deleted without removing the database row."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save(update_fields=["is_deleted", "deleted_at", "is_active", "updated_at"])

    def restore(self) -> None:
        """Restore a soft-deleted user."""
        self.is_deleted = False
        self.deleted_at = None
        self.is_active = True
        self.save(update_fields=["is_deleted", "deleted_at", "is_active", "updated_at"])


# ---------------------------------------------------------------------------
# OAuth
# ---------------------------------------------------------------------------

class OAuthProvider(models.TextChoices):
    GOOGLE = "google", _("Google")
    LINKEDIN = "linkedin", _("LinkedIn")
    GITHUB = "github", _("GitHub")


class OAuthConnection(TimestampMixin):
    """Stores third-party OAuth provider connections for a user."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="oauth_connections",
        verbose_name=_("user"),
    )
    provider = models.CharField(
        _("provider"),
        max_length=20,
        choices=OAuthProvider.choices,
        db_index=True,
    )
    provider_uid = models.CharField(
        _("provider UID"),
        max_length=255,
    )
    access_token = models.TextField(
        _("access token (encrypted)"),
        blank=True,
        default="",
        help_text=_("Encrypted OAuth access token."),
    )
    refresh_token = models.TextField(
        _("refresh token"),
        blank=True,
        default="",
    )

    class Meta:
        db_table = "accounts_oauth_connection"
        verbose_name = _("OAuth connection")
        verbose_name_plural = _("OAuth connections")
        ordering = ["-created_at"]
        unique_together = [("provider", "provider_uid")]
        indexes = [
            models.Index(fields=["user", "provider"], name="idx_oauth_user_provider"),
        ]

    def __str__(self) -> str:
        return f"{self.user.email} – {self.get_provider_display()}"


# ---------------------------------------------------------------------------
# Email Verification
# ---------------------------------------------------------------------------

def _default_email_verification_expiry() -> Any:
    return timezone.now() + timedelta(hours=24)


class EmailVerification(models.Model):
    """Stores email verification tokens."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verifications",
        verbose_name=_("user"),
    )
    token = models.UUIDField(
        _("token"),
        default=uuid.uuid4,
        unique=True,
        db_index=True,
    )
    is_used = models.BooleanField(_("used"), default=False)
    expires_at = models.DateTimeField(
        _("expires at"),
        default=_default_email_verification_expiry,
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        db_table = "accounts_email_verification"
        verbose_name = _("email verification")
        verbose_name_plural = _("email verifications")
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Verification for {self.user.email} ({self.token})"

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @property
    def is_valid(self) -> bool:
        return not self.is_used and not self.is_expired


# ---------------------------------------------------------------------------
# Password Reset
# ---------------------------------------------------------------------------

def _default_password_reset_expiry() -> Any:
    return timezone.now() + timedelta(hours=1)


class PasswordReset(models.Model):
    """Stores password reset tokens."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_resets",
        verbose_name=_("user"),
    )
    token = models.UUIDField(
        _("token"),
        default=uuid.uuid4,
        unique=True,
        db_index=True,
    )
    is_used = models.BooleanField(_("used"), default=False)
    expires_at = models.DateTimeField(
        _("expires at"),
        default=_default_password_reset_expiry,
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        db_table = "accounts_password_reset"
        verbose_name = _("password reset")
        verbose_name_plural = _("password resets")
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Password reset for {self.user.email} ({self.token})"

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @property
    def is_valid(self) -> bool:
        return not self.is_used and not self.is_expired


# ---------------------------------------------------------------------------
# Login History
# ---------------------------------------------------------------------------

class DeviceType(models.TextChoices):
    DESKTOP = "desktop", _("Desktop")
    MOBILE = "mobile", _("Mobile")
    TABLET = "tablet", _("Tablet")


class LoginHistory(models.Model):
    """Tracks user login events."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("ID"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="login_history",
        verbose_name=_("user"),
    )
    ip_address = models.GenericIPAddressField(
        _("IP address"),
        null=True,
        blank=True,
    )
    user_agent = models.TextField(
        _("user agent"),
        blank=True,
        default="",
    )
    device_type = models.CharField(
        _("device type"),
        max_length=10,
        choices=DeviceType.choices,
        default=DeviceType.DESKTOP,
        db_index=True,
    )
    country = models.CharField(
        _("country"),
        max_length=100,
        blank=True,
        default="",
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True, db_index=True)

    class Meta:
        db_table = "accounts_login_history"
        verbose_name = _("login history entry")
        verbose_name_plural = _("login history")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"], name="idx_login_user_date"),
        ]

    def __str__(self) -> str:
        return f"{self.user.email} – {self.ip_address} ({self.created_at:%Y-%m-%d %H:%M})"
