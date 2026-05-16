"""
Seed 18 example categories for resume and cover letter examples.

Usage:
    python manage.py shell < scripts/seed_categories.py
    # Or via django-extensions:
    python manage.py runscript seed_categories
"""

from __future__ import annotations

from apps.examples.models import ExampleCategory

CATEGORIES: list[dict[str, str | int]] = [
    {"name": "Accounting & Finance", "icon": "mdi-calculator-variant", "order": 1},
    {"name": "Administrative", "icon": "mdi-clipboard-text", "order": 2},
    {"name": "Business & Management", "icon": "mdi-briefcase", "order": 3},
    {"name": "Customer Service", "icon": "mdi-headset", "order": 4},
    {"name": "Data Science & Analytics", "icon": "mdi-chart-bar", "order": 5},
    {"name": "Design & Creative", "icon": "mdi-palette", "order": 6},
    {"name": "Education & Training", "icon": "mdi-school", "order": 7},
    {"name": "Engineering", "icon": "mdi-cog", "order": 8},
    {"name": "Healthcare & Medical", "icon": "mdi-hospital-box", "order": 9},
    {"name": "Hospitality & Tourism", "icon": "mdi-silverware-fork-knife", "order": 10},
    {"name": "Human Resources", "icon": "mdi-account-group", "order": 11},
    {"name": "Information Technology", "icon": "mdi-laptop", "order": 12},
    {"name": "Legal", "icon": "mdi-gavel", "order": 13},
    {"name": "Marketing & Communications", "icon": "mdi-bullhorn", "order": 14},
    {"name": "Retail & Sales", "icon": "mdi-store", "order": 15},
    {"name": "Science & Research", "icon": "mdi-flask", "order": 16},
    {"name": "Skilled Trades & Manufacturing", "icon": "mdi-wrench", "order": 17},
    {"name": "Transportation & Logistics", "icon": "mdi-truck", "order": 18},
]

CATEGORY_DESCRIPTIONS: dict[str, str] = {
    "Accounting & Finance": "Professional resume examples for accountants, financial analysts, auditors, bookkeepers, and finance managers.",
    "Administrative": "Resume examples for office administrators, executive assistants, receptionists, and office managers.",
    "Business & Management": "Resume examples for business analysts, project managers, operations managers, and consultants.",
    "Customer Service": "Resume examples for customer service representatives, call center agents, and support specialists.",
    "Data Science & Analytics": "Resume examples for data scientists, data analysts, machine learning engineers, and BI analysts.",
    "Design & Creative": "Resume examples for graphic designers, UX designers, art directors, and creative professionals.",
    "Education & Training": "Resume examples for teachers, professors, tutors, academic advisors, and curriculum developers.",
    "Engineering": "Resume examples for mechanical, civil, electrical, and chemical engineers.",
    "Healthcare & Medical": "Resume examples for nurses, doctors, medical assistants, pharmacists, and healthcare administrators.",
    "Hospitality & Tourism": "Resume examples for hotel managers, event planners, travel agents, and restaurant managers.",
    "Human Resources": "Resume examples for HR managers, recruiters, talent acquisition specialists, and HR analysts.",
    "Information Technology": "Resume examples for software engineers, system administrators, DevOps engineers, and IT managers.",
    "Legal": "Resume examples for lawyers, paralegals, legal assistants, and compliance officers.",
    "Marketing & Communications": "Resume examples for marketing managers, content writers, social media specialists, and PR professionals.",
    "Retail & Sales": "Resume examples for sales managers, retail associates, account executives, and business development reps.",
    "Science & Research": "Resume examples for research scientists, lab technicians, biologists, and chemists.",
    "Skilled Trades & Manufacturing": "Resume examples for electricians, welders, machinists, and production supervisors.",
    "Transportation & Logistics": "Resume examples for truck drivers, logistics coordinators, supply chain managers, and warehouse supervisors.",
}


def run() -> int:
    """Create all 18 example categories. Returns count of created categories."""
    created_count = 0
    for cat_data in CATEGORIES:
        name = cat_data["name"]
        obj, created = ExampleCategory.objects.get_or_create(
            name=name,
            defaults={
                "icon": cat_data["icon"],
                "order": cat_data["order"],
                "description": CATEGORY_DESCRIPTIONS.get(str(name), ""),
                "is_active": True,
            },
        )
        if created:
            created_count += 1

    print(f"[seed_categories] Created {created_count} example categories "
          f"({ExampleCategory.objects.count()} total).")
    return created_count


if __name__ == "__main__":
    run()
