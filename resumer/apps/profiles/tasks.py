from __future__ import annotations

import logging
from typing import Any

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(
    name="apps.profiles.tasks.calculate_profile_completeness",
    bind=True,
    max_retries=2,
    default_retry_delay=30,
    acks_late=True,
)
def calculate_profile_completeness(self: Any, user_id: str) -> dict[str, Any]:
    """Calculate and cache profile completeness percentage.

    Checks which profile sections the user has filled in and returns
    a completeness score from 0 to 100.

    Parameters
    ----------
    user_id:
        UUID primary key of the user.
    """
    from apps.profiles.models import UserProfile

    try:
        profile = UserProfile.objects.select_related("user").get(user_id=user_id)
    except UserProfile.DoesNotExist:
        logger.warning("UserProfile for user %s does not exist.", user_id)
        return {"status": "not_found", "completeness": 0}

    sections = {
        "basic_info": bool(profile.phone or profile.city),
        "headline": bool(profile.headline),
        "bio": bool(profile.bio),
        "education": profile.educations.exists(),
        "experience": profile.work_experiences.exists(),
        "skills": profile.skills.exists(),
        "languages": profile.languages.exists(),
        "links": bool(profile.linkedin_url or profile.website_url or profile.github_url),
    }

    filled = sum(1 for v in sections.values() if v)
    total = len(sections)
    completeness = round((filled / total) * 100) if total else 0

    logger.info("Profile completeness for user %s: %d%%", user_id, completeness)
    return {"status": "ok", "completeness": completeness, "sections": sections}


@shared_task(
    name="apps.profiles.tasks.export_profile_data",
    bind=True,
    max_retries=2,
    default_retry_delay=60,
    acks_late=True,
)
def export_profile_data(self: Any, user_id: str) -> dict[str, Any]:
    """Export all profile data for a user (GDPR data export).

    Parameters
    ----------
    user_id:
        UUID primary key of the user.
    """
    from apps.profiles.models import UserProfile

    try:
        profile = UserProfile.objects.select_related("user").get(user_id=user_id)
    except UserProfile.DoesNotExist:
        logger.warning("UserProfile for user %s does not exist.", user_id)
        return {"status": "not_found"}

    data: dict[str, Any] = {
        "profile": {
            "phone": profile.phone,
            "city": profile.city,
            "state": profile.state,
            "country": profile.country,
            "headline": profile.headline,
            "bio": profile.bio,
            "linkedin_url": profile.linkedin_url,
            "website_url": profile.website_url,
            "github_url": profile.github_url,
        },
        "education": list(
            profile.educations.values(
                "institution", "degree", "field_of_study", "start_date", "end_date"
            )
        ),
        "experience": list(
            profile.work_experiences.values(
                "company", "position", "location", "start_date", "end_date", "description"
            )
        ),
        "skills": list(profile.skills.values("name", "level", "category")),
        "languages": list(profile.languages.values("name", "level")),
        "certificates": list(
            profile.certificates.values("name", "issuer", "issue_date", "credential_url")
        ),
        "projects": list(
            profile.projects.values("name", "description", "url", "technologies")
        ),
        "awards": list(profile.awards.values("title", "issuer", "date", "description")),
        "volunteers": list(
            profile.volunteers.values("organization", "role", "start_date", "end_date")
        ),
        "interests": list(profile.interests.values("name", "category")),
    }

    logger.info("Profile data exported for user %s", user_id)
    return {"status": "ok", "data": data}
