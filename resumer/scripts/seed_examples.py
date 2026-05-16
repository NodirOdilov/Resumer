"""
Seed 280+ resume examples and 170+ cover letter examples.

Usage:
    python manage.py shell < scripts/seed_examples.py
    # Or via django-extensions:
    python manage.py runscript seed_examples
"""

from __future__ import annotations

import random
from typing import Any

from apps.cl_examples.models import CoverLetterExample
from apps.examples.models import ExampleCategory, ExperienceLevel, ResumeExample
from apps.templates_library.models import DocumentTemplate

# ---------------------------------------------------------------------------
# Job titles per category (15-16 per category)
# ---------------------------------------------------------------------------

JOB_TITLES: dict[str, list[str]] = {
    "Accounting & Finance": [
        "Senior Accountant", "Financial Analyst", "Tax Accountant", "Bookkeeper",
        "Accounts Payable Specialist", "Auditor", "Finance Manager", "Controller",
        "Budget Analyst", "Payroll Specialist", "Accounts Receivable Clerk",
        "Certified Public Accountant", "Treasury Analyst", "Revenue Analyst",
        "Financial Planner", "Cost Accountant",
    ],
    "Administrative": [
        "Executive Assistant", "Office Manager", "Administrative Assistant",
        "Receptionist", "Office Coordinator", "Data Entry Clerk",
        "Executive Secretary", "Administrative Coordinator", "Front Desk Manager",
        "Office Administrator", "Virtual Assistant", "Administrative Specialist",
        "Records Manager", "Scheduling Coordinator", "Mail Clerk", "File Clerk",
    ],
    "Business & Management": [
        "Business Analyst", "Project Manager", "Operations Manager",
        "Management Consultant", "Program Director", "Strategy Analyst",
        "General Manager", "Assistant Manager", "Business Development Manager",
        "Chief Operating Officer", "VP of Operations", "Process Improvement Manager",
        "Change Management Specialist", "Program Manager", "Scrum Master",
    ],
    "Customer Service": [
        "Customer Service Representative", "Call Center Agent", "Support Specialist",
        "Customer Success Manager", "Help Desk Analyst", "Client Relations Manager",
        "Technical Support Representative", "Customer Experience Manager",
        "Service Desk Analyst", "Account Manager", "Complaint Resolution Specialist",
        "Customer Support Team Lead", "Retention Specialist", "Inbound Sales Agent",
        "Quality Assurance Analyst",
    ],
    "Data Science & Analytics": [
        "Data Scientist", "Data Analyst", "Machine Learning Engineer",
        "Business Intelligence Analyst", "Data Engineer", "Statistician",
        "Quantitative Analyst", "AI Research Scientist", "Analytics Manager",
        "Database Administrator", "ETL Developer", "Research Analyst",
        "Predictive Modeler", "NLP Engineer", "Deep Learning Engineer",
        "Data Visualization Specialist",
    ],
    "Design & Creative": [
        "Graphic Designer", "UX Designer", "UI Designer", "Art Director",
        "Creative Director", "Motion Graphics Designer", "Brand Designer",
        "Product Designer", "Web Designer", "Visual Designer",
        "Illustrator", "Interaction Designer", "UX Researcher",
        "Design Systems Lead", "Multimedia Designer",
    ],
    "Education & Training": [
        "Elementary School Teacher", "High School Teacher", "College Professor",
        "Academic Advisor", "Curriculum Developer", "Training Coordinator",
        "Instructional Designer", "Special Education Teacher", "ESL Teacher",
        "School Counselor", "Librarian", "Teaching Assistant", "Tutor",
        "Dean of Students", "Education Director", "Adjunct Professor",
    ],
    "Engineering": [
        "Mechanical Engineer", "Civil Engineer", "Electrical Engineer",
        "Chemical Engineer", "Structural Engineer", "Environmental Engineer",
        "Aerospace Engineer", "Industrial Engineer", "Biomedical Engineer",
        "Quality Engineer", "Manufacturing Engineer", "Systems Engineer",
        "Process Engineer", "Project Engineer", "Design Engineer",
    ],
    "Healthcare & Medical": [
        "Registered Nurse", "Nurse Practitioner", "Medical Assistant",
        "Physician", "Pharmacist", "Physical Therapist", "Dental Hygienist",
        "Medical Technologist", "Healthcare Administrator", "Clinical Research Coordinator",
        "Radiologic Technologist", "Emergency Medical Technician", "Occupational Therapist",
        "Speech Language Pathologist", "Medical Coder", "Surgical Technologist",
    ],
    "Hospitality & Tourism": [
        "Hotel Manager", "Event Planner", "Travel Agent", "Restaurant Manager",
        "Chef", "Concierge", "Banquet Manager", "Front Office Manager",
        "Housekeeping Supervisor", "Cruise Director", "Tourism Marketing Manager",
        "Food and Beverage Director", "Catering Manager", "Resort Manager",
        "Guest Relations Manager",
    ],
    "Human Resources": [
        "HR Manager", "Recruiter", "Talent Acquisition Specialist",
        "HR Business Partner", "Compensation Analyst", "Benefits Coordinator",
        "Training and Development Manager", "HRIS Analyst", "Employee Relations Specialist",
        "Diversity and Inclusion Manager", "HR Generalist", "Workforce Planning Analyst",
        "Organizational Development Consultant", "Payroll Manager", "HR Director",
    ],
    "Information Technology": [
        "Software Engineer", "DevOps Engineer", "System Administrator",
        "IT Manager", "Full Stack Developer", "Frontend Developer",
        "Backend Developer", "Cloud Architect", "Security Analyst",
        "QA Engineer", "Network Engineer", "Site Reliability Engineer",
        "Mobile Developer", "Technical Lead", "CTO", "Solutions Architect",
    ],
    "Legal": [
        "Attorney", "Paralegal", "Legal Assistant", "Compliance Officer",
        "Contract Manager", "Corporate Counsel", "Litigation Associate",
        "Legal Secretary", "Immigration Lawyer", "Intellectual Property Attorney",
        "Public Defender", "Legal Analyst", "Court Clerk", "Mediator",
        "Risk and Compliance Manager",
    ],
    "Marketing & Communications": [
        "Marketing Manager", "Content Writer", "Social Media Manager",
        "SEO Specialist", "Public Relations Specialist", "Brand Manager",
        "Digital Marketing Manager", "Email Marketing Specialist",
        "Copywriter", "Communications Director", "Marketing Analyst",
        "Growth Marketing Manager", "Content Strategist", "Product Marketing Manager",
        "Media Planner", "Campaign Manager",
    ],
    "Retail & Sales": [
        "Sales Manager", "Retail Store Manager", "Account Executive",
        "Business Development Representative", "Sales Associate",
        "Territory Sales Manager", "Inside Sales Representative",
        "Regional Sales Director", "Retail Buyer", "Merchandiser",
        "E-commerce Manager", "Sales Operations Analyst", "Key Account Manager",
        "Outside Sales Representative", "Cashier",
    ],
    "Science & Research": [
        "Research Scientist", "Lab Technician", "Biologist", "Chemist",
        "Physicist", "Research Associate", "Clinical Researcher",
        "Environmental Scientist", "Microbiologist", "Geologist",
        "Forensic Scientist", "Marine Biologist", "Pharmacologist",
        "Materials Scientist", "Research Director",
    ],
    "Skilled Trades & Manufacturing": [
        "Electrician", "Welder", "Machinist", "Production Supervisor",
        "CNC Operator", "Plumber", "HVAC Technician", "Carpenter",
        "Quality Control Inspector", "Maintenance Technician",
        "Assembly Line Worker", "Tool and Die Maker", "Industrial Mechanic",
        "Forklift Operator", "Plant Manager",
    ],
    "Transportation & Logistics": [
        "Truck Driver", "Logistics Coordinator", "Supply Chain Manager",
        "Warehouse Supervisor", "Fleet Manager", "Shipping Clerk",
        "Dispatcher", "Freight Broker", "Import/Export Specialist",
        "Delivery Driver", "Transportation Manager", "Inventory Manager",
        "Procurement Specialist", "Distribution Center Manager",
        "Route Planner",
    ],
}

