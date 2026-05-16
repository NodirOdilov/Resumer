"""Tests for the seo app -- SEO metadata and redirects."""

from __future__ import annotations

import pytest
from django.db import IntegrityError

from apps.seo.models import Redirect, SEOMetadata


@pytest.mark.django_db
class TestSEOMetadata:

    def test_create_seo_metadata(self):
        """SEO metadata can be created for a path."""
        meta = SEOMetadata.objects.create(
            path="/resume-templates/",
            title="Resume Templates | Resumer",
            description="Browse 34+ professional resume templates.",
        )
        assert meta.path == "/resume-templates/"
        assert meta.title == "Resume Templates | Resumer"

    def test_unique_path_constraint(self):
        """Two metadata entries cannot share the same path."""
        SEOMetadata.objects.create(
            path="/about/",
            title="About Us",
        )
        with pytest.raises(IntegrityError):
            SEOMetadata.objects.create(
                path="/about/",
                title="About Us Duplicate",
            )

    def test_title_max_length(self):
        """Title should be max 70 characters as per SEO best practices."""
        meta = SEOMetadata(
            path="/test/",
            title="A" * 70,
        )
        meta.full_clean()  # Should not raise

    def test_description_max_length(self):
        """Description should be max 160 characters."""
        meta = SEOMetadata(
            path="/test/",
            title="Test",
            description="A" * 160,
        )
        meta.full_clean()  # Should not raise

    def test_optional_fields(self):
        """Optional fields default gracefully."""
        meta = SEOMetadata.objects.create(
            path="/minimal/",
            title="Minimal Page",
        )
        assert meta.description == ""
        assert meta.canonical_url == ""
        assert meta.og_image.name in ("", None)

    def test_no_index_flag(self):
        """no_index flag can be set to exclude page from search engines."""
        meta = SEOMetadata.objects.create(
            path="/internal/",
            title="Internal Page",
            no_index=True,
        )
        assert meta.no_index is True

    def test_canonical_url(self):
        """Canonical URL can be specified."""
        meta = SEOMetadata.objects.create(
            path="/resume-templates/page/2/",
            title="Resume Templates Page 2",
            canonical_url="https://resumer.com/resume-templates/",
        )
        assert meta.canonical_url == "https://resumer.com/resume-templates/"

    def test_str_representation(self):
        meta = SEOMetadata.objects.create(
            path="/test/",
            title="Test Page",
        )
        assert "/test/" in str(meta) or "Test Page" in str(meta)


@pytest.mark.django_db
class TestRedirect:

    def test_create_redirect(self):
        """A redirect maps old path to new path."""
        redirect = Redirect.objects.create(
            old_path="/old-resume-templates/",
            new_path="/resume-templates/",
            is_permanent=True,
        )
        assert redirect.old_path == "/old-resume-templates/"
        assert redirect.new_path == "/resume-templates/"
        assert redirect.is_permanent is True

    def test_temporary_redirect(self):
        """Redirects can be temporary (302)."""
        redirect = Redirect.objects.create(
            old_path="/promo/",
            new_path="/special-offer/",
            is_permanent=False,
        )
        assert redirect.is_permanent is False

    def test_redirect_str(self):
        redirect = Redirect.objects.create(
            old_path="/old/",
            new_path="/new/",
        )
        result = str(redirect)
        assert "/old/" in result or "/new/" in result
