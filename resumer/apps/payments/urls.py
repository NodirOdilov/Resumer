from django.urls import path

from apps.payments.views import (
    CancelSubscriptionView,
    CheckoutView,
    InvoiceListView,
    ReactivateSubscriptionView,
    SubscriptionView,
    WebhookView,
)

app_name = "payments"

urlpatterns = [
    # Checkout
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    # Stripe webhook (no auth)
    path("webhook/", WebhookView.as_view(), name="webhook"),
    # Subscription management
    path("subscription/", SubscriptionView.as_view(), name="subscription-detail"),
    path(
        "subscription/cancel/",
        CancelSubscriptionView.as_view(),
        name="subscription-cancel",
    ),
    path(
        "subscription/reactivate/",
        ReactivateSubscriptionView.as_view(),
        name="subscription-reactivate",
    ),
    # Invoices
    path("invoices/", InvoiceListView.as_view(), name="invoice-list"),
]
