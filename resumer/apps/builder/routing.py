from __future__ import annotations

from django.urls import re_path

from apps.builder.consumers import BuilderConsumer

websocket_urlpatterns: list = [
    re_path(
        r"ws/builder/(?P<resume_id>[^/]+)/$",
        BuilderConsumer.as_asgi(),
    ),
]
