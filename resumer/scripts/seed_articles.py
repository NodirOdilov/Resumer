"""
Seed 22 authors, 6 article categories, 40+ tags, and 600+ articles.

Usage:
    python manage.py shell < scripts/seed_articles.py
    # Or via django-extensions:
    python manage.py runscript seed_articles
"""

from __future__ import annotations

import random
from datetime import timedelta

from django.utils import timezone
from django.utils.text import slugify

from apps.content.models import Article, ArticleCategory, Author, Tag

# ---------------------------------------------------------------------------
# Authors (22)
# ---------------------------------------------------------------------------

AUTHORS_DATA: list[dict] = [
    {"name": "Sarah Mitchell", "title": "Career Expert, CPRW", "cprw": True,
     "bio": "Sarah Mitchell is a Certified Professional Resume Writer (CPRW) with over 12 years of experience helping job seekers craft compelling resumes and cover letters. She has reviewed thousands of resumes across industries and specializes in career transitions."},
    {"name": "James Rodriguez", "title": "Senior Career Advisor", "cprw": False,
     "bio": "James Rodriguez brings 10 years of recruiting and career coaching experience. He has worked with Fortune 500 companies and startups alike, helping candidates navigate the job market successfully."},
    {"name": "Emily Chen", "title": "Resume Strategist, CPRW", "cprw": True,
     "bio": "Emily Chen is a CPRW who combines data-driven insights with creative storytelling. She has helped over 5,000 professionals land interviews at top companies including Google, Amazon, and Microsoft."},
    {"name": "Michael Thompson", "title": "HR Director & Career Coach", "cprw": False,
     "bio": "With 15 years in human resources, Michael Thompson offers insider knowledge on what hiring managers look for. He has screened over 50,000 resumes throughout his career."},
    {"name": "Jessica Park", "title": "Career Development Specialist, CPRW", "cprw": True,
     "bio": "Jessica Park is a CPRW specializing in executive-level resumes and LinkedIn optimization. She regularly speaks at career conferences and has been featured in Forbes and Business Insider."},
    {"name": "David Wilson", "title": "Technical Resume Writer", "cprw": False,
     "bio": "David Wilson focuses on IT and engineering resumes. A former software developer turned career writer, he understands the technical nuances that make engineering resumes stand out."},
    {"name": "Amanda Foster", "title": "Career Content Writer, CPRW", "cprw": True,
     "bio": "Amanda Foster has been writing career advice content for over 8 years. She holds a CPRW certification and a master's degree in Communications from Columbia University."},
    {"name": "Robert Kim", "title": "Employment Strategist", "cprw": False,
     "bio": "Robert Kim is a former corporate recruiter who has placed candidates at leading organizations. He specializes in salary negotiation strategies and interview preparation."},
    {"name": "Laura Martinez", "title": "Resume Expert, CPRW", "cprw": True,
     "bio": "Laura Martinez is a bilingual CPRW who helps both English and Spanish-speaking professionals build powerful resumes. She has 9 years of experience in career services."},
    {"name": "Christopher Lee", "title": "Career Coach & Author", "cprw": False,
     "bio": "Christopher Lee is the author of two bestselling career books. He has coached over 3,000 professionals through career transitions and job searches."},
    {"name": "Natalie Brown", "title": "Cover Letter Specialist, CPRW", "cprw": True,
     "bio": "Natalie Brown is a CPRW known for her expertise in cover letters. She has developed a methodology that has helped thousands of job seekers secure interviews."},
    {"name": "Andrew Taylor", "title": "Interview Coach", "cprw": False,
     "bio": "Andrew Taylor is a certified interview coach who has conducted over 10,000 mock interviews. He helps candidates prepare for behavioral, technical, and case interviews."},
    {"name": "Rachel Green", "title": "Career Transition Specialist, CPRW", "cprw": True,
     "bio": "Rachel Green is a CPRW who specializes in career changers. She helps professionals pivot industries by highlighting transferable skills and achievements."},
    {"name": "Daniel Harris", "title": "LinkedIn & Personal Branding Expert", "cprw": False,
     "bio": "Daniel Harris helps professionals build their personal brand online. He has optimized over 2,000 LinkedIn profiles and developed content strategies for thought leaders."},
    {"name": "Stephanie White", "title": "Academic CV Writer, CPRW", "cprw": True,
     "bio": "Stephanie White specializes in academic CVs and research-focused resumes. She has helped postdocs, professors, and researchers at institutions worldwide."},
    {"name": "Kevin Moore", "title": "Recruitment Technology Analyst", "cprw": False,
     "bio": "Kevin Moore studies how ATS software evaluates resumes. His research on applicant tracking systems has helped thousands of job seekers optimize their documents."},
    {"name": "Megan Jackson", "title": "Entry-Level Career Advisor, CPRW", "cprw": True,
     "bio": "Megan Jackson is a CPRW dedicated to helping recent graduates and entry-level professionals. She has partnered with 50+ universities on career readiness programs."},
    {"name": "Brian Clark", "title": "Executive Resume Writer", "cprw": False,
     "bio": "Brian Clark has crafted resumes for C-suite executives and board members. His clients include CEOs, CTOs, and VPs at companies ranging from startups to Fortune 100."},
    {"name": "Nicole Adams", "title": "Healthcare Career Specialist, CPRW", "cprw": True,
     "bio": "Nicole Adams is a CPRW with deep expertise in healthcare industry resumes. A former nurse herself, she understands the unique requirements of medical professionals."},
    {"name": "Thomas Wright", "title": "Career Trends Researcher", "cprw": False,
     "bio": "Thomas Wright analyzes job market trends and provides data-backed career advice. His annual salary and hiring reports are read by over 100,000 professionals."},
    {"name": "Ashley Turner", "title": "Remote Work Career Advisor, CPRW", "cprw": True,
     "bio": "Ashley Turner is a CPRW who helps professionals secure remote positions. She has been writing about remote work and distributed teams since 2018."},
    {"name": "Matthew Scott", "title": "Military-to-Civilian Resume Expert", "cprw": False,
     "bio": "Matthew Scott is a veteran who now helps fellow service members transition to civilian careers. He has assisted over 1,500 veterans with their resumes and job searches."},
]

# ---------------------------------------------------------------------------
# Article categories
# ---------------------------------------------------------------------------

