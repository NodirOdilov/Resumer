import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "How to Write a Resume in 2026 (Step-by-Step Guide) | Resumer",
  description: "Learn how to write a resume step by step. Our comprehensive guide covers everything from choosing the right format to writing compelling bullet points.",
};

export default function HowToWriteResumePage() {
  return (
    <ArticlePage
      breadcrumbs={[
        { label: "Resume", href: "/resume" },
        { label: "How to Write a Resume" },
      ]}
      title="How to Write a Resume in 2026"
      subtitle="A complete step-by-step guide to creating a resume that gets you hired. From choosing the right format to writing compelling content."
      lastUpdated="March 2026"
      readTime="15 min"
      toc={[
        { id: "choose-format", title: "1. Choose the Right Format" },
        { id: "contact-info", title: "2. Add Contact Information" },
        { id: "summary", title: "3. Write a Summary" },
        { id: "work-experience", title: "4. Detail Work Experience" },
        { id: "education", title: "5. List Education" },
        { id: "skills", title: "6. Highlight Skills" },
        { id: "additional", title: "7. Additional Sections" },
        { id: "customize", title: "8. Customize for Each Job" },
        { id: "proofread", title: "9. Proofread & Review" },
        { id: "tips", title: "Expert Tips" },
      ]}
      sections={[
        {
          id: "choose-format",
          title: "1. Choose the Right Resume Format",
          content: `<p>The first step in writing a resume is selecting the right format. Your choice depends on your experience level, career stage, and the type of position you're targeting.</p>
            <ul>
              <li><strong>Reverse-Chronological:</strong> The most popular format. Lists your work experience starting with the most recent position. Best for candidates with a consistent work history in the same field.</li>
              <li><strong>Functional (Skills-Based):</strong> Focuses on skills and abilities rather than chronological work history. Ideal for career changers, new graduates, or those with employment gaps.</li>
              <li><strong>Combination (Hybrid):</strong> Merges both formats by highlighting key skills at the top followed by a chronological work history. Great for experienced professionals looking to emphasize specific competencies.</li>
            </ul>
            <p>For most job seekers, the reverse-chronological format is the safest choice, as it's the format recruiters are most familiar with and works best with Applicant Tracking Systems (ATS).</p>`,
        },
        {
          id: "contact-info",
          title: "2. Add Your Contact Information",
          content: `<p>Your contact information section should be clear and professional. Place it at the very top of your resume and include:</p>
            <ul>
              <li><strong>Full name</strong> in a larger font size</li>
              <li><strong>Phone number</strong> (one reliable number)</li>
              <li><strong>Professional email address</strong> (avoid novelty addresses)</li>
              <li><strong>Location</strong> (city and state are sufficient)</li>
              <li><strong>LinkedIn profile URL</strong> (customized if possible)</li>
              <li><strong>Portfolio or website</strong> (if relevant to your field)</li>
            </ul>
            <p>Avoid including your full mailing address, date of birth, marital status, or photo unless specifically requested by the employer or required by local customs.</p>`,
        },
        {
          id: "summary",
          title: "3. Write a Compelling Professional Summary",
          content: `<p>A professional summary is a 2-4 sentence overview at the top of your resume that highlights your most relevant qualifications. Think of it as your elevator pitch.</p>
            <p>An effective summary includes:</p>
            <ul>
              <li>Your professional title or area of expertise</li>
              <li>Years of relevant experience</li>
              <li>Key accomplishments or skills</li>
              <li>What you can bring to the role</li>
            </ul>
            <p><strong>Example:</strong> "Results-driven marketing manager with 8+ years of experience in digital marketing and brand management. Led campaigns generating $2M+ in revenue and grew social media following by 300%. Seeking to leverage data-driven marketing expertise at a growth-stage SaaS company."</p>`,
        },
        {
          id: "work-experience",
          title: "4. Detail Your Work Experience",
          content: `<p>Your work experience section is the heart of your resume. For each position, include:</p>
            <ul>
              <li>Job title</li>
              <li>Company name and location</li>
              <li>Dates of employment</li>
              <li>3-6 bullet points describing your responsibilities and achievements</li>
            </ul>
            <p>Use the <strong>PAR method</strong> (Problem-Action-Result) for your bullet points:</p>
            <ul>
              <li>Start with a strong action verb</li>
              <li>Describe what you did</li>
              <li>Quantify the result whenever possible</li>
            </ul>
            <p><strong>Strong example:</strong> "Redesigned the customer onboarding process, reducing churn by 25% and increasing customer satisfaction scores from 3.8 to 4.6 out of 5."</p>
            <p><strong>Weak example:</strong> "Responsible for customer onboarding."</p>`,
        },
        {
          id: "education",
          title: "5. List Your Education",
          content: `<p>Include your highest level of education with:</p>
            <ul>
              <li>Degree type and major/field of study</li>
              <li>University or institution name</li>
              <li>Graduation year (or expected graduation date)</li>
              <li>GPA if 3.5+ and you graduated within the last 3 years</li>
              <li>Relevant honors, awards, or coursework</li>
            </ul>
            <p>If you have significant work experience (10+ years), education can be brief. For recent graduates, this section can be more detailed and placed above work experience.</p>`,
        },
        {
          id: "skills",
          title: "6. Highlight Relevant Skills",
          content: `<p>Include a mix of hard skills (technical, measurable abilities) and soft skills (interpersonal qualities). Tailor this section to match the job description.</p>
            <p><strong>Tips for the skills section:</strong></p>
            <ul>
              <li>List 8-12 of your most relevant skills</li>
              <li>Mirror the exact language from the job posting</li>
              <li>Include both technical tools and methodologies</li>
              <li>Consider grouping skills by category for clarity</li>
              <li>Back up skills with evidence in your work experience bullets</li>
            </ul>`,
        },
        {
          id: "additional",
          title: "7. Add Additional Sections",
          content: `<p>Depending on your background, consider adding:</p>
            <ul>
              <li><strong>Certifications & Licenses:</strong> Especially important for regulated industries</li>
              <li><strong>Languages:</strong> If you speak multiple languages, list them with proficiency levels</li>
              <li><strong>Volunteer Experience:</strong> Shows character and can fill experience gaps</li>
              <li><strong>Projects:</strong> Particularly valuable for tech professionals and recent graduates</li>
              <li><strong>Publications & Presentations:</strong> Relevant for academic and research positions</li>
              <li><strong>Awards & Honors:</strong> Professional recognition that adds credibility</li>
            </ul>`,
        },
        {
          id: "customize",
          title: "8. Customize for Each Job Application",
          content: `<p>A generic resume rarely wins interviews. For each application:</p>
            <ul>
              <li>Analyze the job description for key requirements and keywords</li>
              <li>Adjust your professional summary to address specific needs</li>
              <li>Reorder your skills to match the job's priorities</li>
              <li>Emphasize relevant experience and achievements</li>
              <li>Use the same terminology as the job posting</li>
            </ul>
            <p>This customization is critical for passing ATS screening and showing recruiters you're a strong match for the specific role.</p>`,
        },
        {
          id: "proofread",
          title: "9. Proofread and Review",
          content: `<p>Errors on your resume can cost you the interview. Before submitting:</p>
            <ul>
              <li>Run spell check and grammar tools</li>
              <li>Read your resume aloud to catch awkward phrasing</li>
              <li>Ask a friend or mentor to review it</li>
              <li>Check for consistent formatting (fonts, spacing, bullet styles)</li>
              <li>Verify all dates, company names, and contact information</li>
              <li>Save as PDF to preserve formatting (unless the employer requests .docx)</li>
            </ul>`,
        },
        {
          id: "tips",
          title: "Expert Tips for a Standout Resume",
          content: `<ul>
              <li><strong>Keep it concise:</strong> One page for less than 10 years of experience; two pages for senior professionals</li>
              <li><strong>Use metrics:</strong> Numbers make your achievements concrete and memorable</li>
              <li><strong>Avoid pronouns:</strong> Don't use "I," "me," or "my"</li>
              <li><strong>Use white space:</strong> A clean layout with adequate margins improves readability</li>
              <li><strong>Choose a professional font:</strong> Stick to clean fonts like Calibri, Garamond, or Helvetica at 10-12pt</li>
              <li><strong>Be honest:</strong> Never lie or exaggerate on your resume</li>
              <li><strong>Include keywords:</strong> Use terms from the job description naturally throughout your resume</li>
            </ul>`,
        },
      ]}
      relatedLinks={[
        { label: "Resume Format Guide", href: "/resume/format" },
        { label: "Resume Skills Guide", href: "/resume/skills" },
        { label: "Resume Summary Examples", href: "/resume/summary" },
        { label: "Resume Templates", href: "/resume-templates" },
        { label: "Resume Examples", href: "/resume-examples" },
        { label: "ATS-Friendly Resume Tips", href: "/resume/ats" },
      ]}
      ctaTitle="Put these tips into action"
      ctaDescription="Our resume builder walks you through each step with expert guidance, AI-powered suggestions, and real-time preview."
      ctaButtonText="Build your resume now"
      ctaButtonHref="/resume-builder"
    />
  );
}
