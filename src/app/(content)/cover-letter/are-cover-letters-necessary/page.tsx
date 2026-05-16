import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "Are Cover Letters Necessary? When You Need One | Resumer",
  description: "Find out when a cover letter is required, recommended, or optional. Data-backed advice on when to include one with your application.",
};

export default function AreCoverLettersNecessaryPage() {
  return (
    <ArticlePage
      breadcrumbs={[
        { label: "Cover Letter", href: "/cover-letter" },
        { label: "Are Cover Letters Necessary?" },
      ]}
      title="Are Cover Letters Necessary?"
      subtitle="The honest answer: it depends. Here is when you absolutely need one and when you can skip it."
      lastUpdated="March 2026"
      readTime="6 min"
      toc={[
        { id: "when-required", title: "When Required" },
        { id: "when-optional", title: "When Optional" },
        { id: "when-skip", title: "When to Skip" },
        { id: "benefits", title: "Benefits of Writing One" },
      ]}
      sections={[
        { id: "when-required", title: "When a Cover Letter Is Required", content: "<ul><li>The job posting explicitly asks for one</li><li>The application system has a cover letter upload field</li><li>You are applying through email (attach it)</li><li>A recruiter or contact specifically requests it</li><li>You are applying to executive or senior positions</li><li>Academic and government positions almost always require one</li></ul>" },
        { id: "when-optional", title: "When It Is Optional but Recommended", content: "<ul><li>The posting says \"optional\" -- write one anyway to stand out</li><li>You have a referral or connection at the company</li><li>You are changing careers and need to explain the transition</li><li>You have employment gaps or other circumstances to address</li><li>You are applying to a competitive position</li></ul><p>Studies show that 83% of hiring managers say a good cover letter can convince them to interview a candidate whose resume alone would not have been enough.</p>" },
        { id: "when-skip", title: "When You Can Skip It", content: "<ul><li>The job posting explicitly says not to include one</li><li>The application system has no way to upload one</li><li>You are applying through LinkedIn Easy Apply with no attachment option</li><li>High-volume entry-level positions where cover letters are not reviewed</li></ul>" },
        { id: "benefits", title: "Benefits of Writing a Cover Letter", content: "<ul><li>Shows genuine interest in the specific company and role</li><li>Allows you to address concerns (gaps, career changes)</li><li>Demonstrates communication skills</li><li>Provides context that a resume cannot</li><li>Sets you apart from candidates who skip it</li></ul>" },
      ]}
      relatedLinks={[
        { label: "How to Write a Cover Letter", href: "/cover-letter/how-to" },
        { label: "Cover Letter Tips", href: "/cover-letter/tips" },
        { label: "Generic Cover Letter", href: "/cover-letter/generic" },
      ]}
      ctaTitle="Write a cover letter in minutes"
      ctaDescription="Our builder makes it fast and easy. AI suggestions help you write compelling content."
      ctaButtonText="Create your cover letter"
      ctaButtonHref="/cover-letter-builder"
    />
  );
}
