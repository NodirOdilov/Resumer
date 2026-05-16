from __future__ import annotations

from typing import Any

# ---------------------------------------------------------------------------
# Pre-written content suggestions keyed by section_type → job_title.
#
# Each job title entry contains:
#   "experience" — list of bullet-point strings suitable for an experience
#                  section.
#   "summary"    — list of professional-summary paragraph examples.
# ---------------------------------------------------------------------------

SUGGESTIONS_DB: dict[str, dict[str, dict[str, list[str]]]] = {
    "experience": {
        "software_engineer": {
            "bullets": [
                "Designed and implemented scalable RESTful APIs serving 50K+ daily active users with 99.9% uptime.",
                "Led migration of monolithic application to microservices architecture, reducing deployment time by 70%.",
                "Optimized database queries and implemented caching strategies, improving API response times by 45%.",
                "Mentored 4 junior developers through code reviews, pair programming sessions, and technical workshops.",
                "Implemented CI/CD pipelines using GitHub Actions, reducing release cycles from bi-weekly to daily.",
                "Developed comprehensive unit and integration test suites achieving 92% code coverage.",
                "Collaborated with product and design teams to translate business requirements into technical specifications.",
                "Reduced cloud infrastructure costs by 35% through container optimization and auto-scaling policies.",
            ],
        },
        "accountant": {
            "bullets": [
                "Managed full-cycle accounting for a portfolio of 30+ clients with combined annual revenues exceeding $50M.",
                "Prepared and filed federal and state tax returns, identifying $200K+ in cumulative tax savings for clients.",
                "Performed monthly, quarterly, and annual financial close processes with 100% on-time completion.",
                "Implemented automated reconciliation workflows in QuickBooks, reducing month-end close time by 40%.",
                "Conducted internal audits and ensured compliance with GAAP, SOX, and local regulatory requirements.",
                "Developed detailed financial forecasts and variance analyses to support executive decision-making.",
                "Streamlined accounts payable and receivable processes, reducing outstanding receivables by 25%.",
            ],
        },
        "nurse": {
            "bullets": [
                "Provided compassionate, evidence-based nursing care to 15-20 patients per shift in a high-acuity medical-surgical unit.",
                "Administered medications, monitored vital signs, and managed IV therapy with zero medication errors over 3 years.",
                "Collaborated with interdisciplinary teams including physicians, pharmacists, and social workers to develop individualized care plans.",
                "Trained and precepted 10+ new graduate nurses, reducing their orientation period by 2 weeks on average.",
                "Implemented fall-prevention protocols that decreased unit fall rates by 30% within 6 months.",
                "Documented patient assessments, interventions, and outcomes accurately in Epic EHR system.",
                "Responded to rapid response and code blue events, delivering critical interventions under pressure.",
                "Achieved 98% patient satisfaction scores through empathetic communication and proactive care.",
            ],
        },
        "teacher": {
            "bullets": [
                "Developed and delivered engaging lesson plans aligned with Common Core standards for classes of 25-30 students.",
                "Improved average student test scores by 18% through differentiated instruction and targeted intervention strategies.",
                "Integrated technology tools including Google Classroom, Kahoot, and interactive whiteboards to enhance learning outcomes.",
                "Established positive classroom management systems resulting in a 40% reduction in behavioral referrals.",
                "Communicated regularly with parents and guardians through conferences, newsletters, and digital platforms.",
                "Led after-school tutoring programs serving 50+ at-risk students, contributing to a 15% increase in graduation rates.",
                "Mentored student teachers and collaborated with colleagues on curriculum development committees.",
            ],
        },
        "manager": {
            "bullets": [
                "Directed a cross-functional team of 15 professionals, achieving 120% of annual revenue targets ($8M).",
                "Developed and executed strategic plans that increased departmental efficiency by 35% year-over-year.",
                "Managed an annual operating budget of $2.5M, consistently delivering projects under budget.",
                "Implemented performance management frameworks including OKRs, resulting in 25% improvement in team productivity.",
                "Recruited, onboarded, and retained top talent, reducing employee turnover from 22% to 9%.",
                "Facilitated stakeholder meetings and presented quarterly business reviews to C-suite executives.",
                "Launched process improvement initiatives using Lean and Six Sigma methodologies, saving $500K annually.",
                "Negotiated vendor contracts and partnerships, securing 15% cost reductions across key service agreements.",
            ],
        },
        "marketing_specialist": {
            "bullets": [
                "Planned and executed multi-channel marketing campaigns across social media, email, and PPC, generating 40% increase in qualified leads.",
                "Managed a monthly advertising budget of $50K across Google Ads and Meta, achieving a 3.5x ROAS.",
                "Created compelling content strategies that grew organic social media following by 150% in 12 months.",
                "Conducted A/B testing on landing pages and email campaigns, improving conversion rates by 28%.",
                "Analyzed campaign performance using Google Analytics, HubSpot, and Tableau to optimize marketing spend.",
                "Coordinated with design and product teams to launch 4 successful product campaigns per quarter.",
                "Built and nurtured an email subscriber list of 50K+ contacts with a consistent 25% open rate.",
            ],
        },
        "data_analyst": {
            "bullets": [
                "Analyzed large datasets (10M+ rows) using Python, SQL, and Tableau to uncover actionable business insights.",
                "Built automated reporting dashboards that reduced manual reporting effort by 60% across 5 departments.",
                "Developed predictive models that improved customer churn forecasting accuracy by 22%.",
                "Collaborated with product and engineering teams to define KPIs and implement data tracking pipelines.",
                "Conducted statistical analyses including regression, hypothesis testing, and cohort analysis to support strategic decisions.",
                "Cleaned, transformed, and validated data from multiple sources to ensure data quality and integrity.",
                "Presented data-driven recommendations to senior leadership, directly influencing $1M+ in budget allocation decisions.",
            ],
        },
        "graphic_designer": {
            "bullets": [
                "Designed visual assets for print and digital media including branding, packaging, and social media campaigns.",
                "Created brand identity systems for 20+ clients, including logos, style guides, and marketing collateral.",
                "Produced high-quality designs under tight deadlines, managing 10-15 concurrent projects at a time.",
                "Collaborated with copywriters, developers, and account managers to deliver cohesive creative solutions.",
                "Increased client social media engagement by 45% through visually compelling content strategies.",
                "Proficient in Adobe Creative Suite (Photoshop, Illustrator, InDesign), Figma, and Sketch.",
            ],
        },
        "sales_representative": {
            "bullets": [
                "Consistently exceeded quarterly sales quotas by 15-25%, generating $1.2M+ in annual revenue.",
                "Prospected and closed 50+ new enterprise accounts through cold outreach, networking, and referrals.",
                "Managed a pipeline of 100+ opportunities in Salesforce, maintaining accurate forecasting within 5% variance.",
                "Delivered compelling product demonstrations and presentations to C-level executives and buying committees.",
                "Negotiated complex contracts and pricing agreements, maintaining an average deal margin of 38%.",
                "Built and maintained long-term client relationships, achieving a 90% customer retention rate.",
                "Trained and onboarded 8 new sales team members, accelerating their ramp-up time by 30%.",
            ],
        },
        "project_manager": {
            "bullets": [
                "Managed end-to-end delivery of 15+ projects valued at $500K-$5M using Agile and Waterfall methodologies.",
                "Coordinated cross-functional teams of 10-25 members across engineering, design, QA, and operations.",
                "Delivered 95% of projects on time and within budget, with an average client satisfaction score of 4.8/5.",
                "Created detailed project plans, risk registers, and status reports for stakeholder communication.",
                "Implemented Jira-based workflow management systems that improved sprint velocity by 20%.",
                "Facilitated daily stand-ups, sprint planning, retrospectives, and stakeholder review meetings.",
                "Identified and mitigated project risks proactively, preventing $200K+ in potential cost overruns.",
                "Earned PMP certification and applied PMI best practices across all project engagements.",
            ],
        },
        "customer_service_representative": {
            "bullets": [
                "Handled 80+ customer inquiries daily via phone, email, and live chat with a 97% satisfaction rating.",
                "Resolved complex customer complaints and escalations, reducing average resolution time by 35%.",
                "Processed orders, returns, and refunds accurately using CRM systems including Zendesk and Salesforce.",
                "Upsold and cross-sold products and services, contributing an additional $150K in annual revenue.",
                "Created and maintained knowledge base articles that reduced repeat inquiry volume by 20%.",
                "Trained 12 new customer service agents on company procedures, tools, and communication best practices.",
            ],
        },
        "human_resources_specialist": {
            "bullets": [
                "Managed full-cycle recruitment for 50+ positions annually across technical, operational, and executive roles.",
                "Developed and implemented employee onboarding programs that improved 90-day retention rates by 25%.",
                "Administered benefits enrollment, payroll processing, and HRIS data management for 500+ employees.",
                "Conducted workplace investigations and ensured compliance with federal, state, and local employment laws.",
                "Designed and facilitated training programs on diversity, equity, inclusion, and workplace safety.",
                "Partnered with department heads to create performance improvement plans and succession planning strategies.",
            ],
        },
        "web_developer": {
            "bullets": [
                "Built and maintained 30+ responsive websites using HTML5, CSS3, JavaScript, and React, serving 200K+ monthly visitors.",
                "Improved page load times by 55% through code splitting, lazy loading, and CDN optimization techniques.",
                "Integrated third-party APIs including Stripe, Twilio, and Google Maps to extend application functionality.",
                "Implemented SEO best practices and accessibility standards (WCAG 2.1), increasing organic traffic by 40%.",
                "Collaborated with UX designers to translate wireframes and mockups into pixel-perfect, cross-browser-compatible interfaces.",
                "Developed and maintained WordPress themes and plugins for 15+ client websites with custom functionality.",
                "Set up automated testing with Jest and Cypress, achieving 85% code coverage and reducing production bugs by 50%.",
                "Managed version control workflows using Git and GitHub, conducting code reviews for a team of 6 developers.",
            ],
        },
        "data_scientist": {
            "bullets": [
                "Developed machine learning models that improved customer lifetime value predictions by 35%, driving $2M in incremental revenue.",
                "Built and deployed NLP pipelines for sentiment analysis processing 100K+ customer reviews with 91% accuracy.",
                "Designed and ran A/B experiments across 5 product features, providing statistically rigorous recommendations to leadership.",
                "Created end-to-end data pipelines using Python, Spark, and Airflow to process 50GB+ of daily data.",
                "Published 3 internal research papers on predictive modeling techniques adopted across the data science organization.",
                "Collaborated with engineering teams to deploy ML models into production using Docker and AWS SageMaker.",
                "Mentored 5 junior data scientists and led weekly knowledge-sharing sessions on advanced statistical methods.",
                "Reduced customer churn by 18% through a gradient-boosted classification model integrated into the CRM system.",
            ],
        },
        "product_manager": {
            "bullets": [
                "Owned product roadmap for a B2B SaaS platform generating $15M ARR, prioritizing features based on customer feedback and data analysis.",
                "Launched 8 major product features that increased user engagement by 40% and reduced churn by 12%.",
                "Conducted 100+ user interviews and surveys to validate product hypotheses and inform feature prioritization.",
                "Collaborated with engineering, design, and marketing teams to deliver quarterly releases on schedule.",
                "Defined and tracked KPIs including DAU, retention, NPS, and conversion rates using Amplitude and Mixpanel.",
                "Created detailed PRDs, user stories, and acceptance criteria for cross-functional development teams.",
                "Managed a product backlog of 200+ items in Jira, ensuring alignment with company OKRs and strategic goals.",
                "Drove 25% increase in trial-to-paid conversion through data-driven onboarding flow optimization.",
            ],
        },
        "ux_designer": {
            "bullets": [
                "Designed user experiences for web and mobile applications serving 500K+ users across 3 product lines.",
                "Conducted 80+ usability testing sessions and synthesized findings into actionable design improvements.",
                "Created wireframes, prototypes, and high-fidelity mockups using Figma, Sketch, and Adobe XD.",
                "Developed and maintained a design system with 100+ reusable components, reducing design-to-development time by 30%.",
                "Led design sprints and workshops with cross-functional stakeholders to align on product vision and priorities.",
                "Improved task completion rates by 45% through iterative redesign of key user flows based on analytics data.",
                "Collaborated with product managers and engineers to ensure design feasibility and maintain design integrity in production.",
            ],
        },
        "financial_analyst": {
            "bullets": [
                "Built and maintained complex financial models for revenue forecasting, scenario analysis, and capital budgeting.",
                "Analyzed quarterly financial performance and presented variance reports to CFO and board of directors.",
                "Supported M&A due diligence for 3 acquisitions totaling $150M, conducting valuation and synergy analyses.",
                "Automated monthly reporting workflows using Excel VBA and Python, saving 20+ hours per reporting cycle.",
                "Developed dashboards in Power BI to track 30+ financial KPIs across business units in real time.",
                "Prepared investment memos and recommendations that informed $50M+ in capital allocation decisions.",
                "Conducted competitive benchmarking and industry research to support strategic planning initiatives.",
            ],
        },
        "registered_nurse": {
            "bullets": [
                "Delivered comprehensive nursing care to 20+ patients daily in a Level I trauma center emergency department.",
                "Managed triage assessments with 99% accuracy, prioritizing patients based on acuity using ESI protocols.",
                "Administered chemotherapy and biotherapy agents to oncology patients following strict safety and dosing protocols.",
                "Led a unit-based quality improvement project that reduced catheter-associated urinary tract infections by 45%.",
                "Coordinated discharge planning with case managers, social workers, and home health agencies for complex patients.",
                "Served as charge nurse for a 36-bed unit, managing staffing assignments and patient flow during high-census periods.",
                "Maintained ANCC certification in Medical-Surgical Nursing and completed 40+ CEU hours annually.",
                "Participated in Magnet designation efforts, contributing to evidence-based practice and nursing research initiatives.",
            ],
        },
        "pharmacist": {
            "bullets": [
                "Dispensed and verified 300+ prescriptions daily while ensuring accuracy and compliance with state and federal regulations.",
                "Provided medication therapy management consultations to 50+ patients weekly, improving adherence rates by 25%.",
                "Identified and resolved 15+ drug interactions and contraindications per week through clinical review processes.",
                "Supervised and trained a team of 8 pharmacy technicians and 4 pharmacy interns in daily operations.",
                "Implemented an automated dispensing system that reduced medication errors by 60% and improved workflow efficiency.",
                "Administered immunizations including COVID-19, influenza, and shingles vaccines, delivering 2,000+ doses annually.",
                "Collaborated with physicians and nurses to optimize pharmacotherapy for patients with chronic conditions.",
            ],
        },
        "dentist": {
            "bullets": [
                "Provided comprehensive dental care including examinations, cleanings, fillings, crowns, and extractions to 20+ patients daily.",
                "Performed complex restorative and cosmetic procedures including implants, veneers, and root canals with 98% success rate.",
                "Diagnosed oral health conditions using digital radiography, intraoral cameras, and clinical examination techniques.",
                "Increased practice revenue by 30% through introduction of cosmetic dentistry services and patient education programs.",
                "Managed a dental practice with 3 hygienists and 5 support staff, overseeing scheduling, inventory, and compliance.",
                "Maintained infection control protocols exceeding OSHA and CDC guidelines with zero compliance violations.",
                "Developed treatment plans and communicated options to patients, achieving a 92% treatment acceptance rate.",
            ],
        },
        "lawyer": {
            "bullets": [
                "Represented clients in 100+ civil litigation matters from initial filing through trial and appeal, achieving favorable outcomes in 85% of cases.",
                "Drafted and negotiated commercial contracts, NDAs, and service agreements valued at $10M+ annually.",
                "Conducted legal research and prepared memoranda, briefs, and motions for state and federal court proceedings.",
                "Managed a caseload of 40+ active matters while meeting all filing deadlines and court appearance requirements.",
                "Advised corporate clients on regulatory compliance, employment law, and intellectual property matters.",
                "Led mediation and arbitration proceedings, resolving 70% of disputes without proceeding to trial.",
                "Supervised 3 associate attorneys and 2 paralegals, delegating tasks and reviewing work product for quality.",
                "Generated $1.5M+ in annual billings through client development, referrals, and thought leadership activities.",
            ],
        },
        "paralegal": {
            "bullets": [
                "Prepared legal documents including pleadings, discovery requests, motions, and contracts for 30+ active cases.",
                "Conducted thorough legal research using Westlaw and LexisNexis to support case strategy and litigation preparation.",
                "Organized and managed case files, evidence databases, and document review for complex litigation matters.",
                "Coordinated depositions, hearings, and trial logistics including witness preparation and exhibit management.",
                "Drafted and filed court documents with state and federal courts, ensuring compliance with procedural rules.",
                "Managed e-discovery processes for cases involving 500K+ documents using Relativity and Concordance platforms.",
                "Communicated with clients, opposing counsel, and court personnel to facilitate case progression.",
            ],
        },
        "mechanical_engineer": {
            "bullets": [
                "Designed and developed mechanical components and assemblies using SolidWorks and AutoCAD for manufacturing applications.",
                "Conducted FEA and CFD simulations to validate designs, reducing prototype iterations by 40% and saving $200K annually.",
                "Led cross-functional teams of 8 engineers through product development lifecycle from concept to production release.",
                "Improved manufacturing processes through DFM/DFA analysis, reducing production costs by 18% on key product lines.",
                "Created detailed engineering drawings, BOMs, and specifications compliant with ASME and ISO standards.",
                "Managed testing and validation programs including thermal, vibration, and fatigue testing per industry standards.",
                "Filed 3 patents for innovative mechanical design solutions that improved product performance by 25%.",
                "Collaborated with suppliers on material selection, tooling design, and quality control for injection-molded and CNC components.",
            ],
        },
        "electrical_engineer": {
            "bullets": [
                "Designed PCB layouts and schematics for embedded systems using Altium Designer and KiCad for IoT product lines.",
                "Developed power supply circuits and motor control systems for industrial automation applications.",
                "Conducted EMC/EMI testing and implemented design modifications to achieve FCC and CE certification compliance.",
                "Programmed microcontrollers (ARM Cortex, PIC) and wrote firmware in C/C++ for real-time control applications.",
                "Led design reviews and collaborated with mechanical and software teams to deliver integrated product solutions.",
                "Performed signal integrity analysis and optimized high-speed digital circuits for data rates exceeding 10 Gbps.",
                "Reduced BOM costs by 22% through component optimization and vendor negotiation without compromising performance.",
                "Authored test procedures and supervised validation testing of electrical systems for safety and reliability.",
            ],
        },
        "civil_engineer": {
            "bullets": [
                "Designed structural systems for commercial and residential buildings valued at $5M-$50M using STAAD and ETABS.",
                "Managed site development projects including grading, drainage, and utility design for 200+ acre developments.",
                "Prepared construction documents, specifications, and cost estimates for public infrastructure projects.",
                "Conducted site inspections and construction administration to ensure compliance with design specifications and building codes.",
                "Performed geotechnical analysis and foundation design for structures on challenging soil conditions.",
                "Coordinated with architects, contractors, and regulatory agencies to obtain permits and approvals.",
                "Utilized AutoCAD Civil 3D and GIS software for land development and transportation engineering projects.",
                "Supervised 5 junior engineers and managed project budgets totaling $3M+ annually.",
            ],
        },
        "architect": {
            "bullets": [
                "Designed and managed architectural projects from schematic design through construction administration for buildings valued at $10M-$100M.",
                "Created detailed construction documents using Revit and AutoCAD, ensuring code compliance and coordination with consultants.",
                "Led client presentations and design charrettes, translating complex program requirements into innovative spatial solutions.",
                "Managed project teams of 4-8 architects and coordinated with structural, MEP, and landscape engineering consultants.",
                "Achieved LEED Gold certification on 5 projects through sustainable design strategies and energy modeling analysis.",
                "Prepared zoning analyses, variance applications, and presented designs to planning boards and design review committees.",
                "Developed 3D renderings and virtual walkthroughs using SketchUp, Lumion, and Enscape for client approval.",
            ],
        },
        "interior_designer": {
            "bullets": [
                "Designed interior spaces for 40+ residential and commercial projects with budgets ranging from $50K to $2M.",
                "Created detailed space plans, material selections, and furniture specifications using AutoCAD and SketchUp.",
                "Managed client relationships from initial consultation through installation, maintaining 95% client satisfaction scores.",
                "Sourced materials, furnishings, and fixtures from 100+ vendors while staying within project budgets.",
                "Prepared presentation boards, 3D renderings, and finish schedules for client approval and contractor coordination.",
                "Collaborated with architects and contractors to ensure design intent was maintained through construction.",
                "Stayed current with design trends, building codes, and ADA accessibility requirements for commercial projects.",
            ],
        },
        "real_estate_agent": {
            "bullets": [
                "Closed $12M+ in residential real estate transactions annually, consistently ranking in the top 10% of agents in the brokerage.",
                "Represented 40+ buyers and sellers per year, guiding clients through negotiations, inspections, and closings.",
                "Developed targeted marketing campaigns including virtual tours, social media, and direct mail that generated 60+ leads monthly.",
                "Conducted comparative market analyses and pricing strategies that sold listings within 5% of asking price on average.",
                "Built a referral network generating 50% of annual business through client satisfaction and community involvement.",
                "Negotiated purchase agreements and counteroffers, achieving favorable terms for clients in 90% of transactions.",
                "Maintained active relationships with mortgage lenders, inspectors, and title companies to streamline transactions.",
            ],
        },
        "chef": {
            "bullets": [
                "Managed kitchen operations for a 200-seat restaurant generating $3M+ in annual food revenue.",
                "Developed seasonal menus featuring locally sourced ingredients, increasing customer satisfaction scores by 30%.",
                "Supervised a kitchen team of 15 cooks, prep staff, and dishwashers, managing scheduling and training programs.",
                "Reduced food costs from 35% to 28% through inventory management, portion control, and vendor negotiations.",
                "Maintained food safety and sanitation standards, achieving consistent A-grade health department inspections.",
                "Created catering menus and managed off-site events for groups of 50-500 guests with 98% client satisfaction.",
                "Introduced new cooking techniques and presentation styles that earned the restaurant a regional dining award.",
            ],
        },
        "restaurant_manager": {
            "bullets": [
                "Managed daily operations of a full-service restaurant with $4M+ annual revenue and 45 staff members.",
                "Increased revenue by 22% year-over-year through menu optimization, upselling training, and marketing initiatives.",
                "Maintained food cost at 29% and labor cost at 28% through careful scheduling, inventory control, and waste reduction.",
                "Recruited, trained, and managed front-of-house and back-of-house teams, reducing turnover by 35%.",
                "Ensured compliance with health codes, liquor licensing regulations, and workplace safety standards.",
                "Implemented a reservation and waitlist management system that improved table turnover by 20%.",
                "Resolved guest complaints promptly, maintaining a 4.5-star rating on Yelp and Google Reviews.",
            ],
        },
        "hotel_manager": {
            "bullets": [
                "Directed operations for a 250-room full-service hotel with annual revenue of $12M and 80+ staff members.",
                "Improved guest satisfaction scores from 82% to 94% through service training programs and facility upgrades.",
                "Managed departmental budgets totaling $5M, consistently achieving 15%+ GOP margins above brand benchmarks.",
                "Implemented revenue management strategies that increased ADR by 18% and occupancy rates by 12%.",
                "Coordinated with sales and catering teams to secure 200+ group bookings and events annually.",
                "Led hotel through successful brand inspection achieving highest scores in the region.",
                "Supervised front desk, housekeeping, maintenance, and F&B departments, conducting regular performance evaluations.",
            ],
        },
        "flight_attendant": {
            "bullets": [
                "Ensured safety and comfort of 150+ passengers per flight on domestic and international routes for 6+ years.",
                "Conducted pre-flight safety checks, emergency equipment inspections, and delivered safety demonstrations.",
                "Provided exceptional in-flight customer service, consistently receiving positive passenger feedback and commendations.",
                "Completed annual recurrent training in emergency procedures, first aid, CPR, and security protocols.",
                "Managed in-flight service operations including meal service, beverage service, and duty-free sales.",
                "Handled medical emergencies, disruptive passengers, and irregular operations with calm professionalism.",
                "Mentored 20+ new flight attendants during initial operating experience flights.",
            ],
        },
        "police_officer": {
            "bullets": [
                "Patrolled assigned district covering 15 square miles, responding to 10-15 calls for service per shift.",
                "Conducted criminal investigations including evidence collection, witness interviews, and case documentation.",
                "Made 200+ arrests annually while maintaining strict adherence to constitutional rights and department policies.",
                "Authored detailed incident reports, search warrants, and court testimony documentation for prosecution.",
                "Completed 40+ hours of annual continuing education in de-escalation, crisis intervention, and use-of-force policies.",
                "Served as field training officer for 8 recruit officers, providing evaluation and mentorship during probationary period.",
                "Participated in community policing programs that reduced neighborhood crime rates by 20%.",
            ],
        },
        "firefighter": {
            "bullets": [
                "Responded to 1,200+ emergency calls annually including structure fires, medical emergencies, and hazmat incidents.",
                "Operated and maintained firefighting apparatus and equipment including engines, ladders, and aerial platforms.",
                "Performed search and rescue operations in IDLH environments, successfully evacuating civilians from burning structures.",
                "Conducted fire safety inspections of 200+ commercial buildings annually, ensuring code compliance.",
                "Provided emergency medical care as EMT-B/Paramedic, delivering pre-hospital care to critically injured patients.",
                "Led fire prevention education programs reaching 5,000+ community members and school children annually.",
                "Maintained physical fitness standards and completed specialized training in technical rescue, water rescue, and wildland firefighting.",
            ],
        },
        "social_worker": {
            "bullets": [
                "Managed a caseload of 35+ clients providing crisis intervention, counseling, and resource coordination services.",
                "Conducted comprehensive psychosocial assessments and developed individualized treatment and safety plans.",
                "Connected clients with community resources including housing, employment, healthcare, and financial assistance programs.",
                "Facilitated support groups for families dealing with domestic violence, substance abuse, and mental health challenges.",
                "Collaborated with multidisciplinary teams including psychiatrists, nurses, and case managers to coordinate care.",
                "Documented case notes, progress reports, and court-ordered evaluations in compliance with agency and legal standards.",
                "Advocated for policy changes at the organizational and community level to address systemic barriers to client well-being.",
            ],
        },
        "psychologist": {
            "bullets": [
                "Provided individual and group psychotherapy to 25+ clients weekly using CBT, DBT, and EMDR modalities.",
                "Administered and interpreted psychological assessments including MMPI-2, WISC-V, and neuropsychological test batteries.",
                "Developed evidence-based treatment plans tailored to clients with anxiety, depression, PTSD, and personality disorders.",
                "Supervised 4 pre-doctoral psychology interns and 2 post-doctoral fellows in clinical training rotations.",
                "Published 5 peer-reviewed articles on treatment outcomes in the Journal of Clinical Psychology.",
                "Presented research findings at 8 national conferences including APA and ABCT annual conventions.",
                "Maintained active licensure and completed 30+ continuing education hours annually in specialized treatment areas.",
            ],
        },
        "physical_therapist": {
            "bullets": [
                "Evaluated and treated 15-20 patients daily with orthopedic, neurological, and post-surgical rehabilitation needs.",
                "Developed individualized treatment plans incorporating manual therapy, therapeutic exercise, and modalities.",
                "Achieved 90% patient satisfaction scores and 85% functional outcome improvement rates across patient populations.",
                "Supervised 3 physical therapy assistants and 2 PT students during clinical rotations.",
                "Implemented evidence-based protocols for total joint replacement rehabilitation, reducing average recovery time by 3 weeks.",
                "Documented patient evaluations, progress notes, and discharge summaries in compliance with Medicare and insurance requirements.",
                "Served as clinical specialist in sports medicine, providing injury prevention programs for local athletic teams.",
            ],
        },
        "veterinarian": {
            "bullets": [
                "Provided comprehensive medical and surgical care for 25+ companion animals daily in a busy small animal practice.",
                "Performed surgical procedures including spays, neuters, mass removals, and orthopedic repairs with 99% success rate.",
                "Diagnosed complex medical conditions using radiography, ultrasound, and laboratory diagnostics.",
                "Managed a team of 4 veterinary technicians and 3 veterinary assistants, overseeing daily clinical operations.",
                "Increased practice revenue by 20% through introduction of dental services and preventive care packages.",
                "Educated pet owners on nutrition, preventive care, and treatment options, improving treatment compliance rates.",
                "Maintained DEA licensure and ensured compliance with state veterinary practice acts and OSHA regulations.",
            ],
        },
        "journalist": {
            "bullets": [
                "Researched and wrote 200+ articles annually covering local government, business, and community news for a daily newspaper.",
                "Broke 15+ exclusive stories through investigative reporting, source cultivation, and public records analysis.",
                "Conducted interviews with elected officials, business leaders, and community members for feature and breaking news stories.",
                "Produced multimedia content including video, podcasts, and interactive graphics for digital platforms.",
                "Met daily and weekly deadlines while maintaining accuracy and adherence to AP Style and editorial standards.",
                "Grew digital readership by 35% through engaging headlines, SEO optimization, and social media promotion.",
                "Won 3 regional press association awards for investigative reporting and feature writing.",
            ],
        },
        "public_relations_specialist": {
            "bullets": [
                "Developed and executed PR campaigns that generated 500+ media placements in top-tier outlets including Forbes, TechCrunch, and WSJ.",
                "Wrote and distributed press releases, media advisories, and pitch materials for product launches and corporate announcements.",
                "Managed media relationships with 200+ journalists, editors, and influencers across technology, business, and lifestyle beats.",
                "Coordinated press events, product launch parties, and executive media tours with 95% attendance rates.",
                "Monitored media coverage and social sentiment using Meltwater and Cision, providing weekly reports to leadership.",
                "Developed crisis communication plans and served as spokesperson during 5 high-profile incidents.",
                "Increased brand share of voice by 40% through strategic thought leadership and speaking engagement placements.",
            ],
        },
        "content_writer": {
            "bullets": [
                "Produced 100+ pieces of long-form content monthly including blog posts, whitepapers, case studies, and eBooks.",
                "Increased organic website traffic by 60% through SEO-optimized content strategy and keyword research.",
                "Wrote compelling copy for email campaigns achieving 30% open rates and 5% click-through rates.",
                "Managed editorial calendar and coordinated with subject matter experts to ensure content accuracy and relevance.",
                "Edited and proofread content from guest contributors and team members, maintaining brand voice consistency.",
                "Created content for social media platforms that generated 200% increase in engagement metrics.",
                "Developed buyer persona-targeted content that contributed to 25% increase in marketing-qualified leads.",
            ],
        },
        "digital_marketing_manager": {
            "bullets": [
                "Managed $500K annual digital marketing budget across paid search, social media, display, and email channels.",
                "Developed and executed multi-channel digital strategies that increased online revenue by 45% year-over-year.",
                "Led a team of 6 marketing specialists across SEO, PPC, content, social media, and email marketing functions.",
                "Implemented marketing automation workflows in HubSpot that improved lead nurturing conversion by 35%.",
                "Launched and optimized Google Ads and Facebook Ads campaigns generating 10,000+ qualified leads quarterly.",
                "Analyzed campaign performance using Google Analytics, Data Studio, and attribution modeling to optimize ROAS.",
                "Drove website redesign project that improved conversion rates by 50% and reduced bounce rates by 30%.",
            ],
        },
        "seo_specialist": {
            "bullets": [
                "Developed and implemented SEO strategies that increased organic traffic by 150% and first-page rankings by 80%.",
                "Conducted comprehensive technical SEO audits identifying and resolving 500+ issues across site architecture, speed, and indexability.",
                "Performed keyword research and competitive analysis to identify content opportunities driving 200K+ monthly organic visits.",
                "Built and managed link-building campaigns that acquired 500+ high-authority backlinks, increasing domain authority by 20 points.",
                "Optimized on-page elements including title tags, meta descriptions, headers, and schema markup for 1,000+ pages.",
                "Collaborated with content and development teams to implement SEO best practices across website redesigns and migrations.",
                "Monitored rankings, traffic, and conversions using SEMrush, Ahrefs, Google Search Console, and Google Analytics.",
            ],
        },
        "business_analyst": {
            "bullets": [
                "Gathered and documented business requirements through stakeholder interviews, workshops, and process mapping for 20+ projects.",
                "Created detailed BRDs, use cases, user stories, and acceptance criteria for software development initiatives.",
                "Conducted gap analyses and feasibility studies to evaluate system solutions and process improvement opportunities.",
                "Facilitated UAT sessions with 50+ end users, documenting defects and ensuring quality deliverables.",
                "Developed data visualizations and reports using Tableau and Power BI to support executive decision-making.",
                "Mapped current-state and future-state business processes using BPMN notation and Visio.",
                "Served as liaison between business stakeholders and IT teams, ensuring clear communication and alignment on project objectives.",
                "Identified process inefficiencies that led to $500K+ in annual cost savings through automation and workflow improvements.",
            ],
        },
        "operations_manager": {
            "bullets": [
                "Directed daily operations for a facility with 100+ employees, $20M annual revenue, and 24/7 production schedules.",
                "Implemented Lean manufacturing principles that improved production efficiency by 30% and reduced waste by 25%.",
                "Managed vendor relationships and negotiated contracts worth $5M+ annually, achieving 15% cost reductions.",
                "Developed and monitored KPIs including OEE, on-time delivery, quality yield, and safety incident rates.",
                "Led cross-functional teams through ISO 9001 certification process and maintained ongoing audit compliance.",
                "Reduced employee turnover by 40% through improved training programs, career development, and engagement initiatives.",
                "Streamlined inventory management processes, reducing carrying costs by $300K annually while maintaining 99% order fulfillment.",
            ],
        },
        "supply_chain_manager": {
            "bullets": [
                "Managed end-to-end supply chain operations for a $50M product line spanning procurement, logistics, and distribution.",
                "Negotiated contracts with 100+ suppliers and logistics providers, reducing total supply chain costs by 18%.",
                "Implemented demand forecasting models that improved inventory accuracy from 75% to 95%, reducing stockouts by 60%.",
                "Led S&OP process integration across sales, marketing, finance, and operations teams.",
                "Optimized warehouse layouts and fulfillment processes, increasing pick-pack-ship throughput by 35%.",
                "Developed risk mitigation strategies for supply chain disruptions, ensuring 99% continuity during global logistics challenges.",
                "Managed a team of 12 procurement specialists, logistics coordinators, and inventory analysts.",
            ],
        },
        "quality_assurance_engineer": {
            "bullets": [
                "Designed and executed test plans, test cases, and test scripts for web and mobile applications across 10+ product releases.",
                "Developed automated test frameworks using Selenium, Appium, and Pytest that reduced regression testing time by 70%.",
                "Identified and documented 500+ defects per quarter using Jira, providing detailed reproduction steps and severity classifications.",
                "Performed API testing using Postman and REST Assured, validating 200+ endpoints for functionality and performance.",
                "Conducted performance and load testing using JMeter and Gatling, identifying bottlenecks before production deployment.",
                "Collaborated with developers in agile sprints to define acceptance criteria and ensure quality throughout the SDLC.",
                "Led QA process improvements that reduced escaped defect rate from 5% to 1% over 12 months.",
                "Mentored 3 junior QA engineers on test automation best practices and testing methodologies.",
            ],
        },
        "devops_engineer": {
            "bullets": [
                "Designed and maintained CI/CD pipelines using Jenkins, GitLab CI, and GitHub Actions, enabling 50+ deployments per week.",
                "Managed cloud infrastructure on AWS and GCP using Terraform and CloudFormation, supporting 200+ microservices.",
                "Implemented container orchestration with Kubernetes and Docker, improving deployment reliability to 99.95% uptime.",
                "Developed infrastructure monitoring and alerting using Prometheus, Grafana, and PagerDuty, reducing MTTR by 60%.",
                "Automated infrastructure provisioning and configuration management using Ansible and Chef for 500+ servers.",
                "Implemented security best practices including secrets management, network segmentation, and vulnerability scanning.",
                "Reduced cloud infrastructure costs by 40% through right-sizing, reserved instances, and spot instance strategies.",
                "Collaborated with development teams to establish GitOps workflows and improve developer experience.",
            ],
        },
        "cybersecurity_analyst": {
            "bullets": [
                "Monitored security events and analyzed 10K+ daily alerts using SIEM tools (Splunk, QRadar) to identify threats.",
                "Conducted vulnerability assessments and penetration testing on networks, applications, and cloud infrastructure.",
                "Led incident response for 50+ security incidents including malware outbreaks, phishing attacks, and data breaches.",
                "Developed and implemented security policies, procedures, and awareness training programs for 1,000+ employees.",
                "Performed risk assessments and compliance audits for SOC 2, ISO 27001, HIPAA, and PCI DSS frameworks.",
                "Deployed and managed security tools including EDR, DLP, WAF, and multi-factor authentication solutions.",
                "Authored threat intelligence reports and briefed executive leadership on emerging cyber threats and mitigation strategies.",
            ],
        },
        "database_administrator": {
            "bullets": [
                "Administered and optimized 50+ production databases (PostgreSQL, MySQL, Oracle, SQL Server) with 99.99% uptime.",
                "Designed and implemented database architectures supporting high-availability, disaster recovery, and data replication.",
                "Improved query performance by 60% through index optimization, query tuning, and execution plan analysis.",
                "Managed database migrations and upgrades with zero downtime using blue-green deployment strategies.",
                "Implemented automated backup and recovery procedures, achieving RPO of 15 minutes and RTO of 1 hour.",
                "Monitored database health using Datadog and custom scripts, proactively resolving performance bottlenecks.",
                "Collaborated with development teams on schema design, data modeling, and stored procedure optimization.",
            ],
        },
        "network_engineer": {
            "bullets": [
                "Designed and maintained enterprise network infrastructure supporting 5,000+ users across 15 office locations.",
                "Configured and managed Cisco and Juniper routers, switches, and firewalls for LAN, WAN, and SD-WAN environments.",
                "Implemented network security measures including VPNs, ACLs, IDS/IPS, and network segmentation strategies.",
                "Led network migration to SD-WAN architecture, reducing WAN costs by 35% while improving bandwidth by 50%.",
                "Monitored network performance using SolarWinds and Nagios, maintaining 99.99% network availability.",
                "Designed and deployed wireless network solutions for campus and warehouse environments serving 2,000+ concurrent users.",
                "Created and maintained network documentation including topology diagrams, IP address management, and change logs.",
                "Troubleshot complex network issues across L2/L3/L4 layers, resolving 95% of incidents within SLA targets.",
            ],
        },
        "medical_technologist": {
            "bullets": [
                "Performed 200+ clinical laboratory tests daily in hematology, chemistry, microbiology, and blood bank departments.",
                "Operated and maintained automated analyzers including Beckman Coulter, Siemens, and Roche diagnostic systems.",
                "Ensured quality control and proficiency testing compliance, maintaining 100% CAP and CLIA accreditation scores.",
                "Identified critical lab values and communicated results to physicians within established turnaround times.",
                "Trained and mentored 10+ medical laboratory science students during clinical rotations.",
                "Developed and validated new test procedures and protocols in accordance with FDA and CAP guidelines.",
                "Participated in hospital infection control and antibiotic stewardship programs through culture and sensitivity reporting.",
            ],
        },
        "occupational_therapist": {
            "bullets": [
                "Evaluated and treated 12-15 patients daily with conditions including stroke, traumatic brain injury, and orthopedic injuries.",
                "Developed individualized treatment plans focusing on ADL retraining, cognitive rehabilitation, and upper extremity function.",
                "Fabricated custom splints and recommended adaptive equipment to maximize patient independence and safety.",
                "Conducted home safety evaluations and recommended modifications to prevent falls and facilitate independent living.",
                "Supervised 2 occupational therapy assistants and provided clinical fieldwork supervision for OT students.",
                "Achieved 92% patient satisfaction scores and 88% functional outcome improvements across patient caseload.",
                "Maintained NBCOT certification and completed 36+ professional development units biennially.",
            ],
        },
        "elementary_school_teacher": {
            "bullets": [
                "Designed and delivered Common Core-aligned curriculum for 28 students in a Title I elementary school setting.",
                "Improved reading proficiency levels by 25% through implementation of guided reading groups and literacy centers.",
                "Differentiated instruction to meet diverse learning needs including students with IEPs, 504 plans, and ELL accommodations.",
                "Integrated STEM activities and project-based learning to increase student engagement and critical thinking skills.",
                "Maintained detailed student progress data and communicated regularly with parents through conferences and digital platforms.",
                "Organized and chaperoned field trips, science fairs, and school events that enhanced experiential learning opportunities.",
                "Collaborated with grade-level team on curriculum planning, assessment development, and instructional strategy alignment.",
                "Received Teacher of the Year recognition for outstanding commitment to student achievement and school community.",
            ],
        },
        "college_professor": {
            "bullets": [
                "Taught 4-5 undergraduate and graduate courses per semester with enrollment of 30-120 students per section.",
                "Published 12 peer-reviewed journal articles and 2 book chapters in top-tier academic publications.",
                "Secured $500K+ in external research funding through grants from NSF, NIH, and private foundations.",
                "Advised 15 graduate thesis and dissertation students, with 90% completing their programs on time.",
                "Developed new course curricula incorporating current research, industry trends, and online learning technologies.",
                "Served on departmental committees including curriculum review, faculty hiring, and student admissions.",
                "Presented research at 20+ national and international academic conferences.",
            ],
        },
        "librarian": {
            "bullets": [
                "Managed a library collection of 50,000+ physical and digital resources, overseeing acquisitions, cataloging, and weeding.",
                "Provided reference services and research assistance to 100+ patrons weekly across diverse subject areas.",
                "Developed and facilitated 150+ educational programs annually including literacy workshops, author events, and STEM activities.",
                "Managed library technology systems including ILS, digital databases, and public computer workstations.",
                "Created community outreach programs that increased library membership by 20% and program attendance by 35%.",
                "Supervised 5 library staff members and 10 volunteers, coordinating schedules and professional development.",
                "Curated reading lists and displays that promoted diverse voices and supported curriculum alignment for local schools.",
            ],
        },
        "event_coordinator": {
            "bullets": [
                "Planned and executed 80+ events annually including corporate conferences, galas, weddings, and trade shows for up to 2,000 attendees.",
                "Managed event budgets ranging from $10K to $500K, consistently delivering events 5-10% under budget.",
                "Negotiated contracts with venues, caterers, AV providers, and entertainment vendors, saving clients 15-20% on average.",
                "Coordinated event logistics including venue selection, catering, transportation, décor, and audio-visual requirements.",
                "Developed event marketing materials and registration systems that achieved 95% target attendance rates.",
                "Managed on-site event operations including vendor coordination, timeline execution, and troubleshooting.",
                "Achieved 97% client satisfaction rate and generated 60% of new business through referrals and repeat clients.",
            ],
        },
        "travel_agent": {
            "bullets": [
                "Booked $2M+ in annual travel revenue across leisure, corporate, and group travel segments.",
                "Planned customized itineraries for 200+ clients annually, including international destinations across 40+ countries.",
                "Negotiated preferred rates with hotels, airlines, and tour operators, saving clients an average of 15% on travel costs.",
                "Managed complex group travel logistics for corporate retreats and destination weddings with 50-200 guests.",
                "Maintained expertise in GDS systems (Amadeus, Sabre) and online booking platforms for efficient reservation management.",
                "Achieved 95% client retention rate through personalized service, destination expertise, and post-trip follow-up.",
                "Resolved travel disruptions including cancellations, delays, and rebooking during emergencies with minimal client impact.",
            ],
        },
        "insurance_agent": {
            "bullets": [
                "Generated $1.5M+ in annual premium revenue across auto, home, life, and commercial insurance product lines.",
                "Maintained a book of business with 500+ active policies and a 92% policy renewal rate.",
                "Conducted needs assessments and risk analyses to recommend appropriate coverage options for individual and business clients.",
                "Processed policy applications, endorsements, and claims, ensuring accuracy and regulatory compliance.",
                "Built client relationships through community networking, referral programs, and annual policy review consultations.",
                "Exceeded monthly sales targets by 20% through proactive prospecting, cross-selling, and upselling strategies.",
                "Completed continuing education requirements and maintained licenses in Property & Casualty and Life & Health insurance.",
            ],
        },
        "bank_teller": {
            "bullets": [
                "Processed 200+ daily transactions including deposits, withdrawals, transfers, and loan payments with 99.9% accuracy.",
                "Balanced cash drawer averaging $50K daily, maintaining zero discrepancies for 18+ consecutive months.",
                "Identified and referred customers for banking products including savings accounts, CDs, and credit cards, generating 30+ referrals monthly.",
                "Adhered to BSA/AML compliance procedures, identifying and reporting suspicious activity appropriately.",
                "Provided exceptional customer service, achieving highest satisfaction scores in the branch for 4 consecutive quarters.",
                "Assisted with vault operations, ATM balancing, and night deposit processing as part of branch opening and closing procedures.",
                "Trained 5 new tellers on transaction procedures, compliance requirements, and customer service standards.",
            ],
        },
        "retail_manager": {
            "bullets": [
                "Managed a retail store with $5M+ annual revenue, 25 associates, and 15,000 square feet of selling floor.",
                "Exceeded annual sales targets by 15% through visual merchandising optimization, promotional planning, and staff development.",
                "Recruited, trained, and coached sales associates, reducing turnover from 60% to 30% within 12 months.",
                "Analyzed sales data, inventory reports, and customer feedback to optimize product assortment and pricing strategies.",
                "Implemented loss prevention procedures that reduced shrinkage from 2.5% to 1.2% of total revenue.",
                "Managed inventory levels, purchase orders, and receiving operations to maintain optimal stock levels.",
                "Ensured store compliance with corporate merchandising standards, health and safety regulations, and operational procedures.",
            ],
        },
        "warehouse_manager": {
            "bullets": [
                "Managed warehouse operations for a 100,000 sq ft distribution center processing 5,000+ orders daily.",
                "Supervised a team of 40+ warehouse associates across receiving, picking, packing, and shipping functions.",
                "Implemented WMS optimization that improved order accuracy from 97% to 99.5% and reduced fulfillment time by 25%.",
                "Managed inventory valued at $10M+, conducting cycle counts and maintaining 99% inventory accuracy.",
                "Developed and enforced safety protocols resulting in 50% reduction in workplace injuries over 2 years.",
                "Coordinated inbound and outbound logistics with carriers, scheduling 30+ dock appointments daily.",
                "Reduced operational costs by 20% through process improvement, labor optimization, and equipment upgrades.",
            ],
        },
    },
    "summary": {
        "software_engineer": {
            "examples": [
                "Results-driven software engineer with 5+ years of experience building scalable web applications and APIs. Proficient in Python, TypeScript, and cloud-native architectures. Passionate about clean code, test-driven development, and delivering high-impact solutions that drive business growth.",
                "Full-stack software engineer specializing in React and Django with a track record of delivering production-ready features at high-growth startups. Strong collaborator who thrives in agile environments and is committed to continuous learning and technical excellence.",
                "Senior software engineer with expertise in distributed systems, microservices, and DevOps. Proven ability to lead technical initiatives, mentor engineering teams, and translate complex business requirements into elegant, maintainable software solutions.",
            ],
        },
        "accountant": {
            "examples": [
                "Detail-oriented CPA with 7+ years of experience in financial reporting, tax preparation, and audit compliance. Skilled in GAAP, SOX, and multi-state tax regulations. Proven ability to identify cost savings and streamline accounting operations.",
                "Analytical accountant with expertise in financial analysis, budgeting, and ERP systems including SAP and QuickBooks. Known for accuracy, integrity, and the ability to communicate complex financial information to non-financial stakeholders.",
                "Results-focused senior accountant with a strong background in corporate accounting, month-end close, and financial planning. Adept at managing multiple priorities in fast-paced environments while maintaining meticulous attention to detail.",
            ],
        },
        "nurse": {
            "examples": [
                "Compassionate and dedicated registered nurse with 6+ years of experience in acute care and medical-surgical nursing. Committed to evidence-based practice, patient advocacy, and interdisciplinary collaboration to achieve optimal patient outcomes.",
                "Experienced RN with specialized skills in critical care, patient education, and electronic health record documentation. Recognized for calm demeanor under pressure, strong clinical judgment, and a patient-first approach to healthcare delivery.",
                "Licensed registered nurse with a BSN and certification in ACLS and PALS. Proven ability to manage complex patient caseloads, mentor new nurses, and contribute to quality improvement initiatives in hospital settings.",
            ],
        },
        "teacher": {
            "examples": [
                "Passionate and innovative educator with 8+ years of experience teaching K-12 students. Skilled in differentiated instruction, classroom technology integration, and creating inclusive learning environments that inspire academic achievement.",
                "Dedicated high school teacher with expertise in curriculum development, standardized test preparation, and student mentorship. Committed to fostering critical thinking, creativity, and lifelong learning in every student.",
                "Enthusiastic elementary school teacher with a Master's in Education and a proven track record of improving student outcomes through engaging, standards-aligned instruction and positive classroom management.",
            ],
        },
        "manager": {
            "examples": [
                "Dynamic and results-oriented manager with 10+ years of experience leading high-performing teams in fast-paced environments. Skilled in strategic planning, budget management, and driving operational excellence to exceed organizational goals.",
                "Accomplished operations manager with a proven track record of increasing efficiency, reducing costs, and building cohesive teams. Expert in Lean/Six Sigma methodologies, stakeholder management, and data-driven decision making.",
                "Strategic business manager with deep expertise in P&L management, talent development, and cross-functional leadership. Known for translating vision into action and delivering measurable results in competitive markets.",
            ],
        },
        "marketing_specialist": {
            "examples": [
                "Creative and data-driven marketing specialist with 5+ years of experience in digital marketing, content strategy, and brand management. Proven ability to plan and execute campaigns that increase brand awareness and drive measurable ROI.",
                "Results-oriented marketing professional skilled in SEO, PPC, social media marketing, and marketing automation. Passionate about leveraging analytics to optimize campaigns and deliver exceptional customer experiences.",
                "Strategic marketing specialist with expertise in B2B and B2C marketing across SaaS, e-commerce, and consumer goods industries. Known for innovative thinking, strong project management skills, and building collaborative cross-functional relationships.",
            ],
        },
        "data_analyst": {
            "examples": [
                "Analytical and detail-oriented data analyst with 4+ years of experience turning complex datasets into actionable business insights. Proficient in Python, SQL, Tableau, and statistical modeling. Passionate about data storytelling and enabling data-driven decisions.",
                "Experienced data analyst with a strong foundation in statistics, data visualization, and business intelligence. Skilled at building automated dashboards and predictive models that support strategic planning and operational efficiency.",
                "Curious and methodical data analyst adept at extracting, cleaning, and analyzing data from diverse sources. Proven ability to communicate findings clearly to both technical and non-technical audiences.",
            ],
        },
        "graphic_designer": {
            "examples": [
                "Creative graphic designer with 6+ years of experience crafting compelling visual identities for brands across tech, fashion, and non-profit sectors. Expert in Adobe Creative Suite, Figma, and motion graphics.",
                "Versatile graphic designer skilled in branding, UI/UX design, and print production. Known for a keen eye for detail, strong typography skills, and the ability to deliver polished designs under tight deadlines.",
                "Innovative graphic designer passionate about visual storytelling and user-centered design. Experienced in creating brand guidelines, marketing collateral, and digital content that drives engagement and brand loyalty.",
            ],
        },
        "sales_representative": {
            "examples": [
                "High-performing sales professional with 7+ years of experience in B2B and B2C sales. Consistently exceeds quotas through consultative selling, strategic prospecting, and building long-term client relationships.",
                "Driven sales representative with expertise in SaaS, enterprise solutions, and channel sales. Proven track record of closing complex deals, growing key accounts, and mentoring junior sales team members.",
                "Results-focused sales executive skilled in solution selling, negotiation, and CRM management. Recognized for exceeding revenue targets by 20%+ annually and maintaining a customer retention rate above 90%.",
            ],
        },
        "project_manager": {
            "examples": [
                "PMP-certified project manager with 8+ years of experience delivering complex IT and business transformation projects. Expert in Agile, Scrum, and Waterfall methodologies with a consistent record of on-time, on-budget delivery.",
                "Strategic project manager skilled in cross-functional team leadership, risk management, and stakeholder communication. Proven ability to manage multiple concurrent projects valued at $1M-$10M.",
                "Detail-oriented project manager passionate about process optimization and team empowerment. Experienced in software development, infrastructure, and organizational change management projects.",
            ],
        },
        "customer_service_representative": {
            "examples": [
                "Dedicated customer service professional with 4+ years of experience delivering exceptional support across phone, email, and chat channels. Known for empathy, problem-solving skills, and a commitment to first-call resolution.",
                "Customer-focused service representative with expertise in CRM systems, complaint resolution, and process improvement. Consistently recognized for top satisfaction scores and the ability to turn dissatisfied customers into loyal advocates.",
                "Energetic customer service specialist skilled in multi-channel support, upselling, and team training. Passionate about creating positive customer experiences and contributing to continuous service improvement.",
            ],
        },
        "human_resources_specialist": {
            "examples": [
                "SHRM-certified HR specialist with 6+ years of experience in talent acquisition, employee relations, and benefits administration. Skilled in HRIS platforms, employment law compliance, and building inclusive workplace cultures.",
                "Strategic human resources professional with expertise in full-cycle recruitment, onboarding, and organizational development. Passionate about aligning HR initiatives with business objectives to drive employee engagement and retention.",
                "Detail-oriented HR specialist with a strong background in payroll processing, compliance auditing, and training program design. Known for building trusted partnerships with employees and leadership at all levels.",
            ],
        },
        "web_developer": {
            "examples": [
                "Creative and detail-oriented web developer with 5+ years of experience building responsive, user-friendly websites and web applications. Proficient in HTML, CSS, JavaScript, React, and modern web frameworks.",
                "Full-stack web developer specializing in WordPress, React, and Node.js with a passion for clean code and exceptional user experiences. Experienced in e-commerce, SaaS, and content-driven web platforms.",
                "Results-driven web developer with expertise in frontend performance optimization, accessibility, and SEO. Known for delivering pixel-perfect designs and scalable web solutions on time and within budget.",
            ],
        },
        "data_scientist": {
            "examples": [
                "Innovative data scientist with 5+ years of experience building predictive models and machine learning pipelines that drive business outcomes. Proficient in Python, R, TensorFlow, and cloud ML platforms.",
                "Analytically rigorous data scientist specializing in NLP, deep learning, and statistical modeling. Proven track record of translating complex data into actionable insights that generate measurable revenue impact.",
                "Collaborative data scientist with expertise in experiment design, feature engineering, and model deployment. Passionate about building data products that empower decision-making at scale.",
            ],
        },
        "product_manager": {
            "examples": [
                "Strategic product manager with 7+ years of experience driving product vision, roadmap execution, and cross-functional collaboration for B2B SaaS platforms. Data-driven leader with a strong technical background.",
                "Customer-obsessed product manager skilled in discovery research, experimentation, and agile delivery. Proven ability to launch products that increase engagement, retention, and revenue.",
                "Results-oriented product manager with deep expertise in mobile and web product development. Known for balancing user needs with business objectives and delivering impactful features at high-growth startups.",
            ],
        },
        "ux_designer": {
            "examples": [
                "Human-centered UX designer with 6+ years of experience crafting intuitive digital experiences for web and mobile applications. Expert in user research, prototyping, and design systems.",
                "Strategic UX designer passionate about accessibility, inclusive design, and data-informed decision making. Skilled in Figma, usability testing, and cross-functional collaboration with product and engineering teams.",
                "Creative and analytical UX designer with a background in psychology and interaction design. Proven ability to translate complex workflows into simple, elegant user interfaces that drive adoption and satisfaction.",
            ],
        },
        "financial_analyst": {
            "examples": [
                "Detail-oriented financial analyst with 5+ years of experience in financial modeling, forecasting, and strategic analysis. Proficient in Excel, Python, and BI tools with strong presentation skills.",
                "Analytical financial professional with expertise in M&A due diligence, valuation, and capital markets. Known for building robust financial models that inform investment decisions and corporate strategy.",
                "Results-focused financial analyst skilled in variance analysis, budgeting, and executive reporting. Adept at translating complex financial data into clear, actionable recommendations for senior leadership.",
            ],
        },
        "registered_nurse": {
            "examples": [
                "Dedicated registered nurse with 8+ years of experience in emergency and critical care settings. Specialized in trauma care, triage, and rapid clinical decision-making in high-pressure environments.",
                "Compassionate RN with ANCC board certification in Medical-Surgical Nursing and a track record of leading quality improvement initiatives. Committed to evidence-based practice and patient-centered care.",
                "Experienced registered nurse with expertise in oncology nursing, chemotherapy administration, and patient education. Known for building trusting relationships with patients and families during challenging treatment journeys.",
            ],
        },
        "pharmacist": {
            "examples": [
                "Licensed pharmacist with 7+ years of experience in retail and clinical pharmacy settings. Expert in medication therapy management, drug interaction analysis, and patient counseling.",
                "Patient-focused pharmacist with specialized knowledge in immunization delivery, chronic disease management, and pharmacy operations. Committed to improving medication adherence and health outcomes.",
                "Detail-oriented pharmacist skilled in automated dispensing systems, regulatory compliance, and pharmacy staff supervision. Known for accuracy, efficiency, and exceptional patient care.",
            ],
        },
        "dentist": {
            "examples": [
                "Skilled general dentist with 10+ years of experience providing comprehensive preventive, restorative, and cosmetic dental care. Committed to patient comfort and clinical excellence.",
                "Patient-centered dentist with expertise in implant dentistry, endodontics, and digital radiography. Known for building long-term patient relationships and creating healthy, confident smiles.",
                "Entrepreneurial dentist with experience managing private practice operations including staff supervision, marketing, and financial management. Dedicated to community oral health education.",
            ],
        },
        "lawyer": {
            "examples": [
                "Experienced attorney with 10+ years in civil litigation, contract law, and corporate governance. Proven track record of achieving favorable outcomes through strategic advocacy and negotiation.",
                "Detail-oriented lawyer specializing in intellectual property, employment law, and regulatory compliance. Known for providing practical legal counsel that aligns with business objectives.",
                "Results-driven attorney with expertise in commercial litigation, mediation, and client relationship management. Skilled at managing complex caseloads while mentoring junior legal professionals.",
            ],
        },
        "paralegal": {
            "examples": [
                "Organized and detail-oriented paralegal with 6+ years of experience supporting litigation, corporate, and real estate practice areas. Proficient in Westlaw, LexisNexis, and e-discovery platforms.",
                "Dedicated paralegal skilled in legal research, document drafting, and case management. Known for thorough preparation and the ability to manage multiple complex cases simultaneously.",
                "Experienced paralegal with expertise in trial preparation, discovery management, and client communication. Committed to supporting attorneys and contributing to successful case outcomes.",
            ],
        },
        "mechanical_engineer": {
            "examples": [
                "Innovative mechanical engineer with 8+ years of experience in product design, FEA simulation, and manufacturing process optimization. Proficient in SolidWorks, ANSYS, and GD&T.",
                "Results-driven mechanical engineer specializing in thermal systems, HVAC design, and energy efficiency. Proven ability to lead cross-functional teams from concept through production.",
                "Detail-oriented mechanical engineer with expertise in DFM/DFA, materials science, and quality engineering. Known for solving complex design challenges and delivering cost-effective solutions.",
            ],
        },
        "electrical_engineer": {
            "examples": [
                "Experienced electrical engineer with 7+ years of expertise in PCB design, embedded systems, and power electronics. Proficient in Altium Designer, MATLAB, and C/C++ firmware development.",
                "Innovative electrical engineer specializing in IoT product development, RF design, and signal processing. Proven track record of delivering products from prototype to mass production.",
                "Detail-oriented electrical engineer with strong skills in circuit analysis, EMC compliance, and hardware-software integration. Known for solving complex engineering challenges under tight deadlines.",
            ],
        },
        "civil_engineer": {
            "examples": [
                "Licensed Professional Engineer (PE) with 10+ years of experience in structural design, site development, and construction management. Proficient in AutoCAD Civil 3D and STAAD Pro.",
                "Results-oriented civil engineer specializing in transportation infrastructure, water resources, and environmental engineering. Skilled in project management and regulatory compliance.",
                "Collaborative civil engineer with expertise in geotechnical analysis, foundation design, and building code compliance. Known for delivering safe, sustainable, and cost-effective infrastructure solutions.",
            ],
        },
        "architect": {
            "examples": [
                "Licensed architect with 12+ years of experience designing commercial, residential, and institutional buildings. Expert in Revit, sustainable design, and LEED certification processes.",
                "Creative and detail-oriented architect specializing in mixed-use development, adaptive reuse, and urban design. Passionate about creating spaces that enhance community and well-being.",
                "Design-focused architect with a portfolio spanning healthcare, education, and hospitality projects. Known for innovative design solutions, client collaboration, and meticulous project management.",
            ],
        },
        "interior_designer": {
            "examples": [
                "Creative interior designer with 8+ years of experience transforming residential and commercial spaces. Expert in space planning, material selection, and project coordination.",
                "Client-focused interior designer with a keen eye for aesthetics and functionality. Skilled in AutoCAD, SketchUp, and 3D rendering with a portfolio spanning luxury residential and boutique hospitality projects.",
                "Detail-oriented interior designer passionate about sustainable design and biophilic principles. Known for creating beautiful, functional spaces that reflect client personalities and exceed expectations.",
            ],
        },
        "real_estate_agent": {
            "examples": [
                "Top-producing real estate agent with 8+ years of experience in residential sales and a proven track record of exceeding $10M in annual transactions. Expert in market analysis and client negotiation.",
                "Client-focused real estate professional specializing in first-time homebuyers, luxury properties, and investment real estate. Known for market expertise, responsive communication, and strong negotiation skills.",
                "Dynamic real estate agent with deep knowledge of local markets and a commitment to exceeding client expectations. Skilled in digital marketing, CRM management, and transaction coordination.",
            ],
        },
        "chef": {
            "examples": [
                "Creative and disciplined executive chef with 10+ years of experience leading high-volume kitchen operations. Expertise in menu development, cost control, and team leadership across fine dining and casual concepts.",
                "Passionate culinary professional with specialized training in French and Asian cuisines. Known for innovative flavor combinations, farm-to-table sourcing, and maintaining exceptional food quality standards.",
                "Results-oriented chef skilled in kitchen management, catering operations, and food safety compliance. Committed to culinary excellence, staff development, and delivering memorable dining experiences.",
            ],
        },
        "restaurant_manager": {
            "examples": [
                "Experienced restaurant manager with 8+ years of expertise in full-service and fast-casual dining operations. Proven ability to drive revenue growth, control costs, and build high-performing teams.",
                "Customer-focused restaurant manager skilled in staff training, inventory management, and guest experience optimization. Known for turning around underperforming locations and exceeding financial targets.",
                "Dynamic restaurant professional with expertise in multi-unit management, P&L accountability, and brand standard compliance. Passionate about creating exceptional dining experiences and developing future leaders.",
            ],
        },
        "hotel_manager": {
            "examples": [
                "Accomplished hotel manager with 10+ years of experience directing full-service hotel operations. Expert in revenue management, guest satisfaction, and team development across major brand portfolios.",
                "Results-driven hospitality professional with expertise in front office, housekeeping, and F&B management. Proven track record of improving guest scores and achieving financial targets.",
                "Strategic hotel manager skilled in sales, operations, and capital project oversight. Known for building cohesive teams and delivering exceptional guest experiences in competitive markets.",
            ],
        },
        "flight_attendant": {
            "examples": [
                "Dedicated flight attendant with 6+ years of experience ensuring passenger safety and comfort on domestic and international flights. Known for exceptional customer service and calm professionalism.",
                "Customer-oriented cabin crew member with expertise in in-flight service, emergency procedures, and conflict resolution. Recognized for positive passenger feedback and team leadership.",
                "Experienced flight attendant with strong communication skills and cultural awareness. Passionate about aviation safety, passenger well-being, and representing the airline brand with professionalism.",
            ],
        },
        "police_officer": {
            "examples": [
                "Dedicated law enforcement officer with 8+ years of experience in patrol, investigations, and community policing. Committed to public safety, constitutional policing, and building community trust.",
                "Experienced police officer with specialized training in crisis intervention, tactical operations, and crime prevention. Known for de-escalation skills, detailed reporting, and mentoring new officers.",
                "Community-oriented police officer with expertise in problem-oriented policing, traffic enforcement, and juvenile outreach. Recognized for leadership, integrity, and commitment to service.",
            ],
        },
        "firefighter": {
            "examples": [
                "Dedicated firefighter/EMT with 7+ years of experience responding to structure fires, medical emergencies, and technical rescue operations. Committed to public safety and continuous training.",
                "Experienced fire service professional with specialized training in hazardous materials, water rescue, and fire investigation. Known for calm decision-making under pressure and team leadership.",
                "Community-focused firefighter with expertise in fire prevention, public education, and emergency medical services. Recognized for physical fitness, technical proficiency, and dedication to protecting lives and property.",
            ],
        },
        "social_worker": {
            "examples": [
                "Licensed clinical social worker with 7+ years of experience providing crisis intervention, counseling, and case management services. Committed to empowering clients and advocating for social justice.",
                "Compassionate social worker specializing in child welfare, family services, and community resource coordination. Skilled in trauma-informed care and evidence-based therapeutic interventions.",
                "Dedicated social work professional with expertise in mental health, substance abuse, and geriatric care. Known for building trusting relationships and connecting clients with vital support services.",
            ],
        },
        "psychologist": {
            "examples": [
                "Licensed clinical psychologist with 10+ years of experience providing evidence-based psychotherapy and psychological assessment. Specializing in anxiety, depression, trauma, and personality disorders.",
                "Research-oriented psychologist with expertise in cognitive-behavioral therapy, neuropsychological assessment, and clinical supervision. Published researcher with a commitment to advancing the field.",
                "Compassionate psychologist skilled in individual, group, and family therapy across diverse populations. Known for cultural sensitivity, clinical excellence, and dedication to client well-being.",
            ],
        },
        "physical_therapist": {
            "examples": [
                "Licensed physical therapist with 8+ years of experience in orthopedic and sports rehabilitation. Expert in manual therapy, therapeutic exercise prescription, and evidence-based treatment planning.",
                "Patient-centered physical therapist specializing in neurological rehabilitation, geriatric care, and fall prevention. Committed to helping patients achieve their highest level of functional independence.",
                "Results-driven physical therapist with expertise in post-surgical rehabilitation, work injury management, and wellness programming. Known for motivating patients and achieving measurable outcomes.",
            ],
        },
        "veterinarian": {
            "examples": [
                "Compassionate veterinarian with 8+ years of experience in small animal medicine and surgery. Skilled in diagnostics, preventive care, and client education with a focus on fear-free practices.",
                "Dedicated veterinary professional with expertise in emergency medicine, dental care, and geriatric pet management. Known for clinical excellence and building lasting relationships with pet owners.",
                "Community-focused veterinarian with experience in shelter medicine, spay/neuter programs, and public health. Committed to animal welfare, preventive care, and advancing veterinary medicine.",
            ],
        },
        "journalist": {
            "examples": [
                "Award-winning journalist with 7+ years of experience in investigative reporting, feature writing, and multimedia storytelling. Skilled in deadline-driven environments and public records research.",
                "Versatile journalist with expertise in digital media, video production, and data-driven reporting. Passionate about holding institutions accountable and telling stories that inform and engage communities.",
                "Experienced reporter with a strong background in local government, business, and health reporting. Known for accuracy, source cultivation, and compelling narrative storytelling across print and digital platforms.",
            ],
        },
        "public_relations_specialist": {
            "examples": [
                "Strategic PR professional with 6+ years of experience in media relations, crisis communication, and brand management. Proven ability to secure top-tier media coverage and shape public narratives.",
                "Results-driven public relations specialist skilled in press release writing, event coordination, and influencer engagement. Known for building strong media relationships and delivering measurable PR outcomes.",
                "Creative communications professional with expertise in corporate PR, thought leadership, and social media strategy. Passionate about storytelling that builds brand credibility and stakeholder trust.",
            ],
        },
        "content_writer": {
            "examples": [
                "Versatile content writer with 5+ years of experience creating SEO-optimized blog posts, whitepapers, and marketing copy for B2B and B2C brands. Skilled in research, storytelling, and brand voice development.",
                "Creative content professional specializing in technology, healthcare, and finance content marketing. Known for translating complex topics into engaging, accessible content that drives organic traffic and leads.",
                "Detail-oriented content writer with expertise in content strategy, editorial planning, and performance analytics. Committed to producing high-quality content that informs, engages, and converts.",
            ],
        },
        "digital_marketing_manager": {
            "examples": [
                "Data-driven digital marketing manager with 7+ years of experience leading multi-channel campaigns across paid search, social, email, and content marketing. Proven track record of driving ROI and revenue growth.",
                "Strategic digital marketing leader skilled in marketing automation, conversion optimization, and team management. Expert in HubSpot, Google Analytics, and performance marketing across B2B SaaS platforms.",
                "Results-oriented digital marketing professional with deep expertise in e-commerce, lead generation, and brand building. Known for innovative campaign strategies and measurable business impact.",
            ],
        },
        "seo_specialist": {
            "examples": [
                "Technical SEO specialist with 5+ years of experience improving organic search visibility for enterprise and mid-market websites. Expert in site audits, keyword strategy, and link building.",
                "Data-driven SEO professional skilled in content optimization, technical SEO, and analytics. Proven ability to increase organic traffic by 100%+ through strategic keyword targeting and on-page optimization.",
                "Results-focused SEO specialist with expertise in local SEO, e-commerce optimization, and algorithm recovery. Known for staying ahead of search engine trends and delivering sustainable organic growth.",
            ],
        },
        "business_analyst": {
            "examples": [
                "Certified business analyst with 6+ years of experience in requirements gathering, process improvement, and stakeholder management. Proficient in Agile methodologies, SQL, and BI tools.",
                "Analytical professional with expertise in business process modeling, gap analysis, and UAT coordination. Known for bridging the gap between business needs and technology solutions.",
                "Detail-oriented business analyst skilled in data analysis, workflow optimization, and cross-functional collaboration. Committed to delivering solutions that drive efficiency and organizational value.",
            ],
        },
        "operations_manager": {
            "examples": [
                "Results-driven operations manager with 10+ years of experience optimizing processes, managing teams, and driving operational excellence. Expert in Lean/Six Sigma, supply chain management, and continuous improvement.",
                "Strategic operations leader with a proven track record of reducing costs, improving quality, and scaling operations for high-growth organizations. Skilled in data-driven decision making and team development.",
                "Experienced operations manager with expertise in manufacturing, logistics, and facility management. Known for building efficient systems, developing talent, and achieving ambitious performance targets.",
            ],
        },
        "supply_chain_manager": {
            "examples": [
                "Strategic supply chain manager with 8+ years of experience in procurement, logistics, and demand planning. Proven ability to reduce costs, improve service levels, and build resilient supply networks.",
                "Analytical supply chain professional with expertise in S&OP, inventory optimization, and vendor management. Skilled in SAP, Oracle SCM, and advanced forecasting methodologies.",
                "Results-oriented supply chain leader with a track record of managing global supply chains across manufacturing and retail industries. Known for risk mitigation, cost savings, and cross-functional collaboration.",
            ],
        },
        "quality_assurance_engineer": {
            "examples": [
                "Detail-oriented QA engineer with 5+ years of experience in manual and automated testing for web and mobile applications. Proficient in Selenium, Pytest, and CI/CD testing integration.",
                "Results-driven quality assurance professional skilled in test strategy development, API testing, and performance testing. Committed to delivering high-quality software through rigorous testing practices.",
                "Experienced QA engineer with expertise in agile testing, test automation frameworks, and defect management. Known for identifying critical bugs early and championing quality throughout the SDLC.",
            ],
        },
        "devops_engineer": {
            "examples": [
                "Experienced DevOps engineer with 6+ years of expertise in CI/CD, cloud infrastructure, and container orchestration. Proficient in AWS, Terraform, Kubernetes, and infrastructure-as-code practices.",
                "Automation-focused DevOps professional skilled in pipeline development, monitoring, and security hardening. Proven ability to improve deployment frequency, reliability, and developer productivity.",
                "Collaborative DevOps engineer with deep expertise in cloud-native architectures, GitOps workflows, and site reliability engineering. Known for reducing downtime, cutting costs, and enabling rapid iteration.",
            ],
        },
        "cybersecurity_analyst": {
            "examples": [
                "Vigilant cybersecurity analyst with 5+ years of experience in threat detection, incident response, and security operations. Proficient in SIEM tools, penetration testing, and compliance frameworks.",
                "Detail-oriented security professional with expertise in vulnerability management, risk assessment, and security awareness training. Committed to protecting organizational assets from evolving cyber threats.",
                "Certified cybersecurity analyst (CISSP, CEH) with a strong background in network security, cloud security, and digital forensics. Known for proactive threat hunting and clear communication of security risks to leadership.",
            ],
        },
        "database_administrator": {
            "examples": [
                "Experienced database administrator with 8+ years of expertise in PostgreSQL, MySQL, Oracle, and SQL Server administration. Skilled in performance tuning, high availability, and disaster recovery.",
                "Detail-oriented DBA with a strong background in database design, migration, and automation. Proven ability to maintain 99.99% uptime and optimize query performance for high-transaction environments.",
                "Proactive database administrator skilled in cloud database management (AWS RDS, Azure SQL), monitoring, and security. Known for reliable data management and collaboration with development teams.",
            ],
        },
        "network_engineer": {
            "examples": [
                "Certified network engineer (CCNP, JNCIS) with 7+ years of experience designing, implementing, and managing enterprise network infrastructure. Expert in routing, switching, and network security.",
                "Results-driven network professional with expertise in SD-WAN, wireless networking, and cloud connectivity. Proven track record of delivering high-availability networks with 99.99% uptime.",
                "Detail-oriented network engineer skilled in network architecture, firewall management, and performance monitoring. Known for troubleshooting complex issues and implementing scalable network solutions.",
            ],
        },
        "medical_technologist": {
            "examples": [
                "ASCP-certified medical technologist with 6+ years of experience performing clinical laboratory testing in hospital and reference lab settings. Proficient in hematology, chemistry, and microbiology.",
                "Detail-oriented lab professional with expertise in automated analyzer operation, quality control, and regulatory compliance. Committed to accuracy, patient safety, and continuous quality improvement.",
                "Experienced medical technologist skilled in blood bank procedures, molecular diagnostics, and laboratory information systems. Known for reliability, technical proficiency, and mentoring laboratory students.",
            ],
        },
        "occupational_therapist": {
            "examples": [
                "Licensed occupational therapist with 7+ years of experience in adult rehabilitation, cognitive therapy, and adaptive equipment assessment. Committed to helping patients achieve maximum independence.",
                "Patient-centered OT with expertise in hand therapy, work rehabilitation, and home modification assessment. Known for creative treatment approaches and compassionate patient care.",
                "Dedicated occupational therapist specializing in pediatric and neurological rehabilitation. Skilled in sensory integration, developmental assessment, and family education to optimize functional outcomes.",
            ],
        },
        "elementary_school_teacher": {
            "examples": [
                "Passionate elementary educator with 8+ years of experience teaching K-5 students in diverse school settings. Expert in differentiated instruction, literacy development, and STEM integration.",
                "Dedicated elementary teacher with a Master's in Education and a commitment to creating inclusive, engaging learning environments. Known for data-driven instruction and strong parent-teacher partnerships.",
                "Creative and student-centered elementary teacher skilled in project-based learning, classroom technology, and social-emotional learning. Recognized for improving student achievement and fostering a love of learning.",
            ],
        },
        "college_professor": {
            "examples": [
                "Published professor with 10+ years of experience in higher education teaching, research, and academic leadership. Expert in curriculum development, grant writing, and graduate student mentorship.",
                "Engaging college educator with a passion for student success and innovative pedagogy. Experienced in online and hybrid course delivery, assessment design, and interdisciplinary collaboration.",
                "Research-active professor with a strong publication record and expertise in securing external funding. Committed to excellence in teaching, mentoring, and contributing to the academic community.",
            ],
        },
        "librarian": {
            "examples": [
                "Resourceful librarian with 6+ years of experience in collection management, reference services, and community programming. Skilled in library technology, digital literacy instruction, and patron engagement.",
                "Innovative library professional with expertise in information science, data management, and academic research support. Passionate about equitable access to information and lifelong learning.",
                "Community-focused librarian with a strong background in children's services, outreach programming, and library marketing. Known for creating welcoming spaces and impactful educational programs.",
            ],
        },
        "event_coordinator": {
            "examples": [
                "Detail-oriented event coordinator with 6+ years of experience planning corporate, social, and non-profit events. Expert in vendor management, budget control, and creative event design.",
                "Energetic event professional skilled in logistics management, client relations, and on-site coordination. Known for executing flawless events that exceed client expectations and stay within budget.",
                "Versatile event coordinator with expertise in virtual, hybrid, and in-person event production. Passionate about creating memorable experiences through innovative planning and seamless execution.",
            ],
        },
        "travel_agent": {
            "examples": [
                "Experienced travel advisor with 7+ years of expertise in leisure, corporate, and group travel planning. Known for personalized service, destination knowledge, and building long-term client relationships.",
                "Client-focused travel professional skilled in itinerary design, GDS systems, and supplier negotiations. Passionate about creating unforgettable travel experiences and maximizing client value.",
                "Detail-oriented travel agent with expertise in luxury travel, honeymoon planning, and adventure tourism. Recognized for exceptional customer service and a loyal referral-based client base.",
            ],
        },
        "insurance_agent": {
            "examples": [
                "Licensed insurance agent with 6+ years of experience in property & casualty, life, and health insurance sales. Proven track record of building and maintaining a profitable book of business.",
                "Client-focused insurance professional skilled in risk assessment, needs analysis, and coverage recommendation. Known for explaining complex policies clearly and maintaining high client retention rates.",
                "Results-driven insurance agent with expertise in commercial lines, personal lines, and employee benefits. Committed to protecting clients' assets and providing responsive, trustworthy service.",
            ],
        },
        "bank_teller": {
            "examples": [
                "Reliable bank teller with 4+ years of experience in transaction processing, cash handling, and customer service. Known for accuracy, compliance, and building positive relationships with clients.",
                "Customer-oriented banking professional skilled in cross-selling financial products, account maintenance, and regulatory compliance. Committed to providing efficient, friendly service in fast-paced branch environments.",
                "Detail-oriented bank teller with expertise in cash management, fraud detection, and new account opening. Recognized for zero-error transaction records and consistently high customer satisfaction scores.",
            ],
        },
        "retail_manager": {
            "examples": [
                "Results-driven retail manager with 7+ years of experience in multi-unit retail operations. Proven ability to increase sales, reduce costs, and develop high-performing teams across diverse retail formats.",
                "Customer-focused retail leader skilled in visual merchandising, inventory management, and staff development. Known for turning around underperforming locations and exceeding corporate performance benchmarks.",
                "Dynamic retail manager with expertise in P&L management, loss prevention, and omnichannel retail strategy. Passionate about creating exceptional shopping experiences and coaching future leaders.",
            ],
        },
        "warehouse_manager": {
            "examples": [
                "Experienced warehouse manager with 8+ years of expertise in distribution center operations, inventory management, and team leadership. Proficient in WMS platforms and Lean warehousing principles.",
                "Results-oriented warehouse professional skilled in logistics coordination, safety management, and process improvement. Proven track record of improving accuracy, throughput, and operational efficiency.",
                "Strategic warehouse manager with expertise in e-commerce fulfillment, multi-site operations, and labor planning. Known for building strong teams and delivering operational excellence in fast-paced environments.",
            ],
        },
    },
}

