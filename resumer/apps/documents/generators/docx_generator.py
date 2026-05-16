from __future__ import annotations

import logging
from io import BytesIO
from typing import Any

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Mm, Pt, RGBColor

logger = logging.getLogger(__name__)

# Page dimensions
PAGE_SIZES: dict[str, dict[str, Any]] = {
    "us_letter": {
        "width": Inches(8.5),
        "height": Inches(11),
    },
    "a4": {
        "width": Mm(210),
        "height": Mm(297),
    },
}

DEFAULT_PAGE_SIZE = "us_letter"


def _hex_to_rgb(hex_color: str) -> RGBColor:
    """Convert a hex colour string (``#RRGGBB``) to a ``RGBColor``."""
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return RGBColor(r, g, b)


class DOCXGenerator:
    """Builds a ``.docx`` document programmatically from resume data.

    Uses *python-docx* to create sections, headings, tables and styled
    paragraphs matching the resume content.
    """

    def generate(
        self,
        resume_data: dict[str, Any],
        template_slug: str,
        settings: dict[str, Any] | None = None,
    ) -> bytes:
        """Generate a DOCX document from *resume_data*.

        Parameters
        ----------
        resume_data:
            Dictionary containing all resume sections.
        template_slug:
            Template slug (used for future style-mapping expansion).
        settings:
            Optional rendering settings.  Recognised keys:

            * ``page_size`` – ``"us_letter"`` (default) or ``"a4"``.
            * ``margin_top``, ``margin_bottom``, ``margin_left``, ``margin_right``
              – Margin in inches (float).
            * ``font_name`` – Base font name (default ``"Calibri"``).
            * ``font_size`` – Base font size in pt (int, default ``11``).
            * ``primary_color`` – Hex colour for headings.

        Returns
        -------
        bytes
            The generated DOCX file contents.
        """
        if settings is None:
            settings = {}

        doc = Document()

        # ── Page setup ──────────────────────────────────────────────
        page_size_key: str = settings.get("page_size", DEFAULT_PAGE_SIZE)
        dims = PAGE_SIZES.get(page_size_key, PAGE_SIZES[DEFAULT_PAGE_SIZE])

        section = doc.sections[0]
        section.page_width = dims["width"]
        section.page_height = dims["height"]
        section.orientation = WD_ORIENT.PORTRAIT

        section.top_margin = Inches(settings.get("margin_top", 0.5))
        section.bottom_margin = Inches(settings.get("margin_bottom", 0.5))
        section.left_margin = Inches(settings.get("margin_left", 0.5))
        section.right_margin = Inches(settings.get("margin_right", 0.5))

        font_name: str = settings.get("font_name", "Calibri")
        font_size: int = settings.get("font_size", 11)
        primary_color: str = settings.get("primary_color", "#2C3E50")

        # ── Default style ───────────────────────────────────────────
        style = doc.styles["Normal"]
        font = style.font
        font.name = font_name
        font.size = Pt(font_size)
        style.paragraph_format.space_after = Pt(2)

        # ── Contact / header ────────────────────────────────────────
        contact: dict[str, Any] = resume_data.get("contact", {})
        if contact:
            self._add_contact_section(doc, contact, font_name, primary_color)

        # ── Summary ─────────────────────────────────────────────────
        summary: str = resume_data.get("summary", "")
        if summary:
            self._add_heading(doc, "Professional Summary", font_name, primary_color)
            p = doc.add_paragraph(summary)
            p.style.font.name = font_name

        # ── Experience ──────────────────────────────────────────────
        experience: list[dict[str, Any]] = resume_data.get("experience", [])
        if experience:
            self._add_heading(doc, "Experience", font_name, primary_color)
            for job in experience:
                self._add_experience_entry(doc, job, font_name)

        # ── Education ───────────────────────────────────────────────
        education: list[dict[str, Any]] = resume_data.get("education", [])
        if education:
            self._add_heading(doc, "Education", font_name, primary_color)
            for edu in education:
                self._add_education_entry(doc, edu, font_name)

        # ── Skills ──────────────────────────────────────────────────
        skills: list[str] | dict[str, Any] = resume_data.get("skills", [])
        if skills:
            self._add_heading(doc, "Skills", font_name, primary_color)
            self._add_skills_section(doc, skills, font_name)

        # ── Languages ───────────────────────────────────────────────
        languages: list[dict[str, str]] = resume_data.get("languages", [])
        if languages:
            self._add_heading(doc, "Languages", font_name, primary_color)
            for lang in languages:
                name = lang.get("name", "")
                level = lang.get("level", "")
                text = f"{name} — {level}" if level else name
                doc.add_paragraph(text, style="List Bullet")

        # ── Certificates ────────────────────────────────────────────
        certificates: list[dict[str, Any]] = resume_data.get("certificates", [])
        if certificates:
            self._add_heading(doc, "Certificates", font_name, primary_color)
            for cert in certificates:
                name = cert.get("name", "")
                issuer = cert.get("issuer", "")
                date = cert.get("date", "")
                parts = [p for p in [name, issuer, date] if p]
                doc.add_paragraph(" | ".join(parts), style="List Bullet")

        # ── Projects ────────────────────────────────────────────────
        projects: list[dict[str, Any]] = resume_data.get("projects", [])
        if projects:
            self._add_heading(doc, "Projects", font_name, primary_color)
            for proj in projects:
                p_title = proj.get("name", proj.get("title", ""))
                desc = proj.get("description", "")
                p = doc.add_paragraph()
                run = p.add_run(p_title)
                run.bold = True
                run.font.name = font_name
                if desc:
                    doc.add_paragraph(desc)

        # ── Custom sections ─────────────────────────────────────────
        custom_sections: list[dict[str, Any]] = resume_data.get("custom_sections", [])
        for cs in custom_sections:
            section_title: str = cs.get("title", "Other")
            items: list[str] = cs.get("items", [])
            self._add_heading(doc, section_title, font_name, primary_color)
            for item in items:
                doc.add_paragraph(item, style="List Bullet")

        # ── Serialise ───────────────────────────────────────────────
        buffer = BytesIO()
        doc.save(buffer)
        docx_bytes: bytes = buffer.getvalue()
        buffer.close()

        logger.info(
            "DOCX generated successfully: template=%s, %d bytes",
            template_slug,
            len(docx_bytes),
        )
        return docx_bytes

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _add_heading(
        doc: Document,
        text: str,
        font_name: str,
        primary_color: str,
    ) -> None:
        heading = doc.add_heading(level=2)
        run = heading.add_run(text)
        run.font.name = font_name
        run.font.size = Pt(14)
        run.font.color.rgb = _hex_to_rgb(primary_color)

    @staticmethod
    def _add_contact_section(
        doc: Document,
        contact: dict[str, Any],
        font_name: str,
        primary_color: str,
    ) -> None:
        full_name: str = contact.get("full_name", "")
        if full_name:
            heading = doc.add_heading(level=1)
            heading.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = heading.add_run(full_name)
            run.font.name = font_name
            run.font.size = Pt(20)
            run.font.color.rgb = _hex_to_rgb(primary_color)

        contact_parts: list[str] = []
        for key in ("email", "phone", "location", "linkedin", "website"):
            value: str = contact.get(key, "")
            if value:
                contact_parts.append(value)

        if contact_parts:
            p = doc.add_paragraph(" | ".join(contact_parts))
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = font_name
                run.font.size = Pt(9)

    @staticmethod
    def _add_experience_entry(
        doc: Document,
        job: dict[str, Any],
        font_name: str,
    ) -> None:
        title: str = job.get("title", "")
        company: str = job.get("company", "")
        location: str = job.get("location", "")
        start_date: str = job.get("start_date", "")
        end_date: str = job.get("end_date", "Present")
        description: str = job.get("description", "")
        bullets: list[str] = job.get("bullets", [])

        # Title + Company row
        p = doc.add_paragraph()
        run = p.add_run(title)
        run.bold = True
        run.font.name = font_name
        if company:
            run2 = p.add_run(f"  |  {company}")
            run2.font.name = font_name
        if location:
            run3 = p.add_run(f"  |  {location}")
            run3.font.name = font_name

        # Date row
        date_str = f"{start_date} — {end_date}" if start_date else end_date
        if date_str:
            date_p = doc.add_paragraph(date_str)
            date_p.runs[0].font.size = Pt(9)
            date_p.runs[0].italic = True
            date_p.runs[0].font.name = font_name

        # Description
        if description:
            doc.add_paragraph(description)

        # Bullet points
        for bullet in bullets:
            doc.add_paragraph(bullet, style="List Bullet")

    @staticmethod
    def _add_education_entry(
        doc: Document,
        edu: dict[str, Any],
        font_name: str,
    ) -> None:
        degree: str = edu.get("degree", "")
        institution: str = edu.get("institution", edu.get("school", ""))
        location: str = edu.get("location", "")
        start_date: str = edu.get("start_date", "")
        end_date: str = edu.get("end_date", "")
        gpa: str = edu.get("gpa", "")

        p = doc.add_paragraph()
        run = p.add_run(degree)
        run.bold = True
        run.font.name = font_name
        if institution:
            run2 = p.add_run(f"  |  {institution}")
            run2.font.name = font_name
        if location:
            run3 = p.add_run(f"  |  {location}")
            run3.font.name = font_name

        date_str = f"{start_date} — {end_date}" if start_date else end_date
        if date_str:
            date_p = doc.add_paragraph(date_str)
            date_p.runs[0].font.size = Pt(9)
            date_p.runs[0].italic = True
            date_p.runs[0].font.name = font_name

        if gpa:
            doc.add_paragraph(f"GPA: {gpa}")

    @staticmethod
    def _add_skills_section(
        doc: Document,
        skills: list[str] | dict[str, Any],
        font_name: str,
    ) -> None:
        if isinstance(skills, dict):
            # Grouped skills: {"Technical": ["Python", "Django"], ...}
            for category, items in skills.items():
                p = doc.add_paragraph()
                run = p.add_run(f"{category}: ")
                run.bold = True
                run.font.name = font_name
                skill_text = ", ".join(items) if isinstance(items, list) else str(items)
                run2 = p.add_run(skill_text)
                run2.font.name = font_name
        elif isinstance(skills, list):
            if skills and isinstance(skills[0], dict):
                # List of {"name": ..., "level": ...}
                for skill in skills:
                    name = skill.get("name", "")
                    level = skill.get("level", "")
                    text = f"{name} — {level}" if level else name
                    doc.add_paragraph(text, style="List Bullet")
            else:
                # Simple list of strings
                p = doc.add_paragraph()
                run = p.add_run(", ".join(str(s) for s in skills))
                run.font.name = font_name
