"""Tests for the payments.views module."""

from __future__ import annotations

import json
from decimal import Decimal
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from django.conf import settings
from rest_framework import status
from rest_framework.test import APIClient

from apps.payments.models import (
    Invoice,
    InvoiceStatus,
    Subscription,
    SubscriptionStatus,
)
from tests.factories import UserFactory

CHECKOUT_URL = "/api/v1/payments/checkout/"
WEBHOOK_URL = "/api/v1/payments/webhook/"
SUBSCRIPTION_URL = "/api/v1/payments/subscription/"
CANCEL_URL = "/api/v1/payments/subscription/cancel/"
INVOICES_URL = "/api/v1/payments/invoices/"


@pytest.mark.django_db
class TestCheckoutView:
    """Tests for POST /api/v1/payments/checkout/."""

    @patch("apps.payments.views.stripe.checkout.Session.create")
    def test_create_checkout_session(
        self,
        mock_stripe_create: MagicMock,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """Checkout creates a Stripe session and returns the URL."""
        mock_session = MagicMock()
        mock_session.url = "https://checkout.stripe.com/test-session-123"
        mock_session.id = "cs_test_123"
        mock_stripe_create.return_value = mock_session

        # Ensure STRIPE settings exist for the test
        with patch.object(settings, "STRIPE_SECRET_KEY", "sk_test_xxx"), \
             patch.object(settings, "STRIPE_SUCCESS_URL", "https://example.com/success"), \
             patch.object(settings, "STRIPE_CANCEL_URL", "https://example.com/cancel"), \
             patch("apps.payments.views.PLAN_PRICE_MAP", {"monthly": "price_monthly_123"}):

            payload = {"plan": "monthly"}
            response = authenticated_client.post(CHECKOUT_URL, payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["checkout_url"] == "https://checkout.stripe.com/test-session-123"
        assert data["session_id"] == "cs_test_123"
        mock_stripe_create.assert_called_once()

    def test_checkout_unauthenticated(self, api_client: APIClient) -> None:
        """Unauthenticated checkout returns 401."""
        response = api_client.post(CHECKOUT_URL, {"plan": "monthly"}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestWebhookView:
    """Tests for POST /api/v1/payments/webhook/."""

    @patch("apps.payments.views.handle_checkout_completed")
    @patch("apps.payments.views.stripe.Webhook.construct_event")
    def test_webhook_checkout_completed(
        self,
        mock_construct: MagicMock,
        mock_handler: MagicMock,
        api_client: APIClient,
    ) -> None:
        """Valid webhook event dispatches to the correct handler."""
        mock_event = {
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "customer": "cus_test",
                    "subscription": "sub_test",
                    "customer_email": "webhook@example.com",
                },
            },
        }
        mock_construct.return_value = mock_event

        with patch.object(settings, "STRIPE_SECRET_KEY", "sk_test_xxx"), \
             patch.object(settings, "STRIPE_WEBHOOK_SECRET", "whsec_test"):
            response = api_client.post(
                WEBHOOK_URL,
                data=json.dumps(mock_event),
                content_type="application/json",
                HTTP_STRIPE_SIGNATURE="test_sig_123",
            )

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "ok"
        mock_handler.assert_called_once()

    @patch("apps.payments.views.stripe.Webhook.construct_event")
    def test_webhook_invalid_signature(
        self,
        mock_construct: MagicMock,
        api_client: APIClient,
    ) -> None:
        """Invalid signature returns 400."""
        import stripe

        mock_construct.side_effect = stripe.error.SignatureVerificationError(
            "Invalid signature", "sig_header"
        )

        with patch.object(settings, "STRIPE_SECRET_KEY", "sk_test_xxx"), \
             patch.object(settings, "STRIPE_WEBHOOK_SECRET", "whsec_test"):
            response = api_client.post(
                WEBHOOK_URL,
                data="{}",
                content_type="application/json",
                HTTP_STRIPE_SIGNATURE="bad_sig",
            )

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestSubscriptionView:
    """Tests for GET /api/v1/payments/subscription/."""

    def test_get_subscription(
        self,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """Retrieve subscription creates one if none exists and returns it."""
        response = authenticated_client.get(SUBSCRIPTION_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "status" in data
        assert "plan" in data

        # Verify it was created
        assert Subscription.objects.filter(user=user).exists()

    def test_get_subscription_unauthenticated(self, api_client: APIClient) -> None:
        """Unauthenticated request returns 401."""
        response = api_client.get(SUBSCRIPTION_URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestCancelSubscription:
    """Tests for POST /api/v1/payments/subscription/cancel/."""

    @patch("apps.payments.views.stripe.Subscription.modify")
    def test_cancel_subscription(
        self,
        mock_stripe_modify: MagicMock,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """Cancelling an active subscription sets cancel_at_period_end."""
        sub = Subscription.objects.create(
            user=user,
            status=SubscriptionStatus.ACTIVE,
            stripe_subscription_id="sub_cancel_test",
            stripe_customer_id="cus_cancel_test",
        )

        with patch.object(settings, "STRIPE_SECRET_KEY", "sk_test_xxx"):
            response = authenticated_client.post(CANCEL_URL)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["cancel_at_period_end"] is True
        mock_stripe_modify.assert_called_once_with(
            "sub_cancel_test",
            cancel_at_period_end=True,
        )

    def test_cancel_no_subscription(
        self,
        authenticated_client: APIClient,
    ) -> None:
        """Cancelling when no subscription exists returns 404."""
        response = authenticated_client.post(CANCEL_URL)
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestInvoiceList:
    """Tests for GET /api/v1/payments/invoices/."""

    def test_invoices_list(
        self,
        authenticated_client: APIClient,
        user: Any,
    ) -> None:
        """Invoice list returns only the current user's invoices."""
        Invoice.objects.create(
            user=user,
            stripe_invoice_id="inv_001",
            amount=Decimal("9.99"),
            currency="usd",
            status=InvoiceStatus.PAID,
        )
        Invoice.objects.create(
            user=user,
            stripe_invoice_id="inv_002",
            amount=Decimal("9.99"),
            currency="usd",
            status=InvoiceStatus.OPEN,
        )
        # Invoice for another user
        other_user = UserFactory()
        Invoice.objects.create(
            user=other_user,
            stripe_invoice_id="inv_003",
            amount=Decimal("19.99"),
            currency="usd",
            status=InvoiceStatus.PAID,
        )

        response = authenticated_client.get(INVOICES_URL)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        results = data.get("results", data) if isinstance(data, dict) else data
        assert len(results) == 2
        invoice_ids = [inv["stripe_invoice_id"] for inv in results]
        assert "inv_001" in invoice_ids
        assert "inv_002" in invoice_ids
        assert "inv_003" not in invoice_ids
