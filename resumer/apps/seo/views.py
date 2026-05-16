from __future__ import annotations

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from apps.seo.models import Redirect, SEOMetadata
from apps.seo.serializers import RedirectSerializer, SEOMetadataSerializer


def robots_txt(request: HttpRequest) -> HttpResponse:
    """Serve a ``robots.txt`` response.

    In production the file allows all crawlers and points to the sitemap.
    In non-production environments, crawling is disallowed.
    """
    site_url: str = getattr(settings, "SITE_URL", "https://resumer.com")

    if settings.DEBUG:
        content = "User-agent: *\nDisallow: /\n"
    else:
        lines: list[str] = [
            "User-agent: *",
            "Allow: /",
            "",
            "# Disallow private / API paths",
            "Disallow: /api/",
            "Disallow: /admin/",
            "Disallow: /accounts/",
            "Disallow: /dashboard/",
            "",
            f"Sitemap: {site_url}/sitemap.xml",
        ]
        content = "\n".join(lines) + "\n"

    return HttpResponse(content, content_type="text/plain; charset=utf-8")


@api_view(["GET"])
@permission_classes([AllowAny])
def seo_metadata_by_path(request: Request) -> Response:
    """Return SEO metadata for a given URL path.

    Query parameter ``path`` is required, e.g. ``/api/v1/seo/metadata/?path=/resume-templates/``.
    """
    path_param: str = request.query_params.get("path", "")
    if not path_param:
        return Response({"detail": "Query parameter 'path' is required."}, status=400)

    try:
        meta = SEOMetadata.objects.get(path=path_param)
    except SEOMetadata.DoesNotExist:
        return Response({"detail": "No SEO metadata for this path."}, status=404)

    serializer = SEOMetadataSerializer(meta)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def redirect_list(request: Request) -> Response:
    """Return all active URL redirects."""
    redirects = Redirect.objects.all().order_by("old_path")
    serializer = RedirectSerializer(redirects, many=True)
    return Response(serializer.data)
