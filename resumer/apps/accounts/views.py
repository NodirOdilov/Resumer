from __future__ import annotations

import logging
from typing import Any

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import (
    DeviceType,
    EmailVerification,
    LoginHistory,
    OAuthConnection,
    OAuthProvider,
    PasswordReset,
)
from apps.accounts.serializers import (
    AdminUserSerializer,
    EmailVerificationSerializer,
    LoginSerializer,
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
)
from apps.accounts.tasks import send_password_reset_email, send_verification_email

logger = logging.getLogger(__name__)

User = get_user_model()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_client_ip(request: Request) -> str | None:
    """Extract the client IP address from the request."""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _detect_device_type(user_agent: str) -> str:
    """Naive device detection based on User-Agent string."""
    ua_lower = user_agent.lower()
    if any(kw in ua_lower for kw in ("mobile", "android", "iphone")):
        return DeviceType.MOBILE
    if any(kw in ua_lower for kw in ("tablet", "ipad")):
        return DeviceType.TABLET
    return DeviceType.DESKTOP


def _get_tokens_for_user(user: Any) -> dict[str, str]:
    """Generate JWT access/refresh pair for the given user."""
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def _record_login(request: Request, user: Any) -> None:
    """Create a LoginHistory entry and update the user's last_login_ip."""
    ip = _get_client_ip(request)
    ua = request.META.get("HTTP_USER_AGENT", "")
    LoginHistory.objects.create(
        user=user,
        ip_address=ip,
        user_agent=ua,
        device_type=_detect_device_type(ua),
    )
    if ip:
        User.objects.filter(pk=user.pk).update(last_login_ip=ip)


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

