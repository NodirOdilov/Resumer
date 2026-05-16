from __future__ import annotations

from rest_framework.throttling import AnonRateThrottle as BaseAnonRateThrottle
from rest_framework.throttling import UserRateThrottle as BaseUserRateThrottle


class AnonRateThrottle(BaseAnonRateThrottle):
    """Throttle for anonymous (unauthenticated) requests."""

    scope: str = "anon"
    rate: str = "60/minute"


class UserRateThrottle(BaseUserRateThrottle):
    """Throttle for authenticated user requests."""

    scope: str = "user"
    rate: str = "120/minute"


class LoginRateThrottle(BaseAnonRateThrottle):
    """Throttle for login attempts: 5 requests per 15 minutes."""

    scope: str = "login"
    rate: str = "5/minute"
    THROTTLE_RATES: dict[str, str | None] = {"login": "5/minute"}

    def get_rate(self) -> str:
        return "5/minute"

    def parse_rate(self, rate: str) -> tuple[int, int]:
        num_requests, _ = super().parse_rate(rate)
        return (num_requests, 900)


class RegisterRateThrottle(BaseAnonRateThrottle):
    """Throttle for registration attempts: 3 requests per hour."""

    scope: str = "register"
    rate: str = "3/hour"


class AIRateThrottle(BaseUserRateThrottle):
    """Rate-limit AI endpoints: 10 requests/hour for free users, unlimited for premium.

    Premium status is determined by ``user.is_premium_active()``.
    Anonymous users are always throttled at the free-tier rate.
    """

    scope: str = "ai"
    rate: str = "10/hour"  # default (free-tier) rate

    def allow_request(self, request, view) -> bool:  # type: ignore[override]
        user = request.user
        # Premium users bypass the throttle entirely.
        if user and user.is_authenticated and getattr(user, "is_premium_active", lambda: False)():
            return True
        return super().allow_request(request, view)

    def get_cache_key(self, request, view) -> str | None:  # type: ignore[override]
        if request.user and request.user.is_authenticated:
            return self.cache_format % {
                "scope": self.scope,
                "ident": request.user.pk,
            }
        # Fall back to IP-based throttling for anonymous users.
        ident = self.get_ident(request)
        if ident is None:
            return None
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident,
        }