# ---------------------------------------------------------------------------
# Realistic skills per category
# ---------------------------------------------------------------------------

SKILLS_BY_CATEGORY: dict[str, list[str]] = {
    "Accounting & Finance": ["GAAP", "QuickBooks", "Financial Modeling", "Tax Preparation", "SAP", "Excel Advanced", "Audit", "Budgeting", "Reconciliation", "Compliance"],
    "Administrative": ["Microsoft Office Suite", "Calendar Management", "Data Entry", "Travel Coordination", "Filing Systems", "Meeting Coordination", "Typing 75 WPM", "Office Equipment", "Record Keeping", "Scheduling"],
    "Business & Management": ["Strategic Planning", "Stakeholder Management", "Agile", "P&L Management", "Risk Assessment", "KPI Tracking", "Business Process Improvement", "Team Leadership", "Budgeting", "Change Management"],
    "Customer Service": ["CRM Software", "Conflict Resolution", "Active Listening", "Salesforce", "Zendesk", "Phone Etiquette", "Problem Solving", "Complaint Handling", "Upselling", "Time Management"],
    "Data Science & Analytics": ["Python", "R", "SQL", "TensorFlow", "Pandas", "Scikit-learn", "Tableau", "Statistical Analysis", "Machine Learning", "Data Visualization"],
    "Design & Creative": ["Adobe Creative Suite", "Figma", "Sketch", "Typography", "Color Theory", "Wireframing", "Prototyping", "Brand Identity", "Print Design", "Motion Graphics"],
    "Education & Training": ["Curriculum Development", "Classroom Management", "Lesson Planning", "Student Assessment", "Differentiated Instruction", "IEP Development", "Educational Technology", "Parent Communication", "Google Classroom", "Mentoring"],
    "Engineering": ["AutoCAD", "SolidWorks", "MATLAB", "FEA Analysis", "Project Management", "Technical Drawing", "Quality Assurance", "Lean Manufacturing", "Root Cause Analysis", "Compliance Standards"],
    "Healthcare & Medical": ["Patient Care", "EMR/EHR Systems", "HIPAA Compliance", "Vital Signs Monitoring", "Medication Administration", "CPR/BLS Certified", "Clinical Documentation", "Infection Control", "Triage", "Care Planning"],
    "Hospitality & Tourism": ["Guest Relations", "Revenue Management", "POS Systems", "Event Coordination", "Food Safety", "Staff Scheduling", "Inventory Control", "Reservation Systems", "Banquet Planning", "Customer Satisfaction"],
    "Human Resources": ["Recruiting", "ADP Workforce", "Benefits Administration", "Employee Relations", "HRIS", "Performance Management", "Labor Law Compliance", "Onboarding", "Compensation Analysis", "Talent Management"],
    "Information Technology": ["Python", "JavaScript", "AWS", "Docker", "Kubernetes", "Linux", "CI/CD", "Git", "Agile/Scrum", "REST APIs"],
    "Legal": ["Legal Research", "Contract Drafting", "Westlaw", "LexisNexis", "Case Management", "Legal Writing", "Regulatory Compliance", "E-Discovery", "Litigation Support", "Client Counseling"],
    "Marketing & Communications": ["Google Analytics", "SEO/SEM", "Social Media Marketing", "Content Strategy", "Email Marketing", "HubSpot", "A/B Testing", "Copywriting", "Brand Management", "Marketing Automation"],
    "Retail & Sales": ["Salesforce CRM", "Negotiation", "Lead Generation", "Pipeline Management", "Cold Calling", "Retail Merchandising", "POS Systems", "Inventory Management", "Customer Relationship Building", "Sales Forecasting"],
    "Science & Research": ["Laboratory Techniques", "Data Analysis", "Scientific Writing", "GLP Compliance", "PCR", "Spectroscopy", "Statistical Software", "Grant Writing", "Literature Review", "HPLC"],
    "Skilled Trades & Manufacturing": ["Blueprint Reading", "OSHA Safety", "Welding", "CNC Programming", "Electrical Wiring", "Preventive Maintenance", "Quality Inspection", "Hand and Power Tools", "PLC Programming", "Lean Manufacturing"],
    "Transportation & Logistics": ["Route Optimization", "DOT Regulations", "Warehouse Management Systems", "Supply Chain Optimization", "Fleet Management Software", "Inventory Control", "Freight Negotiation", "GPS Navigation", "CDL Class A", "Safety Compliance"],
}

