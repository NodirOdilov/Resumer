from __future__ import annotations

import uuid
from decimal import Decimal
from typing import Any

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.core.models import BaseModel, OrderableMixin, SoftDeleteMixin, TimestampMixin


# ──────────────────────────── Choices ────────────────────────────


class DegreeChoice(models.TextChoices):
    HIGH_SCHOOL = "high_school", "High School"
    ASSOCIATE = "associate", "Associate"
    BACHELOR = "bachelor", "Bachelor's"
    MASTER = "master", "Master's"
    PHD = "phd", "PhD"
    DIPLOMA = "diploma", "Diploma"


class SkillCategory(models.TextChoices):
    HARD = "hard", "Hard Skill"
    SOFT = "soft", "Soft Skill"


class LanguageLevel(models.TextChoices):
    NATIVE = "native", "Native"
    FLUENT = "fluent", "Fluent"
    ADVANCED = "advanced", "Advanced"
    INTERMEDIATE = "intermediate", "Intermediate"
    BASIC = "basic", "Basic"


# ──────────────────────────── User Profile ────────────────────────────


class UserProfile(BaseModel):
    """Primary profile linked one-to-one with the User account."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="user",
    )
    phone = models.CharField(max_length=30, blank=True, default="", verbose_name="phone")
    address = models.CharField(max_length=255, blank=True, default="", verbose_name="address")
    city = models.CharField(max_length=100, blank=True, default="", verbose_name="city")
    state = models.CharField(max_length=100, blank=True, default="", verbose_name="state")
    zip_code = models.CharField(max_length=20, blank=True, default="", verbose_name="zip code")
    country = models.CharField(max_length=100, blank=True, default="", verbose_name="country")
    linkedin_url = models.URLField(max_length=500, blank=True, default="", verbose_name="LinkedIn URL")
    website_url = models.URLField(max_length=500, blank=True, default="", verbose_name="website URL")
    github_url = models.URLField(max_length=500, blank=True, default="", verbose_name="GitHub URL")
    bio = models.TextField(blank=True, default="", verbose_name="bio")
    headline = models.CharField(max_length=255, blank=True, default="", verbose_name="headline")
    years_experience = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="years of experience",
    )
    industry = models.CharField(max_length=150, blank=True, default="", verbose_name="industry")

    class Meta:
        verbose_name = "user profile"
        verbose_name_plural = "user profiles"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Profile of {self.user}"


# ──────────────────────────── Education ────────────────────────────


class Education(BaseModel, OrderableMixin):
    """Academic education entries."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="educations",
        verbose_name="profile",
    )
    institution = models.CharField(max_length=255, verbose_name="institution")
    degree = models.CharField(
        max_length=20,
        choices=DegreeChoice.choices,
        verbose_name="degree",
    )
    field_of_study = models.CharField(max_length=255, blank=True, default="", verbose_name="field of study")
    start_date = models.DateField(verbose_name="start date")
    end_date = models.DateField(null=True, blank=True, verbose_name="end date")
    is_current = models.BooleanField(default=False, verbose_name="is current")
    gpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="GPA",
    )
    description = models.TextField(blank=True, default="", verbose_name="description")

    class Meta:
        verbose_name = "education"
        verbose_name_plural = "educations"
        ordering = ["order", "-start_date"]

    def __str__(self) -> str:
        return f"{self.degree} at {self.institution}"


# ──────────────────────────── Work Experience ────────────────────────────


class WorkExperience(BaseModel, OrderableMixin):
    """Professional work experience entries."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="work_experiences",
        verbose_name="profile",
    )
    company = models.CharField(max_length=255, verbose_name="company")
    position = models.CharField(max_length=255, verbose_name="position")
    location = models.CharField(max_length=255, blank=True, default="", verbose_name="location")
    start_date = models.DateField(verbose_name="start date")
    end_date = models.DateField(null=True, blank=True, verbose_name="end date")
    is_current = models.BooleanField(default=False, verbose_name="is current")
    description = models.TextField(blank=True, default="", verbose_name="description")
    achievements = models.JSONField(
        default=list,
        blank=True,
        verbose_name="achievements",
        help_text="List of achievement strings.",
    )

    class Meta:
        verbose_name = "work experience"
        verbose_name_plural = "work experiences"
        ordering = ["order", "-start_date"]

    def __str__(self) -> str:
        return f"{self.position} at {self.company}"


# ──────────────────────────── Skill ────────────────────────────


class Skill(BaseModel, OrderableMixin):
    """Technical or soft skills with proficiency level."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="skills",
        verbose_name="profile",
    )
    name = models.CharField(max_length=150, verbose_name="name")
    level = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="level",
        help_text="Proficiency level from 1 (beginner) to 5 (expert).",
    )
    category = models.CharField(
        max_length=10,
        choices=SkillCategory.choices,
        verbose_name="category",
    )

    class Meta:
        verbose_name = "skill"
        verbose_name_plural = "skills"
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.name} ({self.get_category_display()})"


