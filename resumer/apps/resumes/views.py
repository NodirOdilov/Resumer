from __future__ import annotations

import copy
import logging
from typing import Any

from django.db import transaction
from django.db.models import QuerySet
from django.template.loader import render_to_string
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.permissions import IsOwnerPermission
from apps.resumes.filters import ResumeFilter
from apps.resumes.models import (
    Resume,
    ResumeDownload,
    ResumeSection,
    ResumeVersion,
)
from apps.resumes.serializers import (
    ChangeTemplateSerializer,
    ResumeCreateSerializer,
    ResumeDetailSerializer,
    ResumeDownloadRequestSerializer,
    ResumeDownloadSerializer,
    ResumeListSerializer,
    ResumeSectionSerializer,
    ResumeSettingsSerializer,
    ResumeUpdateSerializer,
    ResumeVersionSerializer,
    ReorderSectionsSerializer,
    RestoreVersionSerializer,
)
from apps.documents.tasks import generate_document

logger = logging.getLogger(__name__)


class ResumeViewSet(viewsets.ModelViewSet):  # type: ignore[type-arg]
    """ViewSet for managing user resumes.

    Provides standard CRUD plus custom actions for duplication, download,
    preview, section reordering, template change, settings update,
    version history, and version restoration.
    """

    permission_classes = [permissions.IsAuthenticated, IsOwnerPermission]
    filterset_class = ResumeFilter
    search_fields = ["title"]
    ordering_fields = ["title", "status", "created_at", "updated_at", "last_edited"]
    ordering = ["-updated_at"]
    lookup_field = "pk"

    def get_queryset(self) -> QuerySet[Resume]:
        """Return only the authenticated user's non-deleted resumes."""
        return (
            Resume.objects.filter(user=self.request.user)
            .select_related("template", "user")
            .prefetch_related("sections")
        )

    def get_serializer_class(self) -> type:
        """Return the appropriate serializer for each action."""
        if self.action == "list":
            return ResumeListSerializer
        if self.action == "create":
            return ResumeCreateSerializer
        if self.action in {"update", "partial_update"}:
            return ResumeUpdateSerializer
        return ResumeDetailSerializer

    def perform_destroy(self, instance: Resume) -> None:
        """Soft-delete the resume instead of hard-deleting."""
        instance.soft_delete()

    # ──────────────────── Custom actions ────────────────────

    @action(detail=True, methods=["post"], url_path="duplicate")
    def duplicate(self, request: Request, pk: str | None = None) -> Response:
        """Create a duplicate of the specified resume."""
        original: Resume = self.get_object()

        with transaction.atomic():
            new_resume = Resume(
                user=request.user,
                title=f"{original.title} (Copy)",
                template=original.template,
                status=Resume.Status.DRAFT,
                content=copy.deepcopy(original.content),
                settings=copy.deepcopy(original.settings),
                language=original.language,
            )
            new_resume.save()

            # Duplicate sections
            sections = original.sections.all().order_by("order")
            for section in sections:
                ResumeSection.objects.create(
                    resume=new_resume,
                    section_type=section.section_type,
                    content=copy.deepcopy(section.content),
                    order=section.order,
                    is_visible=section.is_visible,
                )

        serializer = ResumeDetailSerializer(new_resume, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="download")
    def download(self, request: Request, pk: str | None = None) -> Response:
        """Trigger async file generation for the specified resume."""
        resume: Resume = self.get_object()
        serializer = ResumeDownloadRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_format: str = serializer.validated_data["format"]

        if file_format in (ResumeDownload.Format.PDF, ResumeDownload.Format.DOCX):
            task = generate_document.delay("resume", str(resume.pk), file_format)
        else:
            # TXT: generate synchronously since it is lightweight
            content_data: dict[str, Any] = resume.content or {}
            text_lines: list[str] = [
                resume.title,
                "=" * len(resume.title),
                "",
            ]
            for section in resume.sections.filter(is_visible=True).order_by("order"):
                text_lines.append(section.get_section_type_display().upper())
                text_lines.append("-" * 40)
                section_content = section.content
                if isinstance(section_content, str):
                    text_lines.append(section_content)
                elif isinstance(section_content, list):
                    for item in section_content:
                        if isinstance(item, dict):
                            for k, v in item.items():
                                text_lines.append(f"  {k}: {v}")
                        else:
                            text_lines.append(f"  - {item}")
                elif isinstance(section_content, dict):
                    for k, v in section_content.items():
                        text_lines.append(f"  {k}: {v}")
                text_lines.append("")

            return Response(
                {
                    "format": "txt",
                    "content": "\n".join(text_lines),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "task_id": task.id,
                "format": file_format,
                "message": f"{file_format.upper()} generation started. Poll task for result.",
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=["get"], url_path="preview")
    def preview(self, request: Request, pk: str | None = None) -> Response:
        """Return an HTML preview of the resume."""
        resume: Resume = self.get_object()

        template_name = "resumes/preview.html"
        if resume.template:
            template_name = f"resumes/templates/{resume.template.slug}_preview.html"

        html: str = render_to_string(template_name, {
            "resume": resume,
            "content": resume.content,
            "settings": resume.settings,
            "sections": resume.sections.filter(is_visible=True).order_by("order"),
        })
        return Response({"html": html}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="reorder-sections")
    def reorder_sections(self, request: Request, pk: str | None = None) -> Response:
        """Reorder the sections of a resume by providing an ordered list of section IDs."""
        resume: Resume = self.get_object()
        serializer = ReorderSectionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        section_ids: list[Any] = serializer.validated_data["section_ids"]

        # Validate all IDs belong to this resume
        existing_ids = set(
            resume.sections.values_list("id", flat=True)
        )
        provided_ids = set(section_ids)
        if provided_ids != existing_ids:
            missing = existing_ids - provided_ids
            extra = provided_ids - existing_ids
            errors: list[str] = []
            if missing:
                errors.append(f"Missing section IDs: {[str(s) for s in missing]}")
            if extra:
                errors.append(f"Unknown section IDs: {[str(s) for s in extra]}")
            return Response(
                {"detail": "; ".join(errors)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            for order, section_id in enumerate(section_ids):
                ResumeSection.objects.filter(
                    pk=section_id, resume=resume
                ).update(order=order)

        sections = resume.sections.all().order_by("order")
        section_serializer = ResumeSectionSerializer(sections, many=True)
        return Response(section_serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="change-template")
    def change_template(self, request: Request, pk: str | None = None) -> Response:
        """Change the template of a resume."""
        resume: Resume = self.get_object()
        serializer = ChangeTemplateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume.template_id = serializer.validated_data["template_id"]
        resume.save(update_fields=["template_id", "updated_at"])

        detail_serializer = ResumeDetailSerializer(resume, context={"request": request})
        return Response(detail_serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path="update-settings")
    def update_settings(self, request: Request, pk: str | None = None) -> Response:
        """Partially update the rendering settings of a resume."""
        resume: Resume = self.get_object()
        serializer = ResumeSettingsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_settings: dict[str, Any] = serializer.validated_data["settings"]
        current_settings: dict[str, Any] = resume.settings or {}
        current_settings.update(new_settings)
        resume.settings = current_settings
        resume.save(update_fields=["settings", "updated_at"])

        detail_serializer = ResumeDetailSerializer(resume, context={"request": request})
        return Response(detail_serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="versions")
    def versions(self, request: Request, pk: str | None = None) -> Response:
        """List all versions of the specified resume."""
        resume: Resume = self.get_object()
        versions_qs = ResumeVersion.objects.filter(resume=resume).order_by("-version_number")
        page = self.paginate_queryset(versions_qs)
        if page is not None:
            serializer = ResumeVersionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ResumeVersionSerializer(versions_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="restore-version")
    def restore_version(self, request: Request, pk: str | None = None) -> Response:
        """Restore a resume to the content of a previous version."""
        resume: Resume = self.get_object()
        serializer = RestoreVersionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        version_id = serializer.validated_data["version_id"]
        try:
            version = ResumeVersion.objects.get(pk=version_id, resume=resume)
        except ResumeVersion.DoesNotExist:
            return Response(
                {"detail": "Version not found for this resume."},
                status=status.HTTP_404_NOT_FOUND,
            )

        resume.content = copy.deepcopy(version.content)
        resume.save(update_fields=["content", "updated_at"])

        detail_serializer = ResumeDetailSerializer(resume, context={"request": request})
        return Response(detail_serializer.data, status=status.HTTP_200_OK)
