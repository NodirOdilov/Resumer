"""Root URL configuration for Resumer."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.analytics.admin_dashboard import patch_admin_index
from apps.seo.sitemaps import SITEMAPS
from apps.seo.views import robots_txt

admin.site.site_header = "Resumer Administration"
admin.site.site_title = "Resumer Admin"
admin.site.index_title = "Dashboard"

# Inject dashboard widgets into the default admin index page
patch_admin_index()

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    # API v1
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/profile/", include("apps.profiles.urls")),
    path("api/v1/resumes/", include("apps.resumes.urls")),
    path("api/v1/cvs/", include("apps.cvs.urls")),
    path("api/v1/cover-letters/", include("apps.cover_letters.urls")),
    path("api/v1/templates/", include("apps.templates_library.urls")),
    path("api/v1/examples/", include("apps.examples.urls")),
    path("api/v1/content/", include("apps.content.urls")),
    path("api/v1/payments/", include("apps.payments.urls")),
    path("api/v1/suggestions/", include("apps.builder.urls")),
    path("api/v1/reviews/", include("apps.reviews.urls")),
    path("api/v1/categories/", include("apps.categories.urls")),
    path("api/v1/media/", include("apps.media_library.urls")),
    path("api/v1/notifications/", include("apps.notifications.urls")),
    path("api/v1/analytics/", include("apps.analytics.urls")),
    path("api/v1/seo/", include("apps.seo.urls")),
    path("api/v1/search/", include("apps.search.urls")),
    path("api/v1/documents/", include("apps.documents.urls")),
    path("api/v1/audit/", include("apps.audit.urls")),
    path("api/v1/feature-flags/", include("apps.feature_flags.urls")),
    path("api/v1/organizations/", include("apps.organizations.urls")),
    path("api/v1/webhooks/", include("apps.webhooks.urls")),
    path("api/v1/api-keys/", include("apps.api_keys.urls")),
    path("api/v1/platform/", include("apps.core.urls")),
    path("api/v1/telegram/", include("apps.telegram.urls")),
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    # Health check
    path("health/", include("apps.core.health_urls")),
    # SEO
    path("sitemap.xml", sitemap, {"sitemaps": SITEMAPS}, name="django.contrib.sitemaps.views.sitemap"),
    path("robots.txt", robots_txt, name="robots-txt"),
    # Allauth
    path("accounts/", include("allauth.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    try:
        import debug_toolbar
        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
    except ImportError:
        pass
