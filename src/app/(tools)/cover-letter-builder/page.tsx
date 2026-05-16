import type { Metadata } from "next";
import { CoverLetterBuilderLanding } from "./CoverLetterBuilderLanding";

export const metadata: Metadata = {
  title: "Cover Letter Builder — Create Your Cover Letter Online | Resumer",
  description:
    "Create a compelling cover letter in minutes with Resumer. Professional templates, AI-powered writing assistance, and formatting that matches your resume. Free to start.",
  keywords: [
    "cover letter builder",
    "online cover letter builder",
    "cover letter maker",
    "professional cover letter",
    "cover letter templates",
    "free cover letter builder",
  ],
  openGraph: {
    title: "Cover Letter Builder — Resumer",
    description:
      "Create a compelling cover letter in minutes. Professional templates and AI-powered writing assistance.",
    type: "website",
    url: "https://resumer.com/cover-letter-builder",
  },
  alternates: {
    canonical: "https://resumer.com/cover-letter-builder",
  },
};

export default function CoverLetterBuilderPage() {
  return <CoverLetterBuilderLanding />;
}
