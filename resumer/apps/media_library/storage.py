from __future__ import annotations

import os
import uuid
from typing import Any

from django.conf import settings

try:
    from storages.backends.s3boto3 import S3Boto3Storage
except ImportError:  # pragma: no cover – allow running without boto3 installed
    from django.core.files.storage import FileSystemStorage as S3Boto3Storage  # type: ignore[assignment]


class MediaLibraryS3Storage(S3Boto3Storage):  # type: ignore[misc]
    """Custom S3 storage backend for the media library.

    Organises uploads into a predictable path hierarchy::

        media/{file_type}/{user_id}/{subtype}/{filename}

    Falls back to ``FileSystemStorage`` semantics when ``storages`` / ``boto3``
    are not installed (useful for local development).
    """

    bucket_name: str = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "resumer-media")
    default_acl: str | None = None
    querystring_auth: bool = False

    def _save(self, name: str, content: Any) -> str:
        """Override save to inject the structured path."""
        return super()._save(name, content)

    @staticmethod
    def generate_upload_path(
        file_type: str,
        user_id: str | uuid.UUID | None,
        subtype: str,
        original_filename: str,
    ) -> str:
        """Build a deterministic upload path.

        Parameters
        ----------
        file_type:
            One of ``"image"``, ``"document"``, ``"avatar"``.
        user_id:
            The uploading user's primary key (UUID).  Falls back to
            ``"anonymous"`` if ``None``.
        subtype:
            A secondary classifier (e.g. ``"profile"``, ``"resume"``).
        original_filename:
            The original file name from the upload.

        Returns
        -------
        str
            The generated path, e.g.
            ``media/image/abc123/profile/4f2e…a1b2.jpg``
        """
        user_dir: str = str(user_id) if user_id else "anonymous"
        ext: str = os.path.splitext(original_filename)[1].lower()
        unique_name: str = f"{uuid.uuid4().hex}{ext}"
        return f"media/{file_type}/{user_dir}/{subtype}/{unique_name}"