ARTICLE_CATEGORIES: list[dict[str, str | int]] = [
    {"name": "Resume Writing", "slug": "resume-writing", "icon": "mdi-file-document-edit", "order": 1,
     "description": "Tips, guides, and best practices for writing professional resumes."},
    {"name": "CV Writing", "slug": "cv-writing", "icon": "mdi-file-document-multiple", "order": 2,
     "description": "Comprehensive guides on academic and international CV formats."},
    {"name": "Cover Letter", "slug": "cover-letter", "icon": "mdi-email-edit", "order": 3,
     "description": "How to write compelling cover letters that get you interviews."},
    {"name": "Job Search", "slug": "job-search", "icon": "mdi-magnify", "order": 4,
     "description": "Strategies for finding and landing your dream job."},
    {"name": "Career Advice", "slug": "career-advice", "icon": "mdi-compass", "order": 5,
     "description": "General career guidance, growth strategies, and professional development."},
    {"name": "Interview Tips", "slug": "interview-tips", "icon": "mdi-microphone", "order": 6,
     "description": "Preparation tips, common questions, and strategies for acing interviews."},
]

# ---------------------------------------------------------------------------
# Tags
# ---------------------------------------------------------------------------

TAG_NAMES: list[str] = [
    "Resume Tips", "Cover Letter Tips", "ATS Optimization", "Career Change",
    "Entry Level", "Executive", "Remote Work", "Salary Negotiation",
    "LinkedIn", "Networking", "Interview Prep", "Job Search Strategy",
    "Professional Development", "Skills Section", "Resume Format",
    "Chronological Resume", "Functional Resume", "Combination Resume",
    "Resume Summary", "Resume Objective", "Work Experience", "Education Section",
    "References", "Portfolio", "Personal Branding", "Freelancing",
    "Internship", "First Job", "Career Gap", "Industry Specific",
    "Tech Resume", "Healthcare Resume", "Finance Resume", "Marketing Resume",
    "Engineering Resume", "Teaching Resume", "Creative Resume", "Federal Resume",
    "Resume Design", "Resume Keywords",
]

# ---------------------------------------------------------------------------
# Articles (600+) - Generated from topic lists per category
# ---------------------------------------------------------------------------

# Tag mapping: keywords in titles -> tags to assign
_TAG_KEYWORDS: dict[str, list[str]] = {
    "ats": ["ATS Optimization"],
    "applicant tracking": ["ATS Optimization"],
    "keyword": ["Resume Keywords", "ATS Optimization"],
    "format": ["Resume Format"],
    "template": ["Resume Format"],
    "layout": ["Resume Format", "Resume Design"],
    "design": ["Resume Design"],
    "creative": ["Creative Resume"],
    "summary": ["Resume Summary"],
    "objective": ["Resume Objective"],
    "experience": ["Work Experience"],
    "skill": ["Skills Section"],
    "education": ["Education Section"],
    "reference": ["References"],
    "chronological": ["Chronological Resume"],
    "functional": ["Functional Resume"],
    "combination": ["Combination Resume"],
    "career change": ["Career Change"],
    "career transition": ["Career Change"],
    "pivot": ["Career Change"],
    "entry level": ["Entry Level"],
    "entry-level": ["Entry Level"],
    "first job": ["First Job", "Entry Level"],
    "no experience": ["Entry Level", "First Job"],
    "graduate": ["Entry Level"],
    "intern": ["Internship", "Entry Level"],
    "executive": ["Executive"],
    "senior": ["Executive"],
    "c-suite": ["Executive"],
    "remote": ["Remote Work"],
    "work from home": ["Remote Work"],
    "salary": ["Salary Negotiation"],
    "negotiat": ["Salary Negotiation"],
    "compensation": ["Salary Negotiation"],
    "linkedin": ["LinkedIn"],
    "network": ["Networking"],
    "interview": ["Interview Prep"],
    "cover letter": ["Cover Letter Tips"],
    "personal brand": ["Personal Branding"],
    "portfolio": ["Portfolio"],
    "freelanc": ["Freelancing"],
    "federal": ["Federal Resume"],
    "government": ["Federal Resume"],
    "tech": ["Tech Resume"],
    "software": ["Tech Resume"],
    "engineer": ["Engineering Resume"],
    "healthcare": ["Healthcare Resume"],
    "nurse": ["Healthcare Resume"],
    "medical": ["Healthcare Resume"],
    "finance": ["Finance Resume"],
    "marketing": ["Marketing Resume"],
    "teaching": ["Teaching Resume"],
    "gap": ["Career Gap"],
    "fired": ["Career Gap"],
    "laid off": ["Career Gap"],
    "professional development": ["Professional Development"],
    "career growth": ["Professional Development"],
    "promotion": ["Professional Development"],
    "leadership": ["Professional Development"],
}


def _pick_tags(title: str, category: str) -> list[str]:
    """Pick 2-4 relevant tags based on title keywords and category."""
    tags: list[str] = []
    title_lower = title.lower()

    # Add tags based on keyword matches
    for keyword, keyword_tags in _TAG_KEYWORDS.items():
        if keyword in title_lower:
            tags.extend(keyword_tags)

    # Add default category tags
    cat_defaults = {
        "Resume Writing": ["Resume Tips"],
        "CV Writing": ["Resume Tips", "Resume Format"],
        "Cover Letter": ["Cover Letter Tips"],
        "Job Search": ["Job Search Strategy"],
        "Career Advice": ["Professional Development"],
        "Interview Tips": ["Interview Prep"],
    }
    tags.extend(cat_defaults.get(category, []))

    # Deduplicate and limit to 2-4 tags
    seen: set[str] = set()
    unique: list[str] = []
    for t in tags:
        if t not in seen and t in TAG_NAMES:
            seen.add(t)
            unique.append(t)

    if len(unique) < 2:
        # Pad with a generic tag
        for fallback in ["Resume Tips", "Professional Development", "Job Search Strategy"]:
            if fallback not in seen and fallback in TAG_NAMES:
                unique.append(fallback)
                if len(unique) >= 2:
                    break

    return unique[:4]


