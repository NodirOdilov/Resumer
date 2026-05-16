import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "How to Write a CV: Complete Guide for 2026 | Resumer",
  description: "Learn how to write a professional CV. Covers structure, content, formatting, and tips for academic and international applications.",
};

export default function HowToWriteCVPage() {
  return (
    <ArticlePage
      breadcrumbs={[
        { label: "CV", href: "/cv" },
        { label: "How to Write a CV" },
      ]}
      title="How to Write a CV in 2026"
      subtitle="A comprehensive guide to creating a curriculum vitae that showcases your full academic and professional history."
      lastUpdated="March 2026"
      readTime="12 min"
      toc={[
        { id: "what-is-cv", title: "What Is a CV?" },
        { id: "cv-structure", title: "CV Structure" },
        { id: "personal-info", title: "Personal Information" },
        { id: "academic-history", title: "Academic History" },
        { id: "research", title: "Research & Publications" },
        { id: "professional", title: "Professional Experience" },
        { id: "additional", title: "Additional Sections" },
        { id: "formatting", title: "Formatting Tips" },
      ]}
      sections={[
        { id: "what-is-cv", title: "What Is a CV?", content: "<p>A curriculum vitae (CV) is a comprehensive document that details your entire academic and professional history. Unlike a resume, which is typically 1-2 pages and tailored to a specific job, a CV can be any length and provides a complete overview of your career, education, research, publications, presentations, and other scholarly activities.</p><p>CVs are primarily used for academic positions, research roles, medical careers, and applications in many countries outside the United States.</p>" },
        { id: "cv-structure", title: "Standard CV Structure", content: "<ol><li>Personal/Contact Information</li><li>Academic History and Qualifications</li><li>Research Interests</li><li>Publications</li><li>Professional and Academic Experience</li><li>Teaching Experience</li><li>Grants and Fellowships</li><li>Awards and Honors</li><li>Presentations and Conferences</li><li>Professional Memberships</li><li>Skills and Languages</li><li>References</li></ol>" },
        { id: "personal-info", title: "Personal Information", content: "<p>Include your full name, title (Dr., Prof.), contact details, and professional online presence. For academic CVs, include your department and institutional affiliation. In many countries, it is standard to include a professional photo, date of birth, and nationality.</p>" },
        { id: "academic-history", title: "Academic History", content: "<p>List all degrees in reverse chronological order with:</p><ul><li>Degree type, field, and specialization</li><li>Institution name and location</li><li>Dates of attendance and completion</li><li>Thesis/dissertation title and advisor</li><li>Key honors or distinctions</li></ul>" },
        { id: "research", title: "Research and Publications", content: "<p>This is often the most important section of an academic CV. Include:</p><ul><li>Peer-reviewed journal articles</li><li>Books and book chapters</li><li>Conference proceedings</li><li>Working papers and preprints</li><li>Technical reports</li></ul><p>Format citations according to the conventions of your field (APA, MLA, Chicago, etc.).</p>" },
        { id: "professional", title: "Professional Experience", content: "<p>Include all relevant positions: faculty appointments, postdoctoral positions, research assistantships, industry roles, consulting work, and clinical positions. For each, describe your responsibilities, achievements, and notable contributions.</p>" },
        { id: "additional", title: "Additional Sections", content: "<ul><li><strong>Teaching:</strong> Courses taught, student evaluations, curriculum development</li><li><strong>Grants:</strong> Funded research with amounts and funding bodies</li><li><strong>Service:</strong> Committee work, editorial boards, peer review</li><li><strong>Mentoring:</strong> Graduate students supervised, thesis committees</li><li><strong>Media:</strong> Interviews, public engagement, science communication</li></ul>" },
        { id: "formatting", title: "Formatting Best Practices", content: "<ul><li>Use a clean, consistent layout throughout</li><li>Maintain reverse chronological order within each section</li><li>Use the same citation format consistently</li><li>Include page numbers for multi-page CVs</li><li>Update regularly as you achieve new milestones</li><li>Proofread meticulously for accuracy</li></ul>" },
      ]}
      relatedLinks={[
        { label: "CV Format Guide", href: "/cv/format" },
        { label: "CV Templates", href: "/cv-templates" },
        { label: "CV Examples", href: "/cv-examples" },
        { label: "CV vs Resume", href: "/resume/cv-vs-resume" },
      ]}
      ctaTitle="Build your CV"
      ctaDescription="Create a professional CV with our guided builder. Perfect for academic and international applications."
      ctaButtonText="Start your CV"
      ctaButtonHref="/cv-builder"
    />
  );
}
