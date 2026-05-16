from __future__ import annotations

import os
import re
import unicodedata
import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.http import HttpRequest
from django.utils.text import slugify


def generate_unique_slug(model: type[models.Model], value: str, slug_field: str = "slug") -> str:
    """
    Generate a unique slug for the given model based on the provided value.

    Args:
        model: The Django model class to check uniqueness against.
        value: The string value to derive the slug from.
        slug_field: The name of the slug field on the model.

    Returns:
        A unique slug string.
    """
    base_slug = slugify(value, allow_unicode=True)
    if not base_slug:
        base_slug = str(uuid.uuid4())[:8]

    slug = base_slug
    counter = 1
    while model.objects.filter(**{slug_field: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def get_client_ip(request: HttpRequest) -> str:
    """
    Extract the client IP address from the request, respecting proxy headers.

    Args:
        request: The Django HTTP request object.

    Returns:
        The client IP address as a string.
    """
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()

    x_real_ip = request.META.get("HTTP_X_REAL_IP")
    if x_real_ip:
        return x_real_ip.strip()

    return request.META.get("REMOTE_ADDR", "0.0.0.0")


def validate_file_size(file: object, max_mb: int = 10) -> None:
    """
    Validate that the uploaded file does not exceed the maximum allowed size.

    Args:
        file: A file-like object with a `size` attribute (e.g. Django UploadedFile).
        max_mb: Maximum allowed file size in megabytes.

    Raises:
        ValidationError: If the file exceeds the size limit.
    """
    max_bytes = max_mb * 1024 * 1024
    file_size: int = getattr(file, "size", 0)
    if file_size > max_bytes:
        raise ValidationError(
            f"File size {file_size / (1024 * 1024):.1f} MB exceeds "
            f"the maximum allowed size of {max_mb} MB."
        )


def sanitize_filename(name: str) -> str:
    """
    Sanitize a filename by removing dangerous characters and normalizing unicode.

    Args:
        name: The original filename.

    Returns:
        A sanitized, safe filename string.
    """
    name = unicodedata.normalize("NFKD", name)
    name = os.path.basename(name)
    name = re.sub(r"[^\w\s\-.]", "", name)
    name = re.sub(r"\s+", "_", name)
    name = re.sub(r"\.{2,}", ".", name)
    name = name.strip("._")

    if not name:
        return str(uuid.uuid4())[:12]

    root, ext = os.path.splitext(name)
    if len(root) > 200:
        root = root[:200]
    return f"{root}{ext}"