# ---- Resume Writing topics (100) ----
RESUME_WRITING_TOPICS: list[str] = [
    # Original 25
    "How to Write a Professional Resume in 2025: Complete Guide",
    "10 Resume Mistakes That Cost You the Interview",
    "The Ultimate Guide to Resume Formatting",
    "How to Write a Resume Summary That Gets Noticed",
    "Resume Objective vs Summary: Which One Should You Use?",
    "How to List Work Experience on a Resume",
    "Best Skills to Put on a Resume in 2025",
    "Chronological vs Functional Resume: Which is Right for You?",
    "How to Write a Resume With No Experience",
    "ATS-Friendly Resume: How to Beat Applicant Tracking Systems",
    "How to Quantify Achievements on Your Resume",
    "How to Tailor Your Resume for Each Job Application",
    "Resume Action Verbs: 200+ Power Words to Use",
    "How to Write an Education Section on Your Resume",
    "How to Handle Employment Gaps on Your Resume",
    "One-Page Resume: When and How to Keep It Short",
    "Two-Page Resume: When Is It Appropriate?",
    "Resume References: Should You Include Them?",
    "How to Write a Federal Resume: Government Job Guide",
    "How to Write a Technical Resume for Software Engineers",
    "Resume Header: What to Include and What to Leave Out",
    "How to List Certifications on a Resume",
    "Resume for Career Changers: How to Pivot Successfully",
    "How to Include Volunteer Work on Your Resume",
    "Creative Resume Design: When Does It Help?",
    # New 75
    "How to Write a Resume for a Marketing Position",
    "Resume for Project Managers: Key Sections and Tips",
    "How to Showcase Leadership Skills on Your Resume",
    "Resume Writing for Healthcare Professionals",
    "Best Resume Fonts: Typography That Gets You Hired",
    "How to Write a Resume for a Finance Career",
    "Resume for Teachers: Education-Specific Tips",
    "How to Add Freelance Work to Your Resume",
    "Resume Writing Tips for Military Veterans",
    "How to List Languages on Your Resume",
    "Resume for Data Scientists: What Recruiters Want",
    "Writing a Resume After Being Laid Off",
    "How to Describe Remote Work on Your Resume",
    "Resume Tips for Returning to Work After a Break",
    "How to Write a Resume for a Startup Job",
    "Resume for Sales Professionals: Metrics That Matter",
    "How to List Projects on Your Resume",
    "Resume for Graphic Designers: Showcasing Your Portfolio",
    "Writing a Resume for the Hospitality Industry",
    "How to Include Hobbies and Interests on a Resume",
    "Resume for Human Resources Professionals",
    "How to Write a Resume for a Legal Career",
    "Resume Tips for Accountants and Auditors",
    "How to Write a Resume for a Nonprofit Job",
    "Resume for Supply Chain and Logistics Roles",
    "How to List Publications on Your Resume",
    "Resume Writing for the Construction Industry",
    "How to Include Awards and Honors on Your Resume",
    "Resume for Administrative Assistants: Key Skills",
    "How to Write a Resume for a Government Contractor",
    "Resume Tips for Real Estate Professionals",
    "How to Write a Strong Resume Headline",
    "Resume for Cybersecurity Professionals",
    "How to Handle Multiple Jobs at the Same Company on a Resume",
    "Resume Writing for the Retail Industry",
    "How to Include Professional Memberships on a Resume",
    "Resume for UX and UI Designers",
    "Writing a Resume for an Apprenticeship",
    "How to List Online Courses on Your Resume",
    "Resume Tips for the Pharmaceutical Industry",
    "How to Write a Resume for a Customer Service Role",
    "Resume for Mechanical Engineers: Technical Skills to Highlight",
    "How to Write a Combination Resume: Step-by-Step",
    "Resume for Social Workers: Compassion Meets Professionalism",
    "How to Include Research Experience on Your Resume",
    "Resume Tips for the Automotive Industry",
    "How to Write a Resume for an IT Support Role",
    "Resume for Electrical Engineers: What to Include",
    "Writing a Resume for the Food Service Industry",
    "How to Add GPA to Your Resume (And When to Skip It)",
    "Resume for Civil Engineers: Projects and Certifications",
    "How to Write a Resume for an Executive Assistant Role",
    "Resume Tips for the Telecommunications Industry",
    "How to List Soft Skills vs Hard Skills on a Resume",
    "Resume for Product Managers: Strategy and Impact",
    "Writing a Resume for the Insurance Industry",
    "How to Include Study Abroad on Your Resume",
    "Resume for Environmental Scientists and Engineers",
    "How to Write a Resume for a Warehouse Position",
    "Resume Tips for the Media and Entertainment Industry",
    "How to Add Military Experience to a Civilian Resume",
    "Resume for Operations Managers: Efficiency and Results",
    "Writing a Resume for the Biotech Industry",
    "How to Include Continuing Education on Your Resume",
    "Resume for Quality Assurance Professionals",
    "How to Write a Resume for a Banking Career",
    "Resume Tips for the Transportation and Logistics Sector",
    "How to Include Conference Presentations on Your Resume",
    "Resume for Content Writers and Editors",
    "Writing a Resume for a Career in Agriculture",
    "How to Optimize Your Resume for Online Applications",
    "Resume Tips for the Energy and Utilities Sector",
    "How to Write a Resume for a Consulting Career",
    "Resume for Paralegals and Legal Assistants",
    "How to Include Patents and Inventions on Your Resume",
]

