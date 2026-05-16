from __future__ import annotations

from django.urls import path

from apps.seo.views import robots_txt, seo_metadata_by_path, redirect_list

app_name = "seo"

urlpatterns = [
    path("robots.txt", robots_txt, name="robots-txt"),
    path("metadata/", seo_metadata_by_path, name="seo-metadata"),
    path("redirects/", redirect_list, name="seo-redirects"),
]
