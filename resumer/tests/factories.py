"""Factory Boy factories for the Resumer test suite."""

from __future__ import annotations

import uuid
from datetime import date, timedelta
from decimal import Decimal
from typing import Any, ClassVar, Sequence

import factory
from django.contrib.auth import get_user_model
from django.utils import timezone
from factory.django import DjangoModelFactory

User = get_user_model()


# ---------------------------------------------------------------------------
# Accounts
# ---------------------------------------------------------------------------


class UserFactory(DjangoModelFactory):
    """Creates User instances with unique emails."""

    class Meta:
        model = User
        skip_postgeneration_save = True

    email = factory.LazyAttribute(lambda o: f"{uuid.uuid4().hex[:10]}@example.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_verified = True
    is_premium = False
    is_active = True
    password = factory.PostGenerationMethodCall("set_password", "TestPass123!")

    @classmethod
    def _after_postgeneration(cls, instance: Any, create: bool, results: dict[str, Any] | None = None) -> None:
        if create:
            instance.save()


# ---------------------------------------------------------------------------
# Profiles
# ---------------------------------------------------------------------------


class UserProfileFactory(DjangoModelFactory):
    """Creates UserProfile instances."""

    class Meta:
        model = "profiles.UserProfile"
        skip_postgeneration_save = True

    user = factory.SubFactory(UserFactory)
    phone = factory.Faker("phone_number")
    city = factory.Faker("city")
    state = factory.Faker("state")
    country = factory.Faker("country")
    headline = factory.Faker("job")
    bio = factory.Faker("paragraph")
    years_experience = factory.Faker("random_int", min=0, max=30)
    industry = factory.Faker("bs")


class EducationFactory(DjangoModelFactory):
    """Creates Education instances."""

    class Meta:
        model = "profiles.Education"

    profile = factory.SubFactory(UserProfileFactory)
    institution = factory.Faker("company")
    degree = "bachelor"
    field_of_study = factory.Faker("bs")
    start_date = factory.LazyFunction(lambda: date(2015, 9, 1))
    end_date = factory.LazyFunction(lambda: date(2019, 6, 1))
    is_current = False
    gpa = Decimal("3.50")
    description = factory.Faker("paragraph")
    order = factory.Sequence(lambda n: n)


class WorkExperienceFactory(DjangoModelFactory):
    """Creates WorkExperience instances."""

    class Meta:
        model = "profiles.WorkExperience"

    profile = factory.SubFactory(UserProfileFactory)
    company = factory.Faker("company")
    position = factory.Faker("job")
    location = factory.Faker("city")
    start_date = factory.LazyFunction(lambda: date(2019, 7, 1))
    end_date = None
    is_current = True
    description = factory.Faker("paragraph")
    achievements = factory.LazyFunction(lambda: ["Led a team of 5", "Increased revenue by 20%"])
    order = factory.Sequence(lambda n: n)


class SkillFactory(DjangoModelFactory):
    """Creates Skill instances."""

    class Meta:
        model = "profiles.Skill"

    profile = factory.SubFactory(UserProfileFactory)
    name = factory.Faker("word")
    level = 4
    category = "hard"
    order = factory.Sequence(lambda n: n)


class LanguageProfileFactory(DjangoModelFactory):
    """Creates Language instances for profiles."""

    class Meta:
        model = "profiles.Language"

    profile = factory.SubFactory(UserProfileFactory)
    name = "English"
    level = "native"


class CertificateFactory(DjangoModelFactory):
    """Creates Certificate instances."""

    class Meta:
        model = "profiles.Certificate"

    profile = factory.SubFactory(UserProfileFactory)
    name = factory.Faker("bs")
    issuer = factory.Faker("company")
    issue_date = factory.LazyFunction(lambda: date(2021, 1, 15))
    expiry_date = None
    credential_id = factory.LazyAttribute(lambda _: f"CERT-{uuid.uuid4().hex[:8]}")
    credential_url = ""


class ProjectFactory(DjangoModelFactory):
    """Creates Project instances."""

    class Meta:
        model = "profiles.Project"

    profile = factory.SubFactory(UserProfileFactory)
    name = factory.Faker("catch_phrase")
    description = factory.Faker("paragraph")
    url = factory.Faker("url")
    technologies = factory.LazyFunction(lambda: ["Python", "Django", "React"])
    start_date = factory.LazyFunction(lambda: date(2022, 1, 1))
    end_date = factory.LazyFunction(lambda: date(2022, 12, 31))


# ---------------------------------------------------------------------------
# Templates Library
# ---------------------------------------------------------------------------


class DocumentTemplateFactory(DjangoModelFactory):
    """Creates DocumentTemplate instances."""

    class Meta:
        model = "templates_library.DocumentTemplate"

    name = factory.LazyAttribute(lambda o: f"Template {uuid.uuid4().hex[:6]}")
    slug = factory.LazyAttribute(lambda o: f"tpl-{uuid.uuid4().hex[:8]}")
    skin_id = factory.LazyAttribute(lambda _: uuid.uuid4().hex[:8])
    type = "resume"
    category = "professional"
    is_active = True
    is_premium = False
    is_ats_friendly = True
    popularity_score = factory.Faker("random_int", min=0, max=1000)
    supported_sections = factory.LazyFunction(
        lambda: ["summary", "experience", "education", "skills"]
    )
    color_schemes = factory.LazyFunction(list)
    font_options = factory.LazyFunction(lambda: ["Inter", "Roboto"])


# ---------------------------------------------------------------------------
# Resumes
# ---------------------------------------------------------------------------


class ResumeFactory(DjangoModelFactory):
    """Creates Resume instances with sensible defaults."""

    class Meta:
        model = "resumes.Resume"

    user = factory.SubFactory(UserFactory)
    title = factory.LazyAttribute(lambda o: f"Resume {uuid.uuid4().hex[:6]}")
    template = factory.SubFactory(DocumentTemplateFactory)
    status = "draft"
    content = factory.LazyFunction(lambda: {
        "personal_info": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1-555-0100",
        },
        "summary": "Experienced software engineer.",
    })
    settings = factory.LazyFunction(lambda: {
        "color": "#3498DB",
        "font": "Inter",
        "spacing": 1.15,
    })
    language = "en-us"


