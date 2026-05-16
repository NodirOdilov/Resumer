import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "Generic Cover Letter: How to Write a Versatile Letter | Resumer",
  description: "Learn how to write a generic cover letter that can be quickly customized for multiple job applications.",
};

export default function GenericCoverLetterPage() {
  return (
    <ArticlePage
      breadcrumbs={[{ label: "Cover Letter", href: "/cover-letter" }, { label: "Generic Cover Letter" }]}
      title="How to Write a Generic Cover Letter"
      subtitle="A well-crafted generic cover letter serves as a versatile starting point for multiple applications."
      lastUpdated="March 2026"
      readTime="6 min"
      toc={[
        { id: "when-to-use", title: "When to Use One" },
        { id: "how-to-write", title: "How to Write One" },
        { id: "customizing", title: "Quick Customization" },
      ]}
      sections={[
        { id: "when-to-use", title: "When a Generic Letter Makes Sense", content: "<ul><li>Job fairs and networking events</li><li>Uploading to job boards that require a default cover letter</li><li>When you need a starting template to customize quickly</li><li>Speculative applications to companies without open positions</li></ul>" },
        { id: "how-to-write", title: "Writing a Strong Generic Letter", content: "<ul><li>Highlight transferable skills applicable across roles</li><li>Focus on your most impressive, broadly relevant achievements</li><li>Use industry-general language</li><li>Leave placeholders for easy customization</li><li>Write a flexible opening that works for various contexts</li></ul>" },
        { id: "customizing", title: "Quick Customization Tips", content: "<p>To convert your generic letter for a specific application in 5 minutes:</p><ol><li>Replace placeholders with the company and role name</li><li>Add one sentence about why this specific company interests you</li><li>Adjust the top achievement to match the primary requirement</li><li>Update the closing to reference the specific position</li></ol>" },
      ]}
      relatedLinks={[
        { label: "How to Write a Cover Letter", href: "/cover-letter/how-to" },
        { label: "Cover Letter Tips", href: "/cover-letter/tips" },
        { label: "Cover Letter Templates", href: "/cover-letter-templates" },
      ]}
      ctaTitle="Start with a smart template"
      ctaDescription="Our builder creates personalized letters in minutes with AI customization."
      ctaButtonText="Build your cover letter"
      ctaButtonHref="/cover-letter-builder"
    />
  );
}
