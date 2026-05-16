"""Сериализаторы API экспорта документов."""

from rest_framework import serializers


class DocumentExportSerializer(serializers.Serializer):
    """Запрос на экспорт документа."""

    document_type = serializers.ChoiceField(
        choices=["resume", "cv", "cover_letter"],
        help_text="Тип документа.",
    )
    document_id = serializers.UUIDField(help_text="UUID документа.")
    format = serializers.ChoiceField(
        choices=["pdf", "docx", "txt"],
        default="pdf",
        help_text="Формат экспорта.",
    )


class DocumentExportResponseSerializer(serializers.Serializer):
    """Ответ на запрос экспорта."""

    task_id = serializers.CharField(required=False)
    status = serializers.CharField()
    message = serializers.CharField(required=False)
    download_id = serializers.CharField(required=False)
    file_url = serializers.URLField(required=False)
    file_size = serializers.IntegerField(required=False)
