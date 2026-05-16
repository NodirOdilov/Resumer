"""
Main orchestrator script — runs all seed scripts in order and creates
default admin/test users.

Usage:
    python manage.py shell < scripts/seed_data.py
    # Or via django-extensions:
    python manage.py runscript seed_data
"""

from __future__ import annotations

import sys
import time

import django  # noqa: F401
from django.contrib.auth import get_user_model

User = get_user_model()


def _create_users() -> int:
    """Create superadmin and test user accounts. Returns count created."""
    created = 0

    # Superadmin
    if not User.objects.filter(email="admin@resumer.com").exists():
        User.objects.create_superuser(
            email="admin@resumer.com",
            password="admin123456",
            first_name="Admin",
            last_name="Resumer",
        )
        print("[seed_data] Created superadmin: admin@resumer.com / admin123456")
        created += 1
    else:
        print("[seed_data] Superadmin admin@resumer.com already exists — skipped.")

    # Test user
    if not User.objects.filter(email="user@resumer.com").exists():
        user = User.objects.create_user(
            email="user@resumer.com",
            password="user123456",
            first_name="Test",
            last_name="User",
        )
        user.is_verified = True
        user.save(update_fields=["is_verified"])
        print("[seed_data] Created test user: user@resumer.com / user123456")
        created += 1
    else:
        print("[seed_data] Test user user@resumer.com already exists — skipped.")

    return created


def run() -> None:
    """Run all seed scripts in dependency order."""
    start = time.time()

    print("=" * 70)
    print("  RESUMER — DATABASE SEED")
    print("=" * 70)
    print()

    # ------------------------------------------------------------------
    # 1. Categories (no deps)
    # ------------------------------------------------------------------
    print("-" * 40)
    print("Step 1/5: Seeding example categories ...")
    print("-" * 40)
    from scripts.seed_categories import run as seed_categories  # noqa: E402
    seed_categories()
    print()

    # ------------------------------------------------------------------
    # 2. Templates (no deps)
    # ------------------------------------------------------------------
    print("-" * 40)
    print("Step 2/5: Seeding templates ...")
    print("-" * 40)
    from scripts.seed_templates import run as seed_templates  # noqa: E402
    seed_templates()
    print()

    # ------------------------------------------------------------------
    # 3. Examples (depends on categories + templates)
    # ------------------------------------------------------------------
    print("-" * 40)
    print("Step 3/5: Seeding resume & cover letter examples ...")
    print("-" * 40)
    from scripts.seed_examples import run as seed_examples  # noqa: E402
    seed_examples()
    print()

    # ------------------------------------------------------------------
    # 4. Articles (authors, categories, tags, articles)
    # ------------------------------------------------------------------
    print("-" * 40)
    print("Step 4/5: Seeding articles, authors & tags ...")
    print("-" * 40)
    from scripts.seed_articles import run as seed_articles  # noqa: E402
    seed_articles()
    print()

    # ------------------------------------------------------------------
    # 5. Users
    # ------------------------------------------------------------------
    print("-" * 40)
    print("Step 5/5: Creating default users ...")
    print("-" * 40)
    _create_users()
    print()

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------
    elapsed = time.time() - start

    from apps.cl_examples.models import CoverLetterExample
    from apps.content.models import Article, ArticleCategory, Author, Tag
    from apps.examples.models import ExampleCategory, ResumeExample
    from apps.templates_library.models import DocumentTemplate, TemplateColorScheme

    print("=" * 70)
    print("  SEED COMPLETE")
    print("=" * 70)
    print(f"  Example Categories:   {ExampleCategory.objects.count()}")
    print(f"  Templates:            {DocumentTemplate.objects.count()}")
    print(f"  Colour Schemes:       {TemplateColorScheme.objects.count()}")
    print(f"  Resume Examples:      {ResumeExample.objects.count()}")
    print(f"  Cover Letter Examples: {CoverLetterExample.objects.count()}")
    print(f"  Authors:              {Author.objects.count()}")
    print(f"  Article Categories:   {ArticleCategory.objects.count()}")
    print(f"  Tags:                 {Tag.objects.count()}")
    print(f"  Articles:             {Article.objects.count()}")
    print(f"  Users:                {User.objects.count()}")
    print(f"  Time:                 {elapsed:.1f}s")
    print("=" * 70)


if __name__ == "__main__":
    run()
