"""
Seed 34 resume templates + 34 matching cover letter templates.

Usage:
    python manage.py shell < scripts/seed_templates.py
    # Or via django-extensions:
    python manage.py runscript seed_templates
"""

from __future__ import annotations

import random

from apps.templates_library.models import DocumentTemplate, TemplateColorScheme

# ---------------------------------------------------------------------------
# Template definitions (28 resume templates)
# ---------------------------------------------------------------------------

RESUME_TEMPLATES: list[dict] = [
    # Professional category
    {"name": "Cascade", "skin_id": "srz1", "category": "professional", "is_new": False, "is_premium": False},
    {"name": "Classic", "skin_id": "cls1", "category": "professional", "is_new": False, "is_premium": False},
    {"name": "Cubic", "skin_id": "srz4", "category": "professional", "is_new": False, "is_premium": False},
    {"name": "Diamond", "skin_id": "srz5", "category": "professional", "is_new": False, "is_premium": False},
    {"name": "Enfold", "skin_id": "srz6", "category": "professional", "is_new": False, "is_premium": False},
    {"name": "Newcast", "skin_id": "trz5", "category": "professional", "is_new": False, "is_premium": False},
    {"name": "Valera", "skin_id": "trz8", "category": "professional", "is_new": False, "is_premium": False},
    {"name": "Nexus", "skin_id": "nxs1", "category": "professional", "is_new": False, "is_premium": True},
    {"name": "Atlas", "skin_id": "atl1", "category": "professional", "is_new": False, "is_premium": False},
    # Modern category
    {"name": "Ceramica", "skin_id": "cer1", "category": "modern", "is_new": True, "is_premium": False},
    {"name": "Dynamic", "skin_id": "dyn1", "category": "modern", "is_new": True, "is_premium": False},
    {"name": "Influx", "skin_id": "srz8", "category": "modern", "is_new": False, "is_premium": False},
    {"name": "Lumina", "skin_id": "lum1", "category": "modern", "is_new": True, "is_premium": False},
    {"name": "Modern", "skin_id": "trz2", "category": "modern", "is_new": False, "is_premium": False},
    {"name": "Profile", "skin_id": "pro1", "category": "modern", "is_new": True, "is_premium": False},
    {"name": "Squares", "skin_id": "sqr1", "category": "modern", "is_new": False, "is_premium": False},
    {"name": "Horizon", "skin_id": "hrz1", "category": "modern", "is_new": False, "is_premium": False},
    # Creative category
    {"name": "Concept", "skin_id": "srz2", "category": "creative", "is_new": False, "is_premium": False},
    {"name": "Impetus", "skin_id": "imp1", "category": "creative", "is_new": True, "is_premium": False},
    {"name": "Initials", "skin_id": "srz9", "category": "creative", "is_new": False, "is_premium": False},
    {"name": "Muse", "skin_id": "trz3", "category": "creative", "is_new": False, "is_premium": False},
    {"name": "Spectra", "skin_id": "spc1", "category": "creative", "is_new": True, "is_premium": False},
    {"name": "Vibes", "skin_id": "trz9", "category": "creative", "is_new": False, "is_premium": False},
    {"name": "Zenith", "skin_id": "znt1", "category": "creative", "is_new": False, "is_premium": False},
    # Simple category
    {"name": "Crisp", "skin_id": "srz3", "category": "simple", "is_new": False, "is_premium": False},
    {"name": "Minimo", "skin_id": "trz1", "category": "simple", "is_new": False, "is_premium": False},
    {"name": "Nanica", "skin_id": "trz4", "category": "simple", "is_new": False, "is_premium": False},
    {"name": "Simple", "skin_id": "trz7", "category": "simple", "is_new": False, "is_premium": False},
    {"name": "Clarity", "skin_id": "clt1", "category": "simple", "is_new": False, "is_premium": False},
    # Business / Executive category
    {"name": "Iconic", "skin_id": "srz7", "category": "business", "is_new": False, "is_premium": False},
    {"name": "Primo", "skin_id": "trz6", "category": "business", "is_new": False, "is_premium": False},
    {"name": "Synergy", "skin_id": "syn1", "category": "business", "is_new": True, "is_premium": False},
    {"name": "Elevate", "skin_id": "elv1", "category": "business", "is_new": False, "is_premium": True},
    # Classic category
    {"name": "Vintage", "skin_id": "vin1", "category": "classic", "is_new": False, "is_premium": False},
]


# ---------------------------------------------------------------------------
# Color schemes (each template will get 5-8 of these)
# ---------------------------------------------------------------------------

