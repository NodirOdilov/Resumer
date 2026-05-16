from __future__ import annotations

from rest_framework import serializers

from apps.reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer[Review]):
    """Serializer for creating and listing reviews.

    On **create**, ``user`` is set from the request context if authenticated;
    ``is_featured`` and ``is_approved`` are always read-only (admin-controlled).
    """

    class Meta:
        model = Review
        fields: list[str] = [
            "id",
            "user",
            "name",
            "rating",
            "text",
            "is_featured",
            "is_approved",
            "created_at",
        ]
        read_only_fields: list[str] = [
            "id",
            "user",
            "is_featured",
            "is_approved",
            "created_at",
        ]

    def create(self, validated_data: dict) -> Review:
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)
