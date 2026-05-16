"""Tests for the reviews app -- review creation and validation."""

from __future__ import annotations

import pytest
from django.core.exceptions import ValidationError

from apps.reviews.models import Review
from tests.factories import ReviewFactory, UserFactory


@pytest.mark.django_db
class TestReviewModel:

    def test_create_review(self):
        """A review can be created with valid data."""
        review = ReviewFactory(rating=5, text="Excellent platform!")
        assert review.rating == 5
        assert review.text == "Excellent platform!"
        assert review.is_approved is True

    def test_review_str(self):
        review = ReviewFactory(name="Alice", rating=4)
        result = str(review)
        assert "Alice" in result or "4" in result

    def test_rating_min_value(self):
        """Rating below 1 should fail validation."""
        review = Review(
            user=UserFactory(),
            name="Test",
            rating=0,
            text="Invalid rating",
        )
        with pytest.raises(ValidationError):
            review.full_clean()

    def test_rating_max_value(self):
        """Rating above 5 should fail validation."""
        review = Review(
            user=UserFactory(),
            name="Test",
            rating=6,
            text="Invalid rating",
        )
        with pytest.raises(ValidationError):
            review.full_clean()

    def test_valid_ratings(self):
        """Ratings 1-5 are all valid."""
        user = UserFactory()
        for rating in range(1, 6):
            review = Review(
                user=user,
                name=f"User {rating}",
                rating=rating,
                text=f"Rating {rating} review",
            )
            review.full_clean()  # Should not raise

    def test_featured_review(self):
        review = ReviewFactory(is_featured=True)
        assert review.is_featured is True

    def test_review_without_user(self):
        """A review can exist without an associated user."""
        review = Review.objects.create(
            name="Anonymous",
            rating=4,
            text="Great service",
            is_approved=True,
        )
        assert review.user is None
        assert review.name == "Anonymous"

    def test_review_default_not_featured(self):
        review = ReviewFactory()
        assert review.is_featured is False

    def test_approved_filter(self):
        """Only approved reviews should be queryable via approved filter."""
        ReviewFactory(is_approved=True)
        ReviewFactory(is_approved=True)
        ReviewFactory(is_approved=False)

        assert Review.objects.filter(is_approved=True).count() == 2
        assert Review.objects.filter(is_approved=False).count() == 1

    def test_featured_reviews_query(self):
        """Featured reviews can be queried separately."""
        ReviewFactory(is_featured=True, is_approved=True)
        ReviewFactory(is_featured=True, is_approved=True)
        ReviewFactory(is_featured=False, is_approved=True)

        featured = Review.objects.filter(is_featured=True, is_approved=True)
        assert featured.count() == 2
