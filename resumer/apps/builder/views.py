from __future__ import annotations

import logging
from typing import Any

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.builder.ai_service import ai_generate, ai_rewrite
from apps.builder.suggestions import (
    get_company_suggestions,
    get_job_title_suggestions,
    get_skill_suggestions,
    get_suggestions,
)
from apps.core.throttling import AIRateThrottle

logger = logging.getLogger(__name__)


class SuggestionsView(APIView):
    """Return pre-written content suggestions for a resume section.

    **GET** ``/api/v1/suggestions/content/{section_type}/{job_title}/``
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, section_type: str, job_title: str) -> Response:
        suggestions: list[str] = get_suggestions(section_type, job_title)
        return Response(
            {
                "section_type": section_type,
                "job_title": job_title,
                "suggestions": suggestions,
            },
            status=status.HTTP_200_OK,
        )


class SkillSuggestionsView(APIView):
    """Return skill autocomplete suggestions for a job title.

    **GET** ``/api/v1/suggestions/skills/?job_title=software_engineer``
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        job_title: str = request.query_params.get("job_title", "")
        query: str = request.query_params.get("q", "")

        skills: list[str] = get_skill_suggestions(job_title)

        # Optional client-side filtering when ``q`` is provided
        if query:
            q_lower = query.lower()
            skills = [s for s in skills if q_lower in s.lower()]

        return Response(
            {
                "job_title": job_title,
                "skills": skills,
            },
            status=status.HTTP_200_OK,
        )


class JobTitleSuggestionsView(APIView):
    """Return job title autocomplete suggestions.

    **GET** ``/api/v1/suggestions/job-titles/?q=soft``
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        query: str = request.query_params.get("q", "")
        titles: list[str] = get_job_title_suggestions(query)
        return Response(
            {"query": query, "titles": titles},
            status=status.HTTP_200_OK,
        )


class CompanySuggestionsView(APIView):
    """Return company name autocomplete suggestions.

    **GET** ``/api/v1/suggestions/companies/?q=goo``
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        query: str = request.query_params.get("q", "")
        companies: list[str] = get_company_suggestions(query)
        return Response(
            {"query": query, "companies": companies},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# AI-powered endpoints
# ---------------------------------------------------------------------------

VALID_SECTION_TYPES: set[str] = {
    "summary",
    "experience",
    "education",
    "skills",
    "cover_letter",
    "project",
    "certification",
    "volunteer",
}


class AIRewriteView(APIView):
    """Rewrite resume text using AI.

    **POST** ``/api/v1/builder/ai/rewrite/``

    Request body::

        {
            "text": "...",
            "section_type": "experience"
        }

    Returns the improved text. On AI failure the original text is returned.
    """

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRateThrottle]

    def post(self, request: Request) -> Response:
        text: str = (request.data.get("text") or "").strip()
        section_type: str = (request.data.get("section_type") or "").strip()

        if not text:
            return Response(
                {"detail": "The 'text' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if section_type and section_type not in VALID_SECTION_TYPES:
            return Response(
                {
                    "detail": f"Invalid section_type. Choose from: {', '.join(sorted(VALID_SECTION_TYPES))}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        section_type = section_type or "summary"
        improved_text: str = ai_rewrite(text, section_type)

        return Response(
            {
                "original_text": text,
                "improved_text": improved_text,
                "section_type": section_type,
            },
            status=status.HTTP_200_OK,
        )


class AIGenerateView(APIView):
    """Generate resume content using AI.

    **POST** ``/api/v1/builder/ai/generate/``

    Request body::

        {
            "job_title": "Software Engineer",
            "section_type": "summary",
            "profile_data": { ... }   // optional
        }

    Returns the generated content.
    """

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIRateThrottle]

    def post(self, request: Request) -> Response:
        job_title: str = (request.data.get("job_title") or "").strip()
        section_type: str = (request.data.get("section_type") or "").strip()
        profile_data: dict[str, Any] | None = request.data.get("profile_data")

        if not job_title:
            return Response(
                {"detail": "The 'job_title' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not section_type:
            return Response(
                {"detail": "The 'section_type' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if section_type not in VALID_SECTION_TYPES:
            return Response(
                {
                    "detail": f"Invalid section_type. Choose from: {', '.join(sorted(VALID_SECTION_TYPES))}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            generated_text: str = ai_generate(job_title, section_type, profile_data)
        except Exception:
            logger.exception("AI content generation failed.")
            return Response(
                {"detail": "AI content generation failed. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "job_title": job_title,
                "section_type": section_type,
                "generated_text": generated_text,
            },
            status=status.HTTP_200_OK,
        )
