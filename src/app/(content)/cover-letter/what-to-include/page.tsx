import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "What to Include in a Cover Letter | Resumer",
  description: "A complete guide to what belongs in a cover letter. Essential elements, optional additions, and what to leave out.",
};

export default function WhatToIncludePage() {
  return (
    <ArticlePage
      breadcrumbs={[{ label: "Cover Letter", href: "/cover-letter" }, { label: "What to Include" }]}
      title="What to Include in a Cover Letter"
      subtitle="Every element of an effective cover letter explained, from the header to the sign-off."
      lastUpdated="March 2026"
      readTime="7 min"
      toc={[
        { id: "essentials", title: "Essential Elements" },
        { id: "content", title: "Content to Include" },
        { id: "avoid", title: "What to Avoid" },
      ]}
      sections={[
        { id: "essentials", title: "Essential Elements", content: "<ul><li>Your contact information and professional header</li><li>The date and recipient details</li><li>A personalized salutation</li><li>A hook that grabs attention in the first sentence</li><li>2-3 paragraphs connecting your skills to the job requirements</li><li>Specific examples with quantified results</li><li>A clear call to action</li><li>A professional sign-off</li></ul>" },
        { id: "content", title: "Content That Strengthens Your Letter", content: "<ul><li>Why you are interested in this specific company</li><li>How your experience solves their problems</li><li>Achievements relevant to the role with metrics</li><li>Soft skills demonstrated through examples</li><li>Knowledge of the company's recent news or challenges</li><li>Your availability and enthusiasm for next steps</li></ul>" },
        { id: "avoid", title: "What to Leave Out", content: "<ul><li>Your entire resume restated in paragraph form</li><li>Salary expectations (unless specifically asked)</li><li>Negative comments about previous employers</li><li>Personal information unrelated to the job</li><li>Generic phrases that could apply to any company</li><li>Typos or the wrong company name</li></ul>" },
      ]}
      relatedLinks={[
        { label: "How to Write a Cover Letter", href: "/cover-letter/how-to" },
        { label: "Cover Letter Format", href: "/cover-letter/format" },
        { label: "Cover Letter Tips", href: "/cover-letter/tips" },
      ]}
      ctaTitle="Include everything that matters"
      ctaDescription="Our builder guides you through each section so you never miss an important element."
      ctaButtonText="Build your cover letter"
      ctaButtonHref="/cover-letter-builder"
    />
  );
}