class RegisterView(generics.CreateAPIView):
    """POST /api/v1/auth/register/ -- create a new user account."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Queue verification email
        send_verification_email.delay(str(user.pk))

        tokens = _get_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
                "message": _("Registration successful. Please verify your email."),
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------------------
# Login / Logout
# ---------------------------------------------------------------------------

class LoginView(APIView):
    """POST /api/v1/auth/login/ -- authenticate and return JWT tokens."""

    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request=request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        if user is None:
            return Response(
                {"detail": _("Invalid email or password.")},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"detail": _("This account has been deactivated.")},
                status=status.HTTP_403_FORBIDDEN,
            )

        _record_login(request, user)
        tokens = _get_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """POST /api/v1/auth/logout/ -- blacklist the refresh token."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": _("Refresh token is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:  # noqa: BLE001
            return Response(
                {"detail": _("Invalid or expired token.")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"detail": _("Successfully logged out.")},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Current user (/me)
# ---------------------------------------------------------------------------

class MeView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/v1/auth/me/ -- retrieve current user
    PATCH  /api/v1/auth/me/ -- partial update
    DELETE /api/v1/auth/me/ -- soft-delete the account
    """

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self) -> Any:
        return self.request.user

    def perform_destroy(self, instance: Any) -> None:
        instance.soft_delete()


# ---------------------------------------------------------------------------
# Password management
# ---------------------------------------------------------------------------

class PasswordChangeView(APIView):
    """POST /api/v1/auth/password/change/ -- change password for authenticated user."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])

        return Response(
            {"detail": _("Password changed successfully.")},
            status=status.HTTP_200_OK,
        )


class PasswordResetRequestView(APIView):
    """POST /api/v1/auth/password/reset/ -- request a password-reset email."""

    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email__iexact=email, is_active=True)
        except User.DoesNotExist:
            # Always return 200 to prevent email enumeration.
            return Response(
                {"detail": _("If that email exists, a reset link has been sent.")},
                status=status.HTTP_200_OK,
            )

        # Invalidate existing tokens
        PasswordReset.objects.filter(user=user, is_used=False).update(is_used=True)

        reset_obj = PasswordReset.objects.create(user=user)
        send_password_reset_email.delay(str(user.pk), str(reset_obj.token))

        return Response(
            {"detail": _("If that email exists, a reset link has been sent.")},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    """POST /api/v1/auth/password/reset/confirm/ -- confirm a password reset."""

    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            reset_obj = PasswordReset.objects.select_related("user").get(
                token=serializer.validated_data["token"],
            )
        except PasswordReset.DoesNotExist:
            return Response(
                {"detail": _("Invalid or expired reset token.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not reset_obj.is_valid:
            return Response(
                {"detail": _("Invalid or expired reset token.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = reset_obj.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])

        reset_obj.is_used = True
        reset_obj.save(update_fields=["is_used"])

        return Response(
            {"detail": _("Password has been reset successfully.")},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Email verification
# ---------------------------------------------------------------------------

class EmailVerifyView(APIView):
    """POST /api/v1/auth/email/verify/ -- verify email with token."""

    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            verification = EmailVerification.objects.select_related("user").get(
                token=serializer.validated_data["token"],
            )
        except EmailVerification.DoesNotExist:
            return Response(
                {"detail": _("Invalid or expired verification token.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not verification.is_valid:
            return Response(
                {"detail": _("Invalid or expired verification token.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = verification.user
        user.is_verified = True
        user.save(update_fields=["is_verified", "updated_at"])

        verification.is_used = True
        verification.save(update_fields=["is_used"])

        return Response(
            {"detail": _("Email verified successfully.")},
            status=status.HTTP_200_OK,
        )


class EmailResendView(APIView):
    """POST /api/v1/auth/email/resend/ -- resend verification email."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        user = request.user

        if user.is_verified:
            return Response(
                {"detail": _("Email is already verified.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Invalidate previous tokens
        EmailVerification.objects.filter(user=user, is_used=False).update(is_used=True)

        send_verification_email.delay(str(user.pk))

        return Response(
            {"detail": _("Verification email has been sent.")},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# OAuth views
# ---------------------------------------------------------------------------

class _BaseOAuthView(APIView):
    """
    Base class for OAuth callback handling.

    Subclasses set ``provider`` and implement ``_fetch_user_info`` to retrieve
    user details from the specific provider.
    """

    permission_classes = [permissions.AllowAny]
    provider: str = ""

    def post(self, request: Request) -> Response:
        access_token = request.data.get("access_token")
        if not access_token:
            return Response(
                {"detail": _("Access token is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_info = self._fetch_user_info(access_token)
        if user_info is None:
            return Response(
                {"detail": _("Failed to retrieve user info from provider.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        provider_uid: str = user_info["uid"]
        email: str = user_info["email"]
        first_name: str = user_info.get("first_name", "")
        last_name: str = user_info.get("last_name", "")

        # Try to find existing OAuth connection
        try:
            connection = OAuthConnection.objects.select_related("user").get(
                provider=self.provider,
                provider_uid=provider_uid,
            )
            user = connection.user
        except OAuthConnection.DoesNotExist:
            # Try to match by email
            user = User.objects.filter(email__iexact=email).first()
            if user is None:
                user = User.objects.create_user(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    is_verified=True,
                )

            OAuthConnection.objects.create(
                user=user,
                provider=self.provider,
                provider_uid=provider_uid,
                access_token=access_token,
            )

        if not user.is_active:
            return Response(
                {"detail": _("This account has been deactivated.")},
                status=status.HTTP_403_FORBIDDEN,
            )

        _record_login(request, user)
        tokens = _get_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )

    def _fetch_user_info(self, access_token: str) -> dict[str, Any] | None:
        """
        Retrieve user profile data from the OAuth provider.

        Returns a dict with keys: uid, email, first_name, last_name
        or None on failure.
        """
        raise NotImplementedError


class GoogleOAuthView(_BaseOAuthView):
    """POST /api/v1/auth/oauth/google/ -- Google OAuth callback."""

    provider = OAuthProvider.GOOGLE

    def _fetch_user_info(self, access_token: str) -> dict[str, Any] | None:
        import requests as http_requests  # noqa: WPS433

        try:
            resp = http_requests.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "uid": data["id"],
                "email": data["email"],
                "first_name": data.get("given_name", ""),
                "last_name": data.get("family_name", ""),
            }
        except Exception:  # noqa: BLE001
            logger.exception("Google OAuth user info fetch failed")
            return None


class LinkedInOAuthView(_BaseOAuthView):
    """POST /api/v1/auth/oauth/linkedin/ -- LinkedIn OAuth callback."""

    provider = OAuthProvider.LINKEDIN

    def _fetch_user_info(self, access_token: str) -> dict[str, Any] | None:
        import requests as http_requests  # noqa: WPS433

        try:
            resp = http_requests.get(
                "https://api.linkedin.com/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "uid": data.get("sub", ""),
                "email": data.get("email", ""),
                "first_name": data.get("given_name", ""),
                "last_name": data.get("family_name", ""),
            }
        except Exception:  # noqa: BLE001
            logger.exception("LinkedIn OAuth user info fetch failed")
            return None


class GitHubOAuthView(_BaseOAuthView):
    """POST /api/v1/auth/oauth/github/ -- GitHub OAuth callback."""

    provider = OAuthProvider.GITHUB

    def _fetch_user_info(self, access_token: str) -> dict[str, Any] | None:
        import requests as http_requests  # noqa: WPS433

        try:
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            }
            # Fetch profile
            resp = http_requests.get(
                "https://api.github.com/user",
                headers=headers,
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()

            # Fetch primary email if not public
            email = data.get("email")
            if not email:
                email_resp = http_requests.get(
                    "https://api.github.com/user/emails",
                    headers=headers,
                    timeout=10,
                )
                email_resp.raise_for_status()
                emails = email_resp.json()
                for entry in emails:
                    if entry.get("primary") and entry.get("verified"):
                        email = entry["email"]
                        break

            if not email:
                return None

            name_parts = (data.get("name") or "").split(" ", 1)
            return {
                "uid": str(data["id"]),
                "email": email,
                "first_name": name_parts[0] if name_parts else "",
                "last_name": name_parts[1] if len(name_parts) > 1 else "",
            }
        except Exception:  # noqa: BLE001
            logger.exception("GitHub OAuth user info fetch failed")
            return None


# ---------------------------------------------------------------------------
# 2FA (TOTP) views
# ---------------------------------------------------------------------------

import base64
import hashlib
import hmac
import struct
import time as _time


def _generate_totp_secret() -> str:
    """Generate a random base32-encoded secret for TOTP."""
    import secrets

    return base64.b32encode(secrets.token_bytes(20)).decode("ascii")


def _compute_totp(secret: str, time_step: int = 30, digits: int = 6) -> str:
    """Compute the current TOTP code for a given secret."""
    key = base64.b32decode(secret, casefold=True)
    counter = int(_time.time()) // time_step
    msg = struct.pack(">Q", counter)
    h = hmac.new(key, msg, hashlib.sha1).digest()
    offset = h[-1] & 0x0F
    code = struct.unpack(">I", h[offset : offset + 4])[0] & 0x7FFFFFFF
    return str(code % (10**digits)).zfill(digits)


def _verify_totp(secret: str, code: str, window: int = 1) -> bool:
    """Verify a TOTP code with a tolerance window."""
    key = base64.b32decode(secret, casefold=True)
    now = int(_time.time())
    for offset in range(-window, window + 1):
        counter = (now // 30) + offset
        msg = struct.pack(">Q", counter)
        h = hmac.new(key, msg, hashlib.sha1).digest()
        o = h[-1] & 0x0F
        c = struct.unpack(">I", h[o : o + 4])[0] & 0x7FFFFFFF
        expected = str(c % 1_000_000).zfill(6)
        if hmac.compare_digest(expected, code):
            return True
    return False


class TOTPSetupView(APIView):
    """POST /api/v1/auth/2fa/setup/ -- generate TOTP secret and provisioning URI."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        user = request.user
        if getattr(user, "totp_secret", None):
            return Response(
                {"detail": _("2FA is already enabled. Disable it first to reconfigure.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        secret = _generate_totp_secret()
        # Store temporarily in cache until verified
        from django.core.cache import cache

        cache_key = f"totp_setup:{user.pk}"
        cache.set(cache_key, secret, timeout=600)  # 10 min to verify

        # Build otpauth URI
        issuer = "Resumer"
        provisioning_uri = (
            f"otpauth://totp/{issuer}:{user.email}"
            f"?secret={secret}&issuer={issuer}&digits=6&period=30"
        )

        return Response(
            {
                "secret": secret,
                "provisioning_uri": provisioning_uri,
                "message": _("Scan the QR code with your authenticator app, then verify with a code."),
            },
            status=status.HTTP_200_OK,
        )


class TOTPVerifyView(APIView):
    """POST /api/v1/auth/2fa/verify/ -- verify TOTP code and enable 2FA."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        code = request.data.get("code", "")
        if not code or len(code) != 6:
            return Response(
                {"detail": _("A 6-digit code is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        from django.core.cache import cache

        cache_key = f"totp_setup:{user.pk}"
        secret = cache.get(cache_key)

        # If already set up, verify against stored secret
        if secret is None:
            secret = getattr(user, "totp_secret", None)
            if not secret:
                return Response(
                    {"detail": _("No 2FA setup in progress. Call /2fa/setup/ first.")},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if _verify_totp(secret, code):
                return Response(
                    {"detail": _("2FA code verified successfully.")},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"detail": _("Invalid 2FA code.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not _verify_totp(secret, code):
            return Response(
                {"detail": _("Invalid 2FA code. Please try again.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Persist secret on user model
        user.totp_secret = secret
        user.is_2fa_enabled = True
        user.save(update_fields=["totp_secret", "is_2fa_enabled"])
        cache.delete(cache_key)

        return Response(
            {"detail": _("2FA has been enabled successfully.")},
            status=status.HTTP_200_OK,
        )


class TOTPDisableView(APIView):
    """POST /api/v1/auth/2fa/disable/ -- disable 2FA (requires current code)."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        user = request.user
        code = request.data.get("code", "")

        if not getattr(user, "is_2fa_enabled", False):
            return Response(
                {"detail": _("2FA is not enabled.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not code or not _verify_totp(user.totp_secret, code):
            return Response(
                {"detail": _("Invalid 2FA code.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.totp_secret = ""
        user.is_2fa_enabled = False
        user.save(update_fields=["totp_secret", "is_2fa_enabled"])

        return Response(
            {"detail": _("2FA has been disabled.")},
            status=status.HTTP_200_OK,
        )
