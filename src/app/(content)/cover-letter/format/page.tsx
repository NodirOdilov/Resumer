import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "Cover Letter Format: Structure & Layout Guide | Resumer",
  description: "Learn the proper cover letter format including structure, margins, fonts, and layout. Professional formatting for every industry.",
};

export default function CoverLetterFormatPage() {
  return (
    <ArticlePage
      breadcrumbs={[
        { label: "Cover Letter", href: "/cover-letter" },
        { label: "Cover Letter Format" },
      ]}
      title="Cover Letter Format Guide"
      subtitle="Proper formatting gives your cover letter a professional appearance and makes it easy to read."
      lastUpdated="March 2026"
      readTime="8 min"
      toc={[
        { id: "structure", title: "Standard Structure" },
        { id: "layout", title: "Layout & Spacing" },
        { id: "length", title: "Ideal Length" },
        { id: "file-format", title: "File Format" },
      ]}
      sections={[
        { id: "structure", title: "Standard Cover Letter Structure", content: "<p>A professional cover letter follows the standard business letter format:</p><ol><li><strong>Your contact information</strong> (top of page or in header)</li><li><strong>Date</strong></li><li><strong>Employer's contact information</strong></li><li><strong>Salutation</strong> (Dear Mr./Ms. Last Name)</li><li><strong>Opening paragraph</strong> (why you are writing)</li><li><strong>Body paragraph(s)</strong> (why you are qualified)</li><li><strong>Closing paragraph</strong> (call to action)</li><li><strong>Sign-off</strong> (Sincerely, Your Name)</li></ol>" },
        { id: "layout", title: "Layout and Spacing", content: "<ul><li>1-inch margins on all sides</li><li>Single spacing within paragraphs</li><li>One blank line between paragraphs</li><li>Left-aligned text (no justification)</li><li>Professional font: Calibri, Arial, or Georgia at 10-12pt</li><li>Match your resume's header design for consistency</li></ul>" },
        { id: "length", title: "Ideal Length", content: "<p>The ideal cover letter is 250-400 words, fitting on a single page. Hiring managers spend an average of 30-60 seconds reviewing a cover letter, so conciseness is key. Three to four paragraphs typically provide enough space to make your case effectively.</p>" },
        { id: "file-format", title: "File Format", content: "<p>Save your cover letter as a PDF to preserve formatting. Name it clearly: \"FirstName-LastName-Cover-Letter.pdf\". If the application system requires a specific format, follow their instructions. Some systems combine the cover letter with the resume into a single document.</p>" },
      ]}
      relatedLinks={[
        { label: "How to Write a Cover Letter", href: "/cover-letter/how-to" },
        { label: "What to Include", href: "/cover-letter/what-to-include" },
        { label: "Cover Letter Templates", href: "/cover-letter-templates" },
      ]}
      ctaTitle="Format your cover letter perfectly"
      ctaDescription="Our builder handles formatting automatically. Focus on your message while we handle the design."
      ctaButtonText="Create your cover letter"
      ctaButtonHref="/cover-letter-builder"
    />
  );
}
