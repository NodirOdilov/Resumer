from __future__ import annotations

import logging
from io import BytesIO
from typing import Any

from celery import shared_task
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)

# Maximum dimensions for thumbnails
THUMBNAIL_MAX_WIDTH: int = 300
THUMBNAIL_MAX_HEIGHT: int = 300

# Maximum dimensions for optimised images
OPTIMISED_MAX_WIDTH: int = 1920
OPTIMISED_MAX_HEIGHT: int = 1920


@shared_task(
    name="apps.media_library.tasks.optimize_image",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
    acks_late=True,
)
def optimize_image(self: Any, media_file_id: str) -> dict[str, Any]:
    """Optimise an uploaded image.

    1. Resize the original if it exceeds the maximum dimensions.
    2. Create a WebP version alongside the original.
    3. Generate a thumbnail and attach it to the ``MediaFile`` record.

    Parameters
    ----------
    media_file_id:
        UUID primary key of the ``MediaFile`` to process.

    Returns
    -------
    dict
        ``{"status": "ok", "thumbnail_generated": bool, "webp_created": bool}``
    """
    try:
        from PIL import Image
    except ImportError:
        logger.error("Pillow is not installed; cannot optimise image.")
        return {"status": "error", "detail": "Pillow not installed"}

    from apps.media_library.models import MediaFile

    try:
        media_file = MediaFile.objects.get(pk=media_file_id)
    except MediaFile.DoesNotExist:
        logger.warning("MediaFile %s does not exist; skipping.", media_file_id)
        return {"status": "not_found"}

    if not media_file.is_image:
        logger.info("MediaFile %s is not an image; skipping.", media_file_id)
        return {"status": "skipped", "detail": "Not an image"}

    # ── Load image ──────────────────────────────────────────────
    media_file.file.open("rb")
    img: Image.Image = Image.open(media_file.file)
    img_format: str = img.format or "PNG"

    original_width, original_height = img.size
    webp_created: bool = False
    thumbnail_generated: bool = False

    # ── Resize original if too large ────────────────────────────
    if original_width > OPTIMISED_MAX_WIDTH or original_height > OPTIMISED_MAX_HEIGHT:
        img.thumbnail(
            (OPTIMISED_MAX_WIDTH, OPTIMISED_MAX_HEIGHT),
            Image.Resampling.LANCZOS,
        )
        buffer = BytesIO()
        img.save(buffer, format=img_format, quality=85, optimize=True)
        media_file.file.save(
            media_file.file.name,
            ContentFile(buffer.getvalue()),
            save=False,
        )
        buffer.close()
        logger.info(
            "Resized image %s from %dx%d to %dx%d",
            media_file_id,
            original_width,
            original_height,
            img.width,
            img.height,
        )

    # ── Store dimensions ────────────────────────────────────────
    media_file.width = img.width
    media_file.height = img.height

    # ── Create WebP version ─────────────────────────────────────
    try:
        webp_buffer = BytesIO()
        img.save(webp_buffer, format="WEBP", quality=80)
        webp_name = media_file.file.name.rsplit(".", 1)[0] + ".webp"
        from django.core.files.storage import default_storage

        default_storage.save(webp_name, ContentFile(webp_buffer.getvalue()))
        webp_buffer.close()
        webp_created = True
        logger.info("WebP version created for %s", media_file_id)
    except Exception:
        logger.exception("Failed to create WebP version for %s", media_file_id)

    # ── Generate thumbnail ──────────────────────────────────────
    try:
        thumb = img.copy()
        thumb.thumbnail(
            (THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_HEIGHT),
            Image.Resampling.LANCZOS,
        )
        thumb_buffer = BytesIO()
        thumb.save(thumb_buffer, format=img_format, quality=80, optimize=True)

        thumb_filename = f"thumbnails/{media_file_id}.{img_format.lower()}"
        media_file.thumbnail.save(
            thumb_filename,
            ContentFile(thumb_buffer.getvalue()),
            save=False,
        )
        thumb_buffer.close()
        thumbnail_generated = True
        logger.info("Thumbnail generated for %s", media_file_id)
    except Exception:
        logger.exception("Failed to generate thumbnail for %s", media_file_id)

    # ── Persist changes ─────────────────────────────────────────
    update_fields: list[str] = ["width", "height"]
    if thumbnail_generated:
        update_fields.append("thumbnail")
    media_file.save(update_fields=update_fields)

    media_file.file.close()

    return {
        "status": "ok",
        "thumbnail_generated": thumbnail_generated,
        "webp_created": webp_created,
    }
