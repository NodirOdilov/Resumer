from __future__ import annotations

import logging
from typing import Any

from django.db.models import QuerySet
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.cvs.filters import CVFilter
from apps.cvs.models import CV, CVVersion
from apps.cvs.serializers import (
    CVCreateSerializer,
    CVDetailSerializer,
    CVDownloadRequestSerializer,
    CVListSerializer,
    CVSectionSerializer,
    CVUpdateSerializer,
    CVVersionSerializer,
)
from apps.cvs.tasks import generate_cv_docx, generate_cv_pdf

logger = logging.getLogger(__name__)


class CVViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing CVs.

    list:       GET    /api/v1/cvs/
    create:     POST   /api/v1/cvs/
    retrieve:   GET    /api/v1/cvs/{id}/
    update:     PUT    /api/v1/cvs/{id}/
    partial:    PATCH  /api/v1/cvs/{id}/
    destroy:    DELETE /api/v1/cvs/{id}/ (soft-delete)
    duplicate:  POST   /api/v1/cvs/{id}/duplicate/
    download:   POST   /api/v1/cvs/{id}/download/
    preview:    GET    /api/v1/cvs/{id}/preview/
    versions:   GET    /api/v1/cvs/{id}/versions/
    restore_version: POST /api/v1/cvs/{id}/restore-version/
    sections:   GET    /api/v1/cvs/{id}/sections/
    """

    permission_classes = [permissions.IsAuthenticated]
    filterset_class = CVFilter
    search_fields = ["title"]
    ordering_fields = ["title", "status", "created_at", "updated_at", "last_edited"]
    ordering = ["-created_at"]
    lookup_field = "id"

    def get_queryset(self) -> QuerySet[CV]:
        return (
            CV.objects.filter(user=self.request.user)
            .select_related("template")
            .prefetch_related("versions", "sections")
        )

    def get_serializer_class(self) -> type:
        serializer_map: dict[str, type] = {
            "list": CVListSerializer,
            "retrieve": CVDetailSerializer,
            "create": CVCreateSerializer,
            "update": CVUpdateSerializer,
            "partial_update": CVUpdateSerializer,
            "preview": CVDetailSerializer,
        }
        return serializer_map.get(self.action, CVDetailSerializer)

    def perform_destroy(self, instance: CV) -> None:
        instance.soft_delete()

    # ── Custom actions ──────────────────────────────────────────

    @action(detail=True, methods=["post"], url_path="duplicate")
    def duplicate(self, request: Request, id: str | None = None) -> Response:
        """Create a duplicate of the specified CV, including all sections."""
        cv: CV = self.get_object()
        new_cv = cv.duplicate()
        serializer = CVDetailSerializer(new_cv, context=self.get_serializer_context())
        logger.info(
            "CV %s duplicated as %s by user %s",
            cv.id,
            new_cv.id,
            request.user.id,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="download")
    def download(self, request: Request, id: str | None = None) -> Response:
        """Request an asynchronous file generation for the CV."""
        cv: CV = self.get_object()
        serializer = CVDownloadRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_format: str = serializer.validated_data["format"]

        task_map: dict[str, Any] = {
            "pdf": generate_cv_pdf,
            "docx": generate_cv_docx,
        }
        task_func = task_map.get(file_format)
        if task_func is None:
            return Response(
                {"detail": f"Format '{file_format}' generation is not supported yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        task = task_func.delay(str(cv.id), str(request.user.id))
        logger.info(
            "Download task %s queued for CV %s (format=%s, user=%s)",
            task.id,
            cv.id,
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
        """Return the full CV data for client-side preview rendering."""
        cv: CV = self.get_object()
        serializer = CVDetailSerializer(cv, context=self.get_serializer_context())
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="versions")
    def versions(self, request: Request, id: str | None = None) -> Response:
        """List all saved versions of this CV."""
        cv: CV = self.get_object()
        versions_qs = cv.versions.order_by("-version_number")
        page = self.paginate_queryset(versions_qs)
        if page is not None:
            serializer = CVVersionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = CVVersionSerializer(versions_qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="restore-version")
    def restore_version(self, request: Request, id: str | None = None) -> Response:
        """Restore the CV content from a specific version."""
        cv: CV = self.get_object()
        version_id = request.data.get("version_id")
        if not version_id:
            return Response(
                {"detail": "version_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            version = cv.versions.get(id=version_id)
        except CVVersion.DoesNotExist:
            return Response(
                {"detail": "Version not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cv.content = version.content
        cv.save(update_fields=["content", "updated_at"])
        logger.info(
            "CV %s restored to version %s by user %s",
            cv.id,
            version.version_number,
            request.user.id,
        )
        serializer = CVDetailSerializer(cv, context=self.get_serializer_context())
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="sections")
    def sections(self, request: Request, id: str | None = None) -> Response:
        """List all sections of this CV, ordered by their position."""
        cv: CV = self.get_object()
        sections_qs = cv.sections.order_by("order")
        serializer = CVSectionSerializer(sections_qs, many=True)
        return Response(serializer.data)
