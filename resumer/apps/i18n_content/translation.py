from __future__ import annotations

from modeltranslation.translator import TranslationOptions, register

from apps.content.models import Article, ArticleCategory, Author
from apps.examples.models import ExampleCategory, ResumeExample
from apps.templates_library.models import DocumentTemplate


@register(DocumentTemplate)
class DocumentTemplateTranslationOptions(TranslationOptions):
    """Translatable fields for ``DocumentTemplate``."""

    fields: tuple[str, ...] = ("name",)


@register(ExampleCategory)
class ExampleCategoryTranslationOptions(TranslationOptions):
    """Translatable fields for ``ExampleCategory``."""

    fields: tuple[str, ...] = ("name", "description")


@register(ResumeExample)
class ResumeExampleTranslationOptions(TranslationOptions):
    """Translatable fields for ``ResumeExample``."""

    fields: tuple[str, ...] = ("title", "meta_title", "meta_description")


@register(ArticleCategory)
class ArticleCategoryTranslationOptions(TranslationOptions):
    """Translatable fields for ``ArticleCategory``."""

    fields: tuple[str, ...] = ("name", "description")


@register(Article)
class ArticleTranslationOptions(TranslationOptions):
    """Translatable fields for ``Article``."""

    fields: tuple[str, ...] = (
        "title",
        "content",
        "excerpt",
        "meta_title",
        "meta_description",
    )


@register(Author)
class AuthorTranslationOptions(TranslationOptions):
    """Translatable fields for ``Author``."""

    fields: tuple[str, ...] = ("name", "bio", "title")
