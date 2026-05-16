from __future__ import annotations

import logging
from typing import Callable

from django.http import HttpRequest, HttpResponse, HttpResponsePermanentRedirect, HttpResponseRedirect

logger = logging.getLogger(__name__)


class CanonicalURLMiddleware:
    """Middleware that:

    1. Checks incoming requests against the ``Redirect`` model and issues
       301/302 redirects when a match is found.
    2. Adds a ``Link: <canonical>; rel="canonical"`` header to responses
       when ``SEOMetadata`` defines a canonical URL for the request path.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # ── Check for redirects ─────────────────────────────────
        redirect_response = self._handle_redirect(request)
        if redirect_response is not None:
            return redirect_response

        response: HttpResponse = self.get_response(request)

        # ── Attach canonical header ─────────────────────────────
        self._attach_canonical_header(request, response)

        return response

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _handle_redirect(request: HttpRequest) -> HttpResponse | None:
        """Return a redirect response if the path matches a ``Redirect`` entry."""
        from apps.seo.models import Redirect

        path: str = request.path
        try:
            redirect = Redirect.objects.get(old_path=path)
        except Redirect.DoesNotExist:
            return None

        logger.info(
            "Redirect matched: %s → %s (permanent=%s)",
            redirect.old_path,
            redirect.new_path,
            redirect.is_permanent,
        )

        if redirect.is_permanent:
            return HttpResponsePermanentRedirect(redirect.new_path)
        return HttpResponseRedirect(redirect.new_path)

    @staticmethod
    def _attach_canonical_header(request: HttpRequest, response: HttpResponse) -> None:
        """Set the ``Link`` header with canonical URL when metadata exists."""
        from apps.seo.models import SEOMetadata

        path: str = request.path
        try:
            metadata = SEOMetadata.objects.only("canonical_url").get(path=path)
        except SEOMetadata.DoesNotExist:
            return

        canonical: str = metadata.canonical_url
        if canonical:
            response["Link"] = f'<{canonical}>; rel="canonical"'