# ---- CV Writing topics (100) ----
CV_WRITING_TOPICS: list[str] = [
    # Original 12
    "CV vs Resume: Key Differences Explained",
    "How to Write an Academic CV: Complete Guide",
    "International CV Format: Country-by-Country Guide",
    "How to Write a Research CV for Postdocs",
    "Medical CV: How to Write a CV for Healthcare Professionals",
    "Europass CV: Template and Writing Guide",
    "How to Write a CV for Graduate School Applications",
    "CV Publications Section: How to List Your Research",
    "CV for Industry Positions: Transitioning from Academia",
    "How Long Should a CV Be? Length Guidelines",
    "CV Personal Statement: Examples and Writing Tips",
    "Skills-Based CV: When and How to Use It",
    # New 88
    "How to Write a CV for a PhD Application",
    "CV for Postdoctoral Fellowship Applications",
    "How to List Teaching Experience on an Academic CV",
    "CV for Medical Residency Applications: A Step-by-Step Guide",
    "Writing a CV for a Law Career in the UK",
    "How to Include Grants and Funding on Your CV",
    "CV for Scientists: Structuring Your Research Career",
    "South African CV Format: What Employers Expect",
    "How to Write a CV for a UN or NGO Position",
    "Australian CV Format: Tips for the Aussie Job Market",
    "CV for Artists and Performers: Showcasing Creative Work",
    "How to Write a CV for a European Employer",
    "Canadian CV Format: Key Differences from a Resume",
    "CV for Architects: Portfolio Integration Tips",
    "How to List Professional Development on Your CV",
    "British CV Writing Guide: UK Employer Expectations",
    "CV for Veterinary Professionals",
    "How to Write a CV for a University Lecturing Position",
    "New Zealand CV Format: Local Hiring Customs",
    "CV for Dentists: Clinical and Academic Sections",
    "How to List Research Interests on Your CV",
    "CV for Pharmacists: Regulatory and Clinical Skills",
    "Middle Eastern CV Formats: Cultural Considerations",
    "How to Write a CV for a Teaching Position Abroad",
    "CV for Engineers in the UK Market",
    "How to Include Peer Review Experience on Your CV",
    "CV for Psychologists: Clinical vs Research Focus",
    "Indian CV Format: What Hiring Managers Expect",
    "How to Write a CV for a Museum or Gallery Role",
    "CV for Nurses: Clinical Placements and Certifications",
    "Japanese CV Format: Rirekisho Writing Guide",
    "How to Include Editorial Board Memberships on a CV",
    "CV for Economists: Research and Policy Experience",
    "German CV Format: Lebenslauf Tips and Examples",
    "How to Write a CV for a Consultancy Role",
    "CV for Mathematicians: Publications and Conferences",
    "French CV Format: What French Employers Expect",
    "How to Write a CV for a Think Tank Position",
    "CV for Social Scientists: Mixed Methods Research",
    "Chinese CV Format: Job Applications in China",
    "How to Include Patents on Your CV",
    "CV for Librarians and Information Professionals",
    "How to Write a CV for an International Development Role",
    "CV for Theologians and Religious Studies Scholars",
    "How to Include Community Engagement on Your CV",
    "CV for Physicists: Lab Experience and Publications",
    "Scandinavian CV Format: Nordic Hiring Expectations",
    "How to Write a CV for a Policy Analyst Position",
    "CV for Biologists: Fieldwork and Lab Skills",
    "How to Include Invited Talks on Your CV",
    "CV for Journalists and Media Professionals",
    "Brazilian CV Format: Curriculo Vitae Tips",
    "How to Write a CV for a Diplomatic or Foreign Service Role",
    "CV for Chemists: Safety Training and Research",
    "How to Include Supervision Experience on Your CV",
    "CV for Linguists: Language Proficiency and Research",
    "How to Write a CV for a Sports Science Role",
    "CV for Geologists: Fieldwork and Technical Skills",
    "How to Include Impact Metrics on Your Academic CV",
    "CV for Computer Scientists: Bridging Industry and Academia",
    "Korean CV Format: Iryeokseo Writing Guide",
    "How to Write a CV for a Clinical Trial Position",
    "CV for Historians: Archival Research and Teaching",
    "How to Include Workshops Organized on Your CV",
    "CV for Music Professionals: Performance and Education",
    "How to Write a CV for a Data Science Research Role",
    "CV for Political Scientists: Policy and Governance Focus",
    "How to Include Collaborative Research on Your CV",
    "CV for Statisticians: Methodology and Applications",
    "How to Write a CV When Changing Academic Fields",
    "CV for Environmental Policy Professionals",
    "How to Include Public Engagement on Your CV",
    "CV for Anthropologists: Ethnographic Fieldwork",
    "How to Write a CV for a Fulbright Application",
    "CV for Philosophers: Teaching and Publication Record",
    "How to Include Dissertation Work on Your CV",
    "CV for Public Health Professionals: Epidemiology and Policy",
    "How to Update Your Academic CV After Tenure",
    "CV for Aerospace Engineers: Projects and Clearances",
    "How to Write a CV for a Visiting Scholar Position",
    "CV for Marine Biologists: Fieldwork and Conservation",
    "How to Write a CV for a Research Grant Application",
    "CV for Epidemiologists: Public Health and Data Analysis",
    "How to Write a CV for a Postgraduate Taught Programme",
    "CV for Art Historians: Curatorial and Research Experience",
    "How to Include Mentoring Experience on Your CV",
    "CV for Speech and Language Therapists",
    "How to Write a CV for a Position in Higher Education Administration",
]

# ---- Cover Letter topics (100) ----
COVER_LETTER_TOPICS: list[str] = [
    # Original 18
    "How to Write a Cover Letter: The Complete Guide",
    "Cover Letter Examples for Every Job Category",
    "Short Cover Letter Examples That Get Results",
    "Cover Letter Format: How to Structure Your Letter",
    "How to Address a Cover Letter (With Examples)",
    "Cover Letter Opening Lines That Hook the Reader",
    "How to End a Cover Letter: Strong Closing Examples",
    "Cover Letter for Internship: Template and Examples",
    "Cover Letter for Career Change: How to Explain Your Transition",
    "Email Cover Letter: Format and Examples",
    "Cover Letter With No Experience: What to Write",
    "Do You Still Need a Cover Letter in 2025?",
    "Cover Letter vs Letter of Interest: What's the Difference?",
    "How to Write a Thank You Letter After an Interview",
    "Cover Letter for Remote Jobs: Tips and Examples",
    "Referral Cover Letter: How to Mention a Contact",
    "Cover Letter Mistakes That Ruin Your Chances",
    "How to Write a Cover Letter for a Promotion",
    # New 82
    "How to Write a Cover Letter for a Teaching Position",
    "Cover Letter for a Government Job: Format and Tips",
    "How to Write a Cover Letter for a Scholarship Application",
    "Cover Letter for Engineering Roles: Technical and Clear",
    "How to Personalize a Cover Letter for Any Company",
    "Cover Letter for Healthcare Jobs: Compassion in Writing",
    "How to Write a Cover Letter for a Nonprofit Organization",
    "Cover Letter for Customer Service Positions",
    "How to Write a Persuasive Cover Letter Body Paragraph",
    "Cover Letter for Data Analyst and Data Science Roles",
    "How to Write a Cover Letter When You Are Overqualified",
    "Cover Letter for Administrative and Office Roles",
    "How to Reference a Job Posting in Your Cover Letter",
    "Cover Letter for Finance and Accounting Positions",
    "How to Write a Cover Letter for a Creative Agency",
    "Cover Letter for Retail and Sales Positions",
    "How to Highlight Achievements in a Cover Letter",
    "Cover Letter for IT and Software Development Roles",
    "How to Write a Cover Letter for a Startup",
    "Cover Letter for Legal and Law Firm Positions",
    "How to Explain Relocation in a Cover Letter",
    "Cover Letter for Human Resources Roles",
    "How to Write a Cover Letter for a Part-Time Job",
    "Cover Letter for Marketing and Communications Roles",
    "How to Write a Speculative Cover Letter",
    "Cover Letter for Project Management Positions",
    "How to Address Employment Gaps in a Cover Letter",
    "Cover Letter for Supply Chain and Operations Roles",
    "How to Write a Cover Letter for a Federal Job Application",
    "Cover Letter for Social Work and Counseling Positions",
    "How to Use Storytelling in Your Cover Letter",
    "Cover Letter for Construction and Trades Positions",
    "How to Write a Cover Letter for an Academic Position",
    "Cover Letter for Hospitality and Tourism Roles",
    "How to Follow Up After Sending a Cover Letter",
    "Cover Letter for Research and Laboratory Positions",
    "How to Write a Cover Letter in a Different Language",
    "Cover Letter for Journalism and Media Roles",
    "How to Tailor Your Cover Letter Using the Job Description",
    "Cover Letter for Real Estate Positions",
    "How to Write a Cover Letter for a Management Position",
    "Cover Letter for Graphic Design and UX Roles",
    "How to Write a Cover Letter With AI Assistance",
    "Cover Letter for Warehouse and Logistics Positions",
    "How to Write a Cover Letter After a Layoff",
    "Cover Letter for Pharmaceutical and Biotech Roles",
    "How to Mention Salary Expectations in a Cover Letter",
    "Cover Letter for Event Planning and Coordination Roles",
    "How to Write a Cover Letter for a Volunteer Position",
    "Cover Letter for Banking and Investment Roles",
    "How to Demonstrate Cultural Fit in a Cover Letter",
    "Cover Letter for Environmental and Sustainability Roles",
    "How to Write a Cover Letter When Switching Industries",
    "Cover Letter for Architecture and Urban Planning Roles",
    "How to Write a Cover Letter for a Consulting Position",
    "Cover Letter for Insurance and Risk Management Roles",
    "How to Address Multiple Decision Makers in a Cover Letter",
    "Cover Letter for Sports and Recreation Positions",
    "How to Write a Cover Letter for an Apprenticeship",
    "Cover Letter for Telecommunications Roles",
    "How to Show Enthusiasm Without Being Desperate in a Cover Letter",
    "Cover Letter for Transportation and Aviation Roles",
    "How to Write a Cover Letter for a Board Position",
    "Cover Letter for Cybersecurity and Information Security Roles",
    "How to Write a Follow-Up Cover Letter After No Response",
    "Cover Letter for Public Relations and Affairs Roles",
    "How to Write a Cover Letter for a Military Spouse",
    "Cover Letter for Automotive Industry Positions",
    "How to Write a Cover Letter That Passes ATS Screening",
    "Cover Letter for Food Service and Restaurant Management",
    "How to Write a Cover Letter for a Second Career",
    "Cover Letter for Nonprofit Fundraising and Development Roles",
    "How to Write a Cover Letter for an Executive Position",
    "Cover Letter for Manufacturing and Production Roles",
    "How to Write a Three-Paragraph Cover Letter",
    "Cover Letter for Education Administration Positions",
    "How to Write a Cover Letter for International Jobs",
    "Cover Letter for Freelance and Contract Positions",
    "How to Write a Cover Letter When You Have Been Referred",
    "Cover Letter for Energy and Utilities Sector Roles",
    "How to Write a Cover Letter for a Research Grant Application",
    "Cover Letter for Library and Information Science Positions",
]