# ---------------------------------------------------------------------------
# Skills suggestions — flat lists of common skills by job title
# ---------------------------------------------------------------------------

SKILLS_DB: dict[str, list[str]] = {
    "software_engineer": [
        "Python", "JavaScript", "TypeScript", "React", "Node.js", "Django",
        "PostgreSQL", "Docker", "Kubernetes", "AWS", "Git", "CI/CD",
        "REST APIs", "GraphQL", "Redis", "Linux", "Agile/Scrum",
        "Microservices", "TDD", "System Design",
    ],
    "accountant": [
        "GAAP", "Financial Reporting", "Tax Preparation", "QuickBooks",
        "SAP", "Excel (Advanced)", "Budgeting", "Auditing", "SOX Compliance",
        "Accounts Payable/Receivable", "Payroll", "ERP Systems",
        "Financial Analysis", "Cost Accounting",
    ],
    "nurse": [
        "Patient Assessment", "IV Therapy", "Medication Administration",
        "Electronic Health Records (Epic)", "ACLS", "BLS", "PALS",
        "Wound Care", "Patient Education", "Care Planning",
        "Vital Signs Monitoring", "Infection Control",
    ],
    "teacher": [
        "Lesson Planning", "Curriculum Development", "Classroom Management",
        "Differentiated Instruction", "Assessment Design", "Google Classroom",
        "Student Engagement", "IEP Development", "Parent Communication",
        "Educational Technology", "Standardized Testing",
    ],
    "manager": [
        "Team Leadership", "Strategic Planning", "Budget Management",
        "Performance Management", "Stakeholder Communication",
        "Process Improvement", "Agile/Scrum", "Conflict Resolution",
        "Vendor Management", "P&L Management", "Change Management",
        "OKRs", "Lean/Six Sigma",
    ],
    "marketing_specialist": [
        "SEO/SEM", "Google Analytics", "Social Media Marketing",
        "Content Strategy", "Email Marketing", "PPC Advertising",
        "HubSpot", "Copywriting", "A/B Testing", "Brand Management",
        "Marketing Automation", "Tableau",
    ],
    "data_analyst": [
        "Python", "SQL", "Tableau", "Power BI", "Excel (Advanced)",
        "R", "Statistics", "Data Visualization", "ETL",
        "Machine Learning", "A/B Testing", "Google Analytics",
        "Pandas", "NumPy", "Jupyter Notebooks",
    ],
    "graphic_designer": [
        "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign",
        "Figma", "Sketch", "Typography", "Brand Identity",
        "UI/UX Design", "Motion Graphics", "Print Design",
        "Color Theory", "Layout Design",
    ],
    "sales_representative": [
        "Salesforce", "CRM Management", "Cold Calling",
        "Negotiation", "Consultative Selling", "Pipeline Management",
        "Lead Generation", "Account Management", "Presentations",
        "Contract Negotiation", "Revenue Forecasting",
    ],
    "project_manager": [
        "Jira", "Agile/Scrum", "Waterfall", "MS Project",
        "Risk Management", "Stakeholder Management", "Budgeting",
        "Resource Planning", "Gantt Charts", "Sprint Planning",
        "PMP", "Change Management",
    ],
    "customer_service_representative": [
        "Zendesk", "Salesforce Service Cloud", "Live Chat Support",
        "Conflict Resolution", "CRM Systems", "Call Centre Operations",
        "Problem Solving", "Data Entry", "Multi-tasking",
        "Upselling/Cross-selling", "Knowledge Base Management",
    ],
    "human_resources_specialist": [
        "Talent Acquisition", "HRIS (Workday, ADP)", "Employee Relations",
        "Benefits Administration", "Payroll Processing", "Onboarding",
        "Employment Law", "Performance Reviews", "Training & Development",
        "Diversity & Inclusion", "SHRM Certification",
    ],
    "web_developer": [
        "HTML5", "CSS3", "JavaScript", "React", "Vue.js", "Angular",
        "Node.js", "PHP", "WordPress", "Responsive Design", "SEO",
        "Git", "REST APIs", "Bootstrap", "SASS/LESS",
    ],
    "data_scientist": [
        "Python", "R", "TensorFlow", "PyTorch", "Scikit-learn",
        "SQL", "Pandas", "NumPy", "Deep Learning", "NLP",
        "Computer Vision", "A/B Testing", "Spark", "AWS SageMaker",
        "Statistical Modeling",
    ],
    "product_manager": [
        "Product Roadmapping", "User Research", "Agile/Scrum",
        "Jira", "Data Analysis", "A/B Testing", "PRDs",
        "Stakeholder Management", "OKRs", "Competitive Analysis",
        "Wireframing", "SQL", "Amplitude", "Mixpanel",
    ],
    "ux_designer": [
        "Figma", "Sketch", "Adobe XD", "User Research",
        "Usability Testing", "Wireframing", "Prototyping",
        "Design Systems", "Information Architecture", "Accessibility (WCAG)",
        "Interaction Design", "User Flows", "Miro",
    ],
    "financial_analyst": [
        "Financial Modeling", "Excel (Advanced)", "Power BI",
        "Bloomberg Terminal", "Valuation", "Forecasting",
        "Variance Analysis", "M&A Analysis", "SQL", "Python",
        "Capital Budgeting", "SEC Filings", "VBA",
    ],
    "registered_nurse": [
        "Patient Assessment", "Triage", "IV Therapy",
        "Medication Administration", "Epic EHR", "ACLS", "BLS",
        "PALS", "Wound Care", "Patient Education",
        "Charge Nurse Leadership", "Quality Improvement",
        "Infection Control", "Care Coordination",
    ],
    "pharmacist": [
        "Medication Dispensing", "Drug Interaction Analysis",
        "Medication Therapy Management", "Immunization Administration",
        "Clinical Pharmacology", "Pharmacy Operations",
        "Compounding", "Controlled Substances Management",
        "Patient Counseling", "Regulatory Compliance",
        "Automated Dispensing Systems", "Inventory Management",
    ],
    "dentist": [
        "Restorative Dentistry", "Cosmetic Dentistry", "Endodontics",
        "Dental Implants", "Digital Radiography", "Oral Surgery",
        "Periodontics", "Patient Communication", "Treatment Planning",
        "Infection Control", "Practice Management", "Prosthodontics",
    ],
    "lawyer": [
        "Legal Research", "Litigation", "Contract Drafting",
        "Negotiation", "Westlaw", "LexisNexis", "Mediation",
        "Regulatory Compliance", "Client Counseling", "Brief Writing",
        "Oral Advocacy", "Due Diligence", "Case Management",
    ],
    "paralegal": [
        "Legal Research", "Westlaw", "LexisNexis", "Document Drafting",
        "E-Discovery", "Relativity", "Case Management",
        "Court Filing", "Deposition Coordination", "Contract Review",
        "Legal Writing", "Client Communication", "Trial Preparation",
    ],
    "mechanical_engineer": [
        "SolidWorks", "AutoCAD", "ANSYS", "FEA",
        "GD&T", "DFM/DFA", "3D Printing", "MATLAB",
        "Thermodynamics", "Materials Science", "CNC Machining",
        "Six Sigma", "Product Lifecycle Management", "ISO Standards",
    ],
    "electrical_engineer": [
        "PCB Design", "Altium Designer", "MATLAB", "Simulink",
        "Embedded Systems", "C/C++", "VHDL/Verilog", "Power Electronics",
        "Signal Processing", "EMC/EMI Testing", "Oscilloscopes",
        "Circuit Analysis", "PLC Programming", "KiCad",
    ],
    "civil_engineer": [
        "AutoCAD Civil 3D", "STAAD Pro", "ETABS", "Revit",
        "Structural Analysis", "Site Design", "Geotechnical Engineering",
        "Construction Management", "ACI/AISC Codes", "GIS",
        "Stormwater Management", "Cost Estimation", "Surveying",
    ],
    "architect": [
        "Revit", "AutoCAD", "SketchUp", "Rhino",
        "Enscape", "Lumion", "LEED Certification",
        "Building Codes", "Construction Documents", "Sustainable Design",
        "Space Planning", "3D Rendering", "BIM Coordination",
    ],
    "interior_designer": [
        "AutoCAD", "SketchUp", "Revit", "3D Rendering",
        "Space Planning", "Material Selection", "Color Theory",
        "Furniture Specification", "FF&E", "Lighting Design",
        "ADA Compliance", "Client Presentations", "Textile Knowledge",
    ],
    "real_estate_agent": [
        "MLS", "CRM Software", "Market Analysis",
        "Contract Negotiation", "Property Valuation", "Lead Generation",
        "Client Relationship Management", "Virtual Tours",
        "Social Media Marketing", "Transaction Coordination",
        "Comparative Market Analysis", "Open House Management",
    ],
    "chef": [
        "Menu Development", "Food Cost Control", "Kitchen Management",
        "Food Safety (ServSafe)", "Inventory Management",
        "Catering", "Recipe Development", "Garde Manger",
        "Pastry", "Butchery", "Wine Pairing",
        "Team Leadership", "Vendor Relations",
    ],
    "restaurant_manager": [
        "P&L Management", "Staff Training", "Inventory Control",
        "Food Safety", "Customer Service", "POS Systems",
        "Scheduling", "Vendor Negotiations", "Marketing",
        "Liquor Compliance", "Conflict Resolution", "Menu Pricing",
    ],
    "hotel_manager": [
        "Revenue Management", "Guest Relations", "Opera PMS",
        "Housekeeping Management", "F&B Operations",
        "Sales & Catering", "Budget Management", "Staff Training",
        "Brand Standards", "Quality Assurance", "Forecasting",
        "Event Coordination",
    ],
    "flight_attendant": [
        "Safety Procedures", "Emergency Response", "First Aid/CPR",
        "Customer Service", "Conflict Resolution", "In-flight Service",
        "Cultural Awareness", "Crew Resource Management",
        "Regulatory Compliance", "Language Skills",
        "Cabin Preparation", "Security Protocols",
    ],
    "police_officer": [
        "Law Enforcement", "Criminal Investigation", "Report Writing",
        "De-escalation", "Crisis Intervention", "Patrol Operations",
        "Traffic Enforcement", "Community Policing", "Evidence Collection",
        "Firearms Proficiency", "Defensive Tactics", "Court Testimony",
    ],
    "firefighter": [
        "Fire Suppression", "Emergency Medical Services", "Hazmat Response",
        "Technical Rescue", "Fire Prevention", "Apparatus Operation",
        "Incident Command System", "CPR/AED", "Public Education",
        "Building Inspection", "Physical Fitness", "Water Rescue",
    ],
    "social_worker": [
        "Case Management", "Crisis Intervention", "Counseling",
        "Psychosocial Assessment", "Community Resources",
        "Treatment Planning", "Group Facilitation", "Advocacy",
        "Trauma-Informed Care", "Mandated Reporting",
        "DSM-5", "Cultural Competency", "Documentation",
    ],
    "psychologist": [
        "Psychotherapy (CBT, DBT, EMDR)", "Psychological Assessment",
        "Clinical Interviewing", "Treatment Planning", "Research Design",
        "Statistical Analysis (SPSS)", "Neuropsychological Testing",
        "Group Therapy", "Clinical Supervision",
        "Diagnostic Evaluation", "Report Writing",
        "Ethical Practice", "Cultural Competency",
    ],
    "physical_therapist": [
        "Manual Therapy", "Therapeutic Exercise", "Patient Evaluation",
        "Treatment Planning", "Gait Training", "Orthopedic Rehabilitation",
        "Neurological Rehabilitation", "Sports Medicine",
        "Modalities (Ultrasound, E-stim)", "Documentation",
        "Patient Education", "Functional Assessment",
    ],
    "veterinarian": [
        "Small Animal Medicine", "Surgery", "Radiology",
        "Ultrasound", "Dentistry", "Anesthesia", "Pharmacology",
        "Client Education", "Laboratory Diagnostics",
        "Emergency Medicine", "Preventive Care",
        "Practice Management", "Compassionate Euthanasia",
    ],
    "journalist": [
        "Investigative Reporting", "AP Style", "Interviewing",
        "Deadline Writing", "Copy Editing", "Multimedia Production",
        "Data Journalism", "Social Media", "Public Records Research",
        "Fact-Checking", "CMS (WordPress)", "SEO",
        "Photography", "Podcast Production",
    ],
    "public_relations_specialist": [
        "Media Relations", "Press Release Writing", "Crisis Communication",
        "Event Planning", "Social Media Management",
        "Meltwater", "Cision", "Media Monitoring",
        "Thought Leadership", "Spokesperson Training",
        "Brand Messaging", "Influencer Outreach", "Content Creation",
    ],
    "content_writer": [
        "SEO Writing", "Blog Posts", "Whitepapers", "Copywriting",
        "Content Strategy", "WordPress", "Keyword Research",
        "Editing/Proofreading", "Social Media Content",
        "Email Marketing", "Brand Voice", "Google Analytics",
        "Content Calendar Management", "Research",
    ],
    "digital_marketing_manager": [
        "Google Ads", "Facebook Ads", "Google Analytics",
        "HubSpot", "Marketing Automation", "SEO/SEM",
        "Email Marketing", "Conversion Optimization",
        "Data Studio", "Content Strategy", "Social Media Marketing",
        "A/B Testing", "Attribution Modeling", "Team Leadership",
    ],
    "seo_specialist": [
        "Technical SEO", "On-page Optimization", "Link Building",
        "Keyword Research", "Google Search Console", "Google Analytics",
        "SEMrush", "Ahrefs", "Moz", "Schema Markup",
        "Content Optimization", "Site Auditing",
        "Local SEO", "Core Web Vitals", "Screaming Frog",
    ],
    "business_analyst": [
        "Requirements Gathering", "Process Mapping", "SQL",
        "Tableau", "Power BI", "Jira", "Agile/Scrum",
        "User Stories", "UAT", "Visio", "BRD/FRD Writing",
        "Gap Analysis", "Stakeholder Management", "BPMN",
    ],
    "operations_manager": [
        "Lean Manufacturing", "Six Sigma", "P&L Management",
        "Supply Chain Management", "Process Improvement",
        "KPI Development", "Vendor Management", "Budget Management",
        "Team Leadership", "ISO 9001", "Safety Management",
        "ERP Systems", "Workforce Planning",
    ],
    "supply_chain_manager": [
        "Procurement", "Demand Forecasting", "S&OP",
        "Inventory Management", "SAP SCM", "Logistics",
        "Vendor Management", "Contract Negotiation",
        "Warehouse Management", "ERP Systems", "Risk Management",
        "Cost Reduction", "Six Sigma", "Global Sourcing",
    ],
    "quality_assurance_engineer": [
        "Selenium", "Pytest", "Appium", "JMeter",
        "Postman", "API Testing", "Test Automation",
        "CI/CD Testing", "Jira", "Agile Testing",
        "Performance Testing", "SQL", "Python",
        "Test Planning", "Regression Testing",
    ],
    "devops_engineer": [
        "AWS", "GCP", "Azure", "Docker", "Kubernetes",
        "Terraform", "Ansible", "Jenkins", "GitLab CI",
        "Prometheus", "Grafana", "Linux", "Python",
        "Bash Scripting", "Infrastructure as Code",
    ],
    "cybersecurity_analyst": [
        "SIEM (Splunk, QRadar)", "Penetration Testing",
        "Vulnerability Assessment", "Incident Response",
        "Firewalls/IDS/IPS", "SOC 2", "ISO 27001",
        "Network Security", "Endpoint Security", "NIST Framework",
        "Threat Intelligence", "Digital Forensics", "Risk Assessment",
    ],
    "database_administrator": [
        "PostgreSQL", "MySQL", "Oracle", "SQL Server",
        "Database Design", "Performance Tuning", "Backup & Recovery",
        "High Availability", "Replication", "AWS RDS",
        "Azure SQL", "MongoDB", "Data Modeling", "Shell Scripting",
    ],
    "network_engineer": [
        "Cisco (CCNP/CCIE)", "Juniper", "Routing & Switching",
        "Firewalls (Palo Alto, Fortinet)", "SD-WAN", "VPN",
        "Wireless Networking", "Network Monitoring (SolarWinds)",
        "TCP/IP", "BGP/OSPF", "Load Balancing",
        "Network Security", "Cloud Networking",
    ],
    "medical_technologist": [
        "Hematology", "Clinical Chemistry", "Microbiology",
        "Blood Bank", "Urinalysis", "Quality Control",
        "Automated Analyzers", "Phlebotomy", "Laboratory Safety",
        "CAP/CLIA Compliance", "LIS Systems", "Molecular Diagnostics",
    ],
    "occupational_therapist": [
        "ADL Training", "Cognitive Rehabilitation", "Splinting",
        "Adaptive Equipment", "Home Safety Evaluation",
        "Sensory Integration", "Hand Therapy", "Patient Education",
        "Treatment Planning", "Functional Assessment",
        "Documentation", "Work Rehabilitation",
    ],
    "elementary_school_teacher": [
        "Lesson Planning", "Differentiated Instruction",
        "Classroom Management", "Literacy Instruction", "STEM Education",
        "IEP Accommodation", "Google Classroom", "Student Assessment",
        "Parent Communication", "Social-Emotional Learning",
        "Project-Based Learning", "Common Core Standards",
    ],
    "college_professor": [
        "Curriculum Development", "Academic Research", "Grant Writing",
        "Thesis Advising", "Lecture Design", "Online Teaching (LMS)",
        "Peer Review", "Academic Publishing", "Student Mentorship",
        "Assessment Design", "Conference Presentation",
        "Interdisciplinary Collaboration",
    ],
    "librarian": [
        "Collection Management", "Reference Services", "Cataloging",
        "ILS Systems", "Digital Databases", "Information Literacy",
        "Programming & Outreach", "Research Assistance",
        "Community Engagement", "Library Technology",
        "Children's Services", "Archival Management",
    ],
    "event_coordinator": [
        "Event Planning", "Vendor Management", "Budget Management",
        "Venue Selection", "Contract Negotiation", "Catering Coordination",
        "AV Management", "Registration Systems", "Marketing",
        "On-site Coordination", "Timeline Management",
        "Client Relations", "Virtual Event Platforms",
    ],
    "travel_agent": [
        "Amadeus", "Sabre", "Itinerary Planning",
        "Client Relations", "Destination Knowledge",
        "Group Travel", "Corporate Travel", "Cruise Bookings",
        "Travel Insurance", "Visa & Passport Assistance",
        "Supplier Negotiations", "CRM Systems",
    ],
    "insurance_agent": [
        "Property & Casualty", "Life & Health", "Risk Assessment",
        "Policy Analysis", "Claims Processing", "Underwriting Basics",
        "Client Relationship Management", "Cross-selling",
        "Regulatory Compliance", "CRM Software",
        "Needs Analysis", "Sales Prospecting",
    ],
    "bank_teller": [
        "Cash Handling", "Transaction Processing", "Customer Service",
        "Cross-selling", "BSA/AML Compliance", "Account Opening",
        "Fraud Detection", "Banking Software", "Balancing",
        "Vault Operations", "Attention to Detail",
    ],
    "retail_manager": [
        "P&L Management", "Visual Merchandising", "Staff Development",
        "Inventory Management", "Loss Prevention", "Customer Service",
        "POS Systems", "Sales Forecasting", "Recruitment",
        "Scheduling", "Vendor Relations", "Omnichannel Retail",
    ],
    "warehouse_manager": [
        "WMS Systems", "Inventory Management", "Logistics",
        "Team Leadership", "Safety Management (OSHA)",
        "Order Fulfillment", "Forklift Operations",
        "Lean Warehousing", "Shipping & Receiving",
        "Process Improvement", "Labor Planning", "ERP Systems",
    ],
}

