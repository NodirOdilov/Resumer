"""Сигналы контента — индексация в Elasticsearch."""

from __future__ import annotations

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


@receiver(post_save, sender="content.Article")
def index_article_on_save(sender, instance, **kwargs) -> None:
    """Поставить статью в очередь индексации Elasticsearch."""
    if instance.status != "published":
        return
    from apps.search.tasks import index_article

    index_article.delay(str(instance.pk))


@receiver(post_delete, sender="content.Article")
def remove_article_from_index(sender, instance, **kwargs) -> None:
    """Удалить статью из индекса при удалении."""
    try:
        from apps.search.indexes import ArticleDocument

        doc = ArticleDocument.get(id=str(instance.pk), ignore=404)
        if doc:
            doc.delete()
    except Exception:
        pass