# ---- Job Search topics (100) ----
JOB_SEARCH_TOPICS: list[str] = [
    # Original 18
    "Job Search Strategy: A Step-by-Step Guide for 2025",
    "Best Job Search Sites and How to Use Them",
    "How to Use LinkedIn to Find a Job",
    "Networking Tips: How to Build Professional Connections",
    "How to Follow Up After Submitting a Job Application",
    "How to Find Remote Jobs: Complete Guide",
    "Job Application Email: How to Apply by Email",
    "How to Research a Company Before Your Interview",
    "Signs of a Good Job Offer: What to Look For",
    "How to Negotiate Your Job Offer: Salary and Benefits",
    "Internal Job Posting: How to Apply Within Your Company",
    "Job Search While Employed: How to Be Discreet",
    "How to Handle Job Rejection and Keep Going",
    "Freelancing vs Full-Time: Which Is Right for You?",
    "How to Build a Professional Portfolio",
    "Job Fairs: How to Make a Great Impression",
    "Recruiters vs Hiring Managers: Understanding the Process",
    "How to Explain Being Fired in a Job Application",
    # New 82
    "How to Use Indeed Effectively for Your Job Search",
    "How to Optimize Your LinkedIn Profile for Recruiters",
    "Job Search Apps: The Best Mobile Tools for Job Seekers",
    "How to Write a Job Application Letter That Stands Out",
    "How to Find Jobs on Twitter and Social Media",
    "The Hidden Job Market: How to Access Unadvertised Positions",
    "How to Work With a Staffing Agency",
    "How to Use Glassdoor for Company Research and Job Search",
    "Networking Events: How to Prepare and Follow Up",
    "How to Get Hired Through Employee Referrals",
    "How to Search for Jobs on Google Effectively",
    "Job Search Strategies for Introverts",
    "How to Find International Job Opportunities",
    "How to Evaluate a Job Offer Beyond Salary",
    "Job Searching After 50: Tips for Older Workers",
    "How to Find Jobs in a Recession or Downturn",
    "Temporary vs Permanent Positions: Pros and Cons",
    "How to Use Alumni Networks to Find a Job",
    "Job Search Strategies for Recent Graduates",
    "How to Navigate the Gig Economy",
    "How to Negotiate Remote Work in Your Job Offer",
    "Job Search Strategies for Military Veterans",
    "How to Find Seasonal and Holiday Employment",
    "How to Write a Follow-Up Email After a Job Application",
    "Relocation for a Job: How to Decide and Negotiate",
    "How to Find Part-Time Professional Employment",
    "Job Search Tips for People With Disabilities",
    "How to Use Company Career Pages Effectively",
    "How to Find Government and Public Sector Jobs",
    "Job Search After Being Laid Off: First Steps",
    "How to Find Startup Jobs and Evaluate Early-Stage Companies",
    "How to Use Recruitment Fairs to Your Advantage",
    "Job Search Strategies for Working Parents",
    "How to Find Contract and Freelance Work Online",
    "How to Track Your Job Applications Efficiently",
    "Job Search During a Career Transition",
    "How to Use Professional Associations for Job Leads",
    "How to Negotiate a Signing Bonus",
    "Job Search Tips for Non-Native English Speakers",
    "How to Find Apprenticeship Opportunities",
    "How to Evaluate Company Culture Before Accepting an Offer",
    "How to Find Jobs That Offer Visa Sponsorship",
    "Job Search Red Flags: Warning Signs in Job Postings",
    "How to Create a Job Search Schedule That Works",
    "How to Find and Apply for Fellowships",
    "Job Search After a Career Break: Getting Back on Track",
    "How to Use Informational Interviews to Find Opportunities",
    "How to Find Remote Jobs That Are Not Scams",
    "Job Search Tips for Creatives and Artists",
    "How to Negotiate Flexible Working Arrangements",
    "How to Find Volunteer-to-Hire Opportunities",
    "Job Search Strategies for the Healthcare Industry",
    "How to Find Jobs in Emerging Industries",
    "How to Respond to a Recruiter on LinkedIn",
    "Job Search Tips for PhD Holders Outside Academia",
    "How to Use Headhunters and Executive Recruiters",
    "How to Find and Evaluate Work-From-Home Jobs",
    "Job Search Strategies for the Tech Industry",
    "How to Navigate Multiple Job Offers Simultaneously",
    "How to Find Jobs Abroad Without Relocating First",
    "Job Search Tips for Those Without a College Degree",
    "How to Write a Job Inquiry Email to a Company",
    "How to Find and Apply for Micro-Internships",
    "Job Search Strategies for the Finance Industry",
    "How to Use Job Search Engines Beyond LinkedIn and Indeed",
    "How to Build a Personal Website for Your Job Search",
    "Job Search Etiquette: Do's and Don'ts",
    "How to Find Contract-to-Hire Opportunities",
    "Job Search Strategies for the Education Sector",
    "How to Ask for an Extension on a Job Offer Deadline",
    "How to Deal With Ghosting During the Job Search",
    "Job Search Strategies for the Nonprofit Sector",
    "How to Find an Entry-Level Job in a Competitive Field",
    "How to Counter a Lowball Job Offer Professionally",
    "Job Search Tips for Immigrants and New Residents",
    "How to Use Video Introductions in Your Job Applications",
    "Job Search for Couples: Finding Two Jobs in One Location",
    "How to Stay Motivated During a Long Job Search",
    "How to Find Mentorship Opportunities Through Job Searching",
    "Job Search Strategies for Rural Areas and Small Towns",
    "How to Use AI Tools to Streamline Your Job Search",
    "How to Find and Apply for Rotational Programs",
]

