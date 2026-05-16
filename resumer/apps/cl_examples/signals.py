"""Сигналы примеров cover letter — индексация в Elasticsearch."""

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


@receiver(post_save, sender="cl_examples.CoverLetterExample")
def index_cl_example_on_save(sender, instance, **kwargs) -> None:
    from apps.search.tasks import index_example

    index_example.delay(str(instance.pk), example_type="cover_letter")


@receiver(post_delete, sender="cl_examples.CoverLetterExample")
def remove_cl_example_from_index(sender, instance, **kwargs) -> None:
    try:
        from apps.search.indexes import CoverLetterExampleDocument

        doc = CoverLetterExampleDocument.get(id=str(instance.pk), ignore=404)
        if doc:
            doc.delete()
    except Exception:
        pass
