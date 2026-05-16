"""Сервисный слой организаций."""

from __future__ import annotations

import logging
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

from apps.audit.services import AuditService
from apps.organizations.models import Organization, OrganizationInvite, OrganizationMember, OrganizationRole

logger = logging.getLogger(__name__)
User = get_user_model()


class OrganizationService:
    """Бизнес-логика управления организациями."""

    @staticmethod
    @transaction.atomic
    def create_organization(
        *,
        name: str,
        slug: str,
        owner: User,
        description: str = "",
    ) -> Organization:
        """Создать организацию и назначить владельца."""
        org = Organization.objects.create(
            name=name,
            slug=slug,
            description=description,
        )
        OrganizationMember.objects.create(
            organization=org,
            user=owner,
            role=OrganizationRole.OWNER,
        )
        AuditService.log_create(
            user=owner,
            resource_type="organization",
            resource_id=str(org.pk),
            description=f"Создана организация: {name}",
            organization_id=str(org.pk),
        )
        logger.info("Организация создана: %s (owner=%s)", org.pk, owner.pk)
        return org

    @staticmethod
    def add_member(
        organization: Organization,
        user: User,
        role: str = OrganizationRole.MEMBER,
    ) -> OrganizationMember:
        """Добавить участника в организацию."""
        if organization.members.filter(is_active=True).count() >= organization.max_members:
            raise ValueError("Достигнут лимит участников организации.")

        member, created = OrganizationMember.objects.get_or_create(
            organization=organization,
            user=user,
            defaults={"role": role, "is_active": True},
        )
        if not created and not member.is_active:
            member.is_active = True
            member.role = role
            member.save(update_fields=["is_active", "role", "updated_at"])

        return member

    @staticmethod
    def create_invite(
        organization: Organization,
        email: str,
        role: str,
        invited_by: User,
    ) -> OrganizationInvite:
        """Создать приглашение в организацию."""
        invite = OrganizationInvite.objects.create(
            organization=organization,
            email=email.lower().strip(),
            role=role,
            invited_by=invited_by,
            expires_at=timezone.now() + timedelta(days=7),
        )
        AuditService.log_create(
            user=invited_by,
            resource_type="organization_invite",
            resource_id=str(invite.pk),
            description=f"Приглашение {email} в {organization.name}",
            organization_id=str(organization.pk),
        )
        return invite

    @staticmethod
    @transaction.atomic
    def accept_invite(token: str, user: User) -> OrganizationMember:
        """Принять приглашение по токену."""
        invite = OrganizationInvite.objects.select_related("organization").get(
            token=token,
            is_revoked=False,
            accepted_at__isnull=True,
        )
        if invite.is_expired:
            raise ValueError("Срок действия приглашения истёк.")

        if invite.email.lower() != user.email.lower():
            raise ValueError("Приглашение предназначено для другого email.")

        invite.accepted_at = timezone.now()
        invite.save(update_fields=["accepted_at", "updated_at"])

        member = OrganizationService.add_member(
            invite.organization,
            user,
            role=invite.role,
        )
        return member

    @staticmethod
    def user_has_role(
        organization: Organization,
        user: User,
        roles: list[str],
    ) -> bool:
        """Проверить, имеет ли пользователь одну из указанных ролей."""
        return organization.members.filter(
            user=user,
            role__in=roles,
            is_active=True,
        ).exists()
