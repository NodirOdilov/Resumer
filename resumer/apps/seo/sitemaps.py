from __future__ import annotations

from typing import Any

from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class StaticSitemap(Sitemap):
    """Sitemap for static / marketing pages."""

    priority: float = 0.8
    changefreq: str = "weekly"
    protocol: str = "https"

    def items(self) -> list[str]:
        return [
            "/",
            "/resume-templates/",
            "/resume-examples/",
            "/cover-letter-templates/",
            "/cover-letter-examples/",
            "/cv-templates/",
            "/blog/",
            "/pricing/",
            "/about/",
            "/contact/",
            "/faq/",
            "/privacy-policy/",
            "/terms-of-service/",
        ]

    def location(self, item: str) -> str:
        return item


class ArticleSitemap(Sitemap):
    """Sitemap for published blog articles."""

    changefreq: str = "weekly"
    priority: float = 0.7
    protocol: str = "https"

    def items(self) -> Any:
        from apps.content.models import Article

        return Article.published.order_by("-publish_at")

    def lastmod(self, obj: Any) -> Any:
        return obj.updated_at

    def location(self, obj: Any) -> str:
        return f"/blog/{obj.slug}/"


class ExampleSitemap(Sitemap):
    """Sitemap for resume examples."""

    changefreq: str = "monthly"
    priority: float = 0.6
    protocol: str = "https"

    def items(self) -> Any:
        from apps.examples.models import ResumeExample

        return ResumeExample.objects.order_by("-created_at")

    def lastmod(self, obj: Any) -> Any:
        return obj.updated_at

    def location(self, obj: Any) -> str:
        return f"/resume-examples/{obj.slug}/"


class TemplateSitemap(Sitemap):
    """Sitemap for document templates."""

    changefreq: str = "monthly"
    priority: float = 0.7
    protocol: str = "https"

    def items(self) -> Any:
        from apps.templates_library.models import DocumentTemplate

        return DocumentTemplate.objects.filter(is_active=True).order_by("-popularity_score")

    def lastmod(self, obj: Any) -> Any:
        return obj.updated_at

    def location(self, obj: Any) -> str:
        return f"/resume-templates/{obj.slug}/"


# ---------------------------------------------------------------------------
# Export registry used by the URL configuration
# ---------------------------------------------------------------------------

SITEMAPS: dict[str, type[Sitemap]] = {
    "static": StaticSitemap,
    "articles": ArticleSitemap,
    "examples": ExampleSitemap,
    "templates": TemplateSitemap,
}
