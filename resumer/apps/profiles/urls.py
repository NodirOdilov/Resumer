from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.profiles.views import (
    AwardViewSet,
    CertificateViewSet,
    EducationViewSet,
    InterestViewSet,
    LanguageViewSet,
    ProfileView,
    ProjectViewSet,
    SkillViewSet,
    VolunteerViewSet,
    WorkExperienceViewSet,
)

app_name = "profiles"

router = DefaultRouter()
router.register("educations", EducationViewSet, basename="education")
router.register("work-experiences", WorkExperienceViewSet, basename="work-experience")
router.register("skills", SkillViewSet, basename="skill")
router.register("languages", LanguageViewSet, basename="language")
router.register("certificates", CertificateViewSet, basename="certificate")
router.register("projects", ProjectViewSet, basename="project")
router.register("awards", AwardViewSet, basename="award")
router.register("volunteers", VolunteerViewSet, basename="volunteer")
router.register("interests", InterestViewSet, basename="interest")

urlpatterns = [
    # /api/v1/profile/ — current user's profile (GET / PUT / PATCH)
    path("", ProfileView.as_view(), name="profile-detail"),
    # /api/v1/profile/<resource>/ — nested sub-models
    path("", include(router.urls)),
]