# ---- Interview Tips topics (100) ----
INTERVIEW_TIPS_TOPICS: list[str] = [
    # Original 15
    "Top 50 Interview Questions and How to Answer Them",
    "Behavioral Interview Questions: The STAR Method Explained",
    "How to Prepare for a Phone Interview",
    "Video Interview Tips: How to Ace Your Virtual Meeting",
    "What to Wear to an Interview: Dress Code Guide",
    "How to Answer 'Tell Me About Yourself'",
    "How to Answer 'What Is Your Greatest Weakness?'",
    "How to Answer 'Why Should We Hire You?'",
    "Questions to Ask at the End of an Interview",
    "Panel Interview: How to Handle Multiple Interviewers",
    "Technical Interview Prep: Coding and System Design",
    "Case Interview: Strategy Consulting Preparation Guide",
    "Group Interview: How to Stand Out from Other Candidates",
    "Second Interview: What to Expect and How to Prepare",
    "How to Handle Salary Questions During the Interview",
    # New 85
    "How to Answer 'Where Do You See Yourself in Five Years?'",
    "How to Answer 'Why Do You Want to Work Here?'",
    "How to Answer 'What Are Your Salary Expectations?'",
    "How to Answer 'Why Did You Leave Your Last Job?'",
    "How to Answer 'Describe a Challenge You Overcame'",
    "How to Answer 'What Is Your Greatest Strength?'",
    "How to Answer 'Why Are You Interested in This Role?'",
    "How to Answer 'Tell Me About a Time You Failed'",
    "How to Answer 'What Motivates You?'",
    "How to Answer 'How Do You Handle Stress?'",
    "Situational Interview Questions and How to Answer Them",
    "How to Prepare for a One-Way Video Interview",
    "Competency-Based Interview Questions: A Complete Guide",
    "How to Prepare for a Working Interview or Trial Day",
    "How to Handle Illegal Interview Questions Professionally",
    "Interview Body Language: Nonverbal Tips for Success",
    "How to Build Rapport With Your Interviewer",
    "How to Prepare for a Lunch or Dinner Interview",
    "How to Prepare for an Interview in a Different Language",
    "How to Interview for a Job Above Your Experience Level",
    "Interview Anxiety: Techniques to Calm Your Nerves",
    "How to Prepare for a Government Job Interview",
    "How to Prepare for a Teaching Position Interview",
    "How to Prepare for a Healthcare Job Interview",
    "How to Prepare for a Finance Interview",
    "How to Prepare for a Marketing Interview",
    "How to Prepare for an Engineering Interview",
    "How to Prepare for a Retail Job Interview",
    "How to Prepare for a Customer Service Interview",
    "How to Prepare for a Nonprofit Job Interview",
    "How to Prepare for a Sales Job Interview",
    "How to Prepare for a Remote Job Interview",
    "How to Prepare for a Startup Interview",
    "How to Prepare for an Executive-Level Interview",
    "How to Prepare for a Hospitality Industry Interview",
    "How to Prepare for a Construction Job Interview",
    "How to Prepare for a Legal Job Interview",
    "How to Prepare for a Social Work Interview",
    "How to Prepare for a Supply Chain Interview",
    "Interview Follow-Up Email: Template and Best Practices",
    "How to Send a Thank-You Note After a Virtual Interview",
    "How to Handle a Stress Interview Designed to Test You",
    "How to Discuss Career Gaps in an Interview",
    "How to Explain Being Fired in a Job Interview",
    "How to Explain a Short Tenure at a Previous Job",
    "How to Explain Why You Want to Change Careers in an Interview",
    "How to Present a Portfolio During an Interview",
    "How to Handle the 'Any Questions?' Moment in an Interview",
    "How to Negotiate Benefits During the Interview Process",
    "How to Handle Rejection After a Final-Round Interview",
    "How to Prepare for a Job Interview in 24 Hours",
    "How to Research Your Interviewer Before a Meeting",
    "How to Use the CAR Method for Interview Answers",
    "How to Use the PAR Method for Behavioral Interview Questions",
    "How to Answer Questions About Teamwork in an Interview",
    "How to Answer Questions About Leadership in an Interview",
    "How to Answer Questions About Conflict Resolution",
    "How to Answer Questions About Time Management",
    "How to Answer Questions About Multitasking and Prioritization",
    "How to Prepare for a Skills Assessment During an Interview",
    "How to Handle a Take-Home Assignment for a Job Interview",
    "How to Interview at Companies With Unusual Hiring Processes",
    "How to Demonstrate Problem-Solving Skills in an Interview",
    "How to Talk About Your Weaknesses Without Selling Yourself Short",
    "How to Answer 'What Sets You Apart From Other Candidates?'",
    "How to Answer 'What Do You Know About Our Company?'",
    "How to Answer 'How Would Your Colleagues Describe You?'",
    "How to Answer Curveball and Unexpected Interview Questions",
    "How to Recover From a Bad Interview Answer",
    "How to Prepare for a Job Interview After a Long Absence",
    "How to Handle Multiple Interviews for the Same Company",
    "Interview Etiquette: The Unwritten Rules of Job Interviews",
    "How to Prepare for a Zoom Interview: Camera and Audio Tips",
    "How to Handle Trick Questions in a Job Interview",
    "How to Interview When You Are an Introvert",
    "How to Prepare for an Interview With a Hiring Committee",
    "How to Prepare for Back-to-Back Interviews in One Day",
    "How to Discuss Salary History in an Interview",
    "How to Handle an Interview With No Job Description",
    "How to Ace a Phone Screen With a Recruiter",
    "How to Prepare for an Interview at a Competitor Company",
    "How to Answer 'Describe Your Ideal Work Environment'",
    "How to Answer 'What Are Your Long-Term Career Goals?'",
    "How to Handle an Interview When You Are Not the Top Candidate",
    "How to Prepare for a Presentation Interview",
]

