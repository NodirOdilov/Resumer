from __future__ import annotations

from typing import Any

from rest_framework import serializers

from apps.content.models import Article, ArticleCategory, Author, Tag


# ──────────────────── ArticleCategory ─────────────────────


class ArticleCategorySerializer(serializers.ModelSerializer[ArticleCategory]):
    """Serializer for article categories (includes children count)."""

    children_count: serializers.SerializerMethodField[ArticleCategory, int] = (
        serializers.SerializerMethodField()
    )
    articles_count: serializers.SerializerMethodField[ArticleCategory, int] = (
        serializers.SerializerMethodField()
    )

    class Meta:
        model = ArticleCategory
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "order",
            "parent",
            "is_active",
            "children_count",
            "articles_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_children_count(self, obj: ArticleCategory) -> int:
        return obj.children.count()

    def get_articles_count(self, obj: ArticleCategory) -> int:
        return obj.articles.filter(status=Article.Status.PUBLISHED).count()


# ──────────────────────── Tag ─────────────────────────────


class TagSerializer(serializers.ModelSerializer[Tag]):
    """Serializer for article tags."""

    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]
        read_only_fields = fields


# ─────────────────────── Author ───────────────────────────


class AuthorListSerializer(serializers.ModelSerializer[Author]):
    """Compact serializer for author listings."""

    class Meta:
        model = Author
        fields = [
            "id",
            "name",
            "slug",
            "photo",
            "title",
            "is_cprw_certified",
            "articles_count",
        ]
        read_only_fields = fields


class AuthorDetailSerializer(serializers.ModelSerializer[Author]):
    """Full author profile with recent published articles."""

    recent_articles: serializers.SerializerMethodField[Author, list[dict[str, Any]]] = (
        serializers.SerializerMethodField()
    )

    class Meta:
        model = Author
        fields = [
            "id",
            "name",
            "slug",
            "bio",
            "photo",
            "title",
            "is_cprw_certified",
            "linkedin_url",
            "articles_count",
            "recent_articles",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_recent_articles(self, obj: Author) -> list[dict[str, Any]]:
        articles = (
            Article.published.filter(author=obj)
            .select_related("category")
            .only(
                "id",
                "title",
                "slug",
                "excerpt",
                "featured_image",
                "publish_at",
                "reading_time",
                "category__name",
                "category__slug",
            )
            .order_by("-publish_at")[:5]
        )
        return ArticleListSerializer(articles, many=True, context=self.context).data  # type: ignore[return-value]


# ─────────────────────── Article ──────────────────────────


class ArticleListSerializer(serializers.ModelSerializer[Article]):
    """Compact article serializer for list views (no full content)."""

    author_name = serializers.CharField(source="author.name", read_only=True)
    author_slug = serializers.CharField(source="author.slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "featured_image",
            "author_name",
            "author_slug",
            "category_name",
            "category_slug",
            "tags",
            "status",
            "publish_at",
            "reading_time",
            "views_count",
            "is_featured",
            "created_at",
        ]
        read_only_fields = fields


class ArticleDetailSerializer(serializers.ModelSerializer[Article]):
    """Full article serializer with content, FAQ, and related articles."""

    author = AuthorListSerializer(read_only=True)
    category = ArticleCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    related_articles: serializers.SerializerMethodField[Article, list[dict[str, Any]]] = (
        serializers.SerializerMethodField()
    )

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "author",
            "content",
            "excerpt",
            "featured_image",
            "tags",
            "status",
            "publish_at",
            "meta_title",
            "meta_description",
            "canonical_url",
            "faq",
            "reading_time",
            "views_count",
            "is_featured",
            "related_articles",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_related_articles(self, obj: Article) -> list[dict[str, Any]]:
        """Return up to 4 published articles in the same category, excluding self."""
        related = (
            Article.published.filter(category=obj.category)
            .exclude(pk=obj.pk)
            .select_related("author", "category")
            .prefetch_related("tags")
            .order_by("-publish_at")[:4]
        )
        return ArticleListSerializer(related, many=True, context=self.context).data  # type: ignore[return-value]


class ArticleSearchSerializer(serializers.ModelSerializer[Article]):
    """Lightweight serializer for search results."""

    author_name = serializers.CharField(source="author.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "author_name",
            "category_name",
            "publish_at",
            "reading_time",
        ]
        read_only_fields = fields
