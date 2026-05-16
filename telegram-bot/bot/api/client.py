"""HTTP-клиент для Resumer REST API."""

from __future__ import annotations

from typing import Any

import httpx

from bot.config import settings


class ResumerAPIError(Exception):
    """Ошибка API Resumer."""

    def __init__(self, message: str, status_code: int = 0) -> None:
        self.status_code = status_code
        super().__init__(message)


class ResumerAPIClient:
    """Клиент для взаимодействия с backend Resumer."""

    def __init__(self, access_token: str | None = None) -> None:
        self._token = access_token
        self._client = httpx.AsyncClient(
            base_url=settings.api_base_url.rstrip("/"),
            timeout=settings.api_timeout,
        )

    def _headers(self) -> dict[str, str]:
        headers = {"Accept": "application/json", "Content-Type": "application/json"}
        if self._token:
            headers["Authorization"] = f"Bearer {self._token}"
        return headers

    async def close(self) -> None:
        await self._client.aclose()

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json: dict | None = None,
        params: dict | None = None,
    ) -> Any:
        response = await self._client.request(
            method,
            path,
            headers=self._headers(),
            json=json,
            params=params,
        )
        if response.status_code >= 400:
            data = response.json() if response.content else {}
            msg = data.get("error") or data.get("detail") or response.text
            raise ResumerAPIError(str(msg), response.status_code)
        if response.status_code == 204:
            return None
        return response.json()

    # --- Auth ---

    async def login(self, email: str, password: str) -> dict[str, Any]:
        return await self._request(
            "POST",
            "/auth/login/",
            json={"email": email, "password": password},
        )

    async def register(self, email: str, password: str, first_name: str = "") -> dict:
        return await self._request(
            "POST",
            "/auth/register/",
            json={
                "email": email,
                "password": password,
                "password_confirm": password,
                "first_name": first_name,
            },
        )

    async def me(self) -> dict[str, Any]:
        return await self._request("GET", "/auth/me/")

    # --- Telegram ---

    async def link_telegram(
        self,
        *,
        telegram_id: int,
        link_token: str,
        username: str = "",
        first_name: str = "",
        last_name: str = "",
        language_code: str = "ru",
    ) -> dict:
        return await self._request(
            "POST",
            "/telegram/link/",
            json={
                "telegram_id": telegram_id,
                "link_token": link_token,
                "telegram_username": username,
                "first_name": first_name,
                "last_name": last_name,
                "language_code": language_code,
            },
        )

    # --- Resumes ---

    async def list_resumes(self) -> list[dict]:
        data = await self._request("GET", "/resumes/")
        return data.get("results", data) if isinstance(data, dict) else data

    async def get_resume(self, resume_id: str) -> dict:
        return await self._request("GET", f"/resumes/{resume_id}/")

    async def create_resume(self, title: str, template_id: str | None = None) -> dict:
        payload: dict[str, Any] = {"title": title}
        if template_id:
            payload["template"] = template_id
        return await self._request("POST", "/resumes/", json=payload)

    async def delete_resume(self, resume_id: str) -> None:
        await self._request("DELETE", f"/resumes/{resume_id}/")

    async def export_resume(self, resume_id: str, fmt: str = "pdf") -> dict:
        return await self._request(
            "POST",
            "/documents/export/",
            json={
                "document_type": "resume",
                "document_id": resume_id,
                "format": fmt,
            },
        )

    # --- AI ---

    async def ai_generate(
        self,
        section: str,
        job_title: str = "",
        context: str = "",
    ) -> dict:
        return await self._request(
            "POST",
            "/suggestions/generate/",
            json={
                "section": section,
                "job_title": job_title,
                "context": context,
            },
        )

    # --- Templates ---

    async def list_templates(self, doc_type: str = "resume") -> list[dict]:
        data = await self._request("GET", "/templates/", params={"type": doc_type})
        return data.get("results", data) if isinstance(data, dict) else data

    # --- Search ---

    async def search(self, query: str) -> dict:
        return await self._request("GET", "/search/", params={"q": query, "limit": 5})
