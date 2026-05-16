"""Export model translations to JSON files for external translation services.

Usage::

    python manage.py export_translations
    python manage.py export_translations --language de
    python manage.py export_translations --language fr --language es

Outputs JSON files to ``locale/exports/<language_code>/``.
"""

from __future__ import annotations

import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.i18n_content.translation import (
    ArticleCategoryTranslationOptions,
    ArticleTranslationOptions,
    AuthorTranslationOptions,
    DocumentTemplateTranslationOptions,
    ExampleCategoryTranslationOptions,
    ResumeExampleTranslationOptions,
)
from apps.content.models import Article, ArticleCategory, Author
from apps.examples.models import ExampleCategory, ResumeExample
from apps.templates_library.models import DocumentTemplate


# Mapping of model class to its translation options fields
TRANSLATABLE_MODELS = [
    {
        "model": DocumentTemplate,
        "fields": DocumentTemplateTranslationOptions.fields,
        "name": "document_templates",
        "pk_field": "skin_id",
    },
    {
        "model": ExampleCategory,
        "fields": ExampleCategoryTranslationOptions.fields,
        "name": "example_categories",
        "pk_field": "name",
    },
    {
        "model": ResumeExample,
        "fields": ResumeExampleTranslationOptions.fields,
        "name": "resume_examples",
        "pk_field": "pk",
    },
    {
        "model": ArticleCategory,
        "fields": ArticleCategoryTranslationOptions.fields,
        "name": "article_categories",
        "pk_field": "slug",
    },
    {
        "model": Article,
        "fields": ArticleTranslationOptions.fields,
        "name": "articles",
        "pk_field": "slug",
    },
    {
        "model": Author,
        "fields": AuthorTranslationOptions.fields,
        "name": "authors",
        "pk_field": "slug",
    },
]


def _get_available_languages() -> list[str]:
    """Return list of language codes from settings."""
    return [code for code, _name in settings.LANGUAGES]


class Command(BaseCommand):
    help = "Export translatable model fields to JSON files per language."

    def add_arguments(self, parser):
        parser.add_argument(
            "--language",
            action="append",
            dest="languages",
            help="Export only the specified language(s). Can be repeated.",
        )
        parser.add_argument(
            "--output-dir",
            type=str,
            default=None,
            help="Output directory (default: <project>/locale/exports/).",
        )

    def handle(self, *args, **options):
        available = _get_available_languages()
        languages = options.get("languages") or available

        # Validate requested languages
        for lang in languages:
            if lang not in available:
                raise CommandError(
                    f"Language '{lang}' is not configured in settings.LANGUAGES. "
                    f"Available: {', '.join(available)}"
                )

        output_base = options.get("output_dir")
        if output_base:
            base_dir = Path(output_base)
        else:
            base_dir = Path(settings.BASE_DIR) / "locale" / "exports"

        total_exported = 0

        for lang in languages:
            lang_dir = base_dir / lang
            lang_dir.mkdir(parents=True, exist_ok=True)

            for entry in TRANSLATABLE_MODELS:
                model = entry["model"]
                fields = entry["fields"]
                name = entry["name"]
                pk_field = entry["pk_field"]

                records = []
                for obj in model.objects.all().order_by("pk"):
                    record = {
                        "pk": str(getattr(obj, pk_field)),
                    }
                    for field in fields:
                        # The translated field name pattern is: <field>_<lang_code_normalized>
                        # e.g. name_en_us, name_de, title_fr
                        lang_suffix = lang.replace("-", "_")
                        translated_field = f"{field}_{lang_suffix}"
                        source_value = getattr(obj, field, "")
                        translated_value = getattr(obj, translated_field, "")

                        record[field] = {
                            "source": source_value or "",
                            "translation": translated_value or "",
                        }

                    records.append(record)

                output_file = lang_dir / f"{name}.json"
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(records, f, ensure_ascii=False, indent=2)

                total_exported += len(records)
                self.stdout.write(
                    f"  Exported {len(records)} {name} records for '{lang}' "
                    f"to {output_file}"
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Export complete. {total_exported} total records exported "
                f"for {len(languages)} language(s) to {base_dir}"
            )
        )
