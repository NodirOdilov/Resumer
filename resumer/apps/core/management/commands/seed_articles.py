"""Management command to seed articles, authors, categories, and tags.

Wraps ``scripts/seed_articles.py`` so it can be invoked via::

    python manage.py seed_articles
"""

from django.core.management.base import BaseCommand

from scripts.seed_articles import run


class Command(BaseCommand):
    help = "Seed 22 authors, 6 article categories, 40+ tags, and 100+ articles."

    def handle(self, *args, **options):
        self.stdout.write("Seeding articles, authors, categories, and tags...")
        counts = run()
        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created {counts['authors']} authors, "
                f"{counts['article_categories']} categories, "
                f"{counts['tags']} tags, "
                f"{counts['articles']} articles."
            )
        )
