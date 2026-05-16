from __future__ import annotations

import uuid
from collections.abc import Callable
from typing import Any

from django.http import HttpRequest, HttpResponse

REQUEST_ID_HEADER = "X-Request-ID"


class RequestIDMiddleware:
    """
    Middleware that attaches a unique X-Request-ID header to every response.
    If the incoming request already carries the header, it is preserved;
    otherwise a new UUID4 value is generated.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request_id = request.headers.get(REQUEST_ID_HEADER) or str(uuid.uuid4())
        request.META["HTTP_X_REQUEST_ID"] = request_id

        response = self.get_response(request)
        response[REQUEST_ID_HEADER] = request_id
        return response
