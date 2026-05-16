import type { Metadata } from "next";
import { ArticlePage } from "@/components/shared/ArticlePage";

export const metadata: Metadata = {
  title: "How to Write a Cover Letter (Step-by-Step Guide) | Resumer",
  description: "Learn how to write a cover letter that impresses hiring managers. Step-by-step instructions with examples for every industry.",
};

export default function HowToWriteCoverLetterPage() {
  return (
    <ArticlePage
      breadcrumbs={[
        { label: "Cover Letter", href: "/cover-letter" },
        { label: "How to Write a Cover Letter" },
      ]}
      title="How to Write a Cover Letter"
      subtitle="A step-by-step guide to writing cover letters that complement your resume and win interviews."
      lastUpdated="March 2026"
      readTime="12 min"
      toc={[
        { id: "header", title: "1. Header & Contact Info" },
        { id: "greeting", title: "2. Professional Greeting" },
        { id: "opening", title: "3. Compelling Opening" },
        { id: "body", title: "4. Body Paragraphs" },
        { id: "closing", title: "5. Strong Closing" },
        { id: "formatting", title: "Formatting Tips" },
      ]}
      sections={[
        { id: "header", title: "1. Set Up Your Header", content: "<p>Your cover letter header should match your resume for a polished, cohesive look. Include your full name, phone number, email, and the date. Below that, add the recipient's name, title, company name, and address.</p>" },
        { id: "greeting", title: "2. Write a Professional Greeting", content: "<p>Always address the letter to a specific person when possible. \"Dear [Hiring Manager's Name]\" is ideal. If you cannot find a name, \"Dear Hiring Manager\" or \"Dear [Department] Team\" are acceptable alternatives. Avoid outdated greetings like \"To Whom It May Concern\" or \"Dear Sir/Madam.\"</p>" },
        { id: "opening", title: "3. Craft a Compelling Opening", content: "<p>Your opening paragraph should grab attention immediately. Mention the specific position, how you learned about it, and one compelling reason why you are an excellent fit. Avoid generic openers like \"I am writing to apply for...\"</p><p><strong>Strong example:</strong> \"When I saw the Senior Product Manager opening at Acme Corp, I knew my experience launching three successful SaaS products with combined ARR of $12M made this a perfect match.\"</p>" },
        { id: "body", title: "4. Build Your Body Paragraphs", content: "<p>Use 1-2 paragraphs to demonstrate why you are the right candidate. Each paragraph should:</p><ul><li>Connect a specific requirement from the job posting to your experience</li><li>Provide concrete examples and quantified results</li><li>Show you understand the company's challenges or goals</li><li>Demonstrate skills that complement what is on your resume</li></ul><p>Do not simply repeat your resume. Instead, tell the story behind your accomplishments and explain how they are relevant to the new role.</p>" },
        { id: "closing", title: "5. End with a Strong Closing", content: "<p>Your closing paragraph should:</p><ul><li>Reiterate your enthusiasm for the role</li><li>Summarize why you are a great fit in one sentence</li><li>Include a clear call to action (request for interview)</li><li>Thank the reader for their time</li></ul><p>Sign off with \"Sincerely,\" \"Best regards,\" or \"Thank you,\" followed by your full name.</p>" },
        { id: "formatting", title: "Cover Letter Formatting Tips", content: "<ul><li>Keep it to one page (250-400 words)</li><li>Use the same font and header as your resume</li><li>Use 10-12pt font and 1-1.15 line spacing</li><li>Maintain 1-inch margins</li><li>Use standard business letter format</li><li>Save as PDF with a clear filename</li></ul>" },
      ]}
      relatedLinks={[
        { label: "Cover Letter Format", href: "/cover-letter/format" },
        { label: "Cover Letter Tips", href: "/cover-letter/tips" },
        { label: "Cover Letter Templates", href: "/cover-letter-templates" },
        { label: "Cover Letter Examples", href: "/cover-letter-examples" },
      ]}
      ctaTitle="Write your cover letter"
      ctaDescription="Our builder walks you through each section with AI-powered suggestions tailored to your industry."
      ctaButtonText="Create your cover letter"
      ctaButtonHref="/cover-letter-builder"
    />
  );
}
