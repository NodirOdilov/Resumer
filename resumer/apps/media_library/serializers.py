from __future__ import annotations

from rest_framework import serializers

from apps.media_library.models import MediaFile


class MediaFileSerializer(serializers.ModelSerializer[MediaFile]):
    """Serializer for listing and retrieving media files."""

    class Meta:
        model = MediaFile
        fields: list[str] = [
            "id",
            "file",
            "thumbnail",
            "alt_text",
            "file_type",
            "original_filename",
            "file_size",
            "width",
            "height",
            "created_at",
        ]
        read_only_fields: list[str] = [
            "id",
            "thumbnail",
            "file_size",
            "width",
            "height",
            "created_at",
        ]


class MediaFileUploadSerializer(serializers.ModelSerializer[MediaFile]):
    """Serializer for uploading a new media file."""

    class Meta:
        model = MediaFile
        fields: list[str] = [
            "id",
            "file",
            "alt_text",
            "file_type",
        ]
        read_only_fields: list[str] = ["id"]

    def create(self, validated_data: dict) -> MediaFile:
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["uploaded_by"] = request.user

        uploaded_file = validated_data.get("file")
        if uploaded_file:
            validated_data["original_filename"] = uploaded_file.name
            validated_data["file_size"] = uploaded_file.size

            if hasattr(uploaded_file, "image"):
                try:
                    from PIL import Image

                    img = Image.open(uploaded_file)
                    validated_data["width"] = img.width
                    validated_data["height"] = img.height
                    uploaded_file.seek(0)
                except Exception:
                    pass

        return super().create(validated_data)
