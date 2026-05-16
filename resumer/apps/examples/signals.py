"""Сигналы примеров резюме — индексация в Elasticsearch."""

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


@receiver(post_save, sender="examples.ResumeExample")
def index_resume_example_on_save(sender, instance, **kwargs) -> None:
    from apps.search.tasks import index_example

    index_example.delay(str(instance.pk), example_type="resume")


@receiver(post_delete, sender="examples.ResumeExample")
def remove_resume_example_from_index(sender, instance, **kwargs) -> None:
    try:
        from apps.search.indexes import ResumeExampleDocument

        doc = ResumeExampleDocument.get(id=str(instance.pk), ignore=404)
        if doc:
            doc.delete()
    except Exception:
        pass
