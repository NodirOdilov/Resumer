"""Custom Django Admin dashboard widgets for the Resumer platform.

Provides a custom admin index view that injects dashboard widget context
into the default admin index page. Works with the standard ``admin.site``
so all existing ``@admin.register()`` decorators continue to work.

The dashboard template at ``templates/admin/index.html`` extends the
built-in admin index and renders the dashboard widgets above the
default app list.
"""

from __future__ import annotations

from datetime import timedelta
from functools import wraps

from django.contrib import admin
from django.db.models import Count, Sum
from django.http import HttpRequest, HttpResponse
from django.utils import timezone


def get_dashboard_context() -> dict:
    """Build the context dict with all dashboard widget data.

    Returns a dictionary containing:
    - dau: Daily Active Users count
    - mau: Monthly Active Users count
    - new_users_week: New registrations in the last 7 days
    - revenue_this_month: Sum of successful payments this month (USD)
    - conversion_rate: Percentage of trial users who converted to paid
    - top_templates: Top 5 templates by popularity score
    - docs_today: Total documents (resumes + CLs + CVs) created today
    - subscription_by_status: Count of subscriptions grouped by status
    """
    from apps.accounts.models import User
    from apps.cover_letters.models import CoverLetter
    from apps.cvs.models import CV
    from apps.payments.models import Payment, PaymentStatus, Subscription, SubscriptionStatus
    from apps.resumes.models import Resume
    from apps.templates_library.models import DocumentTemplate

    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)

    # 1. DAU - Daily Active Users
    dau = User.objects.filter(last_login__gte=today_start).count()

    # 2. MAU - Monthly Active Users
    mau = User.objects.filter(last_login__gte=month_start).count()

    # 3. New Users This Week
    new_users_week = User.objects.filter(
        created_at__gte=week_start,
        is_deleted=False,
    ).count()

    # 4. Total Revenue This Month
    revenue_this_month = (
        Payment.objects.filter(
            status=PaymentStatus.SUCCEEDED,
            created_at__gte=month_start,
        ).aggregate(total=Sum("amount"))["total"]
        or 0
    )

    # 5. Trial to Paid Conversion
    trial_ever = Subscription.objects.exclude(
        trial_start__isnull=True,
    ).count()
    paid_from_trial = Subscription.objects.filter(
        status=SubscriptionStatus.ACTIVE,
        plan__in=["monthly", "yearly"],
        trial_start__isnull=False,
    ).count()
    conversion_rate = (
        round((paid_from_trial / trial_ever) * 100, 1) if trial_ever > 0 else 0
    )

    # 6. Top Downloaded Templates (by popularity_score as proxy)
    top_templates = (
        DocumentTemplate.objects.filter(is_active=True)
        .order_by("-popularity_score")[:5]
        .values_list("name", "popularity_score")
    )
    top_templates_list = [
        {"name": name, "score": score} for name, score in top_templates
    ]

    # 7. Documents Created Today
    resumes_today = Resume.objects.filter(created_at__gte=today_start).count()
    cover_letters_today = CoverLetter.objects.filter(created_at__gte=today_start).count()
    cvs_today = CV.objects.filter(created_at__gte=today_start).count()
    docs_today = resumes_today + cover_letters_today + cvs_today

    # 8. Active Subscriptions by Status
    subscription_by_status = dict(
        Subscription.objects.values_list("status")
        .annotate(count=Count("id"))
        .values_list("status", "count")
    )

    # Extra: total counts for context
    total_users = User.objects.filter(is_deleted=False).count()
    premium_users = User.objects.filter(is_premium=True, is_deleted=False).count()

    return {
        "dau": dau,
        "mau": mau,
        "new_users_week": new_users_week,
        "revenue_this_month": float(revenue_this_month),
        "conversion_rate": conversion_rate,
        "top_templates": top_templates_list,
        "docs_today": docs_today,
        "resumes_today": resumes_today,
        "cover_letters_today": cover_letters_today,
        "cvs_today": cvs_today,
        "subscription_by_status": subscription_by_status,
        "total_users": total_users,
        "premium_users": premium_users,
        "trial_ever": trial_ever,
        "paid_from_trial": paid_from_trial,
    }


def patch_admin_index():
    """Monkey-patch the default admin site's index method to inject dashboard context.

    Call this once during URL configuration to add dashboard widgets to the
    default Django admin index page without requiring a custom AdminSite
    (which would break existing ``@admin.register()`` decorators).
    """
    original_index = admin.site.__class__.index

    @wraps(original_index)
    def custom_index(self, request: HttpRequest, extra_context: dict | None = None) -> HttpResponse:
        extra_context = extra_context or {}
        try:
            extra_context["dashboard"] = get_dashboard_context()
        except Exception:
            # If models are not migrated yet or DB is unavailable,
            # fall back gracefully without dashboard data.
            extra_context["dashboard"] = None
        return original_index(self, request, extra_context=extra_context)

    admin.site.index = custom_index.__get__(admin.site, type(admin.site))