class ResumeVersionFactory(DjangoModelFactory):
    """Creates ResumeVersion instances."""

    class Meta:
        model = "resumes.ResumeVersion"

    resume = factory.SubFactory(ResumeFactory)
    version_number = factory.Sequence(lambda n: n + 1)
    content = factory.LazyFunction(lambda: {
        "personal_info": {"name": "John Doe"},
        "summary": "Version snapshot content.",
    })


class ResumeSectionFactory(DjangoModelFactory):
    """Creates ResumeSection instances."""

    class Meta:
        model = "resumes.ResumeSection"

    resume = factory.SubFactory(ResumeFactory)
    section_type = "summary"
    content = factory.LazyFunction(lambda: {"text": "Professional summary."})
    order = factory.Sequence(lambda n: n)
    is_visible = True


# ---------------------------------------------------------------------------
# Cover Letters
# ---------------------------------------------------------------------------


class CoverLetterFactory(DjangoModelFactory):
    """Creates CoverLetter instances."""

    class Meta:
        model = "cover_letters.CoverLetter"

    user = factory.SubFactory(UserFactory)
    title = factory.LazyAttribute(lambda o: f"Cover Letter {uuid.uuid4().hex[:6]}")
    template = factory.SubFactory(DocumentTemplateFactory)
    status = "draft"
    content = factory.LazyFunction(lambda: {
        "greeting": "Dear Hiring Manager,",
        "opening": "I am writing to express my interest.",
        "body": "With my experience in software development...",
        "closing": "Thank you for your consideration.",
        "signature": "John Doe",
    })
    language = "en-us"


# ---------------------------------------------------------------------------
# CVs
# ---------------------------------------------------------------------------


class CVFactory(DjangoModelFactory):
    """Creates CV instances."""

    class Meta:
        model = "cvs.CV"

    user = factory.SubFactory(UserFactory)
    title = factory.LazyAttribute(lambda o: f"CV {uuid.uuid4().hex[:6]}")
    template = factory.SubFactory(DocumentTemplateFactory)
    status = "draft"
    content = factory.LazyFunction(lambda: {
        "personal_info": {"name": "Jane Doe"},
        "research": "Machine learning applications in healthcare.",
    })
    language = "en-us"


class CVSectionFactory(DjangoModelFactory):
    """Creates CVSection instances."""

    class Meta:
        model = "cvs.CVSection"

    cv = factory.SubFactory(CVFactory)
    section_type = "publications"
    content = factory.LazyFunction(lambda: {"entries": []})
    order = factory.Sequence(lambda n: n)
    is_visible = True


# ---------------------------------------------------------------------------
# Content / Blog
# ---------------------------------------------------------------------------


class ArticleCategoryFactory(DjangoModelFactory):
    """Creates ArticleCategory instances."""

    class Meta:
        model = "content.ArticleCategory"

    name = factory.LazyAttribute(lambda o: f"Category {uuid.uuid4().hex[:6]}")
    slug = factory.LazyAttribute(lambda o: f"cat-{uuid.uuid4().hex[:8]}")
    is_active = True
    order = factory.Sequence(lambda n: n)


class AuthorFactory(DjangoModelFactory):
    """Creates Author instances."""

    class Meta:
        model = "content.Author"

    name = factory.Faker("name")
    slug = factory.LazyAttribute(lambda o: f"author-{uuid.uuid4().hex[:8]}")
    bio = factory.Faker("paragraph")
    title = "Career Expert"
    is_cprw_certified = False


