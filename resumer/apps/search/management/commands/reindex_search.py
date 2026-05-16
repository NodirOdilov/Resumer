"""Management-команда полной переиндексации Elasticsearch."""

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Переиндексировать все Elasticsearch-индексы платформы Resumer."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--index",
            type=str,
            default="all",
            choices=["all", "articles", "resume_examples", "cover_letter_examples"],
            help="Какой индекс переиндексировать (по умолчанию: all).",
        )
        parser.add_argument(
            "--async",
            action="store_true",
            help="Запустить через Celery (асинхронно).",
        )

    def handle(self, *args, **options) -> None:
        index_name = options["index"]
        use_async = options["async"]

        if use_async:
            from apps.search.tasks import rebuild_index, sync_all_indexes

            if index_name == "all":
                result = sync_all_indexes.delay()
                self.stdout.write(self.style.SUCCESS(f"Задача Celery запущена: {result.id}"))
            else:
                result = rebuild_index.delay(index_name)
                self.stdout.write(self.style.SUCCESS(f"Задача Celery запущена: {result.id}"))
            return

        from apps.search.tasks import _rebuild_articles_index, _rebuild_cover_letter_examples_index, _rebuild_resume_examples_index

        if index_name in ("all", "articles"):
            msg = _rebuild_articles_index()
            self.stdout.write(self.style.SUCCESS(msg))

        if index_name in ("all", "resume_examples"):
            msg = _rebuild_resume_examples_index()
            self.stdout.write(self.style.SUCCESS(msg))

        if index_name in ("all", "cover_letter_examples"):
            msg = _rebuild_cover_letter_examples_index()
            self.stdout.write(self.style.SUCCESS(msg))

        self.stdout.write(self.style.SUCCESS("Переиндексация завершена."))