COLOR_SCHEME_POOL: list[dict[str, str]] = [
    {"name": "Ocean Blue", "primary": "#1A73E8", "secondary": "#174EA6", "accent": "#34A853", "text": "#202124", "bg": "#FFFFFF"},
    {"name": "Forest Green", "primary": "#0D652D", "secondary": "#137333", "accent": "#1A73E8", "text": "#202124", "bg": "#FFFFFF"},
    {"name": "Royal Purple", "primary": "#673AB7", "secondary": "#512DA8", "accent": "#FF6F00", "text": "#212121", "bg": "#FFFFFF"},
    {"name": "Charcoal", "primary": "#37474F", "secondary": "#263238", "accent": "#00BCD4", "text": "#212121", "bg": "#FFFFFF"},
    {"name": "Crimson Red", "primary": "#C62828", "secondary": "#B71C1C", "accent": "#FF8F00", "text": "#212121", "bg": "#FFFFFF"},
    {"name": "Midnight", "primary": "#1A237E", "secondary": "#0D47A1", "accent": "#00E5FF", "text": "#FAFAFA", "bg": "#FFFFFF"},
    {"name": "Slate Gray", "primary": "#546E7A", "secondary": "#455A64", "accent": "#26A69A", "text": "#212121", "bg": "#FFFFFF"},
    {"name": "Warm Amber", "primary": "#FF8F00", "secondary": "#F57C00", "accent": "#3F51B5", "text": "#212121", "bg": "#FFFFFF"},
    {"name": "Deep Teal", "primary": "#00695C", "secondary": "#004D40", "accent": "#FF6E40", "text": "#212121", "bg": "#FFFFFF"},
    {"name": "Rose Gold", "primary": "#AD1457", "secondary": "#880E4F", "accent": "#FFB300", "text": "#212121", "bg": "#FFFFFF"},
    {"name": "Dark Mode", "primary": "#BB86FC", "secondary": "#3700B3", "accent": "#03DAC6", "text": "#E1E1E1", "bg": "#121212"},
    {"name": "Navy", "primary": "#003366", "secondary": "#002244", "accent": "#E6B800", "text": "#212121", "bg": "#FFFFFF"},
]

# ---------------------------------------------------------------------------
# Font options (each template will get 8-10 of these)
# ---------------------------------------------------------------------------

FONT_POOL: list[str] = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat",
    "Source Sans 3", "Merriweather", "Playfair Display", "Raleway",
    "Nunito", "PT Sans", "Poppins", "Work Sans", "Libre Baskerville",
    "IBM Plex Sans", "Noto Sans",
]

# ---------------------------------------------------------------------------
# Supported sections
# ---------------------------------------------------------------------------

SECTION_POOL: list[str] = [
    "contact", "summary", "experience", "education", "skills",
    "certifications", "projects", "languages", "awards",
    "publications", "interests", "references", "volunteer",
    "courses", "custom",
]


def _make_sections() -> list[str]:
    """Return a list of supported sections (always includes the core five)."""
    core = ["contact", "summary", "experience", "education", "skills"]
    extras = [s for s in SECTION_POOL if s not in core]
    return core + sorted(random.sample(extras, k=random.randint(3, 5)))


def _make_color_schemes(template: DocumentTemplate, count: int) -> int:
    """Create colour scheme rows for a given template. Returns count created."""
    schemes = random.sample(COLOR_SCHEME_POOL, k=min(count, len(COLOR_SCHEME_POOL)))
    created = 0
    for idx, scheme in enumerate(schemes):
        _, was_created = TemplateColorScheme.objects.get_or_create(
            template=template,
            name=scheme["name"],
            defaults={
                "primary_color": scheme["primary"],
                "secondary_color": scheme["secondary"],
                "accent_color": scheme["accent"],
                "text_color": scheme["text"],
                "background_color": scheme["bg"],
                "is_default": idx == 0,
            },
        )
        if was_created:
            created += 1
    return created


def run() -> tuple[int, int]:
    """
    Create 34 resume templates + 34 matching cover letter templates.
    Returns (templates_created, color_schemes_created).
    """
    random.seed(42)  # reproducible randomness
    templates_created = 0
    schemes_created = 0

    for tpl_data in RESUME_TEMPLATES:
        # ---- Resume template ----
        obj, created = DocumentTemplate.objects.get_or_create(
            skin_id=tpl_data["skin_id"],
            defaults={
                "name": tpl_data["name"],
                "type": DocumentTemplate.TemplateType.RESUME,
                "category": tpl_data["category"],
                "is_new": tpl_data["is_new"],
                "is_premium": tpl_data["is_premium"],
                "is_ats_friendly": True,
                "popularity_score": random.randint(50, 500),
                "supported_sections": _make_sections(),
                "color_schemes": [],  # stored in related model instead
                "font_options": random.sample(FONT_POOL, k=random.randint(8, 10)),
            },
        )
        if created:
            templates_created += 1
        scheme_count = random.randint(5, 8)
        schemes_created += _make_color_schemes(obj, scheme_count)

        # ---- Matching Cover Letter template ----
        cl_skin_id = f"cl-{tpl_data['skin_id']}"
        cl_name = f"{tpl_data['name']} Cover Letter"
        cl_obj, cl_created = DocumentTemplate.objects.get_or_create(
            skin_id=cl_skin_id,
            defaults={
                "name": cl_name,
                "type": DocumentTemplate.TemplateType.COVER_LETTER,
                "category": tpl_data["category"],
                "is_new": tpl_data["is_new"],
                "is_premium": tpl_data["is_premium"],
                "is_ats_friendly": True,
                "popularity_score": random.randint(30, 300),
                "supported_sections": ["header", "greeting", "opening", "body", "closing", "signature"],
                "color_schemes": [],
                "font_options": random.sample(FONT_POOL, k=random.randint(8, 10)),
            },
        )
        if cl_created:
            templates_created += 1
        schemes_created += _make_color_schemes(cl_obj, random.randint(5, 8))

    print(f"[seed_templates] Created {templates_created} templates, "
          f"{schemes_created} colour schemes "
          f"({DocumentTemplate.objects.count()} templates total, "
          f"{TemplateColorScheme.objects.count()} schemes total).")
    return templates_created, schemes_created


if __name__ == "__main__":
    run()
