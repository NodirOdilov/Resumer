from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

DEBOUNCE_SECONDS: float = 0.5


class BuilderConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for the real-time resume builder.

    Flow
    ----
    1. **connect** — Authenticates the user and verifies resume ownership.
    2. **receive** — Accepts JSON payloads containing resume data changes,
       debounces them (500 ms), renders a preview HTML fragment, and sends
       the rendered preview back to the client.
    3. **disconnect** — Cleans up resources.
    """

    resume_id: str
    _debounce_task: asyncio.Task[None] | None
    _latest_data: dict[str, Any] | None

    async def connect(self) -> None:
        """Authenticate the user and join the resume-specific channel group."""
        user = self.scope.get("user")

        if user is None or user.is_anonymous:
            logger.warning("WebSocket connection rejected: unauthenticated user")
            await self.close(code=4001)
            return

        self.resume_id = self.scope["url_route"]["kwargs"]["resume_id"]
        self._debounce_task = None
        self._latest_data = None

        # Verify user owns this resume
        has_access: bool = await self._check_resume_access(user, self.resume_id)
        if not has_access:
            logger.warning(
                "WebSocket connection rejected: user %s has no access to resume %s",
                user.pk,
                self.resume_id,
            )
            await self.close(code=4003)
            return

        self.group_name = f"builder_{self.resume_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        logger.info(
            "WebSocket connected: user=%s, resume=%s",
            user.pk,
            self.resume_id,
        )

    async def disconnect(self, code: int) -> None:
        """Leave the channel group and cancel any pending debounce task."""
        if self._debounce_task and not self._debounce_task.done():
            self._debounce_task.cancel()

        group_name: str = getattr(self, "group_name", "")
        if group_name:
            await self.channel_layer.group_discard(group_name, self.channel_name)

        logger.info("WebSocket disconnected: resume=%s, code=%d", getattr(self, "resume_id", "?"), code)

    async def receive(self, text_data: str | None = None, bytes_data: bytes | None = None) -> None:
        """Handle incoming JSON messages with resume data changes.

        Expected payload::

            {
                "type": "update",
                "resume_data": { ... },
                "template_slug": "modern-pro",
                "settings": { ... }
            }
        """
        if text_data is None:
            return

        try:
            payload: dict[str, Any] = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON"}))
            return

        message_type: str = payload.get("type", "update")

        if message_type == "update":
            self._latest_data = payload
            # Cancel previous debounce if still pending
            if self._debounce_task and not self._debounce_task.done():
                self._debounce_task.cancel()
            self._debounce_task = asyncio.create_task(self._debounced_render())

        elif message_type == "ping":
            await self.send(text_data=json.dumps({"type": "pong"}))

    async def _debounced_render(self) -> None:
        """Wait for the debounce period, then render and send the preview."""
        try:
            await asyncio.sleep(DEBOUNCE_SECONDS)
        except asyncio.CancelledError:
            return

        data = self._latest_data
        if data is None:
            return

        resume_data: dict[str, Any] = data.get("resume_data", {})
        template_slug: str = data.get("template_slug", "default")
        settings: dict[str, Any] = data.get("settings", {})

        try:
            preview_html: str = await self._render_preview(
                resume_data, template_slug, settings
            )
            response: dict[str, Any] = {
                "type": "preview",
                "html": preview_html,
            }
        except Exception:
            logger.exception("Error rendering preview for resume %s", self.resume_id)
            response = {
                "type": "error",
                "message": "Failed to render preview. Please try again.",
            }

        await self.send(text_data=json.dumps(response))

    # ------------------------------------------------------------------
    # Channel-layer event handler (for group broadcasts)
    # ------------------------------------------------------------------

    async def builder_preview(self, event: dict[str, Any]) -> None:
        """Forward a preview update broadcast to this WebSocket."""
        await self.send(
            text_data=json.dumps(
                {
                    "type": "preview",
                    "html": event.get("html", ""),
                }
            )
        )

    # ------------------------------------------------------------------
    # Database helpers (sync → async)
    # ------------------------------------------------------------------

    @database_sync_to_async
    def _check_resume_access(self, user: Any, resume_id: str) -> bool:
        """Return ``True`` if *user* owns the resume identified by *resume_id*."""
        from apps.resumes.models import Resume

        return Resume.all_objects.filter(pk=resume_id, user=user).exists()

    @database_sync_to_async
    def _render_preview(
        self,
        resume_data: dict[str, Any],
        template_slug: str,
        settings: dict[str, Any],
    ) -> str:
        """Render the preview HTML using Django's template engine."""
        template_name = f"documents/{template_slug}.html"
        context: dict[str, Any] = {
            "resume": resume_data,
            "settings": settings,
            "preview_mode": True,
        }
        return render_to_string(template_name, context)
