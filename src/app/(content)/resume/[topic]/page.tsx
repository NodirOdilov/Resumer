import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

interface TopicData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  sections: { heading: string; content: string }[];
  relatedTopics: { label: string; href: string }[];
}

const TOPICS: Record<string, TopicData> = {
  skills: {
    title: "Resume Skills: What to Include & How to List Them",
    metaTitle: "Resume Skills: What to Include & How to List | Resumer",
    metaDescription: "Learn which skills to put on your resume and how to present them. Covers hard skills, soft skills, and ATS keyword optimization.",
    subtitle: "A comprehensive guide to identifying, selecting, and presenting the right skills on your resume.",
    sections: [
      { heading: "Why Skills Matter on a Resume", content: "<p>Skills are one of the first things recruiters look for on a resume. They indicate whether you have the capabilities to perform the job successfully. According to research, hiring managers spend an average of 7.4 seconds scanning a resume, making a clear skills section essential.</p><p>Your skills section serves two purposes: it helps you pass ATS screening by matching keywords, and it gives human reviewers a quick snapshot of your qualifications.</p>" },
      { heading: "Hard Skills vs. Soft Skills", content: "<p><strong>Hard skills</strong> are technical, measurable abilities learned through education, training, or experience. Examples include programming languages, data analysis, graphic design, and project management methodologies.</p><p><strong>Soft skills</strong> are interpersonal qualities that affect how you work. Examples include communication, leadership, problem-solving, and teamwork.</p><p>Most resumes should include a mix of both, with a heavier emphasis on hard skills that can be verified and measured.</p>" },
      { heading: "How to Identify the Right Skills", content: "<ul><li>Analyze the job description for required and preferred qualifications</li><li>Review similar job postings in your field</li><li>Consider the skills you used in your most successful projects</li><li>Ask colleagues or mentors what skills they associate with you</li><li>Research industry-standard tools and technologies</li></ul>" },
      { heading: "How to Present Skills on Your Resume", content: "<ul><li><strong>Dedicated skills section:</strong> List 8-12 skills in a clean format near the top of your resume</li><li><strong>Integrated in experience:</strong> Demonstrate skills through accomplishment bullets</li><li><strong>Proficiency levels:</strong> Consider adding proficiency bars or levels for technical skills</li><li><strong>Categorized:</strong> Group related skills together (Technical, Management, Languages)</li></ul>" },
      { heading: "Skills to Avoid", content: "<ul><li>Outdated technologies no longer in use</li><li>Basic computer skills (Microsoft Word, email) unless entry-level</li><li>Vague terms like \"hardworking\" or \"team player\" without context</li><li>Skills you cannot back up with experience or examples</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Summary", href: "/resume/summary" },
      { label: "ATS Keywords", href: "/resume/keywords" },
      { label: "Work Experience", href: "/resume/work-experience" },
    ],
  },
  summary: {
    title: "How to Write a Resume Summary (With Examples)",
    metaTitle: "Resume Summary: How to Write One + Examples | Resumer",
    metaDescription: "Learn how to write a compelling resume summary statement that grabs attention. Includes examples for various industries and experience levels.",
    subtitle: "Your resume summary is your first impression. Learn how to make it count with proven formulas and real examples.",
    sections: [
      { heading: "What Is a Resume Summary?", content: "<p>A resume summary (also called a professional summary or career summary) is a brief 2-4 sentence overview of your professional background placed at the top of your resume. It serves as your personal pitch, highlighting your most relevant experience, skills, and achievements.</p>" },
      { heading: "Resume Summary vs. Objective", content: "<p>A <strong>summary</strong> focuses on what you bring to the table based on past experience. An <strong>objective</strong> focuses on what you want from the job. In most cases, a summary is more effective because it addresses the employer's needs rather than yours.</p><p>Use an objective only if you're a recent graduate, changing careers, or entering the workforce for the first time.</p>" },
      { heading: "How to Write a Strong Summary", content: "<ul><li>Start with your professional title and years of experience</li><li>Include 2-3 of your most impressive, relevant achievements</li><li>Mention key skills that match the job description</li><li>End with what you aim to accomplish in the role</li><li>Keep it to 3-5 lines maximum</li></ul>" },
      { heading: "Resume Summary Examples", content: "<p><strong>Marketing Professional:</strong> \"Strategic marketing manager with 7+ years of experience driving brand growth for B2B SaaS companies. Spearheaded campaigns that generated $4.2M in pipeline and increased organic traffic by 180%. Skilled in content strategy, marketing automation, and data analytics.\"</p><p><strong>Software Engineer:</strong> \"Full-stack software engineer with 5 years of experience building scalable web applications. Proficient in React, Node.js, and AWS. Led the development of a real-time collaboration platform serving 50,000+ daily active users with 99.9% uptime.\"</p><p><strong>Recent Graduate:</strong> \"Motivated business administration graduate from UCLA with internship experience in financial analysis. Proficient in Excel modeling, SQL, and Tableau. Eager to apply analytical skills and attention to detail in an entry-level financial analyst role.\"</p>" },
    ],
    relatedTopics: [
      { label: "Resume Objective", href: "/resume/objective" },
      { label: "How to Write a Resume", href: "/resume/how-to" },
      { label: "Resume Skills", href: "/resume/skills" },
    ],
  },
  objective: {
    title: "Resume Objective: When & How to Write One",
    metaTitle: "Resume Objective Statement: When to Use & How to Write | Resumer",
    metaDescription: "Learn when a resume objective is appropriate and how to write one that strengthens your application.",
    subtitle: "When a resume summary doesn't fit, an objective statement can work. Here's how to write an effective one.",
    sections: [
      { heading: "What Is a Resume Objective?", content: "<p>A resume objective is a 1-2 sentence statement that expresses your career goals and what you hope to achieve in the position you're applying for. Unlike a summary that highlights past experience, an objective focuses on your future goals and how they align with the employer's needs.</p>" },
      { heading: "When to Use an Objective", content: "<ul><li>You're a recent graduate with limited work experience</li><li>You're changing careers and your past experience doesn't directly relate</li><li>You're re-entering the workforce after a significant gap</li><li>You're applying for a specific entry-level position</li></ul>" },
      { heading: "How to Write an Effective Objective", content: "<ul><li>Keep it concise: 1-2 sentences maximum</li><li>Mention the specific position and company name</li><li>Highlight relevant skills or education</li><li>Focus on what you can offer the employer, not just what you want</li><li>Avoid generic statements like \"seeking a challenging opportunity\"</li></ul>" },
      { heading: "Examples", content: "<p><strong>Career changer:</strong> \"Detail-oriented project manager transitioning from construction to software development, bringing 6 years of team leadership and deadline management experience. Seeking a junior product manager role at TechCo to leverage organizational skills in a technology-driven environment.\"</p><p><strong>Recent graduate:</strong> \"Computer science graduate from MIT with strong foundations in Python and machine learning, seeking a data analyst position at DataCorp to apply statistical analysis skills and contribute to data-driven decision making.\"</p>" },
    ],
    relatedTopics: [
      { label: "Resume Summary", href: "/resume/summary" },
      { label: "How to Write a Resume", href: "/resume/how-to" },
      { label: "Resume for Students", href: "/resume-examples" },
    ],
  },
  "work-experience": {
    title: "How to Write Work Experience on a Resume",
    metaTitle: "Work Experience on a Resume: How to Write It Right | Resumer",
    metaDescription: "Master the art of writing your work experience section with action verbs, quantified achievements, and proper formatting.",
    subtitle: "Your work experience is the most important section. Learn how to make every bullet point count.",
    sections: [
      { heading: "Structuring Your Work Experience", content: "<p>For each position, include: job title, company name, location, dates of employment, and 3-6 bullet points. List positions in reverse chronological order, starting with your current or most recent role.</p>" },
      { heading: "Writing Powerful Bullet Points", content: "<p>Use the <strong>Action Verb + Task + Result</strong> formula:</p><ul><li>Start every bullet with a strong action verb</li><li>Describe what you did specifically</li><li>Quantify the impact with numbers, percentages, or dollar amounts</li></ul><p>Example: \"Implemented automated testing pipeline that reduced bug reports by 40% and shortened release cycles from 2 weeks to 3 days.\"</p>" },
      { heading: "Action Verbs to Use", content: "<p>Replace weak verbs like \"helped,\" \"worked on,\" and \"was responsible for\" with power verbs:</p><ul><li><strong>Leadership:</strong> Directed, Spearheaded, Orchestrated, Championed</li><li><strong>Achievement:</strong> Exceeded, Surpassed, Outperformed, Transformed</li><li><strong>Creation:</strong> Developed, Designed, Launched, Pioneered</li><li><strong>Improvement:</strong> Streamlined, Optimized, Revamped, Enhanced</li><li><strong>Analysis:</strong> Evaluated, Assessed, Forecasted, Identified</li></ul>" },
      { heading: "What to Include and Exclude", content: "<ul><li>Include: Relevant accomplishments, promotions, key projects, team size managed</li><li>Exclude: Routine tasks, irrelevant job duties, reasons for leaving, salary information</li><li>Focus on the last 10-15 years of experience</li><li>Older positions can be listed briefly with just title, company, and dates</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Skills", href: "/resume/skills" },
      { label: "Resume Achievements", href: "/resume/achievements" },
      { label: "Resume Format", href: "/resume/format" },
    ],
  },
  education: {
    title: "How to List Education on a Resume",
    metaTitle: "Education on a Resume: How to List It Correctly | Resumer",
    metaDescription: "Learn how to format your education section, what to include, and where to place it on your resume.",
    subtitle: "Format your education section correctly to strengthen your resume at any career stage.",
    sections: [
      { heading: "What to Include", content: "<ul><li>Degree type (B.A., M.S., Ph.D., etc.) and major</li><li>Institution name and location</li><li>Graduation year (or expected graduation)</li><li>GPA if 3.5+ and within last 3 years</li><li>Relevant honors, Dean's List, scholarships</li><li>Relevant coursework (for recent graduates)</li></ul>" },
      { heading: "Where to Place Education", content: "<p>For experienced professionals: Place education after work experience.</p><p>For recent graduates or students: Place education before or in place of work experience, as it may be your strongest section.</p>" },
      { heading: "Special Situations", content: "<ul><li><strong>No degree:</strong> List relevant coursework, certifications, or professional development</li><li><strong>In progress:</strong> Include expected graduation date and completed coursework</li><li><strong>Multiple degrees:</strong> List most recent first; omit high school if you have a college degree</li><li><strong>Study abroad:</strong> Mention if relevant to the role or shows language skills</li></ul>" },
    ],
    relatedTopics: [
      { label: "How to Write a Resume", href: "/resume/how-to" },
      { label: "Certifications", href: "/resume/certifications" },
      { label: "Student Resume Examples", href: "/resume-examples" },
    ],
  },
  certifications: {
    title: "How to List Certifications on a Resume",
    metaTitle: "Certifications on a Resume: How & Where to List Them | Resumer",
    metaDescription: "Learn the best way to include professional certifications on your resume, with formatting tips and placement advice.",
    subtitle: "Professional certifications can set you apart. Here is how to present them effectively.",
    sections: [
      { heading: "When Certifications Matter", content: "<p>Certifications demonstrate specialized knowledge and commitment to professional development. They are especially important in fields like IT, healthcare, finance, project management, and education where specific credentials are often required.</p>" },
      { heading: "How to Format Certifications", content: "<p>For each certification, include:</p><ul><li>Full certification name and abbreviation</li><li>Issuing organization</li><li>Date obtained (and expiration if applicable)</li><li>Credential ID or URL (optional)</li></ul><p>Example: \"AWS Certified Solutions Architect - Associate, Amazon Web Services, Issued March 2025, Credential ID: ABC123\"</p>" },
      { heading: "Where to Place Certifications", content: "<p>If certifications are highly relevant to the job, place them in a prominent position near the top of your resume, possibly even in your summary. Otherwise, create a dedicated \"Certifications\" section after skills or education.</p>" },
    ],
    relatedTopics: [
      { label: "Resume Skills", href: "/resume/skills" },
      { label: "Education on Resume", href: "/resume/education" },
      { label: "Resume Sections", href: "/resume/sections" },
    ],
  },
  achievements: {
    title: "How to Highlight Achievements on a Resume",
    metaTitle: "Resume Achievements: How to Write & Highlight Them | Resumer",
    metaDescription: "Transform your resume from a list of duties into a showcase of accomplishments. Learn how to quantify and present your achievements.",
    subtitle: "Accomplishments speak louder than duties. Learn how to quantify and present your best results.",
    sections: [
      { heading: "Achievements vs. Responsibilities", content: "<p>Responsibilities describe what you were supposed to do. Achievements describe what you actually accomplished. Recruiters want to see results, not job descriptions.</p><p><strong>Responsibility:</strong> \"Managed social media accounts\"</p><p><strong>Achievement:</strong> \"Grew Instagram following from 5K to 50K in 8 months, generating 200+ qualified leads per month\"</p>" },
      { heading: "How to Quantify Achievements", content: "<ul><li>Revenue generated or costs saved (dollar amounts)</li><li>Percentage improvements (efficiency, growth, reduction)</li><li>Volume metrics (users served, projects completed, reports delivered)</li><li>Time saved or deadlines met/beat</li><li>Awards won or rankings achieved</li></ul>" },
      { heading: "Finding Your Achievements", content: "<ul><li>Review performance reviews and feedback</li><li>Think about problems you solved and their impact</li><li>Consider what you did differently from others in the same role</li><li>Ask former colleagues about your notable contributions</li></ul>" },
    ],
    relatedTopics: [
      { label: "Work Experience", href: "/resume/work-experience" },
      { label: "Resume Skills", href: "/resume/skills" },
      { label: "Resume Summary", href: "/resume/summary" },
    ],
  },
  interests: {
    title: "Should You Include Hobbies & Interests on Your Resume?",
    metaTitle: "Hobbies & Interests on a Resume: Should You Include Them? | Resumer",
    metaDescription: "Learn when to include hobbies and interests on your resume and which ones to choose for maximum impact.",
    subtitle: "The right hobbies can humanize your resume and build rapport. The wrong ones can hurt your chances.",
    sections: [
      { heading: "When to Include Interests", content: "<ul><li>When the hobby is directly relevant to the role</li><li>When you have limited work experience to fill space</li><li>When company culture values personality and fit</li><li>When it demonstrates transferable skills (team sports show teamwork, blogging shows writing)</li></ul>" },
      { heading: "When to Skip Interests", content: "<ul><li>When space is tight and you have extensive experience</li><li>When hobbies could be controversial or polarizing</li><li>When they don't add value to your candidacy</li></ul>" },
      { heading: "Good vs. Bad Examples", content: "<p><strong>Good:</strong> Marathon runner (discipline), volunteer coding instructor (teaching + tech), competitive chess (strategic thinking), published blogger (communication)</p><p><strong>Avoid:</strong> \"Watching TV,\" \"Socializing with friends,\" controversial hobbies, anything that might suggest time commitment concerns</p>" },
    ],
    relatedTopics: [
      { label: "Resume Sections", href: "/resume/sections" },
      { label: "Volunteering", href: "/resume/volunteering" },
      { label: "What to Include", href: "/resume/what-to-include" },
    ],
  },
  volunteering: {
    title: "How to Include Volunteer Experience on a Resume",
    metaTitle: "Volunteer Experience on Resume: How to Include It | Resumer",
    metaDescription: "Learn how to effectively present volunteer experience on your resume to demonstrate skills, values, and community involvement.",
    subtitle: "Volunteer work can strengthen your resume by showcasing skills, leadership, and community involvement.",
    sections: [
      { heading: "Why Volunteer Experience Matters", content: "<p>Volunteer experience demonstrates initiative, passion, and soft skills that employers value. It is especially useful for filling employment gaps, showcasing skills you do not use in your paid work, and demonstrating cultural fit.</p>" },
      { heading: "How to Format Volunteer Experience", content: "<p>Format volunteer roles the same way you would a paid position: role title, organization name, dates, and bullet points describing what you accomplished. Focus on transferable skills and measurable impact.</p>" },
      { heading: "Where to Place It", content: "<ul><li>Create a dedicated \"Volunteer Experience\" section if you have multiple entries</li><li>Include under work experience if the volunteer role is highly relevant to the job</li><li>Place after work experience and education in most cases</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Sections", href: "/resume/sections" },
      { label: "Interests & Hobbies", href: "/resume/interests" },
      { label: "How to Write a Resume", href: "/resume/how-to" },
    ],
  },
  keywords: {
    title: "Resume Keywords: How to Use Them to Beat the ATS",
    metaTitle: "Resume Keywords: The Complete Guide to ATS Optimization | Resumer",
    metaDescription: "Learn how to identify and strategically place keywords on your resume to pass ATS screening and reach human reviewers.",
    subtitle: "Most resumes are screened by software before a human ever sees them. Learn how to pass that first filter.",
    sections: [
      { heading: "What Are Resume Keywords?", content: "<p>Resume keywords are specific words and phrases that relate to the job requirements. They include job titles, technical skills, tools, certifications, industry terms, and action verbs that ATS software scans for when processing applications.</p>" },
      { heading: "How to Find the Right Keywords", content: "<ul><li>Analyze the job description line by line</li><li>Note required skills, qualifications, and tools mentioned</li><li>Research similar job postings from other companies</li><li>Review industry publications and professional associations</li><li>Check LinkedIn profiles of people in similar roles</li></ul>" },
      { heading: "Where to Place Keywords", content: "<ul><li>Professional summary (2-3 key terms)</li><li>Skills section (primary keyword placement)</li><li>Work experience bullet points (natural integration)</li><li>Education and certifications</li></ul><p>Use exact phrases from the job description but integrate them naturally. Keyword stuffing is easily detected by modern ATS systems and human reviewers.</p>" },
    ],
    relatedTopics: [
      { label: "ATS Resume Guide", href: "/resume/ats" },
      { label: "Resume Skills", href: "/resume/skills" },
      { label: "Resume Summary", href: "/resume/summary" },
    ],
  },
  ats: {
    title: "How to Make an ATS-Friendly Resume",
    metaTitle: "ATS-Friendly Resume: How to Pass Applicant Tracking Systems | Resumer",
    metaDescription: "Learn how to create a resume that passes ATS screening. Tips on formatting, keywords, and common mistakes to avoid.",
    subtitle: "Over 75% of resumes are rejected by ATS before a human reads them. Here is how to make yours pass.",
    sections: [
      { heading: "What Is an ATS?", content: "<p>An Applicant Tracking System (ATS) is software used by employers to filter, sort, and rank job applications. These systems scan resumes for relevant keywords, qualifications, and formatting before passing them to human reviewers. Over 98% of Fortune 500 companies use some form of ATS.</p>" },
      { heading: "ATS-Friendly Formatting", content: "<ul><li>Use standard section headings (Work Experience, Education, Skills)</li><li>Avoid tables, columns, headers/footers, and text boxes</li><li>Use standard fonts (Arial, Calibri, Times New Roman)</li><li>Save as .docx or PDF (check which the employer prefers)</li><li>Do not use images, graphics, or icons for critical information</li><li>Use standard bullet points (not custom symbols)</li></ul>" },
      { heading: "Common ATS Mistakes", content: "<ul><li>Using creative layouts with multiple columns</li><li>Embedding contact info in headers or footers</li><li>Using abbreviations without also spelling them out</li><li>Submitting in incompatible file formats</li><li>Using fancy fonts or excessive formatting</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Keywords", href: "/resume/keywords" },
      { label: "Resume Format", href: "/resume/format" },
      { label: "Resume Templates", href: "/resume-templates" },
    ],
  },
  length: {
    title: "How Long Should a Resume Be?",
    metaTitle: "Resume Length: How Long Should Your Resume Be? | Resumer",
    metaDescription: "The definitive answer to one of the most common resume questions. Learn when to use 1 page vs 2 pages.",
    subtitle: "The age-old question answered with clear guidelines for every career stage.",
    sections: [
      { heading: "The General Rule", content: "<p>For most professionals with fewer than 10 years of experience, a one-page resume is ideal. Senior professionals, academics, and those with extensive relevant experience may use two pages. Three-page resumes are reserved for CVs and very senior executives.</p>" },
      { heading: "When One Page Is Best", content: "<ul><li>Less than 10 years of experience</li><li>Entry-level or early career positions</li><li>Career changes where older experience is less relevant</li><li>Jobs that value conciseness</li></ul>" },
      { heading: "When Two Pages Are Acceptable", content: "<ul><li>10+ years of highly relevant experience</li><li>Technical roles requiring extensive skill lists</li><li>Senior leadership or executive positions</li><li>Academic or research positions (though CVs may be longer)</li></ul><p>If your resume is two pages, make sure every line earns its place. Do not pad with filler content just to fill the second page.</p>" },
    ],
    relatedTopics: [
      { label: "Resume Format", href: "/resume/format" },
      { label: "Two-Page Resume", href: "/resume/two-page" },
      { label: "What to Include", href: "/resume/what-to-include" },
    ],
  },
  look: {
    title: "How Should a Resume Look in 2026?",
    metaTitle: "How Should a Resume Look? Design Guidelines for 2026 | Resumer",
    metaDescription: "Visual guidelines and modern design principles for creating a resume that looks professional and stands out.",
    subtitle: "Modern resume design balances professionalism with visual appeal. Here is what works in 2026.",
    sections: [
      { heading: "Key Design Principles", content: "<ul><li><strong>Clean hierarchy:</strong> Clear visual distinction between sections, headings, and body text</li><li><strong>White space:</strong> Adequate spacing that prevents a cluttered appearance</li><li><strong>Consistent formatting:</strong> Uniform fonts, sizes, spacing, and alignment</li><li><strong>Subtle color:</strong> One accent color used sparingly for headings or borders</li><li><strong>Easy scanning:</strong> Information organized so key details are found in seconds</li></ul>" },
      { heading: "Layout Options", content: "<p><strong>Single column:</strong> The safest, most ATS-friendly choice. Works for all industries and experience levels.</p><p><strong>Two-column:</strong> Modern and space-efficient. Use the sidebar for skills, languages, and contact info. Main column for experience and education.</p><p><strong>Sidebar layout:</strong> A slim sidebar (about 30% width) on the left or right can add visual interest while maintaining readability.</p>" },
      { heading: "Color Usage", content: "<p>A single accent color adds professionalism without distraction. Navy blue, dark teal, or burgundy are safe choices for most industries. Creative fields allow more color experimentation, but keep body text black or dark gray for readability.</p>" },
    ],
    relatedTopics: [
      { label: "Resume Font Guide", href: "/resume/font" },
      { label: "Resume Layout", href: "/resume/layout" },
      { label: "Resume Templates", href: "/resume-templates" },
    ],
  },
  sections: {
    title: "Resume Sections: What to Include & How to Order Them",
    metaTitle: "Resume Sections: Complete Guide to Structure & Order | Resumer",
    metaDescription: "Learn which sections to include on your resume and the optimal order for maximum impact.",
    subtitle: "The right sections in the right order make your resume scannable and effective.",
    sections: [
      { heading: "Essential Sections", content: "<ul><li><strong>Contact Information:</strong> Name, phone, email, LinkedIn, location</li><li><strong>Professional Summary/Objective:</strong> Your career snapshot</li><li><strong>Work Experience:</strong> Your professional history with achievements</li><li><strong>Education:</strong> Degrees, institutions, and relevant details</li><li><strong>Skills:</strong> Technical and interpersonal competencies</li></ul>" },
      { heading: "Optional Sections", content: "<ul><li>Certifications & Licenses</li><li>Languages</li><li>Projects</li><li>Volunteer Experience</li><li>Awards & Honors</li><li>Publications</li><li>Interests & Hobbies</li><li>References (only if requested)</li></ul>" },
      { heading: "Recommended Order", content: "<p>For experienced professionals: Contact > Summary > Experience > Skills > Education > Additional</p><p>For recent graduates: Contact > Objective/Summary > Education > Projects > Skills > Experience > Additional</p><p>For career changers: Contact > Summary > Skills > Relevant Experience > Education > Additional</p>" },
    ],
    relatedTopics: [
      { label: "How to Write a Resume", href: "/resume/how-to" },
      { label: "Resume Format", href: "/resume/format" },
      { label: "What to Include", href: "/resume/what-to-include" },
    ],
  },
  font: {
    title: "Best Fonts for a Resume in 2026",
    metaTitle: "Best Resume Fonts: Professional Choices for 2026 | Resumer",
    metaDescription: "Discover the best fonts for your resume. Professional, readable font choices that make a great impression on recruiters and ATS systems.",
    subtitle: "The right font enhances readability and professionalism. Choose wisely with this guide.",
    sections: [
      { heading: "Top Font Choices", content: "<ul><li><strong>Calibri:</strong> Modern default, highly readable, ATS-friendly</li><li><strong>Garamond:</strong> Classic serif, elegant, saves space</li><li><strong>Cambria:</strong> Professional serif designed for screen reading</li><li><strong>Helvetica:</strong> Clean sans-serif, universally respected</li><li><strong>Georgia:</strong> Readable serif with personality</li><li><strong>Arial:</strong> Universal sans-serif, safe choice</li><li><strong>Inter:</strong> Modern, open-source, excellent for digital screens</li></ul>" },
      { heading: "Font Size Guidelines", content: "<ul><li>Name: 16-20pt</li><li>Section headings: 12-14pt</li><li>Body text: 10-12pt</li><li>Keep consistent throughout the document</li></ul>" },
      { heading: "Fonts to Avoid", content: "<ul><li>Comic Sans, Papyrus, or novelty fonts</li><li>Overly decorative script fonts</li><li>Extremely thin or condensed fonts that are hard to read</li><li>Non-standard fonts that may not render on all systems</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Layout", href: "/resume/layout" },
      { label: "How a Resume Should Look", href: "/resume/look" },
      { label: "Resume Format", href: "/resume/format" },
    ],
  },
  layout: {
    title: "Resume Layout: Design Tips for an Effective Resume",
    metaTitle: "Resume Layout: Design Tips for Maximum Impact | Resumer",
    metaDescription: "Learn layout principles that make your resume easy to scan and visually appealing. Margins, spacing, columns, and more.",
    subtitle: "Great content in a poor layout gets overlooked. Here is how to design for impact.",
    sections: [
      { heading: "Layout Fundamentals", content: "<ul><li>Use consistent margins (0.5-1 inch on all sides)</li><li>Maintain visual hierarchy with font sizes and weights</li><li>Use line spacing of 1.0-1.15 for body text</li><li>Add extra spacing between sections for clear separation</li><li>Align all text consistently (left-aligned is standard)</li></ul>" },
      { heading: "Single vs. Multi-Column", content: "<p>Single-column layouts are the safest for ATS and work for any industry. Two-column layouts are more modern and can fit more content, but test ATS compatibility. Use a sidebar column for skills, languages, and contact info.</p>" },
      { heading: "Visual Elements", content: "<ul><li>Use horizontal lines or subtle dividers between sections</li><li>Bold key terms like job titles and company names</li><li>Use consistent bullet styles throughout</li><li>Consider subtle color accents for headings</li><li>Avoid photos, graphics, and charts unless in creative fields</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Font", href: "/resume/font" },
      { label: "How a Resume Should Look", href: "/resume/look" },
      { label: "Resume Templates", href: "/resume-templates" },
    ],
  },
  chronological: {
    title: "Chronological Resume: Format, Examples & Template",
    metaTitle: "Chronological Resume Format: Complete Guide | Resumer",
    metaDescription: "The chronological resume is the most popular format. Learn how to structure one, with examples and templates.",
    subtitle: "The most widely used and recruiter-preferred resume format explained in detail.",
    sections: [
      { heading: "What Is a Chronological Resume?", content: "<p>A chronological resume (technically reverse-chronological) lists your work experience starting from the most recent position and working backward. It is the standard format that most recruiters expect and is highly compatible with ATS systems.</p>" },
      { heading: "Structure", content: "<ol><li>Contact Information</li><li>Professional Summary</li><li>Work Experience (most recent first)</li><li>Education</li><li>Skills</li><li>Additional Sections</li></ol>" },
      { heading: "Best For", content: "<ul><li>Candidates with a consistent work history</li><li>Those staying in the same industry</li><li>Job seekers with clear career progression</li><li>Most professional situations</li></ul>" },
    ],
    relatedTopics: [
      { label: "Functional Resume", href: "/resume/functional" },
      { label: "Combination Resume", href: "/resume/chrono-functional" },
      { label: "Resume Format Guide", href: "/resume/format" },
    ],
  },
  functional: {
    title: "Functional Resume: When & How to Use This Format",
    metaTitle: "Functional Resume Format: When to Use It | Resumer",
    metaDescription: "Learn when a functional resume is the right choice and how to create one that works for career changers and those with employment gaps.",
    subtitle: "The skills-based format that puts abilities front and center. Use it wisely.",
    sections: [
      { heading: "What Is a Functional Resume?", content: "<p>A functional resume organizes your qualifications by skill category rather than by employment history. Work experience is typically listed briefly at the bottom without detailed descriptions.</p>" },
      { heading: "When to Use It", content: "<ul><li>Changing careers to a completely different field</li><li>Re-entering the workforce after a long gap</li><li>Freelancers with project-based experience across many clients</li><li>Military personnel transitioning to civilian careers</li></ul>" },
      { heading: "Important Caveats", content: "<p>Many recruiters are skeptical of functional resumes because they can hide work history issues. Modern ATS systems may also struggle to parse them correctly. Consider using a combination format instead, which highlights skills while still providing clear work history.</p>" },
    ],
    relatedTopics: [
      { label: "Chronological Resume", href: "/resume/chronological" },
      { label: "Combination Resume", href: "/resume/chrono-functional" },
      { label: "Resume Format Guide", href: "/resume/format" },
    ],
  },
  "chrono-functional": {
    title: "Combination Resume: The Best of Both Formats",
    metaTitle: "Combination Resume Format: How to Write a Hybrid Resume | Resumer",
    metaDescription: "The combination resume merges skills emphasis with chronological work history. Learn how to use this versatile format.",
    subtitle: "Merge a skills showcase with clear work history for a powerful, versatile resume.",
    sections: [
      { heading: "What Is a Combination Resume?", content: "<p>A combination (hybrid) resume features a prominent skills or qualifications section at the top, followed by a traditional reverse-chronological work history. This format lets you emphasize your most relevant abilities while still providing the work timeline that recruiters need.</p>" },
      { heading: "Structure", content: "<ol><li>Contact Information</li><li>Professional Summary</li><li>Core Competencies/Key Skills</li><li>Work Experience</li><li>Education</li><li>Additional Sections</li></ol>" },
      { heading: "When to Use It", content: "<ul><li>You have 10+ years of diverse experience</li><li>Applying for roles that require specific competencies</li><li>Transitioning between related fields</li><li>Technical or specialized positions</li></ul>" },
    ],
    relatedTopics: [
      { label: "Chronological Resume", href: "/resume/chronological" },
      { label: "Functional Resume", href: "/resume/functional" },
      { label: "Resume Format Guide", href: "/resume/format" },
    ],
  },
  targeted: {
    title: "How to Write a Targeted Resume",
    metaTitle: "Targeted Resume: How to Tailor Your Resume for Each Job | Resumer",
    metaDescription: "Learn how to customize your resume for specific job applications to maximize your chances of getting interviews.",
    subtitle: "A tailored resume dramatically increases your interview chances. Here is the step-by-step process.",
    sections: [
      { heading: "What Is a Targeted Resume?", content: "<p>A targeted resume is customized for a specific job posting. Rather than sending the same generic resume to every employer, you modify your content to match the particular requirements, keywords, and priorities of each role.</p>" },
      { heading: "How to Tailor Your Resume", content: "<ul><li>Read the job description carefully and identify key requirements</li><li>Adjust your professional summary to address the role specifically</li><li>Reorder skills to match the job's priorities</li><li>Emphasize relevant experience and de-emphasize less relevant roles</li><li>Mirror the language and terminology used in the posting</li><li>Include specific achievements related to the role's requirements</li></ul>" },
      { heading: "Is It Worth the Effort?", content: "<p>Studies show that tailored resumes receive 2-3x more interview invitations than generic ones. While it takes more time, the dramatically higher success rate makes it worthwhile for positions you truly want.</p>" },
    ],
    relatedTopics: [
      { label: "Resume Keywords", href: "/resume/keywords" },
      { label: "ATS Resume Tips", href: "/resume/ats" },
      { label: "Resume Summary", href: "/resume/summary" },
    ],
  },
  general: {
    title: "How to Write a General Resume",
    metaTitle: "General Resume: A Versatile Resume for Broad Job Search | Resumer",
    metaDescription: "Create a flexible general resume suitable for applying to multiple types of positions. Tips for broad appeal.",
    subtitle: "A well-crafted general resume works across multiple job applications while maintaining impact.",
    sections: [
      { heading: "When a General Resume Works", content: "<p>A general resume is useful when you are exploring opportunities across similar roles, attending job fairs, networking, or uploading to job boards. It presents your qualifications broadly without targeting a specific position.</p>" },
      { heading: "Tips for a Strong General Resume", content: "<ul><li>Write a summary that highlights versatile skills and experience</li><li>Focus on transferable achievements applicable to many roles</li><li>Include a broad but relevant skills section</li><li>Use industry-standard terminology</li><li>Keep the format clean and professional</li></ul>" },
      { heading: "Limitations", content: "<p>While convenient, a general resume will always be less effective than a targeted one for specific applications. Use it as a base that you customize when applying to positions you are serious about.</p>" },
    ],
    relatedTopics: [
      { label: "Targeted Resume", href: "/resume/targeted" },
      { label: "Resume Format", href: "/resume/format" },
      { label: "How to Write a Resume", href: "/resume/how-to" },
    ],
  },
  "two-page": {
    title: "Two-Page Resume: When It's Appropriate & How to Format It",
    metaTitle: "Two-Page Resume: When to Use One & How to Format | Resumer",
    metaDescription: "Is a two-page resume okay? Learn when it makes sense and formatting best practices for multi-page resumes.",
    subtitle: "Sometimes one page is not enough. Here is when and how to extend to two pages.",
    sections: [
      { heading: "When Two Pages Are Appropriate", content: "<ul><li>You have 10+ years of relevant professional experience</li><li>You are in a senior or executive position</li><li>The role requires extensive technical skills or certifications</li><li>You have significant publications, patents, or research</li><li>Your industry expects detailed resumes (academia, federal jobs)</li></ul>" },
      { heading: "Formatting Tips", content: "<ul><li>Put your most important information on page one</li><li>Include your name and page number on page two</li><li>Do not pad with filler content just to fill the second page</li><li>Use consistent formatting across both pages</li><li>Keep margins and spacing uniform</li></ul>" },
      { heading: "Common Mistakes", content: "<ul><li>Spreading thin content across two pages (looks padded)</li><li>Orphaning just a few lines on page two</li><li>Including irrelevant early-career positions</li><li>Repeating information across pages</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Length Guide", href: "/resume/length" },
      { label: "Resume Format", href: "/resume/format" },
      { label: "Resume Sections", href: "/resume/sections" },
    ],
  },
  "best-templates": {
    title: "Best Resume Templates for 2026",
    metaTitle: "Best Resume Templates for 2026 (Expert-Picked) | Resumer",
    metaDescription: "Our career experts picked the best resume templates for every industry and career stage. Find your perfect template.",
    subtitle: "Handpicked by career experts and tested with real recruiters. Find the template that fits your career.",
    sections: [
      { heading: "What Makes a Great Template", content: "<ul><li>ATS-compatible formatting that machines can read</li><li>Clean, professional design that humans appreciate</li><li>Proper hierarchy with clear section separation</li><li>Customizable colors and fonts</li><li>Appropriate for your industry and career level</li></ul>" },
      { heading: "Top Picks by Category", content: "<p><strong>Best Overall:</strong> Toronto - Clean, professional, works for any industry</p><p><strong>Best Modern:</strong> Stockholm - Contemporary design with subtle creativity</p><p><strong>Best Creative:</strong> Milan - Visual flair without sacrificing readability</p><p><strong>Best Simple:</strong> Copenhagen - Minimalist elegance that lets content shine</p><p><strong>Best Executive:</strong> Monaco - Sophisticated design for senior professionals</p>" },
      { heading: "How to Choose", content: "<ul><li>Consider your industry (conservative vs. creative)</li><li>Match the template style to the company culture</li><li>Ensure the layout fits your content volume</li><li>Test with an ATS checker before submitting</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Templates", href: "/resume-templates" },
      { label: "Simple Templates", href: "/resume/simple-templates" },
      { label: "Modern Templates", href: "/resume/modern-templates" },
    ],
  },
  "simple-templates": {
    title: "Simple Resume Templates: Clean & Effective Designs",
    metaTitle: "Simple Resume Templates: Clean Designs That Work | Resumer",
    metaDescription: "Minimalist resume templates that let your content shine. Clean designs that are ATS-friendly and recruiter-approved.",
    subtitle: "Sometimes less is more. Clean, simple templates that put your qualifications center stage.",
    sections: [
      { heading: "Why Simple Works", content: "<p>Simple templates are the most ATS-friendly, easiest to customize, and most universally appropriate across industries. They work because they remove visual distractions and let recruiters focus on your content.</p>" },
      { heading: "Our Top Simple Templates", content: "<ul><li><strong>Copenhagen:</strong> Ultra-clean single-column layout</li><li><strong>Edinburgh:</strong> Classic design with subtle dividers</li><li><strong>Lisbon:</strong> Minimalist with clean typography</li><li><strong>Oslo:</strong> Balanced whitespace with elegant spacing</li></ul>" },
      { heading: "When to Choose Simple", content: "<ul><li>Traditional or conservative industries (finance, law, government)</li><li>When ATS compatibility is critical</li><li>When you want your content to do the talking</li><li>Senior positions where professionalism matters most</li></ul>" },
    ],
    relatedTopics: [
      { label: "Best Templates", href: "/resume/best-templates" },
      { label: "Modern Templates", href: "/resume/modern-templates" },
      { label: "Resume Templates", href: "/resume-templates" },
    ],
  },
  "modern-templates": {
    title: "Modern Resume Templates: Contemporary Designs",
    metaTitle: "Modern Resume Templates: Contemporary Designs for 2026 | Resumer",
    metaDescription: "Stand out with modern resume templates featuring creative layouts, color accents, and contemporary design elements.",
    subtitle: "Contemporary designs that balance visual appeal with professional formatting.",
    sections: [
      { heading: "What Makes a Template Modern", content: "<ul><li>Two-column or sidebar layouts</li><li>Accent colors and subtle design elements</li><li>Clean sans-serif typography</li><li>Visual skill indicators or infographic elements</li><li>Professional yet distinctive appearance</li></ul>" },
      { heading: "Our Top Modern Templates", content: "<ul><li><strong>Stockholm:</strong> Bold header with two-column body</li><li><strong>Berlin:</strong> Sidebar layout with icon integration</li><li><strong>Sydney:</strong> Full-width sections with color bands</li><li><strong>Tokyo:</strong> Asymmetric layout with modern typography</li></ul>" },
      { heading: "Best For", content: "<ul><li>Tech companies and startups</li><li>Marketing, design, and creative roles</li><li>Companies with modern employer branding</li><li>Positions where visual presentation matters</li></ul>" },
    ],
    relatedTopics: [
      { label: "Best Templates", href: "/resume/best-templates" },
      { label: "Simple Templates", href: "/resume/simple-templates" },
      { label: "Resume Templates", href: "/resume-templates" },
    ],
  },
  "cv-vs-resume": {
    title: "CV vs Resume: What's the Difference?",
    metaTitle: "CV vs Resume: Key Differences & When to Use Each | Resumer",
    metaDescription: "Understand the key differences between a CV and a resume. Learn when to use each document and how they differ by region.",
    subtitle: "Two documents, different purposes. Understand when to use a CV versus a resume.",
    sections: [
      { heading: "Key Differences", content: "<p><strong>Resume:</strong> A concise 1-2 page document tailored to a specific job. Focuses on relevant experience and skills. Used in the US, Canada, and most of the private sector worldwide.</p><p><strong>CV (Curriculum Vitae):</strong> A comprehensive document of unlimited length covering your entire academic and professional history. Used for academic, research, and medical positions, as well as standard practice in many countries outside the US.</p>" },
      { heading: "When to Use Each", content: "<ul><li><strong>Use a resume for:</strong> Private sector jobs in the US/Canada, most corporate positions, any job that asks for a \"resume\"</li><li><strong>Use a CV for:</strong> Academic positions, research roles, medical careers, international applications (UK, Europe, Asia), fellowships and grants, any position that specifically requests a CV</li></ul>" },
      { heading: "Regional Differences", content: "<p>In the UK, Ireland, and many European countries, \"CV\" is the standard term for what Americans call a resume. In these regions, a CV is typically 1-2 pages and equivalent to an American resume. When in doubt, follow the conventions of the country where you are applying.</p>" },
    ],
    relatedTopics: [
      { label: "How to Write a Resume", href: "/resume/how-to" },
      { label: "CV Guide", href: "/cv" },
      { label: "Resume Format", href: "/resume/format" },
    ],
  },
  "pdf-doc": {
    title: "Resume File Format: PDF vs DOCX",
    metaTitle: "Resume PDF vs DOCX: Which Format to Submit | Resumer",
    metaDescription: "Should you submit your resume as a PDF or Word document? Learn the pros and cons of each format.",
    subtitle: "The file format you choose can affect how your resume is displayed and processed.",
    sections: [
      { heading: "PDF Advantages", content: "<ul><li>Preserves formatting exactly as designed</li><li>Looks the same on every device and operating system</li><li>Cannot be accidentally edited by recipients</li><li>Most modern ATS systems can parse PDFs effectively</li></ul>" },
      { heading: "DOCX Advantages", content: "<ul><li>Some older ATS systems prefer .docx format</li><li>Easy for recruiters to copy text or add notes</li><li>Required by some job application systems</li><li>Smaller file size in most cases</li></ul>" },
      { heading: "Best Practice", content: "<p>Submit as PDF unless the job posting specifically requests a Word document. If a system allows both, PDF is the safer choice for preserving your layout and design. Always have both versions ready.</p>" },
    ],
    relatedTopics: [
      { label: "ATS Resume Tips", href: "/resume/ats" },
      { label: "Resume Format", href: "/resume/format" },
      { label: "How to Write a Resume", href: "/resume/how-to" },
    ],
  },
  "what-to-include": {
    title: "What to Include on a Resume",
    metaTitle: "What to Include on a Resume: Complete Checklist | Resumer",
    metaDescription: "A comprehensive checklist of what to include on your resume and what to leave off. Essential and optional sections covered.",
    subtitle: "Know exactly what belongs on your resume and what to leave out.",
    sections: [
      { heading: "Must-Have Sections", content: "<ul><li>Contact information (name, phone, email, LinkedIn)</li><li>Professional summary or objective</li><li>Work experience with achievements</li><li>Education</li><li>Relevant skills</li></ul>" },
      { heading: "Recommended Additions", content: "<ul><li>Certifications and licenses</li><li>Languages spoken</li><li>Relevant projects</li><li>Volunteer experience</li><li>Awards and honors</li></ul>" },
      { heading: "What to Leave Off", content: "<ul><li>Personal photo (in the US)</li><li>Date of birth or age</li><li>Marital status</li><li>Social security number</li><li>Full mailing address (city/state is enough)</li><li>Salary history or expectations</li><li>\"References available upon request\"</li><li>Irrelevant work experience from decades ago</li></ul>" },
    ],
    relatedTopics: [
      { label: "Resume Sections", href: "/resume/sections" },
      { label: "How to Write a Resume", href: "/resume/how-to" },
      { label: "Resume Length", href: "/resume/length" },
    ],
  },
};

