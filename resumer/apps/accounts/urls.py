from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import (
    EmailResendView,
    EmailVerifyView,
    GitHubOAuthView,
    GoogleOAuthView,
    LinkedInOAuthView,
    LoginView,
    LogoutView,
    MeView,
    PasswordChangeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RegisterView,
    TOTPSetupView,
    TOTPVerifyView,
    TOTPDisableView,
)

app_name = "accounts"

urlpatterns = [
    # Authentication
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # JWT Token refresh
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    # Current user
    path("me/", MeView.as_view(), name="me"),
    # Password
    path("password/change/", PasswordChangeView.as_view(), name="password-change"),
    path("password/reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path(
        "password/reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    # Email verification
    path("email/verify/", EmailVerifyView.as_view(), name="email-verify"),
    path("email/resend/", EmailResendView.as_view(), name="email-resend"),
    # OAuth
    path("oauth/google/", GoogleOAuthView.as_view(), name="oauth-google"),
    path("oauth/linkedin/", LinkedInOAuthView.as_view(), name="oauth-linkedin"),
    path("oauth/github/", GitHubOAuthView.as_view(), name="oauth-github"),
    # 2FA (TOTP)
    path("2fa/setup/", TOTPSetupView.as_view(), name="2fa-setup"),
    path("2fa/verify/", TOTPVerifyView.as_view(), name="2fa-verify"),
    path("2fa/disable/", TOTPDisableView.as_view(), name="2fa-disable"),
]