# ---------------------------------------------------------------------------
# Content generators
# ---------------------------------------------------------------------------

FIRST_NAMES = [
    "James", "Maria", "David", "Sarah", "Michael", "Jennifer", "Robert", "Lisa",
    "William", "Jessica", "Richard", "Emily", "Thomas", "Amanda", "Daniel", "Ashley",
    "Christopher", "Stephanie", "Matthew", "Nicole", "Anthony", "Megan", "Andrew", "Rachel",
    "Joseph", "Samantha", "Kevin", "Lauren", "Brian", "Natalie",
]

LAST_NAMES = [
    "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson",
    "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Hall",
    "Young", "Allen", "King",
]

UNIVERSITIES = [
    "University of California", "Stanford University", "MIT",
    "University of Michigan", "Columbia University", "NYU",
    "Georgia Institute of Technology", "University of Texas at Austin",
    "University of Washington", "Boston University",
    "Penn State University", "University of Illinois",
]

DEGREES = {
    "entry": ["Bachelor of Science", "Bachelor of Arts", "Associate Degree"],
    "mid": ["Bachelor of Science", "Bachelor of Arts", "Master of Science", "Master of Arts"],
    "senior": ["Master of Science", "Master of Business Administration", "Doctor of Philosophy", "Bachelor of Science"],
}

