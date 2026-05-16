"""Import model translations from JSON files.

Usage::

    python manage.py import_translations
    python manage.py import_translations --language de
    python manage.py import_translations --dry-run

Reads JSON files from ``locale/exports/<language_code>/``.
"""

from __future__ import annotations

import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.content.models import Article, ArticleCategory, Author
from apps.examples.models import ExampleCategory, ResumeExample
from apps.templates_library.models import DocumentTemplate


# Mapping of export file name to (model, pk_field, translatable_fields)
MODEL_REGISTRY = {
    "document_templates": {
        "model": DocumentTemplate,
        "pk_field": "skin_id",
        "lookup_field": "skin_id",
    },
    "example_categories": {
        "model": ExampleCategory,
        "pk_field": "name",
        "lookup_field": "name",
    },
    "resume_examples": {
        "model": ResumeExample,
        "pk_field": "pk",
        "lookup_field": "pk",
    },
    "article_categories": {
        "model": ArticleCategory,
        "pk_field": "slug",
        "lookup_field": "slug",
    },
    "articles": {
        "model": Article,
        "pk_field": "slug",
        "lookup_field": "slug",
    },
    "authors": {
        "model": Author,
        "pk_field": "slug",
        "lookup_field": "slug",
    },
}


def _get_available_languages() -> list[str]:
    """Return list of language codes from settings."""
    return [code for code, _name in settings.LANGUAGES]


class Command(BaseCommand):
    help = "Import model translations from JSON files per language."

    def add_arguments(self, parser):
        parser.add_argument(
            "--language",
            action="append",
            dest="languages",
            help="Import only the specified language(s). Can be repeated.",
        )
        parser.add_argument(
            "--input-dir",
            type=str,
            default=None,
            help="Input directory (default: <project>/locale/exports/).",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            default=False,
            help="Validate data without saving changes.",
        )

    def handle(self, *args, **options):
        available = _get_available_languages()
        languages = options.get("languages") or available
        dry_run = options["dry_run"]

        # Validate requested languages
        for lang in languages:
            if lang not in available:
                raise CommandError(
                    f"Language '{lang}' is not configured in settings.LANGUAGES. "
                    f"Available: {', '.join(available)}"
                )

        input_base = options.get("input_dir")
        if input_base:
            base_dir = Path(input_base)
        else:
            base_dir = Path(settings.BASE_DIR) / "locale" / "exports"

        if not base_dir.exists():
            raise CommandError(f"Input directory does not exist: {base_dir}")

        total_updated = 0
        total_skipped = 0
        total_errors = 0

        for lang in languages:
            lang_dir = base_dir / lang
            if not lang_dir.exists():
                self.stdout.write(
                    self.style.WARNING(
                        f"  No export directory found for '{lang}', skipping."
                    )
                )
                continue

            lang_suffix = lang.replace("-", "_")

            for file_name, registry in MODEL_REGISTRY.items():
                json_file = lang_dir / f"{file_name}.json"
                if not json_file.exists():
                    continue

                model = registry["model"]
                lookup_field = registry["lookup_field"]

                try:
                    with open(json_file, "r", encoding="utf-8") as f:
                        records = json.load(f)
                except (json.JSONDecodeError, OSError) as e:
                    self.stderr.write(
                        self.style.ERROR(f"  Error reading {json_file}: {e}")
                    )
                    total_errors += 1
                    continue

                if not isinstance(records, list):
                    self.stderr.write(
                        self.style.ERROR(
                            f"  Invalid format in {json_file}: expected a list."
                        )
                    )
                    total_errors += 1
                    continue

                updated_count = 0
                skipped_count = 0

                for record in records:
                    pk_value = record.get("pk")
                    if not pk_value:
                        self.stderr.write(
                            self.style.WARNING(
                                f"  Record missing 'pk' in {json_file}, skipping."
                            )
                        )
                        skipped_count += 1
                        continue

                    try:
                        obj = model.objects.get(**{lookup_field: pk_value})
                    except model.DoesNotExist:
                        self.stderr.write(
                            self.style.WARNING(
                                f"  {model.__name__} with {lookup_field}="
                                f"'{pk_value}' not found, skipping."
                            )
                        )
                        skipped_count += 1
                        continue

                    fields_to_update = []
                    for field_name, field_data in record.items():
                        if field_name == "pk":
                            continue
                        if not isinstance(field_data, dict):
                            continue

                        translation = field_data.get("translation", "")
                        if not translation:
                            continue

                        translated_attr = f"{field_name}_{lang_suffix}"
                        if hasattr(obj, translated_attr):
                            setattr(obj, translated_attr, translation)
                            fields_to_update.append(translated_attr)

                    if fields_to_update and not dry_run:
                        with transaction.atomic():
                            obj.save(update_fields=fields_to_update)
                        updated_count += 1
                    elif fields_to_update:
                        updated_count += 1

                total_updated += updated_count
                total_skipped += skipped_count

                action = "Would update" if dry_run else "Updated"
                self.stdout.write(
                    f"  {action} {updated_count} {file_name} records for "
                    f"'{lang}' (skipped {skipped_count})"
                )

        prefix = "[DRY RUN] " if dry_run else ""
        self.stdout.write(
            self.style.SUCCESS(
                f"{prefix}Import complete. {total_updated} records updated, "
                f"{total_skipped} skipped, {total_errors} errors."
            )
        )
