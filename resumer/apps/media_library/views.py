from __future__ import annotations

from typing import Any

from django.db.models import QuerySet
from rest_framework import mixins, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import BaseSerializer

from apps.media_library.models import MediaFile
from apps.media_library.serializers import MediaFileSerializer, MediaFileUploadSerializer


class MediaFileViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet[MediaFile],
):
    """ViewSet for managing user media files.

    * **list** — Files uploaded by the current user.
    * **create** — Upload a new file (multipart/form-data).
    * **retrieve** — Get file details.
    * **destroy** — Delete an uploaded file.
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self) -> type[BaseSerializer[Any]]:
        if self.action == "create":
            return MediaFileUploadSerializer
        return MediaFileSerializer

    def get_queryset(self) -> QuerySet[MediaFile]:
        return MediaFile.objects.filter(uploaded_by=self.request.user).order_by("-created_at")
