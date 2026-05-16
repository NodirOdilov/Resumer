"""API представления унифицированного экспорта документов."""

from __future__ import annotations

import logging

from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.audit.models import AuditAction
from apps.audit.services import AuditService
from apps.documents.serializers import DocumentExportSerializer
from apps.documents.tasks import generate_document

logger = logging.getLogger(__name__)


class DocumentExportView(APIView):
    """POST /api/v1/documents/export/

    Унифицированный endpoint экспорта resume/cv/cover_letter
    через единый Celery-пайплайн генерации.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = DocumentExportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        document_type = serializer.validated_data["document_type"]
        document_id = str(serializer.validated_data["document_id"])
        file_format = serializer.validated_data["format"]

        # Проверка владения документом.
        if not self._user_owns_document(request.user, document_type, document_id):
            return Response(
                {"error": "Документ не найден или доступ запрещён."},
                status=status.HTTP_404_NOT_FOUND,
            )

        task = generate_document.delay(document_type, document_id, file_format)

        AuditService.log(
            action=AuditAction.EXPORT,
            resource_type=document_type,
            resource_id=document_id,
            user=request.user,
            description=f"Экспорт {file_format.upper()}",
            metadata={"format": file_format, "task_id": task.id},
        )

        return Response(
            {
                "task_id": task.id,
                "status": "processing",
                "message": "Генерация документа запущена.",
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @staticmethod
    def _user_owns_document(user, document_type: str, document_id: str) -> bool:
        """Проверить, принадлежит ли документ пользователю."""
        try:
            if document_type == "resume":
                from apps.resumes.models import Resume
                return Resume.objects.filter(pk=document_id, user=user).exists()
            if document_type == "cv":
                from apps.cvs.models import CV
                return CV.objects.filter(pk=document_id, user=user).exists()
            if document_type == "cover_letter":
                from apps.cover_letters.models import CoverLetter
                return CoverLetter.objects.filter(pk=document_id, user=user).exists()
        except Exception:
            logger.exception("Ошибка проверки владения документом.")
        return False


class DocumentExportStatusView(APIView):
    """GET /api/v1/documents/export/<task_id>/status/

    Проверка статуса Celery-задачи экспорта.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, task_id: str) -> Response:
        from celery.result import AsyncResult

        result = AsyncResult(task_id)
        data: dict = {"task_id": task_id, "status": result.status}

        if result.ready():
            if result.successful():
                data["result"] = result.result
            else:
                data["error"] = str(result.result)

        return Response(data)
