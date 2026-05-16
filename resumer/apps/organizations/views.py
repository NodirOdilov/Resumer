"""API представления организаций."""

from __future__ import annotations

from django.db.models import QuerySet
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.organizations.models import Organization, OrganizationInvite, OrganizationMember
from apps.organizations.permissions import IsOrganizationAdmin, IsOrganizationMember
from apps.organizations.serializers import (
    CreateOrganizationSerializer,
    InviteMemberSerializer,
    OrganizationInviteSerializer,
    OrganizationMemberSerializer,
    OrganizationSerializer,
)
from apps.organizations.services import OrganizationService


class OrganizationViewSet(viewsets.ModelViewSet):
    """CRUD организаций для участников."""

    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "slug"

    def get_queryset(self) -> QuerySet[Organization]:
        """Организации, в которых состоит текущий пользователь."""
        return (
            Organization.objects.filter(
                members__user=self.request.user,
                members__is_active=True,
            )
            .distinct()
            .prefetch_related("members")
        )

    def create(self, request: Request, *args, **kwargs) -> Response:
        """Создать новую организацию."""
        serializer = CreateOrganizationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        org = OrganizationService.create_organization(
            name=serializer.validated_data["name"],
            slug=serializer.validated_data["slug"],
            owner=request.user,
            description=serializer.validated_data.get("description", ""),
        )
        return Response(
            OrganizationSerializer(org).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="members",
        permission_classes=[permissions.IsAuthenticated, IsOrganizationMember],
    )
    def members(self, request: Request, slug: str | None = None) -> Response:
        """Список участников организации."""
        org = self.get_object()
        members = org.members.filter(is_active=True).select_related("user")
        return Response(OrganizationMemberSerializer(members, many=True).data)

    @action(
        detail=True,
        methods=["post"],
        url_path="invite",
        permission_classes=[permissions.IsAuthenticated, IsOrganizationAdmin],
    )
    def invite(self, request: Request, slug: str | None = None) -> Response:
        """Отправить приглашение в организацию."""
        org = self.get_object()
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invite = OrganizationService.create_invite(
            organization=org,
            email=serializer.validated_data["email"],
            role=serializer.validated_data["role"],
            invited_by=request.user,
        )
        return Response(
            OrganizationInviteSerializer(invite).data,
            status=status.HTTP_201_CREATED,
        )


class OrganizationInviteViewSet(viewsets.GenericViewSet):
    """Принятие приглашений."""

    permission_classes = [permissions.IsAuthenticated]
    queryset = OrganizationInvite.objects.all()

    @action(detail=False, methods=["post"], url_path="accept")
    def accept(self, request: Request) -> Response:
        """Принять приглашение по токену."""
        token = request.data.get("token", "")
        if not token:
            return Response(
                {"error": "Токен приглашения обязателен."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            member = OrganizationService.accept_invite(token, request.user)
        except OrganizationInvite.DoesNotExist:
            return Response(
                {"error": "Приглашение не найдено."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            OrganizationMemberSerializer(member).data,
            status=status.HTTP_200_OK,
        )
