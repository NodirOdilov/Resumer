"""Celery app configuration for Resumer."""
import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.railway")

app = Celery("resumer")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "send-trial-reminders": {
        "task": "apps.payments.tasks.send_trial_reminders",
        "schedule": crontab(hour=9, minute=0),
    },
    "generate-sitemap": {
        "task": "apps.seo.tasks.generate_sitemap",
        "schedule": crontab(hour=3, minute=0),
    },
    "cleanup-expired-tokens": {
        "task": "apps.accounts.tasks.cleanup_expired_tokens",
        "schedule": crontab(minute=0),  # every hour
    },
    "update-analytics": {
        "task": "apps.analytics.tasks.update_analytics",
        "schedule": crontab(minute=0),  # every hour
    },
}
