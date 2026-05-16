from __future__ import annotations

from typing import Any
from uuid import UUID

from django.db import transaction
from django.db.models import QuerySet
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from apps.profiles.models import (
    Award,
    Certificate,
    Education,
    Interest,
    Language,
    Project,
    Skill,
    UserProfile,
    Volunteer,
    WorkExperience,
)
from apps.profiles.serializers import (
    AwardSerializer,
    CertificateSerializer,
    EducationSerializer,
    InterestSerializer,
    LanguageSerializer,
    ProfileSerializer,
    ProjectSerializer,
    ReorderSerializer,
    SkillSerializer,
    VolunteerSerializer,
    WorkExperienceSerializer,
)


# ──────────────────────────── Profile View ────────────────────────────


class ProfileView(generics.RetrieveUpdateAPIView):  # type: ignore[type-arg]
    """GET / PUT / PATCH the authenticated user's profile."""

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self) -> UserProfile:
        profile, _created = UserProfile.objects.get_or_create(user=self.request.user)
        self.check_object_permissions(self.request, profile)
        return profile


# ──────────────────────────── Base ViewSet ────────────────────────────


class ProfileSubModelViewSet(viewsets.ModelViewSet):  # type: ignore[type-arg]
    """Base viewset for all profile sub-models.

    Automatically scopes queries to the current user's profile and assigns
    the profile FK on creation.
    """

    permission_classes = [IsAuthenticated]

    def _get_profile(self) -> UserProfile:
        profile, _created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get_queryset(self) -> QuerySet[Any]:
        return super().get_queryset().filter(profile=self._get_profile())

    def perform_create(self, serializer: BaseSerializer[Any]) -> None:
        serializer.save(profile=self._get_profile())

    def perform_destroy(self, instance: Any) -> None:
        """Use soft-delete via the model's delete() override."""
        instance.delete()


class OrderableProfileSubModelViewSet(ProfileSubModelViewSet):
    """Extends the base viewset with a bulk reorder action."""

    @action(detail=False, methods=["post"], url_path="reorder")
    def reorder(self, request: Request) -> Response:
        """Bulk-update the ``order`` field for multiple items.

        Expects a JSON list: ``[{"id": "<uuid>", "order": 0}, ...]``
        """
        serializer = ReorderSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        profile = self._get_profile()
        queryset = self.get_queryset()

        id_order_map: dict[UUID, int] = {
            item["id"]: item["order"] for item in serializer.validated_data
        }

        items = list(queryset.filter(id__in=id_order_map.keys()))

        if len(items) != len(id_order_map):
            return Response(
                {"detail": "One or more items not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            for item in items:
                item.order = id_order_map[item.id]
            model_class = queryset.model
            model_class.objects.bulk_update(items, ["order"])

        return Response({"detail": "Order updated."}, status=status.HTTP_200_OK)


# ──────────────────────────── Sub-model ViewSets ────────────────────────────


class EducationViewSet(OrderableProfileSubModelViewSet):
    """CRUD + reorder for Education entries."""

    serializer_class = EducationSerializer
    queryset = Education.objects.all()


class WorkExperienceViewSet(OrderableProfileSubModelViewSet):
    """CRUD + reorder for WorkExperience entries."""

    serializer_class = WorkExperienceSerializer
    queryset = WorkExperience.objects.all()


class SkillViewSet(OrderableProfileSubModelViewSet):
    """CRUD + reorder for Skill entries."""

    serializer_class = SkillSerializer
    queryset = Skill.objects.all()


class LanguageViewSet(ProfileSubModelViewSet):
    """CRUD for Language entries."""

    serializer_class = LanguageSerializer
    queryset = Language.objects.all()


class CertificateViewSet(ProfileSubModelViewSet):
    """CRUD for Certificate entries."""

    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()


class ProjectViewSet(ProfileSubModelViewSet):
    """CRUD for Project entries."""

    serializer_class = ProjectSerializer
    queryset = Project.objects.all()


class AwardViewSet(ProfileSubModelViewSet):
    """CRUD for Award entries."""

    serializer_class = AwardSerializer
    queryset = Award.objects.all()


class VolunteerViewSet(ProfileSubModelViewSet):
    """CRUD for Volunteer entries."""

    serializer_class = VolunteerSerializer
    queryset = Volunteer.objects.all()


class InterestViewSet(ProfileSubModelViewSet):
    """CRUD for Interest entries."""

    serializer_class = InterestSerializer
    queryset = Interest.objects.all()
