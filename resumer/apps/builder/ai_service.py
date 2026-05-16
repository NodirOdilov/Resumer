from __future__ import annotations

import hashlib
import json
import logging
import os
from typing import Any

from django.core.cache import cache

import openai

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Cache helpers
# ---------------------------------------------------------------------------
CACHE_TTL: int = 60 * 60 * 24  # 24 hours


def _build_cache_key(prefix: str, **kwargs: Any) -> str:
    """Build a deterministic cache key from arbitrary keyword arguments."""
    raw = json.dumps(kwargs, sort_keys=True, default=str)
    digest = hashlib.sha256(raw.encode()).hexdigest()[:32]
    return f"ai:{prefix}:{digest}"


# ---------------------------------------------------------------------------
# OpenAI client
# ---------------------------------------------------------------------------

_SECTION_LABELS: dict[str, str] = {
    "summary": "professional summary / objective",
    "experience": "work experience bullet point",
    "education": "education description",
    "skills": "skills section",
    "cover_letter": "cover letter",
    "project": "project description",
    "certification": "certification description",
    "volunteer": "volunteer experience",
}


def _get_client() -> openai.OpenAI:
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set.")
    return openai.OpenAI(api_key=api_key)


def is_ai_enabled() -> bool:
    """Whether real OpenAI calls can be made (key is configured)."""
    return bool(os.environ.get("OPENAI_API_KEY"))


# Demo-mode fallback content — used when no API key is configured so that
# investors can still click the AI buttons and see plausible output.
_DEMO_FALLBACK: dict[str, str] = {
    "summary": (
        "Results-driven {job_title} with a track record of delivering "
        "measurable impact. Skilled at translating business goals into "
        "scalable technical solutions, leading cross-functional initiatives, "
        "and shipping polished products on tight timelines."
    ),
    "experience": (
        "• Led a cross-functional team that delivered key {job_title} "
        "initiatives ahead of schedule.\n"
        "• Drove a 30% improvement in core KPIs through data-driven "
        "experimentation and iteration.\n"
        "• Mentored peers and established engineering best practices "
        "adopted across the org."
    ),
    "skills": (
        "Communication, stakeholder management, problem solving, project "
        "leadership, technical writing, mentoring, agile methodologies."
    ),
    "cover_letter": (
        "Dear Hiring Manager,\n\nI am writing to apply for the {job_title} "
        "position at your company. With a strong background in delivering "
        "high-impact work and collaborating across teams, I am confident I "
        "can contribute meaningfully from day one.\n\nThank you for your "
        "consideration.\n\nSincerely,\n[Your Name]"
    ),
}


def _demo_fallback(section_type: str, job_title: str) -> str:
    template = _DEMO_FALLBACK.get(section_type) or _DEMO_FALLBACK["summary"]
    return template.format(job_title=job_title or "professional")


def _label_for(section_type: str) -> str:
    return _SECTION_LABELS.get(section_type, section_type.replace("_", " "))


# ---------------------------------------------------------------------------
# AI Rewrite
# ---------------------------------------------------------------------------


def ai_rewrite(text: str, section_type: str) -> str:
    """Rewrite *text* so it reads better for a resume *section_type*.

    Results are cached in Redis (24 h TTL).  On any OpenAI error the
    original *text* is returned unchanged.
    """
    if not text or not text.strip():
        return text

    cache_key = _build_cache_key("rewrite", text=text, section_type=section_type)
    cached: str | None = cache.get(cache_key)
    if cached is not None:
        return cached

    label = _label_for(section_type)
    system_prompt = (
        "You are an expert resume writer. "
        "Rewrite the following text so it is concise, impactful, and uses "
        "strong action verbs appropriate for a resume. "
        "Return ONLY the improved text without any preamble or explanation."
    )
    user_prompt = (
        f"Section type: {label}\n\n"
        f"Original text:\n{text}"
    )

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        result = response.choices[0].message.content.strip()
    except Exception:
        logger.exception("OpenAI rewrite request failed; returning original text.")
        return text

    cache.set(cache_key, result, CACHE_TTL)
    return result


# ---------------------------------------------------------------------------
# AI Generate
# ---------------------------------------------------------------------------


def ai_generate(
    job_title: str,
    section_type: str,
    profile_data: dict[str, Any] | None = None,
) -> str:
    """Generate resume content for *section_type* based on *job_title*.

    Optional *profile_data* (name, skills, experience, education, etc.) is
    used to personalise the output.

    Results are cached in Redis (24 h TTL).
    """
    cache_key = _build_cache_key(
        "generate",
        job_title=job_title,
        section_type=section_type,
        profile_data=profile_data or {},
    )
    cached: str | None = cache.get(cache_key)
    if cached is not None:
        return cached

    # Demo mode: if the OpenAI key is not configured, return a sensible
    # fallback so the UI button still produces visible output.
    if not is_ai_enabled():
        result = _demo_fallback(section_type, job_title)
        cache.set(cache_key, result, CACHE_TTL)
        return result

    label = _label_for(section_type)
    profile_block = ""
    if profile_data:
        profile_block = (
            "\n\nCandidate profile:\n"
            + json.dumps(profile_data, indent=2, default=str)
        )

    system_prompt = (
        "You are an expert resume and cover-letter writer. "
        "Generate professional, compelling content for the requested "
        "resume section. Return ONLY the content without any preamble "
        "or explanation."
    )
    user_prompt = (
        f"Job title: {job_title}\n"
        f"Section to generate: {label}"
        f"{profile_block}\n\n"
        "Please generate the content."
    )

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=1536,
        )
        result = response.choices[0].message.content.strip()
    except Exception:
        logger.exception("OpenAI generate request failed; using demo fallback.")
        result = _demo_fallback(section_type, job_title)

    cache.set(cache_key, result, CACHE_TTL)
    return result