# ---- Career Advice topics (100) ----
CAREER_ADVICE_TOPICS: list[str] = [
    # Original 17
    "Top 10 In-Demand Skills Employers Want in 2025",
    "How to Change Careers at 30, 40, and 50",
    "How to Set Career Goals and Actually Achieve Them",
    "Professional Development: How to Keep Growing in Your Career",
    "Work-Life Balance: Strategies That Actually Work",
    "How to Ask for a Raise: Scripts and Strategies",
    "How to Deal With a Difficult Boss",
    "Mentorship: How to Find and Be a Great Mentor",
    "Personal Branding: How to Stand Out Professionally",
    "Side Hustle Ideas for Professionals in 2025",
    "How to Navigate Office Politics Without Losing Yourself",
    "Soft Skills vs Hard Skills: Why You Need Both",
    "How to Build Leadership Skills at Any Level",
    "Remote Work Tips: How to Stay Productive at Home",
    "Career Burnout: Signs, Causes, and Recovery",
    "How to Write a Professional Bio",
    "Continuing Education: Is a Master's Degree Worth It?",
    # New 83
    "How to Negotiate a Promotion at Your Current Company",
    "How to Transition From Individual Contributor to Manager",
    "How to Build a Professional Network From Scratch",
    "Time Management Strategies for Busy Professionals",
    "How to Develop Emotional Intelligence at Work",
    "How to Build a Personal Advisory Board for Your Career",
    "How to Choose the Right Career Path After College",
    "How to Become Indispensable at Work",
    "How to Handle Workplace Conflict Professionally",
    "Career Planning for Your 20s: Building a Strong Foundation",
    "Career Planning for Your 30s: Growth and Advancement",
    "Career Planning for Your 40s: Pivots and Reinvention",
    "Career Planning for Your 50s and Beyond",
    "How to Recover From Being Passed Over for a Promotion",
    "How to Develop a Growth Mindset for Career Success",
    "How to Build Confidence in the Workplace",
    "How to Improve Your Public Speaking Skills for Work",
    "How to Manage Up: Working Effectively With Your Boss",
    "How to Create a Five-Year Career Plan",
    "How to Deal With Imposter Syndrome at Work",
    "How to Develop Critical Thinking Skills for Your Career",
    "How to Balance Multiple Career Interests",
    "How to Succeed in a New Job During the First 90 Days",
    "How to Stay Relevant in a Rapidly Changing Job Market",
    "How to Ask for and Implement Feedback at Work",
    "How to Build Cross-Functional Skills in Your Organization",
    "How to Develop Your Executive Presence",
    "How to Create and Deliver an Elevator Pitch",
    "How to Find Meaning and Purpose in Your Work",
    "How to Handle Being Micromanaged at Work",
    "How to Set Boundaries at Work Without Damaging Relationships",
    "How to Transition to a Leadership Role for the First Time",
    "How to Develop Negotiation Skills for Your Career",
    "How to Stay Motivated When You Feel Stuck in Your Career",
    "How to Use Data and Analytics to Advance Your Career",
    "How to Thrive as an Introvert in the Workplace",
    "How to Handle a Toxic Work Environment",
    "How to Build Strategic Thinking Skills",
    "How to Make the Most of Performance Reviews",
    "How to Develop Adaptability Skills for the Modern Workplace",
    "How to Use Certifications to Boost Your Career",
    "How to Build a Career in the Age of AI and Automation",
    "How to Handle Workplace Bullying",
    "How to Develop Your Professional Writing Skills",
    "How to Transition from a Corporate Job to Entrepreneurship",
    "How to Find a Career Coach and Get the Most From Coaching",
    "How to Build Resilience and Grit in Your Career",
    "How to Manage Stress During Major Career Transitions",
    "How to Create a Skills Development Plan",
    "How to Network Effectively at Conferences and Events",
    "How to Develop Creativity and Innovation at Work",
    "How to Lead Remote and Hybrid Teams Effectively",
    "How to Navigate a Restructuring or Merger at Work",
    "How to Upskill Quickly With Online Learning Platforms",
    "How to Become a Thought Leader in Your Industry",
    "How to Handle Being Demoted at Work",
    "How to Write a Career Development Proposal for Your Employer",
    "How to Transition from Military to Civilian Career",
    "How to Leverage Transferable Skills Across Industries",
    "How to Manage Your Career When Working Multiple Jobs",
    "How to Build and Maintain Professional Relationships Online",
    "How to Manage Career Expectations vs Reality",
    "How to Develop Project Management Skills Without a Degree",
    "How to Get the Most From Workplace Training Programs",
    "How to Know When It Is Time to Leave Your Job",
    "How to Build a Successful Career as a Generalist",
    "How to Build a Successful Career as a Specialist",
    "How to Prepare for the Future of Work in 2030",
    "How to Handle Ethical Dilemmas at Work",
    "How to Build Your Reputation After a Career Setback",
    "How to Transition to a Career in Sustainability",
    "How to Negotiate a Sabbatical From Your Employer",
    "How to Create Work-Life Integration Instead of Balance",
    "How to Use Volunteering to Advance Your Career",
    "How to Develop a Personal Learning Plan for Career Growth",
    "How to Build a Career in Product Management",
    "How to Transition From Nonprofit to Corporate Work",
    "How to Navigate Career Decisions With a Partner or Family",
    "How to Develop Analytical Skills for Career Advancement",
    "How to Handle Workplace Gossip Professionally",
    "How to Manage Your Online Reputation for Career Success",
    "How to Build a Career in the Public Sector",
    "How to Overcome the Fear of Career Change",
]


def _build_articles_data() -> list[dict]:
    """Build the full articles list from compact topic lists."""
    all_topics: list[tuple[str, list[str]]] = [
        ("Resume Writing", RESUME_WRITING_TOPICS),
        ("CV Writing", CV_WRITING_TOPICS),
        ("Cover Letter", COVER_LETTER_TOPICS),
        ("Job Search", JOB_SEARCH_TOPICS),
        ("Interview Tips", INTERVIEW_TIPS_TOPICS),
        ("Career Advice", CAREER_ADVICE_TOPICS),
    ]

    rng = random.Random(42)
    articles: list[dict] = []

    for category, topics in all_topics:
        for title in topics:
            articles.append({
                "title": title,
                "cat": category,
                "tags": _pick_tags(title, category),
                "reading_time": rng.randint(5, 15),
                "featured": rng.random() < 0.10,
            })

    return articles


ARTICLES_DATA: list[dict] = _build_articles_data()


# ---------------------------------------------------------------------------
# Content generator helpers
# ---------------------------------------------------------------------------