# ──────────────────────────── Language ────────────────────────────


class Language(BaseModel):
    """Languages spoken by the user."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="languages",
        verbose_name="profile",
    )
    name = models.CharField(max_length=100, verbose_name="name")
    level = models.CharField(
        max_length=15,
        choices=LanguageLevel.choices,
        verbose_name="level",
    )

    class Meta:
        verbose_name = "language"
        verbose_name_plural = "languages"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} — {self.get_level_display()}"


# ──────────────────────────── Certificate ────────────────────────────


class Certificate(BaseModel):
    """Professional certifications and licences."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="certificates",
        verbose_name="profile",
    )
    name = models.CharField(max_length=255, verbose_name="name")
    issuer = models.CharField(max_length=255, verbose_name="issuer")
    issue_date = models.DateField(verbose_name="issue date")
    expiry_date = models.DateField(null=True, blank=True, verbose_name="expiry date")
    credential_id = models.CharField(max_length=255, blank=True, default="", verbose_name="credential ID")
    credential_url = models.URLField(max_length=500, null=True, blank=True, verbose_name="credential URL")

    class Meta:
        verbose_name = "certificate"
        verbose_name_plural = "certificates"
        ordering = ["-issue_date"]

    def __str__(self) -> str:
        return f"{self.name} — {self.issuer}"


# ──────────────────────────── Project ────────────────────────────


class Project(BaseModel):
    """Personal or professional projects."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="projects",
        verbose_name="profile",
    )
    name = models.CharField(max_length=255, verbose_name="name")
    description = models.TextField(blank=True, default="", verbose_name="description")
    url = models.URLField(max_length=500, null=True, blank=True, verbose_name="URL")
    technologies = models.JSONField(
        default=list,
        blank=True,
        verbose_name="technologies",
        help_text="List of technology strings.",
    )
    start_date = models.DateField(verbose_name="start date")
    end_date = models.DateField(null=True, blank=True, verbose_name="end date")

    class Meta:
        verbose_name = "project"
        verbose_name_plural = "projects"
        ordering = ["-start_date"]

    def __str__(self) -> str:
        return self.name


# ──────────────────────────── Award ────────────────────────────


class Award(BaseModel):
    """Awards and honours."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="awards",
        verbose_name="profile",
    )
    title = models.CharField(max_length=255, verbose_name="title")
    issuer = models.CharField(max_length=255, verbose_name="issuer")
    date = models.DateField(verbose_name="date")
    description = models.TextField(blank=True, default="", verbose_name="description")

    class Meta:
        verbose_name = "award"
        verbose_name_plural = "awards"
        ordering = ["-date"]

    def __str__(self) -> str:
        return self.title


# ──────────────────────────── Volunteer ────────────────────────────


class Volunteer(BaseModel):
    """Volunteer and community work."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="volunteers",
        verbose_name="profile",
    )
    organization = models.CharField(max_length=255, verbose_name="organization")
    role = models.CharField(max_length=255, verbose_name="role")
    start_date = models.DateField(verbose_name="start date")
    end_date = models.DateField(null=True, blank=True, verbose_name="end date")
    description = models.TextField(blank=True, default="", verbose_name="description")

    class Meta:
        verbose_name = "volunteer experience"
        verbose_name_plural = "volunteer experiences"
        ordering = ["-start_date"]

    def __str__(self) -> str:
        return f"{self.role} at {self.organization}"


# ──────────────────────────── Interest ────────────────────────────


class Interest(BaseModel):
    """Personal interests and hobbies."""

    profile = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="interests",
        verbose_name="profile",
    )
    name = models.CharField(max_length=150, verbose_name="name")
    category = models.CharField(max_length=100, blank=True, null=True, verbose_name="category")

    class Meta:
        verbose_name = "interest"
        verbose_name_plural = "interests"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name