YEARS_OF_EXPERIENCE = {
    "entry": (0, 3),
    "mid": (4, 8),
    "senior": (9, 20),
}


def _build_resume_content(
    job_title: str,
    level: str,
    category_name: str,
) -> dict[str, Any]:
    """Generate a realistic resume content JSON structure."""
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    skills = SKILLS_BY_CATEGORY.get(category_name, ["Communication", "Teamwork", "Problem Solving"])

    yoe_min, yoe_max = YEARS_OF_EXPERIENCE.get(level, (1, 5))
    years = random.randint(yoe_min, yoe_max)

    summary_templates = [
        f"Results-driven {job_title} with {years}+ years of experience delivering high-impact solutions. "
        f"Proven track record in {skills[0].lower()} and {skills[1].lower()} with a passion for continuous improvement.",
        f"Dedicated {job_title} bringing {years} years of industry expertise. "
        f"Skilled in {skills[0].lower()}, {skills[2].lower()}, and cross-functional collaboration.",
        f"Accomplished {job_title} with {years} years of progressive experience. "
        f"Expertise in {skills[0].lower()} and {skills[1].lower()}, focused on driving measurable outcomes.",
    ]

    degree = random.choice(DEGREES.get(level, DEGREES["mid"]))
    university = random.choice(UNIVERSITIES)
    grad_year = 2024 - years - random.randint(0, 4)

    return {
        "contact": {
            "full_name": f"{first} {last}",
            "email": f"{first.lower()}.{last.lower()}@example.com",
            "phone": f"+1 (555) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "location": random.choice([
                "New York, NY", "San Francisco, CA", "Chicago, IL", "Austin, TX",
                "Seattle, WA", "Boston, MA", "Denver, CO", "Atlanta, GA",
                "Los Angeles, CA", "Portland, OR",
            ]),
            "linkedin": f"linkedin.com/in/{first.lower()}{last.lower()}",
        },
        "summary": random.choice(summary_templates),
        "experience": [
            {
                "title": job_title,
                "company": random.choice([
                    "Apex Solutions Inc.", "Meridian Corp.", "Vertex Industries",
                    "Pinnacle Group", "TechNova LLC", "Summit Partners",
                    "Catalyst Global", "BlueStar Enterprises", "Paragon Systems",
                    "Eclipse Digital",
                ]),
                "location": random.choice(["New York, NY", "Remote", "San Francisco, CA", "Chicago, IL"]),
                "start_date": f"{2024 - random.randint(1, 3)}-01",
                "end_date": None,
                "is_current": True,
                "bullets": [
                    f"Led cross-functional team of {random.randint(3, 15)} members to deliver key projects on time and under budget.",
                    f"Improved {skills[0].lower()} processes resulting in a {random.randint(15, 45)}% increase in efficiency.",
                    f"Implemented {skills[2].lower()} strategies that drove ${random.randint(50, 500)}K in annual savings.",
                    f"Collaborated with stakeholders to define requirements and ensure alignment with business objectives.",
                ],
            },
            {
                "title": f"Junior {job_title}" if level == "entry" else job_title,
                "company": random.choice([
                    "Horizon Analytics", "Silverline Corp.", "CoreBridge Inc.",
                    "Nexus Dynamics", "Lighthouse Group", "WavePoint Technologies",
                ]),
                "location": random.choice(["Boston, MA", "Austin, TX", "Denver, CO"]),
                "start_date": f"{2024 - years}-06",
                "end_date": f"{2024 - random.randint(1, 3)}-01",
                "is_current": False,
                "bullets": [
                    f"Managed {skills[1].lower()} initiatives across multiple departments.",
                    f"Developed and maintained documentation for {skills[3].lower()} procedures.",
                    f"Reduced operational costs by {random.randint(10, 30)}% through process optimization.",
                ],
            },
        ],
        "education": [
            {
                "degree": degree,
                "field_of_study": random.choice([
                    "Business Administration", "Computer Science", "Engineering",
                    "Communications", "Finance", "Biology", "English",
                    "Psychology", "Mathematics", "Healthcare Administration",
                ]),
                "institution": university,
                "graduation_year": grad_year,
                "gpa": round(random.uniform(3.2, 3.95), 2) if level == "entry" else None,
            },
        ],
        "skills": random.sample(skills, k=min(len(skills), random.randint(6, 10))),
    }