def _generate_article_content(title: str, category_name: str) -> str:
    """Generate placeholder article content (3-5 paragraphs)."""
    paragraphs = [
        (
            f"Understanding how to approach {category_name.lower()} is essential for any "
            f"job seeker in today's competitive market. This comprehensive guide on "
            f'"{title}" covers the key strategies and best practices that hiring managers '
            f"and recruiters look for when evaluating candidates."
        ),
        (
            "The job market continues to evolve rapidly, with new tools and technologies "
            "changing how employers find and evaluate talent. Whether you are just starting "
            "your career or are a seasoned professional looking for your next opportunity, "
            "staying informed about current trends is crucial for success."
        ),
        (
            "One of the most important aspects of any job search is presenting yourself "
            "effectively on paper. Your resume, cover letter, and online presence work "
            "together to create a compelling narrative about your professional journey. "
            "Each element should be carefully crafted to highlight your unique value "
            "proposition to potential employers."
        ),
        (
            "Research shows that hiring managers spend an average of 7.4 seconds on an "
            "initial resume review. This means every word counts. By following the "
            "strategies outlined in this guide, you can ensure that your application "
            "materials make a strong first impression and earn you a spot on the "
            "interview shortlist."
        ),
        (
            "Remember that job searching is a skill in itself, and like any skill, it "
            "improves with practice and knowledge. Take the time to implement the advice "
            "in this article, customize your approach for each opportunity, and stay "
            "persistent. The right opportunity is out there, and with the right preparation, "
            "you will be ready to seize it."
        ),
    ]
    count = random.randint(3, 5)
    return "\n\n".join(paragraphs[:count])


def _generate_faq(title: str, category_name: str) -> list[dict[str, str]]:
    """Generate 3-5 FAQ pairs relevant to the article topic."""
    faq_pool = [
        {"question": f"What is the most important tip for {category_name.lower()}?",
         "answer": "The most important tip is to tailor your approach for each specific opportunity. Generic applications rarely make it past the initial screening."},
        {"question": "How long should my resume be?",
         "answer": "For most professionals, a one-page resume is ideal. Senior professionals with 10+ years of experience may use two pages, and academic CVs can be longer."},
        {"question": "Do I need a cover letter?",
         "answer": "Yes, unless the job posting explicitly says not to include one. A well-written cover letter can set you apart from other candidates with similar qualifications."},
        {"question": "How do I handle employment gaps?",
         "answer": "Be honest and brief. Focus on what you learned or accomplished during the gap, such as freelancing, volunteering, coursework, or personal development."},
        {"question": "What format should I use for my resume?",
         "answer": "A reverse-chronological format is preferred by most employers and ATS systems. Use a clean, professional layout with consistent formatting."},
        {"question": "How do I make my application ATS-friendly?",
         "answer": "Use standard section headings, include relevant keywords from the job posting, avoid tables and graphics, and save your file as a PDF or .docx."},
        {"question": "When should I follow up after applying?",
         "answer": "Wait 1-2 weeks after submitting your application before following up. Send a brief, polite email reiterating your interest in the position."},
    ]
    count = random.randint(3, 5)
    return random.sample(faq_pool, k=min(count, len(faq_pool)))


def _generate_excerpt(title: str) -> str:
    """Generate a short excerpt for the article."""
    return (
        f"Learn everything you need to know about {title.lower()}. "
        f"Expert tips, real-world examples, and actionable strategies to help you succeed."
    )[:500]


# ---------------------------------------------------------------------------
# Main runner
# ---------------------------------------------------------------------------

def run() -> dict[str, int]:
    """
    Seed authors, article categories, tags, and articles.
    Returns dict of counts created.
    """
    random.seed(42)
    counts: dict[str, int] = {
        "authors": 0,
        "article_categories": 0,
        "tags": 0,
        "articles": 0,
    }

    # ---- Authors ----
    for author_data in AUTHORS_DATA:
        slug = slugify(author_data["name"])
        _, created = Author.objects.get_or_create(
            slug=slug,
            defaults={
                "name": author_data["name"],
                "bio": author_data["bio"],
                "title": author_data["title"],
                "is_cprw_certified": author_data["cprw"],
                "linkedin_url": f"https://linkedin.com/in/{slug}",
            },
        )
        if created:
            counts["authors"] += 1

    # ---- Article categories ----
    cat_map: dict[str, ArticleCategory] = {}
    for cat_data in ARTICLE_CATEGORIES:
        obj, created = ArticleCategory.objects.get_or_create(
            slug=cat_data["slug"],
            defaults={
                "name": cat_data["name"],
                "icon": cat_data["icon"],
                "order": cat_data["order"],
                "description": cat_data["description"],
                "is_active": True,
            },
        )
        cat_map[str(cat_data["name"])] = obj
        if created:
            counts["article_categories"] += 1

    # ---- Tags ----
    tag_map: dict[str, Tag] = {}
    for tag_name in TAG_NAMES:
        tag_slug = slugify(tag_name)
        obj, created = Tag.objects.get_or_create(
            slug=tag_slug,
            defaults={"name": tag_name},
        )
        tag_map[tag_name] = obj
        if created:
            counts["tags"] += 1

    # ---- Articles ----
    authors = list(Author.objects.all())
    now = timezone.now()

    for idx, article_data in enumerate(ARTICLES_DATA):
        article_slug = slugify(article_data["title"])
        # Truncate slug to fit within 255 char SlugField
        article_slug = article_slug[:255]

        category = cat_map.get(article_data["cat"])
        if not category:
            print(f"[seed_articles] WARNING: Category '{article_data['cat']}' not found, skipping.")
            continue

        author = authors[idx % len(authors)] if authors else None
        if not author:
            print("[seed_articles] ERROR: No authors found.")
            break

        publish_date = now - timedelta(days=random.randint(1, 365))

        obj, created = Article.objects.get_or_create(
            slug=article_slug,
            defaults={
                "title": article_data["title"],
                "category": category,
                "author": author,
                "content": _generate_article_content(article_data["title"], article_data["cat"]),
                "excerpt": _generate_excerpt(article_data["title"]),
                "status": Article.Status.PUBLISHED,
                "publish_at": publish_date,
                "meta_title": article_data["title"][:70],
                "meta_description": _generate_excerpt(article_data["title"])[:160],
                "faq": _generate_faq(article_data["title"], article_data["cat"]),
                "reading_time": article_data.get("reading_time", 5),
                "is_featured": article_data.get("featured", False),
                "views_count": random.randint(100, 15000),
            },
        )

        if created:
            counts["articles"] += 1
            # Add tags
            tag_names = article_data.get("tags", [])
            for tn in tag_names:
                tag_obj = tag_map.get(tn)
                if tag_obj:
                    obj.tags.add(tag_obj)

    # Update author article counts
    for author in authors:
        author.articles_count = author.articles.count()
        author.save(update_fields=["articles_count"])

    print(f"[seed_articles] Created {counts['authors']} authors "
          f"({Author.objects.count()} total).")
    print(f"[seed_articles] Created {counts['article_categories']} article categories "
          f"({ArticleCategory.objects.count()} total).")
    print(f"[seed_articles] Created {counts['tags']} tags "
          f"({Tag.objects.count()} total).")
    print(f"[seed_articles] Created {counts['articles']} articles "
          f"({Article.objects.count()} total).")
    return counts


if __name__ == "__main__":
    run()