class TagFactory(DjangoModelFactory):
    """Creates Tag instances."""

    class Meta:
        model = "content.Tag"

    name = factory.LazyAttribute(lambda o: f"tag-{uuid.uuid4().hex[:6]}")
    slug = factory.LazyAttribute(lambda o: f"tag-{uuid.uuid4().hex[:8]}")


class ArticleFactory(DjangoModelFactory):
    """Creates Article instances (published by default)."""

    class Meta:
        model = "content.Article"

    title = factory.LazyAttribute(lambda o: f"Article {uuid.uuid4().hex[:6]}")
    slug = factory.LazyAttribute(lambda o: f"article-{uuid.uuid4().hex[:8]}")
    category = factory.SubFactory(ArticleCategoryFactory)
    author = factory.SubFactory(AuthorFactory)
    content = factory.Faker("paragraph", nb_sentences=10)
    excerpt = factory.Faker("paragraph", nb_sentences=2)
    status = "published"
    publish_at = factory.LazyFunction(lambda: timezone.now() - timedelta(hours=1))
    reading_time = 5
    views_count = 0
    is_featured = False


# ---------------------------------------------------------------------------
# Examples
# ---------------------------------------------------------------------------


class ExampleCategoryFactory(DjangoModelFactory):
    """Creates ExampleCategory instances."""

    class Meta:
        model = "examples.ExampleCategory"

    name = factory.LazyAttribute(lambda o: f"ExCat {uuid.uuid4().hex[:6]}")
    slug = factory.LazyAttribute(lambda o: f"excat-{uuid.uuid4().hex[:8]}")
    is_active = True
    order = factory.Sequence(lambda n: n)


class ResumeExampleFactory(DjangoModelFactory):
    """Creates ResumeExample instances."""

    class Meta:
        model = "examples.ResumeExample"

    title = factory.LazyAttribute(lambda o: f"Example {uuid.uuid4().hex[:6]}")
    slug = factory.LazyAttribute(lambda o: f"example-{uuid.uuid4().hex[:8]}")
    category = factory.SubFactory(ExampleCategoryFactory)
    job_title = factory.Faker("job")
    industry = factory.Faker("bs")
    experience_level = "mid"
    content = factory.LazyFunction(lambda: {
        "summary": "Experienced professional seeking new challenges.",
        "experience": [{"company": "Acme Corp", "role": "Engineer"}],
    })
    views_count = 0
    is_featured = False


# ---------------------------------------------------------------------------
# Payments
# ---------------------------------------------------------------------------


class SubscriptionFactory(DjangoModelFactory):
    """Creates Subscription instances."""

    class Meta:
        model = "payments.Subscription"

    user = factory.SubFactory(UserFactory)
    stripe_customer_id = factory.LazyAttribute(lambda _: f"cus_{uuid.uuid4().hex[:14]}")
    stripe_subscription_id = factory.LazyAttribute(lambda _: f"sub_{uuid.uuid4().hex[:14]}")
    status = "active"
    plan = "monthly"
    current_period_start = factory.LazyFunction(timezone.now)
    current_period_end = factory.LazyFunction(lambda: timezone.now() + timedelta(days=30))
    cancel_at_period_end = False


class PaymentFactory(DjangoModelFactory):
    """Creates Payment instances."""

    class Meta:
        model = "payments.Payment"

    user = factory.SubFactory(UserFactory)
    subscription = factory.SubFactory(SubscriptionFactory)
    stripe_payment_intent_id = factory.LazyAttribute(lambda _: f"pi_{uuid.uuid4().hex[:14]}")
    amount = Decimal("9.99")
    currency = "usd"
    status = "succeeded"
    description = "Monthly subscription payment"


class InvoiceFactory(DjangoModelFactory):
    """Creates Invoice instances."""

    class Meta:
        model = "payments.Invoice"

    user = factory.SubFactory(UserFactory)
    subscription = factory.SubFactory(SubscriptionFactory)
    stripe_invoice_id = factory.LazyAttribute(lambda _: f"in_{uuid.uuid4().hex[:14]}")
    amount = Decimal("9.99")
    currency = "usd"
    status = "paid"
    pdf_url = "https://stripe.com/invoice/pdf/test"
    period_start = factory.LazyFunction(timezone.now)
    period_end = factory.LazyFunction(lambda: timezone.now() + timedelta(days=30))


# ---------------------------------------------------------------------------
# Reviews
# ---------------------------------------------------------------------------


class ReviewFactory(DjangoModelFactory):
    """Creates Review instances."""

    class Meta:
        model = "reviews.Review"

    user = factory.SubFactory(UserFactory)
    name = factory.Faker("name")
    rating = 5
    text = factory.Faker("paragraph")
    is_featured = False
    is_approved = True
