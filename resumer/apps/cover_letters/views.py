from __future__ import annotations

import logging
from typing import Any

from django.db.models import QuerySet
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.cover_letters.filters import CoverLetterFilter
from apps.cover_letters.models import CoverLetter, CoverLetterVersion
from apps.cover_letters.serializers import (
    CoverLetterCreateSerializer,
    CoverLetterDetailSerializer,
    CoverLetterDownloadRequestSerializer,
    CoverLetterListSerializer,
    CoverLetterUpdateSerializer,
    CoverLetterVersionSerializer,
)
from apps.cover_letters.tasks import generate_cl_docx, generate_cl_pdf

logger = logging.getLogger(__name__)


class CoverLetterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing cover letters.

    list:       GET    /api/v1/cover-letters/
    create:     POST   /api/v1/cover-letters/
    retrieve:   GET    /api/v1/cover-letters/{id}/
    update:     PUT    /api/v1/cover-letters/{id}/
    partial:    PATCH  /api/v1/cover-letters/{id}/
    destroy:    DELETE /api/v1/cover-letters/{id}/ (soft-delete)
    duplicate:  POST   /api/v1/cover-letters/{id}/duplicate/
    download:   POST   /api/v1/cover-letters/{id}/download/
    preview:    GET    /api/v1/cover-letters/{id}/preview/
    versions:   GET    /api/v1/cover-letters/{id}/versions/
    restore_version: POST /api/v1/cover-letters/{id}/restore-version/
    """

    permission_classes = [permissions.IsAuthenticated]
    filterset_class = CoverLetterFilter
    search_fields = ["title"]
    ordering_fields = ["title", "status", "created_at", "updated_at", "last_edited"]
    ordering = ["-created_at"]
    lookup_field = "id"

    def get_queryset(self) -> QuerySet[CoverLetter]:
        return (
            CoverLetter.objects.filter(user=self.request.user)
            .select_related("template", "resume")
            .prefetch_related("versions")
        )

    def get_serializer_class(self) -> type:
        serializer_map: dict[str, type] = {
            "list": CoverLetterListSerializer,
            "retrieve": CoverLetterDetailSerializer,
            "create": CoverLetterCreateSerializer,
            "update": CoverLetterUpdateSerializer,
            "partial_update": CoverLetterUpdateSerializer,
            "preview": CoverLetterDetailSerializer,
        }
        return serializer_map.get(self.action, CoverLetterDetailSerializer)

    def perform_destroy(self, instance: CoverLetter) -> None:
        instance.soft_delete()

    # ── Custom actions ──────────────────────────────────────────

    @action(detail=True, methods=["post"], url_path="duplicate")
    def duplicate(self, request: Request, id: str | None = None) -> Response:
        """Create a duplicate of the specified cover letter."""
        cover_letter: CoverLetter = self.get_object()
        new_cover_letter = cover_letter.duplicate()
        serializer = CoverLetterDetailSerializer(
            new_cover_letter, context=self.get_serializer_context()
        )
        logger.info(
            "Cover letter %s duplicated as %s by user %s",
            cover_letter.id,
            new_cover_letter.id,
            request.user.id,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="download")
    def download(self, request: Request, id: str | None = None) -> Response:
        """Request an asynchronous file generation for the cover letter."""
        cover_letter: CoverLetter = self.get_object()
        serializer = CoverLetterDownloadRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_format: str = serializer.validated_data["format"]

        task_map: dict[str, Any] = {
            "pdf": generate_cl_pdf,
            "docx": generate_cl_docx,
        }
        task_func = task_map.get(file_format)
        if task_func is None:
            return Response(
                {"detail": f"Format '{file_format}' generation is not supported yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        task = task_func.delay(str(cover_letter.id), str(request.user.id))
        logger.info(
            "Download task %s queued for cover letter %s (format=%s, user=%s)",
            task.id,
            cover_letter.id,
            file_format,
            request.user.id,
        )
        return Response(
            {
                "task_id": task.id,
                "format": file_format,
                "status": "processing",
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=["get"], url_path="preview")
    def preview(self, request: Request, id: str | None = None) -> Response:
        """Return the full cover letter data for client-side preview rendering."""
        cover_letter: CoverLetter = self.get_object()
        serializer = CoverLetterDetailSerializer(
            cover_letter, context=self.get_serializer_context()
        )
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="versions")
    def versions(self, request: Request, id: str | None = None) -> Response:
        """List all saved versions of this cover letter."""
        cover_letter: CoverLetter = self.get_object()
        versions_qs = cover_letter.versions.order_by("-version_number")
        page = self.paginate_queryset(versions_qs)
        if page is not None:
            serializer = CoverLetterVersionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = CoverLetterVersionSerializer(versions_qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="restore-version")
    def restore_version(self, request: Request, id: str | None = None) -> Response:
        """Restore the cover letter content from a specific version."""
        cover_letter: CoverLetter = self.get_object()
        version_id = request.data.get("version_id")
        if not version_id:
            return Response(
                {"detail": "version_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            version = cover_letter.versions.get(id=version_id)
        except CoverLetterVersion.DoesNotExist:
            return Response(
                {"detail": "Version not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cover_letter.content = version.content
        cover_letter.save(update_fields=["content", "updated_at"])
        logger.info(
            "Cover letter %s restored to version %s by user %s",
            cover_letter.id,
            version.version_number,
            request.user.id,
        )
        serializer = CoverLetterDetailSerializer(
            cover_letter, context=self.get_serializer_context()
        )
        return Response(serializer.data)
