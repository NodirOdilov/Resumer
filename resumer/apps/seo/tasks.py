from __future__ import annotations

import logging
from typing import Any

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(
    name="apps.seo.tasks.generate_sitemap",
    bind=True,
    max_retries=2,
    default_retry_delay=60,
)
def generate_sitemap(self: Any) -> dict[str, Any]:
    """Pre-generate and cache the sitemap XML so it can be served instantly.

    This task iterates over all registered sitemaps, renders their XML, and
    stores the result in the Django cache under the key ``sitemap_xml``.

    Returns
    -------
    dict
        ``{"status": "ok", "urls_count": int}``
    """
    from django.contrib.sitemaps import GenericSitemap
    from django.core.cache import cache
    from django.test import RequestFactory

    from apps.seo.sitemaps import SITEMAPS

    factory = RequestFactory()
    request = factory.get("/sitemap.xml")
    request.META["SERVER_NAME"] = "resumer.com"
    request.META["SERVER_PORT"] = "443"

    total_urls: int = 0
    sitemap_sections: list[str] = []

    for section_name, sitemap_cls in SITEMAPS.items():
        sitemap_instance = sitemap_cls()
        items = sitemap_instance.items()
        count = len(items) if hasattr(items, "__len__") else items.count()
        total_urls += count
        sitemap_sections.append(f"{section_name}: {count} URLs")

    # Build and cache the full sitemap index XML using Django's built-in view
    from django.contrib.sitemaps.views import sitemap as sitemap_view

    response = sitemap_view(request, sitemaps=SITEMAPS)
    content: bytes = response.content

    cache.set("sitemap_xml", content, timeout=3600)  # 1 hour

    logger.info(
        "Sitemap generated and cached: %d URLs (%s)",
        total_urls,
        ", ".join(sitemap_sections),
    )

    return {
        "status": "ok",
        "urls_count": total_urls,
    }
