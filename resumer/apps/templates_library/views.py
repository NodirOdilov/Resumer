from __future__ import annotations

from typing import Any

from django.db.models import Count, QuerySet
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.pagination import StandardPagination
from apps.templates_library.models import DocumentTemplate
from apps.templates_library.serializers import (
    TemplateCategorySerializer,
    TemplateDetailSerializer,
    TemplateListSerializer,
)


class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for browsing document templates.

    list:
        Return a paginated list of active templates.  Supports query-param
        filters: ``type``, ``category``, ``is_new``, ``is_premium``,
        ``is_ats_friendly``, ``search`` (name icontains).

    retrieve:
        Return full details for a single template (looked up by **slug**).

    preview:
        Return the template detail together with demo data suitable for
        rendering a live preview.
    """

    permission_classes = [AllowAny]
    pagination_class = StandardPagination
    lookup_field = "slug"

    # ------------------------------------------------------------------
    # Queryset / serializer helpers
    # ------------------------------------------------------------------

    def get_queryset(self) -> QuerySet[DocumentTemplate]:
        qs = DocumentTemplate.objects.filter(is_active=True)
        params = self.request.query_params

        if template_type := params.get("type"):
            qs = qs.filter(type=template_type)
        if category := params.get("category"):
            qs = qs.filter(category=category)
        if (is_new := params.get("is_new")) is not None:
            qs = qs.filter(is_new=is_new.lower() in ("true", "1"))
        if (is_premium := params.get("is_premium")) is not None:
            qs = qs.filter(is_premium=is_premium.lower() in ("true", "1"))
        if (is_ats := params.get("is_ats_friendly")) is not None:
            qs = qs.filter(is_ats_friendly=is_ats.lower() in ("true", "1"))
        if search := params.get("search"):
            qs = qs.filter(name__icontains=search)

        return qs

    def get_serializer_class(self) -> type:
        if self.action == "retrieve" or self.action == "preview":
            return TemplateDetailSerializer
        return TemplateListSerializer

    # ------------------------------------------------------------------
    # Custom actions
    # ------------------------------------------------------------------

    @action(detail=True, methods=["get"], url_path="preview")
    def preview(self, request: Request, slug: str | None = None) -> Response:
        """Return template details combined with demo resume data."""
        template = self.get_object()
        serializer = self.get_serializer(template)

        demo_data: dict[str, Any] = {
            "personal_info": {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "phone": "+1 (555) 123-4567",
                "location": "San Francisco, CA",
                "title": "Senior Software Engineer",
                "summary": (
                    "Experienced software engineer with 8+ years building "
                    "scalable web applications and leading cross-functional teams."
                ),
            },
            "experience": [
                {
                    "company": "Tech Corp",
                    "position": "Senior Software Engineer",
                    "start_date": "2020-03",
                    "end_date": None,
                    "is_current": True,
                    "description": (
                        "Lead a team of 6 engineers delivering microservices "
                        "that serve 2M+ daily active users."
                    ),
                    "highlights": [
                        "Reduced API latency by 40% through caching strategies",
                        "Mentored 3 junior developers to mid-level promotions",
                    ],
                },
                {
                    "company": "StartupXYZ",
                    "position": "Software Engineer",
                    "start_date": "2017-06",
                    "end_date": "2020-02",
                    "is_current": False,
                    "description": "Full-stack development on a SaaS analytics platform.",
                    "highlights": [
                        "Built real-time dashboard serving 500k events/sec",
                        "Implemented CI/CD pipeline reducing deploy time by 60%",
                    ],
                },
            ],
            "education": [
                {
                    "institution": "University of California, Berkeley",
                    "degree": "B.Sc. Computer Science",
                    "start_date": "2013-09",
                    "end_date": "2017-05",
                    "gpa": "3.8",
                },
            ],
            "skills": [
                {"name": "Python", "level": "Expert"},
                {"name": "JavaScript / TypeScript", "level": "Advanced"},
                {"name": "Django & DRF", "level": "Expert"},
                {"name": "React", "level": "Advanced"},
                {"name": "PostgreSQL", "level": "Advanced"},
                {"name": "Docker & Kubernetes", "level": "Intermediate"},
                {"name": "AWS", "level": "Advanced"},
            ],
            "languages": [
                {"name": "English", "proficiency": "Native"},
                {"name": "Spanish", "proficiency": "Conversational"},
            ],
            "certifications": [
                {"name": "AWS Solutions Architect - Associate", "year": "2022"},
            ],
        }

        return Response(
            {
                "template": serializer.data,
                "demo_data": demo_data,
            },
            status=status.HTTP_200_OK,
        )


class TemplateCategoryView(APIView):
    """
    Return a list of unique template categories together with the number of
    active templates in each.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        qs = (
            DocumentTemplate.objects.filter(is_active=True)
            .values("category")
            .annotate(count=Count("id"))
            .order_by("category")
        )

        display_map: dict[str, str] = dict(DocumentTemplate.TemplateCategory.choices)

        data = [
            {
                "category": row["category"],
                "category_display": display_map.get(row["category"], row["category"]),
                "count": row["count"],
            }
            for row in qs
        ]

        serializer = TemplateCategorySerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
