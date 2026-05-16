from __future__ import annotations

from rest_framework.pagination import CursorPagination as BaseCursorPagination
from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """Standard page-number based pagination with sensible defaults."""

    page_size: int = 20
    page_size_query_param: str = "page_size"
    max_page_size: int = 100
    page_query_param: str = "page"


class CursorPagination(BaseCursorPagination):
    """Cursor-based pagination ordered by creation date descending."""

    page_size: int = 20
    page_size_query_param: str = "page_size"
    max_page_size: int = 100
    ordering: str = "-created_at"
    cursor_query_param: str = "cursor"
