"""Management command to seed example categories.

Wraps ``scripts/seed_categories.py`` so it can be invoked via::

    python manage.py seed_categories
"""

from django.core.management.base import BaseCommand

from scripts.seed_categories import run


class Command(BaseCommand):
    help = "Seed 18 example categories for resume and cover letter examples."

    def handle(self, *args, **options):
        self.stdout.write("Seeding example categories...")
        created_count = run()
        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created {created_count} example categories."
            )
        )
