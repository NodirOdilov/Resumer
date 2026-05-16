from __future__ import annotations

import io
import logging
import uuid
from typing import Any

from celery import shared_task
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)


def _upload_to_s3(file_bytes: bytes, key: str, content_type: str) -> str:
    """Upload file bytes to S3 and return the public URL."""
    import boto3  # noqa: WPS433

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )
    bucket: str = settings.AWS_STORAGE_BUCKET_NAME
    s3_client.put_object(
        Bucket=bucket,
        Key=key,
        Body=file_bytes,
        ContentType=content_type,
    )

    if settings.AWS_S3_CUSTOM_DOMAIN:
        return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{key}"
    return f"https://{bucket}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{key}"


@shared_task(
    bind=True,
    name="apps.resumes.tasks.generate_pdf",
    max_retries=3,
    default_retry_delay=30,
    acks_late=True,
)
def generate_pdf(self: Any, resume_id: str) -> dict[str, Any]:
    """Generate a PDF file for the given resume and upload it to S3.

    Returns a dict with file_url, file_size, and format.
    """
    from apps.resumes.models import Resume, ResumeDownload  # noqa: WPS433

    try:
        resume = Resume.objects.select_related("user", "template").get(pk=resume_id)
    except Resume.DoesNotExist:
        logger.error("Resume %s not found for PDF generation.", resume_id)
        return {"error": f"Resume {resume_id} not found."}

    try:
        # Render HTML from resume content and template
        template_name = "resumes/pdf_template.html"
        if resume.template:
            template_name = f"resumes/templates/{resume.template.slug}.html"

        html_content: str = render_to_string(template_name, {
            "resume": resume,
            "content": resume.content,
            "settings": resume.settings,
        })

        # Convert HTML to PDF using weasyprint
        import weasyprint  # noqa: WPS433

        pdf_bytes: bytes = weasyprint.HTML(string=html_content).write_pdf()

        # Upload to S3
        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
        s3_key = (
            f"resumes/{resume.user_id}/{resume.pk}/pdf/"
            f"{resume.slug}_{timestamp}.pdf"
        )
        file_url: str = _upload_to_s3(pdf_bytes, s3_key, "application/pdf")
        file_size: int = len(pdf_bytes)

        # Record the download
        ResumeDownload.objects.create(
            resume=resume,
            user=resume.user,
            format=ResumeDownload.Format.PDF,
            file_url=file_url,
            file_size=file_size,
        )

        # Increment download counter
        Resume.objects.filter(pk=resume.pk).update(
            downloads_count=resume.downloads_count + 1,
        )

        logger.info(
            "PDF generated for resume %s (%d bytes).",
            resume_id,
            file_size,
        )
        return {
            "file_url": file_url,
            "file_size": file_size,
            "format": "pdf",
        }

    except Exception as exc:
        logger.exception("Failed to generate PDF for resume %s.", resume_id)
        raise self.retry(exc=exc)


@shared_task(
    bind=True,
    name="apps.resumes.tasks.generate_docx",
    max_retries=3,
    default_retry_delay=30,
    acks_late=True,
)
def generate_docx(self: Any, resume_id: str) -> dict[str, Any]:
    """Generate a DOCX file for the given resume and upload it to S3.

    Returns a dict with file_url, file_size, and format.
    """
    from apps.resumes.models import Resume, ResumeDownload  # noqa: WPS433

    try:
        resume = Resume.objects.select_related("user", "template").get(pk=resume_id)
    except Resume.DoesNotExist:
        logger.error("Resume %s not found for DOCX generation.", resume_id)
        return {"error": f"Resume {resume_id} not found."}

    try:
        from docx import Document  # noqa: WPS433
        from docx.shared import Inches, Pt  # noqa: WPS433

        doc = Document()

        # Apply resume settings
        resume_settings: dict[str, Any] = resume.settings or {}
        content_data: dict[str, Any] = resume.content or {}

        # Title
        title_text: str = content_data.get("name", resume.title)
        doc.add_heading(title_text, level=0)

        # Contact info
        contact: dict[str, str] = content_data.get("contact", {})
        if contact:
            contact_parts: list[str] = []
            if contact.get("email"):
                contact_parts.append(contact["email"])
            if contact.get("phone"):
                contact_parts.append(contact["phone"])
            if contact.get("location"):
                contact_parts.append(contact["location"])
            if contact_parts:
                doc.add_paragraph(" | ".join(contact_parts))

        # Sections from the sections relationship
        sections = resume.sections.filter(is_visible=True).order_by("order")
        for section in sections:
            doc.add_heading(section.get_section_type_display(), level=1)
            section_content: Any = section.content
            if isinstance(section_content, str):
                doc.add_paragraph(section_content)
            elif isinstance(section_content, list):
                for item in section_content:
                    if isinstance(item, dict):
                        title = item.get("title", item.get("name", ""))
                        if title:
                            doc.add_heading(title, level=2)
                        description = item.get("description", item.get("summary", ""))
                        if description:
                            doc.add_paragraph(description)
                    elif isinstance(item, str):
                        doc.add_paragraph(item, style="List Bullet")
            elif isinstance(section_content, dict):
                for key, val in section_content.items():
                    doc.add_paragraph(f"{key}: {val}")

        # Save to bytes
        buffer = io.BytesIO()
        doc.save(buffer)
        docx_bytes: bytes = buffer.getvalue()

        # Upload to S3
        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
        s3_key = (
            f"resumes/{resume.user_id}/{resume.pk}/docx/"
            f"{resume.slug}_{timestamp}.docx"
        )
        file_url: str = _upload_to_s3(
            docx_bytes,
            s3_key,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        file_size: int = len(docx_bytes)

        # Record the download
        ResumeDownload.objects.create(
            resume=resume,
            user=resume.user,
            format=ResumeDownload.Format.DOCX,
            file_url=file_url,
            file_size=file_size,
        )

        # Increment download counter
        Resume.objects.filter(pk=resume.pk).update(
            downloads_count=resume.downloads_count + 1,
        )

        logger.info(
            "DOCX generated for resume %s (%d bytes).",
            resume_id,
            file_size,
        )
        return {
            "file_url": file_url,
            "file_size": file_size,
            "format": "docx",
        }

    except Exception as exc:
        logger.exception("Failed to generate DOCX for resume %s.", resume_id)
        raise self.retry(exc=exc)