# ---------------------------------------------------------------------------
# Job title suggestions (autocomplete)
# ---------------------------------------------------------------------------

JOB_TITLES: list[str] = [
    "Software Engineer",
    "Senior Software Engineer",
    "Staff Software Engineer",
    "Principal Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Mobile Developer",
    "iOS Developer",
    "Android Developer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Cloud Engineer",
    "Data Analyst",
    "Senior Data Analyst",
    "Data Scientist",
    "Senior Data Scientist",
    "Machine Learning Engineer",
    "AI/ML Researcher",
    "Data Engineer",
    "Database Administrator",
    "Network Engineer",
    "Network Administrator",
    "Systems Administrator",
    "Cybersecurity Analyst",
    "Information Security Engineer",
    "Security Operations Analyst",
    "Quality Assurance Engineer",
    "QA Automation Engineer",
    "Test Engineer",
    "Product Manager",
    "Senior Product Manager",
    "Product Owner",
    "Project Manager",
    "Senior Project Manager",
    "Program Manager",
    "Scrum Master",
    "Technical Program Manager",
    "UX Designer",
    "Senior UX Designer",
    "UI Designer",
    "UX Researcher",
    "Product Designer",
    "Graphic Designer",
    "Senior Graphic Designer",
    "Visual Designer",
    "Motion Designer",
    "Interior Designer",
    "Marketing Specialist",
    "Marketing Manager",
    "Digital Marketing Manager",
    "Content Marketing Manager",
    "SEO Specialist",
    "SEM Specialist",
    "Social Media Manager",
    "Social Media Coordinator",
    "Brand Manager",
    "Public Relations Specialist",
    "Communications Manager",
    "Content Writer",
    "Copywriter",
    "Technical Writer",
    "Sales Representative",
    "Senior Sales Representative",
    "Account Executive",
    "Senior Account Executive",
    "Business Development Representative",
    "Business Development Manager",
    "Sales Manager",
    "Regional Sales Manager",
    "Customer Service Representative",
    "Customer Success Manager",
    "Customer Support Specialist",
    "Human Resources Specialist",
    "HR Manager",
    "HR Director",
    "Recruiter",
    "Talent Acquisition Specialist",
    "HR Business Partner",
    "Compensation & Benefits Analyst",
    "Accountant",
    "Senior Accountant",
    "Staff Accountant",
    "Financial Analyst",
    "Senior Financial Analyst",
    "Controller",
    "CFO",
    "Auditor",
    "Tax Accountant",
    "Bookkeeper",
    "Registered Nurse",
    "Nurse Practitioner",
    "Licensed Practical Nurse",
    "Charge Nurse",
    "Clinical Nurse Specialist",
    "Pharmacist",
    "Pharmacy Technician",
    "Dentist",
    "Dental Hygienist",
    "Physician",
    "Physician Assistant",
    "Medical Technologist",
    "Medical Assistant",
    "Occupational Therapist",
    "Physical Therapist",
    "Physical Therapy Assistant",
    "Speech-Language Pathologist",
    "Veterinarian",
    "Veterinary Technician",
    "Psychologist",
    "Licensed Clinical Social Worker",
    "Social Worker",
    "Mental Health Counselor",
    "Teacher",
    "Elementary School Teacher",
    "Middle School Teacher",
    "High School Teacher",
    "Special Education Teacher",
    "College Professor",
    "Adjunct Professor",
    "Teaching Assistant",
    "School Counselor",
    "Librarian",
    "Operations Manager",
    "Senior Operations Manager",
    "General Manager",
    "Office Manager",
    "Administrative Assistant",
    "Executive Assistant",
    "Supply Chain Manager",
    "Logistics Coordinator",
    "Warehouse Manager",
    "Warehouse Supervisor",
    "Inventory Manager",
    "Purchasing Manager",
    "Business Analyst",
    "Senior Business Analyst",
    "Systems Analyst",
    "Management Consultant",
    "Paralegal",
    "Attorney",
    "Corporate Counsel",
    "Legal Assistant",
    "Mechanical Engineer",
    "Senior Mechanical Engineer",
    "Electrical Engineer",
    "Senior Electrical Engineer",
    "Civil Engineer",
    "Structural Engineer",
    "Environmental Engineer",
    "Chemical Engineer",
    "Industrial Engineer",
    "Architect",
    "Landscape Architect",
    "Real Estate Agent",
    "Real Estate Broker",
    "Property Manager",
    "Chef",
    "Executive Chef",
    "Sous Chef",
    "Pastry Chef",
    "Restaurant Manager",
    "Hotel Manager",
    "Front Desk Manager",
    "Event Coordinator",
    "Event Manager",
    "Meeting Planner",
    "Flight Attendant",
    "Travel Agent",
    "Tour Guide",
    "Police Officer",
    "Detective",
    "Firefighter",
    "Paramedic",
    "EMT",
    "Journalist",
    "Reporter",
    "Editor",
    "News Anchor",
    "Insurance Agent",
    "Insurance Underwriter",
    "Claims Adjuster",
    "Bank Teller",
    "Loan Officer",
    "Financial Advisor",
    "Investment Analyst",
    "Retail Manager",
    "Store Manager",
    "Assistant Store Manager",
    "Retail Sales Associate",
    "Visual Merchandiser",
]

