import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "Cover Letter Tips: Expert Advice for 2026 | Resumer",
  description: "Expert cover letter tips to help you write a compelling letter. Proven strategies from hiring managers and career coaches.",
};

export default function CoverLetterTipsPage() {
  return (
    <ArticlePage
      breadcrumbs={[{ label: "Cover Letter", href: "/cover-letter" }, { label: "Tips" }]}
      title="Cover Letter Tips from Career Experts"
      subtitle="Proven strategies and expert advice to make your cover letter stand out from the competition."
      lastUpdated="March 2026"
      readTime="8 min"
      toc={[
        { id: "research", title: "Research First" },
        { id: "personalize", title: "Personalize Everything" },
        { id: "show-dont-tell", title: "Show, Do Not Tell" },
        { id: "common-mistakes", title: "Common Mistakes" },
      ]}
      sections={[
        { id: "research", title: "Start with Research", content: "<p>Before writing a single word, research the company thoroughly. Visit their website, read recent news, check their social media, and understand their culture and values. This knowledge allows you to write a letter that speaks directly to their needs.</p>" },
        { id: "personalize", title: "Personalize Every Letter", content: "<ul><li>Address it to a specific person</li><li>Reference the exact job title and where you found it</li><li>Mention something specific about the company that excites you</li><li>Connect your experience to their specific needs</li><li>Mirror their language and values</li></ul>" },
        { id: "show-dont-tell", title: "Show, Do Not Tell", content: "<p>Instead of saying you are a great communicator, describe a time you presented to a board of directors and secured $500K in funding. Specific stories are always more convincing than generic claims.</p>" },
        { id: "common-mistakes", title: "Common Mistakes to Avoid", content: "<ul><li>Using the same letter for every application</li><li>Focusing on what you want rather than what you offer</li><li>Writing more than one page</li><li>Starting with a generic opener</li><li>Including the wrong company name</li><li>Not proofreading for errors</li></ul>" },
      ]}
      relatedLinks={[
        { label: "How to Write a Cover Letter", href: "/cover-letter/how-to" },
        { label: "What to Include", href: "/cover-letter/what-to-include" },
        { label: "Cover Letter Examples", href: "/cover-letter-examples" },
      ]}
      ctaTitle="Apply these tips now"
      ctaDescription="Our AI-powered builder helps you implement every tip with real-time feedback."
      ctaButtonText="Create your cover letter"
      ctaButtonHref="/cover-letter-builder"
    />
  );
}
