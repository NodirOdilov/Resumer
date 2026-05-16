"""Management command to run all seed scripts in the correct order.

Usage::

    python manage.py seed_all
"""

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Run all seed scripts in the correct order: categories, templates, examples, articles."

    def add_arguments(self, parser):
        parser.add_argument(
            "--skip",
            nargs="*",
            choices=["categories", "templates", "examples", "articles"],
            default=[],
            help="Seed steps to skip (e.g. --skip articles examples).",
        )

    def handle(self, *args, **options):
        skip = set(options["skip"])

        steps = [
            ("categories", "seed_categories"),
            ("templates", "seed_templates"),
            ("examples", "seed_examples"),
            ("articles", "seed_articles"),
        ]

        for step_name, command_name in steps:
            if step_name in skip:
                self.stdout.write(
                    self.style.WARNING(f"Skipping {step_name}...")
                )
                continue

            self.stdout.write(self.style.MIGRATE_HEADING(f"Running {command_name}..."))
            from django.core.management import call_command

            call_command(command_name, stdout=self.stdout, stderr=self.stderr)

        self.stdout.write(self.style.SUCCESS("All seed scripts completed."))
