"""Celery tasks for Elasticsearch index management."""

from __future__ import annotations

import logging
from typing import Any

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def index_article(self: Any, article_id: str) -> str:
    """Index or update a single article in Elasticsearch.

    Args:
        article_id: UUID string of the article to index.

    Returns:
        Status message.
    """
    from apps.content.models import Article
    from apps.search.indexes import ArticleDocument

    try:
        article = (
            Article.objects
            .select_related("category", "author")
            .prefetch_related("tags")
            .get(pk=article_id)
        )
    except Article.DoesNotExist:
        logger.warning("index_article: article %s not found.", article_id)
        return f"Article {article_id} not found."

    try:
        doc = ArticleDocument.from_django_model(article)
        doc.save()
        logger.info("Indexed article %s (%s).", article_id, article.title)
        return f"Article {article_id} indexed successfully."
    except Exception as exc:
        logger.exception("Failed to index article %s.", article_id)
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def index_example(self: Any, example_id: str, example_type: str = "resume") -> str:
    """Index or update a single example (resume or cover letter) in Elasticsearch.

    Args:
        example_id: UUID string of the example to index.
        example_type: Either 'resume' or 'cover_letter'.

    Returns:
        Status message.
    """
    if example_type == "resume":
        from apps.examples.models import ResumeExample
        from apps.search.indexes import ResumeExampleDocument

        try:
            example = (
                ResumeExample.objects
                .select_related("category")
                .get(pk=example_id)
            )
        except ResumeExample.DoesNotExist:
            logger.warning("index_example: resume example %s not found.", example_id)
            return f"Resume example {example_id} not found."

        try:
            doc = ResumeExampleDocument.from_django_model(example)
            doc.save()
            logger.info("Indexed resume example %s (%s).", example_id, example.title)
            return f"Resume example {example_id} indexed successfully."
        except Exception as exc:
            logger.exception("Failed to index resume example %s.", example_id)
            raise self.retry(exc=exc)

    elif example_type == "cover_letter":
        from apps.cl_examples.models import CoverLetterExample
        from apps.search.indexes import CoverLetterExampleDocument

        try:
            example = (
                CoverLetterExample.objects
                .select_related("category")
                .get(pk=example_id)
            )
        except CoverLetterExample.DoesNotExist:
            logger.warning("index_example: cover letter example %s not found.", example_id)
            return f"Cover letter example {example_id} not found."

        try:
            doc = CoverLetterExampleDocument.from_django_model(example)
            doc.save()
            logger.info("Indexed cover letter example %s (%s).", example_id, example.title)
            return f"Cover letter example {example_id} indexed successfully."
        except Exception as exc:
            logger.exception("Failed to index cover letter example %s.", example_id)
            raise self.retry(exc=exc)

    else:
        msg = f"Unknown example_type: {example_type}"
        logger.error(msg)
        return msg


@shared_task(bind=True, max_retries=1, default_retry_delay=120)
def rebuild_index(self: Any, index_name: str) -> str:
    """Full reindex of a specific Elasticsearch index.

    Args:
        index_name: One of 'articles', 'resume_examples', 'cover_letter_examples'.

    Returns:
        Status message with count of indexed documents.
    """
    try:
        if index_name == "articles":
            return _rebuild_articles_index()
        elif index_name == "resume_examples":
            return _rebuild_resume_examples_index()
        elif index_name == "cover_letter_examples":
            return _rebuild_cover_letter_examples_index()
        else:
            msg = f"Unknown index name: {index_name}"
            logger.error(msg)
            return msg
    except Exception as exc:
        logger.exception("Failed to rebuild index %s.", index_name)
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=1, default_retry_delay=300)
def sync_all_indexes(self: Any) -> str:
    """Reindex all Elasticsearch indices.

    Returns:
        Combined status message.
    """
    results: list[str] = []
    try:
        results.append(_rebuild_articles_index())
        results.append(_rebuild_resume_examples_index())
        results.append(_rebuild_cover_letter_examples_index())
        return " | ".join(results)
    except Exception as exc:
        logger.exception("Failed to sync all indexes.")
        raise self.retry(exc=exc)


# ---------------------------------------------------------------------------
# Private reindex helpers
# ---------------------------------------------------------------------------


def _rebuild_articles_index() -> str:
    """Delete and recreate the articles index, then index all published articles."""
    from apps.content.models import Article
    from apps.search.indexes import ArticleDocument

    # Recreate the index
    index = ArticleDocument._index
    if index.exists():
        index.delete()
    index.create()

    articles = (
        Article.published
        .select_related("category", "author")
        .prefetch_related("tags")
        .all()
    )

    count = 0
    for article in articles.iterator(chunk_size=200):
        try:
            doc = ArticleDocument.from_django_model(article)
            doc.save()
            count += 1
        except Exception:
            logger.exception("Failed to index article %s during rebuild.", article.pk)

    logger.info("Rebuilt articles index: %d documents.", count)
    return f"articles: {count} documents indexed."


def _rebuild_resume_examples_index() -> str:
    """Delete and recreate the resume_examples index."""
    from apps.examples.models import ResumeExample
    from apps.search.indexes import ResumeExampleDocument

    index = ResumeExampleDocument._index
    if index.exists():
        index.delete()
    index.create()

    examples = ResumeExample.objects.select_related("category").all()

    count = 0
    for example in examples.iterator(chunk_size=200):
        try:
            doc = ResumeExampleDocument.from_django_model(example)
            doc.save()
            count += 1
        except Exception:
            logger.exception("Failed to index resume example %s during rebuild.", example.pk)

    logger.info("Rebuilt resume_examples index: %d documents.", count)
    return f"resume_examples: {count} documents indexed."


def _rebuild_cover_letter_examples_index() -> str:
    """Delete and recreate the cover_letter_examples index."""
    from apps.cl_examples.models import CoverLetterExample
    from apps.search.indexes import CoverLetterExampleDocument

    index = CoverLetterExampleDocument._index
    if index.exists():
        index.delete()
    index.create()

    examples = CoverLetterExample.objects.select_related("category").all()

    count = 0
    for example in examples.iterator(chunk_size=200):
        try:
            doc = CoverLetterExampleDocument.from_django_model(example)
            doc.save()
            count += 1
        except Exception:
            logger.exception("Failed to index cover letter example %s during rebuild.", example.pk)

    logger.info("Rebuilt cover_letter_examples index: %d documents.", count)
    return f"cover_letter_examples: {count} documents indexed."
