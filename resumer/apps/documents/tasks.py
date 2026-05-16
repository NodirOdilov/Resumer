from __future__ import annotations

import logging
import uuid
from typing import Any

from celery import shared_task
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    name="apps.documents.tasks.generate_document",
    max_retries=3,
    default_retry_delay=30,
    acks_late=True,
)
def generate_document(
    self: Any,
    document_type: str,
    document_id: str,
    format: str,
) -> dict[str, Any]:
    """Dispatch document generation to the correct generator, save the file,
    and create a Download record.

    Parameters
    ----------
    document_type:
        Type of document — ``"resume"``, ``"cv"``, or ``"cover_letter"``.
    document_id:
        UUID primary key of the source document (Resume, CV, or CoverLetter).
    format:
        Output format — ``"pdf"``, ``"docx"``, or ``"txt"``.

    Returns
    -------
    dict
        ``{"download_id": str, "file_url": str, "file_size": int}``
    """
    from apps.documents.generators import DOCXGenerator, PDFGenerator, TXTGenerator

    # ── Resolve the source document ─────────────────────────────
    document_obj, resume_data, template_slug, render_settings = _load_document(
        document_type, document_id
    )

    # ── Generate file bytes ─────────────────────────────────────
    file_bytes: bytes
    content_type: str
    extension: str

    if format == "pdf":
        generator = PDFGenerator()
        file_bytes = generator.generate(resume_data, template_slug, render_settings)
        content_type = "application/pdf"
        extension = "pdf"
    elif format == "docx":
        generator_docx = DOCXGenerator()
        file_bytes = generator_docx.generate(resume_data, template_slug, render_settings)
        content_type = (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        extension = "docx"
    elif format == "txt":
        generator_txt = TXTGenerator()
        text_content: str = generator_txt.generate(resume_data)
        file_bytes = text_content.encode("utf-8")
        content_type = "text/plain"
        extension = "txt"
    else:
        raise ValueError(f"Unsupported format: {format!r}")

    # ── Persist file ────────────────────────────────────────────
    file_name = (
        f"downloads/{document_type}/{document_id}/"
        f"{uuid.uuid4().hex}.{extension}"
    )
    saved_path: str = default_storage.save(
        file_name,
        ContentFile(file_bytes),
    )
    file_url: str = default_storage.url(saved_path)
    file_size: int = len(file_bytes)

    # ── Create Download record ──────────────────────────────────
    download_id: str = _create_download_record(
        document_type=document_type,
        document_obj=document_obj,
        format=format,
        file_url=file_url,
        file_size=file_size,
    )

    logger.info(
        "Document generated: type=%s, id=%s, format=%s, size=%d",
        document_type,
        document_id,
        format,
        file_size,
    )

    return {
        "download_id": download_id,
        "file_url": file_url,
        "file_size": file_size,
    }


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------


def _load_document(
    document_type: str,
    document_id: str,
) -> tuple[Any, dict[str, Any], str, dict[str, Any]]:
    """Load the source document and return ``(instance, resume_data, template_slug, settings)``."""

    if document_type == "resume":
        from apps.resumes.models import Resume

        obj = Resume.all_objects.select_related("template").get(pk=document_id)
        resume_data: dict[str, Any] = obj.content or {}
        template_slug: str = obj.template.slug if obj.template else "default"
        render_settings: dict[str, Any] = obj.settings or {}
        return obj, resume_data, template_slug, render_settings

    if document_type == "cv":
        from apps.cvs.models import CV

        obj = CV.all_objects.select_related("template").get(pk=document_id)
        resume_data = obj.content or {}
        template_slug = obj.template.slug if obj.template else "default"
        render_settings = obj.settings or {}
        return obj, resume_data, template_slug, render_settings

    if document_type == "cover_letter":
        from apps.cover_letters.models import CoverLetter

        obj = CoverLetter.all_objects.select_related("template").get(pk=document_id)
        resume_data = obj.content or {}
        template_slug = obj.template.slug if obj.template else "default"
        render_settings = obj.settings or {}
        return obj, resume_data, template_slug, render_settings

    raise ValueError(f"Unknown document_type: {document_type!r}")


def _create_download_record(
    *,
    document_type: str,
    document_obj: Any,
    format: str,
    file_url: str,
    file_size: int,
) -> str:
    """Create a ``ResumeDownload`` (or equivalent) record and return its PK as string."""

    if document_type == "resume":
        from apps.resumes.models import ResumeDownload

        dl = ResumeDownload.objects.create(
            resume=document_obj,
            user=document_obj.user,
            format=format,
            file_url=file_url,
            file_size=file_size,
        )
        return str(dl.pk)

    # For CV / cover_letter types, fall back to resume download model or a
    # generic approach.  Extend as needed when those models gain their own
    # download tracking tables.
    logger.warning(
        "No dedicated download model for document_type=%s; skipping record.",
        document_type,
    )
    return ""
