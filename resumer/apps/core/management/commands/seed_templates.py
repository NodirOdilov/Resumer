"""Management command to seed document templates.

Wraps ``scripts/seed_templates.py`` so it can be invoked via::

    python manage.py seed_templates
"""

from django.core.management.base import BaseCommand

from scripts.seed_templates import run


class Command(BaseCommand):
    help = "Seed 28 resume templates and 28 matching cover letter templates with colour schemes."

    def handle(self, *args, **options):
        self.stdout.write("Seeding document templates...")
        templates_created, schemes_created = run()
        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created {templates_created} templates and "
                f"{schemes_created} colour schemes."
            )
        )