def _build_cover_letter_content(job_title: str, level: str, category_name: str) -> dict[str, Any]:
    """Generate a cover letter content JSON structure."""
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    skills = SKILLS_BY_CATEGORY.get(category_name, ["Communication", "Teamwork"])
    yoe_min, yoe_max = YEARS_OF_EXPERIENCE.get(level, (1, 5))
    years = random.randint(yoe_min, yoe_max)

    return {
        "header": {
            "full_name": f"{first} {last}",
            "email": f"{first.lower()}.{last.lower()}@example.com",
            "phone": f"+1 (555) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "date": "2025-01-15",
        },
        "recipient": {
            "name": "Hiring Manager",
            "company": random.choice([
                "Apex Solutions Inc.", "Meridian Corp.", "TechNova LLC",
                "Summit Partners", "Paragon Systems",
            ]),
            "address": random.choice(["New York, NY", "San Francisco, CA", "Chicago, IL"]),
        },
        "greeting": "Dear Hiring Manager,",
        "opening": (
            f"I am writing to express my strong interest in the {job_title} position "
            f"at your organization. With {years} years of experience in {skills[0].lower()} "
            f"and {skills[1].lower()}, I am confident in my ability to contribute "
            f"meaningfully to your team."
        ),
        "body": (
            f"Throughout my career, I have developed deep expertise in {skills[0].lower()} "
            f"and {skills[2].lower()}. In my most recent role, I successfully led initiatives "
            f"that resulted in measurable improvements across key performance indicators. "
            f"I am particularly drawn to this opportunity because of the chance to leverage "
            f"my {skills[1].lower()} skills in a dynamic and collaborative environment."
        ),
        "closing": (
            "I would welcome the opportunity to discuss how my background, skills, and "
            "enthusiasm align with the needs of your team. Thank you for considering my "
            "application, and I look forward to hearing from you."
        ),
        "signature": f"Sincerely,\n{first} {last}",
    }


