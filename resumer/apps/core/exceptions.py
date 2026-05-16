from __future__ import annotations

from typing import Any

from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc: Exception, context: dict[str, Any]) -> Response | None:
    """
    Extend the default DRF exception handler to return a consistent error format:
    {
        "error": "<human-readable message>",
        "details": { ... },
        "code": "<error_code>"
    }
    """
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {
                "error": "An unexpected error occurred.",
                "details": {},
                "code": "internal_error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    error_message = _extract_error_message(response.data)
    details = _extract_details(response.data)
    error_code = _extract_error_code(exc, response)

    response.data = {
        "error": error_message,
        "details": details,
        "code": error_code,
    }

    return response


def _extract_error_message(data: Any) -> str:
    """Extract a human-readable error message from the response data."""
    if isinstance(data, dict):
        if "detail" in data:
            return str(data["detail"])
        if "non_field_errors" in data:
            errors = data["non_field_errors"]
            if isinstance(errors, list) and errors:
                return str(errors[0])
        first_key = next(iter(data), None)
        if first_key is not None:
            value = data[first_key]
            if isinstance(value, list) and value:
                return f"{first_key}: {value[0]}"
            return f"{first_key}: {value}"
    if isinstance(data, list) and data:
        return str(data[0])
    return "An error occurred."


def _extract_details(data: Any) -> dict[str, Any]:
    """Extract field-level error details from the response data."""
    if isinstance(data, dict):
        details: dict[str, Any] = {}
        for key, value in data.items():
            if key == "detail":
                continue
            details[key] = value
        return details
    if isinstance(data, list):
        return {"errors": data}
    return {}


def _extract_error_code(exc: Exception, response: Response) -> str:
    """Derive an error code string from the exception or response status."""
    if isinstance(exc, APIException) and hasattr(exc, "default_code"):
        return str(exc.default_code)

    status_code_map: dict[int, str] = {
        400: "bad_request",
        401: "not_authenticated",
        403: "permission_denied",
        404: "not_found",
        405: "method_not_allowed",
        406: "not_acceptable",
        409: "conflict",
        415: "unsupported_media_type",
        429: "throttled",
        500: "internal_error",
    }

    return status_code_map.get(response.status_code, f"error_{response.status_code}")