# ---------------------------------------------------------------------------
# Company name suggestions (autocomplete)
# ---------------------------------------------------------------------------

COMPANY_NAMES: list[str] = [
    "Google",
    "Apple",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "Tesla",
    "Salesforce",
    "IBM",
    "Oracle",
    "Adobe",
    "SAP",
    "Intel",
    "Cisco",
    "Nvidia",
    "AMD",
    "Qualcomm",
    "Dell Technologies",
    "HP Inc.",
    "VMware",
    "ServiceNow",
    "Workday",
    "Palantir Technologies",
    "Snowflake",
    "Databricks",
    "Twilio",
    "HubSpot",
    "Square (Block)",
    "PayPal",
    "Intuit",
    "Deloitte",
    "PwC",
    "Ernst & Young",
    "KPMG",
    "McKinsey & Company",
    "Accenture",
    "Boston Consulting Group",
    "Bain & Company",
    "Capgemini",
    "Cognizant",
    "Infosys",
    "Wipro",
    "Tata Consultancy Services",
    "JPMorgan Chase",
    "Goldman Sachs",
    "Morgan Stanley",
    "Bank of America",
    "Citigroup",
    "Wells Fargo",
    "Capital One",
    "American Express",
    "Charles Schwab",
    "Fidelity Investments",
    "BlackRock",
    "Vanguard",
    "State Street",
    "Johnson & Johnson",
    "Pfizer",
    "UnitedHealth Group",
    "Merck",
    "AbbVie",
    "Bristol-Myers Squibb",
    "Eli Lilly",
    "Moderna",
    "CVS Health",
    "Walgreens Boots Alliance",
    "Kaiser Permanente",
    "Mayo Clinic",
    "Cleveland Clinic",
    "HCA Healthcare",
    "Procter & Gamble",
    "Coca-Cola",
    "PepsiCo",
    "Nike",
    "Adidas",
    "Under Armour",
    "Walt Disney",
    "Warner Bros. Discovery",
    "NBCUniversal",
    "Paramount Global",
    "Sony",
    "Walmart",
    "Target",
    "Costco",
    "Home Depot",
    "Lowe's",
    "Best Buy",
    "Kroger",
    "Macy's",
    "Nordstrom",
    "Amazon Web Services",
    "General Electric",
    "3M",
    "Honeywell",
    "Caterpillar",
    "John Deere",
    "Siemens",
    "Boeing",
    "Lockheed Martin",
    "Raytheon Technologies",
    "Northrop Grumman",
    "General Dynamics",
    "SpaceX",
    "Uber",
    "Lyft",
    "Airbnb",
    "DoorDash",
    "Stripe",
    "Shopify",
    "Spotify",
    "Pinterest",
    "Snap Inc.",
    "Reddit",
    "Twitter/X",
    "LinkedIn",
    "Slack",
    "Zoom",
    "Atlassian",
    "GitHub",
    "GitLab",
    "Cloudflare",
    "Elastic",
    "MongoDB",
    "Confluent",
    "FedEx",
    "UPS",
    "DHL",
    "Marriott International",
    "Hilton",
    "Hyatt Hotels",
    "Starbucks",
    "McDonald's",
    "Chipotle",
    "Yum! Brands",
    "Delta Air Lines",
    "United Airlines",
    "American Airlines",
    "Southwest Airlines",
    "Comcast",
    "AT&T",
    "Verizon",
    "T-Mobile",
    "State Farm",
    "Allstate",
    "Progressive",
    "MetLife",
    "Prudential Financial",
    "New York Life",
]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_suggestions(section_type: str, job_title: str) -> list[str]:
    """Return pre-written content suggestions for a given *section_type* and *job_title*.

    Parameters
    ----------
    section_type:
        The resume section — ``"experience"`` or ``"summary"``.
    job_title:
        The normalised job title key (e.g. ``"software_engineer"``).

    Returns
    -------
    list[str]
        A list of suggested bullet points (experience) or paragraph
        examples (summary).  Returns an empty list when no match is found.
    """
    # Normalise the job title to a lookup key
    key = _normalise_key(job_title)

    section_data: dict[str, dict[str, list[str]]] = SUGGESTIONS_DB.get(section_type, {})
    entry: dict[str, list[str]] = section_data.get(key, {})

    if section_type == "experience":
        return entry.get("bullets", [])
    if section_type == "summary":
        return entry.get("examples", [])

    return []


def get_skill_suggestions(job_title: str) -> list[str]:
    """Return skill suggestions for the given *job_title*.

    Parameters
    ----------
    job_title:
        The normalised job title key (e.g. ``"software_engineer"``).

    Returns
    -------
    list[str]
        Ordered list of relevant skill names.
    """
    key = _normalise_key(job_title)
    return SKILLS_DB.get(key, [])


def get_job_title_suggestions(query: str) -> list[str]:
    """Return job titles matching *query* (case-insensitive prefix search).

    Parameters
    ----------
    query:
        Partial job title string.

    Returns
    -------
    list[str]
        Matching job titles, max 10.
    """
    q = query.lower()
    return [t for t in JOB_TITLES if q in t.lower()][:10]


def get_company_suggestions(query: str) -> list[str]:
    """Return company names matching *query* (case-insensitive prefix search).

    Parameters
    ----------
    query:
        Partial company name string.

    Returns
    -------
    list[str]
        Matching company names, max 10.
    """
    q = query.lower()
    return [c for c in COMPANY_NAMES if q in c.lower()][:10]


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _normalise_key(value: str) -> str:
    """Normalise a human-readable string to a snake_case lookup key."""
    return value.strip().lower().replace(" ", "_").replace("-", "_")