# ---------------------------------------------------------------------------
# Main runner
# ---------------------------------------------------------------------------

def run() -> tuple[int, int]:
    """
    Create 280+ resume examples and 170+ cover letter examples.
    Returns (resume_count, cover_letter_count).
    """
    random.seed(42)

    categories = list(ExampleCategory.objects.all().order_by("order"))
    if not categories:
        print("[seed_examples] ERROR: No categories found. Run seed_categories first.")
        return 0, 0

    resume_templates = list(
        DocumentTemplate.objects.filter(type=DocumentTemplate.TemplateType.RESUME)
    )
    cl_templates = list(
        DocumentTemplate.objects.filter(type=DocumentTemplate.TemplateType.COVER_LETTER)
    )

    if not resume_templates:
        print("[seed_examples] WARNING: No resume templates found. Examples will have no template FK.")
    if not cl_templates:
        print("[seed_examples] WARNING: No cover letter templates found.")

    levels = [ExperienceLevel.ENTRY, ExperienceLevel.MID, ExperienceLevel.SENIOR]
    resume_created = 0
    cl_created = 0

    for cat in categories:
        titles = JOB_TITLES.get(cat.name, [])
        if not titles:
            # Fallback for categories not in our dict
            titles = [f"{cat.name} Specialist", f"{cat.name} Coordinator", f"{cat.name} Manager"]

        # ---- Resume examples: 15-16 per category ----
        for idx, job_title in enumerate(titles[:16]):
            level = levels[idx % 3]
            title = f"{job_title} Resume Example"

            _, created = ResumeExample.objects.get_or_create(
                title=title,
                defaults={
                    "category": cat,
                    "job_title": job_title,
                    "industry": cat.name,
                    "experience_level": level,
                    "content": _build_resume_content(job_title, level, cat.name),
                    "template": random.choice(resume_templates) if resume_templates else None,
                    "meta_title": f"{job_title} Resume Example | Resumer",
                    "meta_description": (
                        f"Download a professional {job_title} resume example. "
                        f"ATS-friendly template with real-world content for "
                        f"{level.replace('_', ' ')} level candidates."
                    ),
                    "is_featured": idx < 3,
                },
            )
            if created:
                resume_created += 1

        # ---- Cover letter examples: 10 per category ----
        for idx, job_title in enumerate(titles[:10]):
            level = levels[idx % 3]
            cl_title = f"{job_title} Cover Letter Example"

            _, created = CoverLetterExample.objects.get_or_create(
                title=cl_title,
                defaults={
                    "category": cat,
                    "job_title": job_title,
                    "experience_level": level,
                    "content": _build_cover_letter_content(job_title, level, cat.name),
                    "template": random.choice(cl_templates) if cl_templates else None,
                    "meta_title": f"{job_title} Cover Letter Example | Resumer",
                    "meta_description": (
                        f"Professional {job_title} cover letter example. "
                        f"Customizable template to help you land your dream job."
                    ),
                    "is_featured": idx < 2,
                },
            )
            if created:
                cl_created += 1

    print(f"[seed_examples] Created {resume_created} resume examples "
          f"({ResumeExample.objects.count()} total).")
    print(f"[seed_examples] Created {cl_created} cover letter examples "
          f"({CoverLetterExample.objects.count()} total).")
    return resume_created, cl_created


if __name__ == "__main__":
    run()
