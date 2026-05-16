"""Tests for the media_library app -- media file management."""

from __future__ import annotations

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.media_library.models import MediaFile
from tests.factories import UserFactory


@pytest.mark.django_db
class TestMediaFileModel:

    def test_create_media_file(self):
        """A media file can be created with metadata."""
        user = UserFactory()
        media = MediaFile.objects.create(
            file="media/test/sample.png",
            original_filename="sample.png",
            file_type="image",
            file_size=1024,
            width=800,
            height=600,
            alt_text="Sample image",
            uploaded_by=user,
        )
        assert media.original_filename == "sample.png"
        assert media.file_type == "image"
        assert media.file_size == 1024
        assert media.width == 800
        assert media.height == 600
        assert media.uploaded_by == user

    def test_media_file_types(self):
        """All file types (image, document, avatar) can be created."""
        user = UserFactory()
        for file_type in ["image", "document", "avatar"]:
            MediaFile.objects.create(
                file=f"media/test/{file_type}.png",
                original_filename=f"{file_type}.png",
                file_type=file_type,
                uploaded_by=user,
            )

        assert MediaFile.objects.count() == 3

    def test_media_file_str(self):
        user = UserFactory()
        media = MediaFile.objects.create(
            file="media/test/photo.jpg",
            original_filename="photo.jpg",
            file_type="image",
            uploaded_by=user,
        )
        result = str(media)
        assert "photo.jpg" in result or "image" in result

    def test_media_without_dimensions(self):
        """Documents may not have width/height."""
        user = UserFactory()
        media = MediaFile.objects.create(
            file="media/test/resume.pdf",
            original_filename="resume.pdf",
            file_type="document",
            file_size=51200,
            uploaded_by=user,
        )
        assert media.width is None or media.width == 0
        assert media.height is None or media.height == 0

    def test_media_alt_text(self):
        """Alt text can be set for accessibility."""
        user = UserFactory()
        media = MediaFile.objects.create(
            file="media/test/hero.png",
            original_filename="hero.png",
            file_type="image",
            alt_text="Professional resume builder hero image",
            uploaded_by=user,
        )
        assert media.alt_text == "Professional resume builder hero image"

    def test_filter_by_file_type(self):
        """Media files can be filtered by type."""
        user = UserFactory()
        MediaFile.objects.create(
            file="media/1.png", original_filename="1.png",
            file_type="image", uploaded_by=user,
        )
        MediaFile.objects.create(
            file="media/2.png", original_filename="2.png",
            file_type="image", uploaded_by=user,
        )
        MediaFile.objects.create(
            file="media/3.pdf", original_filename="3.pdf",
            file_type="document", uploaded_by=user,
        )
        MediaFile.objects.create(
            file="media/4.jpg", original_filename="4.jpg",
            file_type="avatar", uploaded_by=user,
        )

        assert MediaFile.objects.filter(file_type="image").count() == 2
        assert MediaFile.objects.filter(file_type="document").count() == 1
        assert MediaFile.objects.filter(file_type="avatar").count() == 1

    def test_filter_by_uploader(self):
        """Media files can be filtered by the uploading user."""
        user1 = UserFactory()
        user2 = UserFactory()
        MediaFile.objects.create(
            file="media/u1.png", original_filename="u1.png",
            file_type="image", uploaded_by=user1,
        )
        MediaFile.objects.create(
            file="media/u2.png", original_filename="u2.png",
            file_type="image", uploaded_by=user2,
        )

        assert MediaFile.objects.filter(uploaded_by=user1).count() == 1
