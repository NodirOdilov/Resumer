from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.content.views import (
    ArticleCategoryViewSet,
    ArticleViewSet,
    AuthorViewSet,
    SearchView,
    TagViewSet,
)

app_name = "content"

router = DefaultRouter()
router.register("categories", ArticleCategoryViewSet, basename="category")
router.register("authors", AuthorViewSet, basename="author")
router.register("tags", TagViewSet, basename="tag")
router.register("articles", ArticleViewSet, basename="article")

urlpatterns = [
    path("search/", SearchView.as_view(), name="article-search"),
    path("", include(router.urls)),
]
