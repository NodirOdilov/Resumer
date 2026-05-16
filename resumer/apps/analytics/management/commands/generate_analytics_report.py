"""Generate an analytics summary report.

Usage::

    python manage.py generate_analytics_report
    python manage.py generate_analytics_report --format json
    python manage.py generate_analytics_report --days 7
"""

from __future__ import annotations

import json
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db.models import Count, Sum
from django.utils import timezone


class Command(BaseCommand):
    help = "Generate an analytics summary report with user, document, and revenue metrics."

    def add_arguments(self, parser):
        parser.add_argument(
            "--format",
            type=str,
            choices=["table", "json"],
            default="table",
            help="Output format: table (default) or json.",
        )
        parser.add_argument(
            "--days",
            type=int,
            default=30,
            help="Number of days to include in the report (default: 30).",
        )

    def handle(self, *args, **options):
        output_format = options["format"]
        days = options["days"]
        now = timezone.now()
        period_start = now - timedelta(days=days)

        report = self._build_report(now, period_start, days)

        if output_format == "json":
            self.stdout.write(json.dumps(report, indent=2, default=str))
        else:
            self._print_table(report, days)

    def _build_report(self, now, period_start, days):
        from apps.accounts.models import User
        from apps.analytics.models import Event
        from apps.payments.models import Payment, PaymentStatus, Subscription, SubscriptionStatus
        from apps.resumes.models import Resume
        from apps.cover_letters.models import CoverLetter
        from apps.cvs.models import CV
        from apps.templates_library.models import DocumentTemplate

        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)

        # User metrics
        total_users = User.objects.filter(is_deleted=False).count()
        premium_users = User.objects.filter(is_premium=True, is_deleted=False).count()
        new_users_this_week = User.objects.filter(
            created_at__gte=week_start, is_deleted=False
        ).count()
        active_today = User.objects.filter(last_login__gte=today_start).count()
        active_this_month = User.objects.filter(last_login__gte=month_start).count()

        # Document metrics
        resumes_total = Resume.objects.count()
        cover_letters_total = CoverLetter.objects.count()
        cvs_total = CV.objects.count()

        resumes_period = Resume.objects.filter(created_at__gte=period_start).count()
        cover_letters_period = CoverLetter.objects.filter(
            created_at__gte=period_start
        ).count()
        cvs_period = CV.objects.filter(created_at__gte=period_start).count()

        docs_created_today = (
            Resume.objects.filter(created_at__gte=today_start).count()
            + CoverLetter.objects.filter(created_at__gte=today_start).count()
            + CV.objects.filter(created_at__gte=today_start).count()
        )

        # Download events by format
        downloads_by_format = (
            Event.objects.filter(
                event_type="resume_downloaded",
                created_at__gte=period_start,
            )
            .values("metadata__format")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        downloads_dict = {
            item.get("metadata__format", "unknown"): item["count"]
            for item in downloads_by_format
        }

        # Popular templates
        popular_templates = (
            DocumentTemplate.objects.filter(is_active=True)
            .order_by("-popularity_score")[:5]
            .values("name", "skin_id", "popularity_score")
        )

        # Revenue metrics
        revenue_this_month = (
            Payment.objects.filter(
                status=PaymentStatus.SUCCEEDED,
                created_at__gte=month_start,
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )
        revenue_period = (
            Payment.objects.filter(
                status=PaymentStatus.SUCCEEDED,
                created_at__gte=period_start,
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )

        # Subscription status counts
        subscription_counts = dict(
            Subscription.objects.values_list("status")
            .annotate(count=Count("id"))
            .values_list("status", "count")
        )

        # Trial to paid conversion
        trial_users = Subscription.objects.filter(
            status__in=[
                SubscriptionStatus.TRIALING,
                SubscriptionStatus.ACTIVE,
                SubscriptionStatus.CANCELED,
                SubscriptionStatus.EXPIRED,
            ]
        ).count()
        paid_users = Subscription.objects.filter(
            status=SubscriptionStatus.ACTIVE,
            plan__in=["monthly", "yearly"],
        ).count()
        conversion_rate = (
            round((paid_users / trial_users) * 100, 1) if trial_users > 0 else 0
        )

        return {
            "period_days": days,
            "generated_at": str(now),
            "users": {
                "total": total_users,
                "premium": premium_users,
                "new_this_week": new_users_this_week,
                "dau": active_today,
                "mau": active_this_month,
            },
            "documents": {
                "total_resumes": resumes_total,
                "total_cover_letters": cover_letters_total,
                "total_cvs": cvs_total,
                "created_in_period": resumes_period + cover_letters_period + cvs_period,
                "created_today": docs_created_today,
            },
            "downloads_by_format": downloads_dict,
            "popular_templates": list(popular_templates),
            "revenue": {
                "this_month_usd": float(revenue_this_month),
                "period_usd": float(revenue_period),
            },
            "subscriptions": subscription_counts,
            "trial_to_paid_conversion_pct": conversion_rate,
        }

    def _print_table(self, report, days):
        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING(f"Analytics Report (last {days} days)"))
        self.stdout.write(f"Generated: {report['generated_at']}")
        self.stdout.write("")

        # Users
        self.stdout.write(self.style.MIGRATE_HEADING("Users"))
        u = report["users"]
        self.stdout.write(f"  Total users:          {u['total']}")
        self.stdout.write(f"  Premium users:        {u['premium']}")
        self.stdout.write(f"  New this week:        {u['new_this_week']}")
        self.stdout.write(f"  DAU (today):          {u['dau']}")
        self.stdout.write(f"  MAU (this month):     {u['mau']}")
        self.stdout.write("")

        # Documents
        self.stdout.write(self.style.MIGRATE_HEADING("Documents"))
        d = report["documents"]
        self.stdout.write(f"  Total resumes:        {d['total_resumes']}")
        self.stdout.write(f"  Total cover letters:  {d['total_cover_letters']}")
        self.stdout.write(f"  Total CVs:            {d['total_cvs']}")
        self.stdout.write(f"  Created in period:    {d['created_in_period']}")
        self.stdout.write(f"  Created today:        {d['created_today']}")
        self.stdout.write("")

        # Downloads by format
        self.stdout.write(self.style.MIGRATE_HEADING("Downloads by Format"))
        if report["downloads_by_format"]:
            for fmt, count in report["downloads_by_format"].items():
                self.stdout.write(f"  {fmt or 'unknown':20s} {count}")
        else:
            self.stdout.write("  No download data.")
        self.stdout.write("")

        # Popular templates
        self.stdout.write(self.style.MIGRATE_HEADING("Top 5 Templates"))
        for idx, tpl in enumerate(report["popular_templates"], 1):
            self.stdout.write(
                f"  {idx}. {tpl['name']} ({tpl['skin_id']}) - "
                f"score: {tpl['popularity_score']}"
            )
        self.stdout.write("")

        # Revenue
        self.stdout.write(self.style.MIGRATE_HEADING("Revenue"))
        r = report["revenue"]
        self.stdout.write(f"  This month:           ${r['this_month_usd']:.2f}")
        self.stdout.write(f"  Period ({days}d):        ${r['period_usd']:.2f}")
        self.stdout.write("")

        # Subscriptions
        self.stdout.write(self.style.MIGRATE_HEADING("Subscriptions by Status"))
        if report["subscriptions"]:
            for status, count in report["subscriptions"].items():
                self.stdout.write(f"  {status:20s} {count}")
        else:
            self.stdout.write("  No subscriptions.")
        self.stdout.write("")

        self.stdout.write(
            f"  Trial-to-paid conversion: {report['trial_to_paid_conversion_pct']}%"
        )
        self.stdout.write("")
