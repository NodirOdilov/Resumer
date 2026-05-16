"""One-shot demo initialiser for cloud deploys (Railway, Render, etc.).

Designed to run on every container startup. It is idempotent: existing data
is detected and skipped so subsequent restarts complete in milliseconds.

Steps performed:
    1. Create / promote a superuser from DEMO_ADMIN_EMAIL + DEMO_ADMIN_PASSWORD
    2. Create a demo user from DEMO_USER_EMAIL + DEMO_USER_PASSWORD
    3. Seed document templates (fast — < 5 seconds)
    4. Optional: seed categories/examples/articles when DEMO_FULL_SEED=true

Defaults are chosen so the command runs successfully even with NO env vars
(useful for emergency deploys), but for a real demo you should set the
DEMO_ADMIN_* variables to a known credential pair.
"""

from __future__ import annotations

import os

from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = "Initialise demo data on first deploy: superuser + demo user + templates."

    def add_arguments(self, parser):
        parser.add_argument(
            "--full",
            action="store_true",
            help="Also seed examples, articles, categories (slower).",
        )

    def handle(self, *args, **options):
        full = options["full"] or os.environ.get("DEMO_FULL_SEED", "").lower() == "true"

        self.stdout.write(self.style.HTTP_INFO("Running demo_init ..."))

        self._ensure_superuser()
        self._ensure_demo_user()
        self._seed_templates()

        if full:
            self._seed_categories()
            self._seed_examples()
            self._seed_articles()

        self.stdout.write(self.style.SUCCESS("demo_init complete."))

    # ------------------------------------------------------------------ users

    def _ensure_superuser(self):
        from apps.accounts.models import User

        email = os.environ.get("DEMO_ADMIN_EMAIL", "admin@resumer.demo")
        password = os.environ.get("DEMO_ADMIN_PASSWORD", "Resumer2026!")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": "Admin",
                "last_name": "Demo",
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
                "is_verified": True,
            },
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(f"  + Superuser created: {email}")
        else:
            # Always re-assert privileges so we can recover a locked-out admin
            # by simply redeploying with the desired env vars.
            changed = False
            if not user.is_superuser:
                user.is_superuser = True
                changed = True
            if not user.is_staff:
                user.is_staff = True
                changed = True
            if not user.is_active:
                user.is_active = True
                changed = True
            if changed:
                user.save()
            self.stdout.write(f"  = Superuser already exists: {email}")

    def _ensure_demo_user(self):
        from apps.accounts.models import User

        email = os.environ.get("DEMO_USER_EMAIL", "demo@resumer.demo")
        password = os.environ.get("DEMO_USER_PASSWORD", "DemoPass2026!")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": "Demo",
                "last_name": "User",
                "is_active": True,
                "is_verified": True,
            },
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(f"  + Demo user created: {email}")
        else:
            self.stdout.write(f"  = Demo user already exists: {email}")

    # -------------------------------------------------------------- templates

    def _seed_templates(self):
        from apps.templates_library.models import DocumentTemplate

        if DocumentTemplate.objects.exists():
            self.stdout.write("  = Templates already present — skipped.")
            return

        try:
            from scripts.seed_templates import run as seed
            with transaction.atomic():
                seed()
            self.stdout.write("  + Templates seeded.")
        except Exception as exc:  # noqa: BLE001
            self.stderr.write(self.style.WARNING(f"  ! Template seed failed: {exc}"))

    # ----------------------------------------------------- optional full seed

    def _seed_categories(self):
        try:
            from scripts.seed_categories import run as seed
            seed()
            self.stdout.write("  + Categories seeded.")
        except Exception as exc:  # noqa: BLE001
            self.stderr.write(self.style.WARNING(f"  ! Categories seed failed: {exc}"))

    def _seed_examples(self):
        try:
            from scripts.seed_examples import run as seed
            seed()
            self.stdout.write("  + Examples seeded.")
        except Exception as exc:  # noqa: BLE001
            self.stderr.write(self.style.WARNING(f"  ! Examples seed failed: {exc}"))

    def _seed_articles(self):
        try:
            from scripts.seed_articles import run as seed
            seed()
            self.stdout.write("  + Articles seeded.")
        except Exception as exc:  # noqa: BLE001
            self.stderr.write(self.style.WARNING(f"  ! Articles seed failed: {exc}"))
