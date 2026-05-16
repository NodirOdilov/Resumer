"""Management command to seed resume and cover letter examples.

Wraps ``scripts/seed_examples.py`` so it can be invoked via::

    python manage.py seed_examples
"""

from django.core.management.base import BaseCommand

from scripts.seed_examples import run


class Command(BaseCommand):
    help = "Seed 280+ resume examples and 170+ cover letter examples."

    def handle(self, *args, **options):
        self.stdout.write("Seeding resume and cover letter examples...")
        resume_count, cl_count = run()
        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created {resume_count} resume examples and "
                f"{cl_count} cover letter examples."
            )
        )
