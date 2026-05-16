from __future__ import annotations

from django.urls import path

from apps.builder.views import (
    AIGenerateView,
    AIRewriteView,
    CompanySuggestionsView,
    JobTitleSuggestionsView,
    SkillSuggestionsView,
    SuggestionsView,
)

app_name = "builder"

urlpatterns: list = [
    path(
        "suggestions/content/<str:section_type>/<str:job_title>/",
        SuggestionsView.as_view(),
        name="content-suggestions",
    ),
    path(
        "suggestions/skills/",
        SkillSuggestionsView.as_view(),
        name="skill-suggestions",
    ),
    path(
        "suggestions/job-titles/",
        JobTitleSuggestionsView.as_view(),
        name="job-title-suggestions",
    ),
    path(
        "suggestions/companies/",
        CompanySuggestionsView.as_view(),
        name="company-suggestions",
    ),
    # AI-powered endpoints
    path(
        "ai/rewrite/",
        AIRewriteView.as_view(),
        name="ai-rewrite",
    ),
    path(
        "ai/generate/",
        AIGenerateView.as_view(),
        name="ai-generate",
    ),
]
