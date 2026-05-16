from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

SECTION_DIVIDER = "=" * 60
SUBSECTION_DIVIDER = "-" * 40


class TXTGenerator:
    """Extracts a plain-text representation from all resume sections."""

    def generate(self, resume_data: dict[str, Any]) -> str:
        """Generate a plain-text resume from *resume_data*.

        Parameters
        ----------
        resume_data:
            Dictionary containing all resume sections.

        Returns
        -------
        str
            The complete plain-text resume.
        """
        lines: list[str] = []

        # ── Contact ─────────────────────────────────────────────────
        contact: dict[str, Any] = resume_data.get("contact", {})
        if contact:
            full_name: str = contact.get("full_name", "")
            if full_name:
                lines.append(full_name.upper())
                lines.append(SECTION_DIVIDER)

            contact_parts: list[str] = []
            for key in ("email", "phone", "location", "linkedin", "website"):
                value: str = contact.get(key, "")
                if value:
                    contact_parts.append(value)
            if contact_parts:
                lines.append(" | ".join(contact_parts))
            lines.append("")

        # ── Summary ─────────────────────────────────────────────────
        summary: str = resume_data.get("summary", "")
        if summary:
            lines.append("PROFESSIONAL SUMMARY")
            lines.append(SUBSECTION_DIVIDER)
            lines.append(summary)
            lines.append("")

        # ── Experience ──────────────────────────────────────────────
        experience: list[dict[str, Any]] = resume_data.get("experience", [])
        if experience:
            lines.append("EXPERIENCE")
            lines.append(SUBSECTION_DIVIDER)
            for job in experience:
                title: str = job.get("title", "")
                company: str = job.get("company", "")
                location: str = job.get("location", "")
                start_date: str = job.get("start_date", "")
                end_date: str = job.get("end_date", "Present")

                header_parts: list[str] = [p for p in [title, company, location] if p]
                lines.append(" | ".join(header_parts))

                date_str = f"{start_date} - {end_date}" if start_date else end_date
                if date_str:
                    lines.append(date_str)

                description: str = job.get("description", "")
                if description:
                    lines.append(description)

                bullets: list[str] = job.get("bullets", [])
                for bullet in bullets:
                    lines.append(f"  * {bullet}")

                lines.append("")

        # ── Education ───────────────────────────────────────────────
        education: list[dict[str, Any]] = resume_data.get("education", [])
        if education:
            lines.append("EDUCATION")
            lines.append(SUBSECTION_DIVIDER)
            for edu in education:
                degree: str = edu.get("degree", "")
                institution: str = edu.get("institution", edu.get("school", ""))
                edu_location: str = edu.get("location", "")
                start_date_e: str = edu.get("start_date", "")
                end_date_e: str = edu.get("end_date", "")
                gpa: str = edu.get("gpa", "")

                header = " | ".join(p for p in [degree, institution, edu_location] if p)
                lines.append(header)

                date_str_e = f"{start_date_e} - {end_date_e}" if start_date_e else end_date_e
                if date_str_e:
                    lines.append(date_str_e)
                if gpa:
                    lines.append(f"GPA: {gpa}")
                lines.append("")

        # ── Skills ──────────────────────────────────────────────────
        skills: list[str] | dict[str, Any] | list[dict[str, Any]] = resume_data.get("skills", [])
        if skills:
            lines.append("SKILLS")
            lines.append(SUBSECTION_DIVIDER)
            if isinstance(skills, dict):
                for category, items in skills.items():
                    item_str = ", ".join(items) if isinstance(items, list) else str(items)
                    lines.append(f"{category}: {item_str}")
            elif isinstance(skills, list):
                if skills and isinstance(skills[0], dict):
                    for skill in skills:
                        name = skill.get("name", "")
                        level = skill.get("level", "")
                        lines.append(f"  * {name} ({level})" if level else f"  * {name}")
                else:
                    lines.append(", ".join(str(s) for s in skills))
            lines.append("")

        # ── Languages ───────────────────────────────────────────────
        languages: list[dict[str, str]] = resume_data.get("languages", [])
        if languages:
            lines.append("LANGUAGES")
            lines.append(SUBSECTION_DIVIDER)
            for lang in languages:
                name = lang.get("name", "")
                level = lang.get("level", "")
                lines.append(f"  * {name} - {level}" if level else f"  * {name}")
            lines.append("")

        # ── Certificates ────────────────────────────────────────────
        certificates: list[dict[str, Any]] = resume_data.get("certificates", [])
        if certificates:
            lines.append("CERTIFICATES")
            lines.append(SUBSECTION_DIVIDER)
            for cert in certificates:
                name = cert.get("name", "")
                issuer = cert.get("issuer", "")
                date = cert.get("date", "")
                parts = [p for p in [name, issuer, date] if p]
                lines.append("  * " + " | ".join(parts))
            lines.append("")

        # ── Projects ────────────────────────────────────────────────
        projects: list[dict[str, Any]] = resume_data.get("projects", [])
        if projects:
            lines.append("PROJECTS")
            lines.append(SUBSECTION_DIVIDER)
            for proj in projects:
                p_title = proj.get("name", proj.get("title", ""))
                desc = proj.get("description", "")
                lines.append(p_title)
                if desc:
                    lines.append(f"  {desc}")
                lines.append("")

        # ── Awards ──────────────────────────────────────────────────
        awards: list[dict[str, Any]] = resume_data.get("awards", [])
        if awards:
            lines.append("AWARDS")
            lines.append(SUBSECTION_DIVIDER)
            for award in awards:
                name = award.get("name", award.get("title", ""))
                issuer = award.get("issuer", "")
                date = award.get("date", "")
                parts = [p for p in [name, issuer, date] if p]
                lines.append("  * " + " | ".join(parts))
            lines.append("")

        # ── Volunteer ───────────────────────────────────────────────
        volunteer: list[dict[str, Any]] = resume_data.get("volunteer", [])
        if volunteer:
            lines.append("VOLUNTEER EXPERIENCE")
            lines.append(SUBSECTION_DIVIDER)
            for vol in volunteer:
                role = vol.get("role", vol.get("title", ""))
                org = vol.get("organization", "")
                parts = [p for p in [role, org] if p]
                lines.append(" | ".join(parts))
                desc = vol.get("description", "")
                if desc:
                    lines.append(f"  {desc}")
                lines.append("")

        # ── Custom sections ─────────────────────────────────────────
        custom_sections: list[dict[str, Any]] = resume_data.get("custom_sections", [])
        for cs in custom_sections:
            section_title: str = cs.get("title", "OTHER").upper()
            items: list[str] = cs.get("items", [])
            lines.append(section_title)
            lines.append(SUBSECTION_DIVIDER)
            for item in items:
                lines.append(f"  * {item}")
            lines.append("")

        result = "\n".join(lines).strip() + "\n"

        logger.info("TXT generated successfully: %d characters", len(result))
        return result
