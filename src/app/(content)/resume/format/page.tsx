import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "Resume Format: How to Choose the Best Format in 2026 | Resumer",
  description: "Learn about the three main resume formats: chronological, functional, and combination. Find which format works best for your career stage.",
};

export default function ResumeFormatPage() {
  return (
    <ArticlePage
      breadcrumbs={[
        { label: "Resume", href: "/resume" },
        { label: "Resume Format" },
      ]}
      title="Resume Format Guide"
      subtitle="Choosing the right resume format is the foundation of an effective resume. Learn about the three main formats and when to use each one."
      lastUpdated="March 2026"
      readTime="10 min"
      toc={[
        { id: "overview", title: "Format Overview" },
        { id: "chronological", title: "Chronological Format" },
        { id: "functional", title: "Functional Format" },
        { id: "combination", title: "Combination Format" },
        { id: "which-to-choose", title: "Which Format to Choose" },
        { id: "formatting-tips", title: "General Formatting Tips" },
      ]}
      sections={[
        {
          id: "overview",
          title: "Understanding Resume Formats",
          content: `<p>A resume format refers to the way you organize and present your information. The right format helps recruiters find the details they need quickly while showcasing your strongest qualifications.</p>
            <p>There are three primary resume formats:</p>
            <ul>
              <li><strong>Reverse-Chronological</strong> - Most popular, lists experience by date</li>
              <li><strong>Functional (Skills-Based)</strong> - Emphasizes skills over timeline</li>
              <li><strong>Combination (Hybrid)</strong> - Merges skills emphasis with work history</li>
            </ul>`,
        },
        {
          id: "chronological",
          title: "Reverse-Chronological Resume Format",
          content: `<p>The reverse-chronological format is the gold standard of resumes. It organizes your work experience starting with the most recent position and working backward.</p>
            <p><strong>Best for:</strong></p>
            <ul>
              <li>Professionals with a clear career progression</li>
              <li>Those staying in the same industry or role type</li>
              <li>Anyone with no significant employment gaps</li>
            </ul>
            <p><strong>Section order:</strong> Contact Info, Summary, Work Experience, Education, Skills, Additional Sections</p>
            <p>This format is preferred by 90% of recruiters and is the most ATS-friendly option.</p>`,
        },
        {
          id: "functional",
          title: "Functional (Skills-Based) Resume Format",
          content: `<p>The functional format groups your qualifications by skill category rather than by job. Work history is typically included in a brief section at the bottom.</p>
            <p><strong>Best for:</strong></p>
            <ul>
              <li>Career changers entering a new field</li>
              <li>Individuals with significant employment gaps</li>
              <li>Recent graduates with limited experience</li>
              <li>Freelancers with diverse project experience</li>
            </ul>
            <p><strong>Important note:</strong> Many recruiters are skeptical of functional resumes because they can obscure work history. Use this format only when your circumstances clearly warrant it.</p>`,
        },
        {
          id: "combination",
          title: "Combination (Hybrid) Resume Format",
          content: `<p>The combination format features a prominent skills section followed by a standard reverse-chronological work history. It offers the best of both worlds.</p>
            <p><strong>Best for:</strong></p>
            <ul>
              <li>Experienced professionals with diverse skills</li>
              <li>Those applying for roles that require specific competencies</li>
              <li>Professionals with 10+ years of relevant experience</li>
              <li>Technical roles requiring specific tool proficiency</li>
            </ul>
            <p><strong>Section order:</strong> Contact Info, Summary, Key Skills/Competencies, Work Experience, Education, Additional Sections</p>`,
        },
        {
          id: "which-to-choose",
          title: "How to Choose the Right Format",
          content: `<p>Consider these factors when choosing your format:</p>
            <ul>
              <li><strong>Your experience level:</strong> Entry-level candidates often benefit from the combination format, while experienced professionals do well with chronological.</li>
              <li><strong>Your career path:</strong> Consistent career progression favors chronological; career changes favor functional or combination.</li>
              <li><strong>The job requirements:</strong> Technical roles may benefit from a prominent skills section (combination), while traditional industries prefer chronological.</li>
              <li><strong>ATS compatibility:</strong> Chronological and combination formats perform best with ATS software.</li>
            </ul>
            <p>When in doubt, choose the reverse-chronological format. It's the safest, most widely accepted choice.</p>`,
        },
        {
          id: "formatting-tips",
          title: "General Formatting Best Practices",
          content: `<ul>
              <li><strong>Margins:</strong> Use 0.5-1 inch margins on all sides</li>
              <li><strong>Font size:</strong> 10-12pt for body text, 14-16pt for your name</li>
              <li><strong>Font choice:</strong> Professional, readable fonts like Calibri, Arial, or Garamond</li>
              <li><strong>Spacing:</strong> Single or 1.15 line spacing with extra space between sections</li>
              <li><strong>Consistency:</strong> Use the same bullet style, heading format, and date format throughout</li>
              <li><strong>File format:</strong> Save as PDF unless instructed otherwise</li>
              <li><strong>Length:</strong> 1 page for under 10 years experience, 2 pages maximum for senior roles</li>
            </ul>`,
        },
      ]}
      relatedLinks={[
        { label: "How to Write a Resume", href: "/resume/how-to" },
        { label: "Chronological Resume", href: "/resume/chronological" },
        { label: "Functional Resume", href: "/resume/functional" },
        { label: "Combination Resume", href: "/resume/chrono-functional" },
        { label: "Resume Templates", href: "/resume-templates" },
      ]}
      ctaTitle="Start with the right format"
      ctaDescription="Our builder helps you pick the best format and guides you through every section. Get started in minutes."
      ctaButtonText="Build your resume"
      ctaButtonHref="/resume-builder"
    />
  );
}
