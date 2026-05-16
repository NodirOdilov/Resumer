"""Маршруты API экспорта документов."""

from django.urls import path

from apps.documents.views import DocumentExportStatusView, DocumentExportView

urlpatterns = [
    path("export/", DocumentExportView.as_view(), name="document-export"),
    path(
        "export/<str:task_id>/status/",
        DocumentExportStatusView.as_view(),
        name="document-export-status",
    ),
]
