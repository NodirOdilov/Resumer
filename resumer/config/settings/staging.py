"""Staging settings."""
from .production import *  # noqa: F401, F403

# Slightly more relaxed than production for debugging
LOGGING["handlers"]["console"]["level"] = "INFO"  # noqa: F405
