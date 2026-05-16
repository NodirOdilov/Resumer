"""Elasticsearch DSL document classes for full-text search across the platform."""

from __future__ import annotations

from elasticsearch_dsl import (
    Document,
    Date,
    Integer,
    Keyword,
    Text,
    analyzer,
    token_filter,
)


# ---------------------------------------------------------------------------
# Custom analyzers for multi-language support
# ---------------------------------------------------------------------------

# Edge-ngram filter for autocomplete / partial matching
edge_ngram_filter = token_filter(
    "edge_ngram_filter",
    type="edge_ngram",
    min_gram=2,
    max_gram=20,
)

# Multi-language analyzer that handles English + stemming + stop words
multilang_analyzer = analyzer(
    "multilang_analyzer",
    tokenizer="standard",
    filter=[
        "lowercase",
        "asciifolding",
        "stop",
        "snowball",
    ],
)

# Autocomplete analyzer for prefix matching on titles
autocomplete_analyzer = analyzer(
    "autocomplete_analyzer",
    tokenizer="standard",
    filter=[
        "lowercase",
        "asciifolding",
        edge_ngram_filter,
    ],
)

# Simple keyword-like analyzer for exact-ish matches on names
name_analyzer = analyzer(
    "name_analyzer",
    tokenizer="standard",
    filter=[
        "lowercase",
        "asciifolding",
    ],
)


# ---------------------------------------------------------------------------
# Article Document
# ---------------------------------------------------------------------------


class ArticleDocument(Document):
    """Elasticsearch document for blog articles."""

    title = Text(
        analyzer=autocomplete_analyzer,
        search_analyzer=name_analyzer,
        fields={
            "raw": Keyword(),
            "multilang": Text(analyzer=multilang_analyzer),
        },
    )
    content = Text(analyzer=multilang_analyzer)
    excerpt = Text(analyzer=multilang_analyzer)
    category_name = Text(
        analyzer=name_analyzer,
        fields={"raw": Keyword()},
    )
    author_name = Text(
        analyzer=name_analyzer,
        fields={"raw": Keyword()},
    )
    tags = Keyword(multi=True)
    publish_at = Date()
    views_count = Integer()

    class Index:
        name = "articles"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "max_ngram_diff": 18,
        }

    @classmethod
    def from_django_model(cls, article: object) -> ArticleDocument:
        """Build an ArticleDocument instance from a Django Article model."""
        doc = cls(meta={"id": str(article.pk)})  # type: ignore[attr-defined]
        doc.title = article.title  # type: ignore[attr-defined]
        doc.content = article.content  # type: ignore[attr-defined]
        doc.excerpt = article.excerpt  # type: ignore[attr-defined]
        doc.category_name = article.category.name if article.category else ""  # type: ignore[attr-defined]
        doc.author_name = article.author.name if article.author else ""  # type: ignore[attr-defined]
        doc.tags = [tag.name for tag in article.tags.all()]  # type: ignore[attr-defined]
        doc.publish_at = article.publish_at  # type: ignore[attr-defined]
        doc.views_count = article.views_count  # type: ignore[attr-defined]
        return doc


# ---------------------------------------------------------------------------
# Resume Example Document
# ---------------------------------------------------------------------------


class ResumeExampleDocument(Document):
    """Elasticsearch document for resume examples."""

    title = Text(
        analyzer=autocomplete_analyzer,
        search_analyzer=name_analyzer,
        fields={
            "raw": Keyword(),
            "multilang": Text(analyzer=multilang_analyzer),
        },
    )
    job_title = Text(
        analyzer=name_analyzer,
        fields={"raw": Keyword()},
    )
    industry = Text(
        analyzer=name_analyzer,
        fields={"raw": Keyword()},
    )
    category_name = Text(
        analyzer=name_analyzer,
        fields={"raw": Keyword()},
    )
    experience_level = Keyword()
    content = Text(analyzer=multilang_analyzer)
    views_count = Integer()

    class Index:
        name = "resume_examples"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "max_ngram_diff": 18,
        }

    @classmethod
    def from_django_model(cls, example: object) -> ResumeExampleDocument:
        """Build a ResumeExampleDocument from a Django ResumeExample model."""
        import json

        doc = cls(meta={"id": str(example.pk)})  # type: ignore[attr-defined]
        doc.title = example.title  # type: ignore[attr-defined]
        doc.job_title = example.job_title  # type: ignore[attr-defined]
        doc.industry = getattr(example, "industry", "")  # type: ignore[attr-defined]
        doc.category_name = example.category.name if example.category else ""  # type: ignore[attr-defined]
        doc.experience_level = example.experience_level  # type: ignore[attr-defined]

        # Flatten JSON content to searchable text
        raw_content = example.content  # type: ignore[attr-defined]
        if isinstance(raw_content, dict):
            doc.content = json.dumps(raw_content, ensure_ascii=False)
        elif isinstance(raw_content, str):
            doc.content = raw_content
        else:
            doc.content = str(raw_content)

        doc.views_count = example.views_count  # type: ignore[attr-defined]
        return doc


# ---------------------------------------------------------------------------
# Cover Letter Example Document
# ---------------------------------------------------------------------------


class CoverLetterExampleDocument(Document):
    """Elasticsearch document for cover letter examples."""

    title = Text(
        analyzer=autocomplete_analyzer,
        search_analyzer=name_analyzer,
        fields={
            "raw": Keyword(),
            "multilang": Text(analyzer=multilang_analyzer),
        },
    )
    job_title = Text(
        analyzer=name_analyzer,
        fields={"raw": Keyword()},
    )
    category_name = Text(
        analyzer=name_analyzer,
        fields={"raw": Keyword()},
    )
    experience_level = Keyword()
    content = Text(analyzer=multilang_analyzer)

    class Index:
        name = "cover_letter_examples"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "max_ngram_diff": 18,
        }

    @classmethod
    def from_django_model(cls, example: object) -> CoverLetterExampleDocument:
        """Build a CoverLetterExampleDocument from a Django CoverLetterExample model."""
        import json

        doc = cls(meta={"id": str(example.pk)})  # type: ignore[attr-defined]
        doc.title = example.title  # type: ignore[attr-defined]
        doc.job_title = example.job_title  # type: ignore[attr-defined]
        doc.category_name = example.category.name if example.category else ""  # type: ignore[attr-defined]
        doc.experience_level = example.experience_level  # type: ignore[attr-defined]

        raw_content = example.content  # type: ignore[attr-defined]
        if isinstance(raw_content, dict):
            doc.content = json.dumps(raw_content, ensure_ascii=False)
        elif isinstance(raw_content, str):
            doc.content = raw_content
        else:
            doc.content = str(raw_content)

        return doc
