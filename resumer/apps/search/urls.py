from django.urls import path

from apps.search.views import UnifiedSearchView

app_name = "search"

urlpatterns = [
    path("", UnifiedSearchView.as_view(), name="unified-search"),
]
