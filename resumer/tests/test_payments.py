"""Tests for the payments app -- checkout, subscription, invoices, webhooks."""

from __future__ import annotations

from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.payments.models import Invoice, Subscription, SubscriptionStatus
from tests.factories import InvoiceFactory, SubscriptionFactory, UserFactory


@pytest.mark.django_db
class TestCheckout:
    URL = "/api/v1/payments/checkout/"

    @patch("apps.payments.views.stripe")
    def test_create_checkout_session(self, mock_stripe, authenticated_client: APIClient, user):
        """POST /checkout/ with a valid plan returns a checkout URL."""
        # Configure mock
        mock_session = MagicMock()
        mock_session.url = "https://checkout.stripe.com/session/test"
        mock_session.id = "cs_test_123"
        mock_stripe.checkout.Session.create.return_value = mock_session

        # Need to set a price mapping
        with patch("apps.payments.views.PLAN_PRICE_MAP", {"monthly": "price_monthly_123", "yearly": "price_yearly_456"}):
            response = authenticated_client.post(
                self.URL, {"plan": "monthly"}, format="json"
            )

        assert response.status_code == status.HTTP_200_OK
        assert "checkout_url" in response.data
        assert "session_id" in response.data

    def test_unauthenticated_checkout_rejected(self, api_client: APIClient):
        """POST /checkout/ without auth returns 401."""
        response = api_client.post(
            self.URL, {"plan": "monthly"}, format="json"
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_checkout_invalid_plan(self, authenticated_client: APIClient):
        """POST /checkout/ with invalid plan returns 400."""
        response = authenticated_client.post(
            self.URL, {"plan": "invalid_plan"}, format="json"
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestSubscription:
    URL = "/api/v1/payments/subscription/"

    def test_get_subscription(self, authenticated_client: APIClient, user):
        """GET /subscription/ returns the user's subscription (auto-created)."""
        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        assert "status" in response.data
        assert "plan" in response.data
        assert "plan_display" in response.data
        assert "status_display" in response.data

    def test_get_subscription_with_existing(self, authenticated_client: APIClient, user):
        """GET /subscription/ returns existing subscription data."""
        sub = SubscriptionFactory(user=user, plan="monthly", status="active")

        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["plan"] == "monthly"
        assert response.data["status"] == "active"


@pytest.mark.django_db
class TestCancelSubscription:
    URL = "/api/v1/payments/subscription/cancel/"

    @patch("apps.payments.views.stripe")
    def test_cancel_subscription(self, mock_stripe, authenticated_client: APIClient, user):
        """POST /subscription/cancel/ sets cancel_at_period_end."""
        sub = SubscriptionFactory(
            user=user,
            status=SubscriptionStatus.ACTIVE,
            stripe_subscription_id="sub_test_123",
        )

        response = authenticated_client.post(self.URL, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["cancel_at_period_end"] is True

        sub.refresh_from_db()
        assert sub.cancel_at_period_end is True

    def test_cancel_no_subscription(self, authenticated_client: APIClient, user):
        """POST /subscription/cancel/ without subscription returns 404."""
        response = authenticated_client.post(self.URL, format="json")

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestInvoices:
    URL = "/api/v1/payments/invoices/"

    def test_list_invoices(self, authenticated_client: APIClient, user):
        """GET /invoices/ lists the user's invoices."""
        sub = SubscriptionFactory(user=user)
        InvoiceFactory(user=user, subscription=sub)
        InvoiceFactory(user=user, subscription=sub)
        # Another user's invoice
        other = UserFactory()
        other_sub = SubscriptionFactory(user=other)
        InvoiceFactory(user=other, subscription=other_sub)

        response = authenticated_client.get(self.URL)

        assert response.status_code == status.HTTP_200_OK
        results = response.data if isinstance(response.data, list) else response.data.get("results", response.data)
        assert len(results) == 2

    def test_invoices_unauthenticated(self, api_client: APIClient):
        """GET /invoices/ without auth returns 401."""
        response = api_client.get(self.URL)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestWebhook:
    URL = "/api/v1/payments/webhook/"

    @patch("apps.payments.views.stripe")
    def test_stripe_webhook_signature_verification(self, mock_stripe, api_client: APIClient):
        """POST /webhook/ with invalid signature returns 400."""
        import stripe as stripe_module

        mock_stripe.Webhook.construct_event.side_effect = (
            stripe_module.error.SignatureVerificationError("bad sig", "sig_header")
        )

        response = api_client.post(
            self.URL,
            b'{"type": "test"}',
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="invalid_sig",
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @patch("apps.payments.views.stripe")
    def test_webhook_valid_event(self, mock_stripe, api_client: APIClient):
        """POST /webhook/ with valid event returns 200."""
        mock_stripe.Webhook.construct_event.return_value = {
            "type": "unknown.event",
            "data": {},
        }

        response = api_client.post(
            self.URL,
            b'{"type": "unknown.event"}',
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="valid_sig",
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "ok"
