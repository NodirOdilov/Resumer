import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "CV Format: How to Structure Your CV in 2026 | Resumer",
  description: "Learn the proper CV format for academic, research, and international applications. Covers structure, length, and formatting standards.",
};

export default function CVFormatPage() {
  return (
    <ArticlePage
      breadcrumbs={[
        { label: "CV", href: "/cv" },
        { label: "CV Format" },
      ]}
      title="CV Format Guide"
      subtitle="Proper formatting ensures your CV is professional, readable, and follows the conventions of your field."
      lastUpdated="March 2026"
      readTime="8 min"
      toc={[
        { id: "standard-format", title: "Standard CV Format" },
        { id: "length", title: "CV Length" },
        { id: "design", title: "Design & Typography" },
        { id: "by-field", title: "Format by Field" },
      ]}
      sections={[
        { id: "standard-format", title: "Standard CV Format", content: "<p>A standard academic CV follows a specific order of sections, though the exact arrangement may vary by field and country. The core format includes personal information at the top, followed by education, research, publications, and experience sections in reverse chronological order.</p><p>Unlike resumes, CVs prioritize completeness over brevity. Every relevant publication, presentation, and academic activity should be included.</p>" },
        { id: "length", title: "Appropriate CV Length", content: "<p>CV length varies based on career stage:</p><ul><li><strong>Graduate students:</strong> 2-4 pages</li><li><strong>Postdoctoral researchers:</strong> 3-6 pages</li><li><strong>Assistant professors:</strong> 5-10 pages</li><li><strong>Senior academics:</strong> 10+ pages</li></ul><p>There is no maximum length for a CV. Include everything relevant, but do not pad with unnecessary details.</p>" },
        { id: "design", title: "Design and Typography", content: "<ul><li>Use a professional serif or sans-serif font (11-12pt for body)</li><li>Maintain consistent heading hierarchy</li><li>Use generous margins (1 inch minimum)</li><li>Include page numbers with your name on each page</li><li>Use bold and italics consistently for titles and publications</li><li>Keep the design clean and academic in tone</li></ul>" },
        { id: "by-field", title: "Format Variations by Field", content: "<p><strong>Sciences:</strong> Emphasize grants, publications (by impact factor), and lab experience.</p><p><strong>Humanities:</strong> Prioritize publications, conference presentations, and teaching experience.</p><p><strong>Medicine:</strong> Include clinical training, board certifications, and CME credits.</p><p><strong>Industry (International):</strong> Keep to 2-3 pages, similar to an extended resume with skills emphasis.</p>" },
      ]}
      relatedLinks={[
        { label: "How to Write a CV", href: "/cv/how-to" },
        { label: "CV Templates", href: "/cv-templates" },
        { label: "CV vs Resume", href: "/resume/cv-vs-resume" },
      ]}
      ctaTitle="Format your CV perfectly"
      ctaDescription="Our builder handles formatting automatically so you can focus on your content."
      ctaButtonText="Build your CV"
      ctaButtonHref="/cv-builder"
    />
  );
}
