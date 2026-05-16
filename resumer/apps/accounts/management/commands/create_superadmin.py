"""Create superadmin from environment variables (ADMIN_EMAIL, ADMIN_PASSWORD).

Usage::

    ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret python manage.py create_superadmin

Or with explicit arguments::

    python manage.py create_superadmin --email admin@example.com --password secret
"""

from __future__ import annotations

import os

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create a superadmin user from environment variables or CLI arguments."

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            type=str,
            default=None,
            help="Admin email (overrides ADMIN_EMAIL env var).",
        )
        parser.add_argument(
            "--password",
            type=str,
            default=None,
            help="Admin password (overrides ADMIN_PASSWORD env var).",
        )
        parser.add_argument(
            "--first-name",
            type=str,
            default="Admin",
            help="Admin first name (default: Admin).",
        )
        parser.add_argument(
            "--last-name",
            type=str,
            default="User",
            help="Admin last name (default: User).",
        )
        parser.add_argument(
            "--no-input",
            action="store_true",
            default=False,
            help="Do not prompt for confirmation.",
        )

    def handle(self, *args, **options):
        from apps.accounts.models import User

        email = options["email"] or os.environ.get("ADMIN_EMAIL")
        password = options["password"] or os.environ.get("ADMIN_PASSWORD")
        first_name = options["first_name"]
        last_name = options["last_name"]

        if not email:
            raise CommandError(
                "Email is required. Provide --email or set ADMIN_EMAIL env var."
            )
        if not password:
            raise CommandError(
                "Password is required. Provide --password or set ADMIN_PASSWORD env var."
            )

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(
                    f"User with email '{email}' already exists. "
                    f"Ensuring superuser privileges..."
                )
            )
            user = User.objects.get(email=email)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.is_verified = True
            user.set_password(password)
            user.save(
                update_fields=[
                    "is_staff",
                    "is_superuser",
                    "is_active",
                    "is_verified",
                    "password",
                    "updated_at",
                ]
            )
            self.stdout.write(
                self.style.SUCCESS(f"Superadmin privileges confirmed for '{email}'.")
            )
            return

        user = User.objects.create_superuser(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user.is_verified = True
        user.save(update_fields=["is_verified"])

        self.stdout.write(
            self.style.SUCCESS(f"Superadmin '{email}' created successfully.")
        )
