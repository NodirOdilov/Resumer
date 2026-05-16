"""Railway deployment settings — demo-friendly.

Activated via: DJANGO_SETTINGS_MODULE=config.settings.railway

Designed to boot successfully on Railway with ONLY these required env vars:
    - DATABASE_URL          (auto-set when PostgreSQL plugin is linked)
    - REDIS_URL             (auto-set when Redis plugin is linked)
    - DJANGO_SECRET_KEY
    - FRONTEND_URL          (the Vercel URL, used for CORS + CSRF)

Everything else (Stripe, OAuth, OpenAI, SendGrid, S3, Sentry, Elasticsearch)
is OPTIONAL. The site works without them; affected features degrade gracefully.
"""
import os

from .base import *  # noqa: F401, F403

DEBUG = False

# ─────────────────── Hosts & Security ───────────────────

ALLOWED_HOSTS = os.environ.get(
    "ALLOWED_HOSTS",
    ".up.railway.app,.railway.app,localhost,127.0.0.1",
).split(",")

# Vercel frontend URL is always trusted. Adding wildcard Railway domains too.
_frontend_url = os.environ.get("FRONTEND_URL", "").rstrip("/")
_csrf_extra = os.environ.get("CSRF_TRUSTED_ORIGINS", "")

CSRF_TRUSTED_ORIGINS = [
    "https://*.up.railway.app",
    "https://*.railway.app",
    "https://*.vercel.app",
]
if _frontend_url:
    CSRF_TRUSTED_ORIGINS.append(_frontend_url)
if _csrf_extra:
    CSRF_TRUSTED_ORIGINS.extend(
        origin.strip() for origin in _csrf_extra.split(",") if origin.strip()
    )

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# Railway already terminates TLS at the edge; redirecting again breaks healthchecks.
SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "False") == "True"
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# ─────────────────── Database ───────────────────
# Railway PostgreSQL provides DATABASE_URL automatically when the plugin is linked.

DATABASE_URL = os.environ.get("DATABASE_URL", "")
if DATABASE_URL:
    import dj_database_url

    DATABASES["default"] = dj_database_url.config(  # noqa: F405
        default=DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=False,
    )

# ─────────────────── Redis ───────────────────
# Railway Redis provides REDIS_URL automatically when linked.
# If Redis is missing, fall back to local-memory cache so the site still boots.

REDIS_URL = os.environ.get("REDIS_URL", "")

if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
            "KEY_PREFIX": "resumer",
        },
        "sessions": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
            "KEY_PREFIX": "sessions",
        },
        "throttling": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
            "KEY_PREFIX": "throttle",
        },
    }
    SESSION_ENGINE = "django.contrib.sessions.backends.cache"
    SESSION_CACHE_ALIAS = "sessions"

    CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", REDIS_URL)
    CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", REDIS_URL)

    # WebSocket Channel Layer (only useful if running an ASGI server).
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {"hosts": [REDIS_URL]},
        },
    }
else:
    # Demo fallback: no Redis attached.
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "resumer-default",
        },
        "sessions": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "resumer-sessions",
        },
        "throttling": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "resumer-throttling",
        },
    }
    SESSION_ENGINE = "django.contrib.sessions.backends.db"
    CELERY_TASK_ALWAYS_EAGER = True  # Run tasks inline so the app still works
    CHANNEL_LAYERS = {
        "default": {"BACKEND": "channels.layers.InMemoryChannelLayer"},
    }

# ─────────────────── Static Files (WhiteNoise) ───────────────────

MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")  # noqa: F405
STORAGES = {  # noqa: F405
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# ─────────────────── Media Files ───────────────────
# S3 if configured; otherwise local filesystem on the Railway volume.

if os.environ.get("AWS_STORAGE_BUCKET_NAME"):
    STORAGES["default"] = {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
    }
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
    AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", "")
    AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", "us-east-1")
    AWS_S3_CUSTOM_DOMAIN = os.environ.get("AWS_S3_CUSTOM_DOMAIN", "")
    AWS_DEFAULT_ACL = None
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
    AWS_QUERYSTRING_AUTH = False
else:
    MEDIA_URL = "/media/"

# ─────────────────── CORS ───────────────────
# Frontend Vercel URL is always trusted. Additional origins via CORS_ALLOWED_ORIGINS.

_cors_extra = os.environ.get("CORS_ALLOWED_ORIGINS", "")

CORS_ALLOWED_ORIGINS: list[str] = []
if _frontend_url:
    CORS_ALLOWED_ORIGINS.append(_frontend_url)
if _cors_extra:
    CORS_ALLOWED_ORIGINS.extend(
        origin.strip() for origin in _cors_extra.split(",") if origin.strip()
    )

# Allow any Vercel preview deployment of the same project to call the API
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
    r"^https://.*\.up\.railway\.app$",
]

# Only fall back to "allow all" if we didn't get any explicit config.
CORS_ALLOW_ALL_ORIGINS = not (CORS_ALLOWED_ORIGINS or _frontend_url)
CORS_ALLOW_CREDENTIALS = True

# ─────────────────── Auth (DRF) — JWT only on Railway ───────────────────
# SessionAuthentication requires CSRF for non-safe methods, which breaks
# cross-origin POST from Vercel. Keep session for the admin only.

REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = [  # noqa: F405
    "rest_framework_simplejwt.authentication.JWTAuthentication",
]

# ─────────────────── Allauth — relax for demo ───────────────────
# Email infrastructure is optional in the demo; allow signup without verification.

ACCOUNT_EMAIL_VERIFICATION = os.environ.get("ACCOUNT_EMAIL_VERIFICATION", "optional")

# ─────────────────── Elasticsearch (optional) ───────────────────

ELASTICSEARCH_URL = os.environ.get("ELASTICSEARCH_URL", "")
if ELASTICSEARCH_URL:
    ELASTICSEARCH_DSL = {"default": {"hosts": ELASTICSEARCH_URL}}
else:
    ELASTICSEARCH_DSL = {}

# ─────────────────── Email ───────────────────
# Default to console backend so signup/login still work without SendGrid.
# Set EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend + SENDGRID_API_KEY
# to enable real email delivery in production.

if os.environ.get("SENDGRID_API_KEY"):
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.sendgrid.net")
    EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
    EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "True") == "True"
    EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "apikey")
    EMAIL_HOST_PASSWORD = os.environ["SENDGRID_API_KEY"]
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "noreply@resumer.demo")
SERVER_EMAIL = os.environ.get("SERVER_EMAIL", "server@resumer.demo")

# ─────────────────── Stripe ───────────────────

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
STRIPE_TRIAL_PRICE_ID = os.environ.get("STRIPE_TRIAL_PRICE_ID", "")

# ─────────────────── OAuth ───────────────────

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.environ.get("GOOGLE_CLIENT_ID", ""),
            "secret": os.environ.get("GOOGLE_CLIENT_SECRET", ""),
        },
        "SCOPE": ["email", "profile"],
    },
    "github": {
        "APP": {
            "client_id": os.environ.get("GITHUB_CLIENT_ID", ""),
            "secret": os.environ.get("GITHUB_CLIENT_SECRET", ""),
        },
        "SCOPE": ["user:email"],
    },
}

# ─────────────────── AI (OpenAI) ───────────────────

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# ─────────────────── Sentry ───────────────────

SENTRY_DSN = os.environ.get("SENTRY_DSN", "")
if SENTRY_DSN:
    import sentry_sdk

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=float(os.environ.get("SENTRY_TRACES_RATE", "0.1")),
        profiles_sample_rate=float(os.environ.get("SENTRY_PROFILES_RATE", "0.1")),
        environment="railway",
        send_default_pii=False,
    )

# ─────────────────── Logging ───────────────────

LOGGING["handlers"]["console"]["level"] = "INFO"  # noqa: F405