const ALL_TOPIC_SLUGS = Object.keys(TOPICS);

interface PageProps {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  // Cap pre-rendered topics so the Hobby tier deployment stays under size
  // limit; remaining topics are generated on-demand (ISR).
  return ALL_TOPIC_SLUGS.slice(0, 8).map((topic) => ({ topic }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const data = TOPICS[topic];
  if (!data) return { title: "Resume Guide Not Found" };
  return {
    title: data.metaTitle,
    description: data.metaDescription,
  };
}

export default async function ResumeTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const data = TOPICS[topic];

  if (!data) {
    notFound();
  }

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Home</Link>
            <span>/</span>
            <Link href="/resume" className="hover:text-[#0D47A1]">Resume</Link>
            <span>/</span>
            <span className="text-gray-900">{data.title.split(":")[0]}</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">{data.subtitle}</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-a:text-[#0D47A1] prose-a:no-underline hover:prose-a:underline">
          {data.sections.map((section, idx) => (
            <section key={idx}>
              <h2>{section.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          ))}
        </div>

        {data.relatedTopics.length > 0 && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="text-xl font-bold text-gray-900">Related Guides</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {data.relatedTopics.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#0D47A1]/30 hover:text-[#0D47A1]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Create your resume now</h2>
          <p className="mt-4 text-lg text-gray-600">
            Apply these tips with our easy-to-use builder. Expert guidance at every step.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/resume-builder">Build your resume</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
