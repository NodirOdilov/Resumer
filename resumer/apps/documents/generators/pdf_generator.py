from __future__ import annotations

import logging
from io import BytesIO
from pathlib import Path
from typing import Any

from django.template.loader import render_to_string
from weasyprint import CSS, HTML

logger = logging.getLogger(__name__)

# Page-size dimensions in CSS units
PAGE_SIZES: dict[str, dict[str, str]] = {
    "us_letter": {
        "width": "8.5in",
        "height": "11in",
    },
    "a4": {
        "width": "210mm",
        "height": "297mm",
    },
}

DEFAULT_PAGE_SIZE = "us_letter"


class PDFGenerator:
    """Renders resume data to a PDF file using WeasyPrint.

    Loads an HTML template from ``templates/documents/{slug}.html``, injects
    the resume data as context, and converts the resulting HTML to PDF bytes.
    """

    def generate(
        self,
        resume_data: dict[str, Any],
        template_slug: str,
        settings: dict[str, Any] | None = None,
    ) -> bytes:
        """Generate a PDF document from *resume_data*.

        Parameters
        ----------
        resume_data:
            Dictionary containing all resume sections (contact, experience, etc.).
        template_slug:
            Slug identifying the HTML template to use.
        settings:
            Optional rendering settings.  Recognised keys:

            * ``page_size`` – ``"us_letter"`` (default) or ``"a4"``.
            * ``margin_top``, ``margin_bottom``, ``margin_left``, ``margin_right``
              – CSS-compatible margin strings (e.g. ``"0.5in"``).
            * ``font_family`` – primary font family name.
            * ``font_size`` – base font size (e.g. ``"11pt"``).
            * ``primary_color`` – hex colour for headings / accents.

        Returns
        -------
        bytes
            The generated PDF file contents.
        """
        if settings is None:
            settings = {}

        template_name = f"documents/{template_slug}.html"

        # Build context for the Django template engine
        context: dict[str, Any] = {
            "resume": resume_data,
            "settings": settings,
        }

        html_content: str = render_to_string(template_name, context)

        # Determine page size
        page_size_key: str = settings.get("page_size", DEFAULT_PAGE_SIZE)
        page_dims = PAGE_SIZES.get(page_size_key, PAGE_SIZES[DEFAULT_PAGE_SIZE])

        # Build a @page CSS rule from settings
        margin_top: str = settings.get("margin_top", "0.5in")
        margin_bottom: str = settings.get("margin_bottom", "0.5in")
        margin_left: str = settings.get("margin_left", "0.5in")
        margin_right: str = settings.get("margin_right", "0.5in")
        font_family: str = settings.get("font_family", "sans-serif")
        font_size: str = settings.get("font_size", "11pt")
        primary_color: str = settings.get("primary_color", "#333333")

        page_css = (
            f"@page {{"
            f"  size: {page_dims['width']} {page_dims['height']};"
            f"  margin: {margin_top} {margin_right} {margin_bottom} {margin_left};"
            f"}}"
            f"body {{"
            f"  font-family: {font_family};"
            f"  font-size: {font_size};"
            f"  color: #333333;"
            f"}}"
            f"h1, h2, h3 {{"
            f"  color: {primary_color};"
            f"}}"
        )

        logger.info(
            "Generating PDF with template=%s, page_size=%s",
            template_slug,
            page_size_key,
        )

        html = HTML(string=html_content)
        css = CSS(string=page_css)

        buffer = BytesIO()
        html.write_pdf(target=buffer, stylesheets=[css])
        pdf_bytes: bytes = buffer.getvalue()
        buffer.close()

        logger.info(
            "PDF generated successfully: %d bytes",
            len(pdf_bytes),
        )
        return pdf_bytes
