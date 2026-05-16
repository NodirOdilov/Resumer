import type { Metadata } from "next";
import { ResumeBuilderLanding } from "./ResumeBuilderLanding";

export const metadata: Metadata = {
  title: "Professional Resume Builder — Create Your Resume Online | Resumer",
  description:
    "Build a professional, ATS-friendly resume in minutes with Resumer's resume builder. Choose from expert-designed templates, get AI-powered content suggestions, and download as PDF. Free to start.",
  keywords: [
    "resume builder",
    "online resume builder",
    "professional resume maker",
    "ATS-friendly resume",
    "resume creator",
    "free resume builder",
  ],
  openGraph: {
    title: "Professional Resume Builder — Resumer",
    description:
      "Build a professional, ATS-friendly resume in minutes. Expert-designed templates and AI-powered suggestions.",
    type: "website",
    url: "https://resumer.com/resume-builder",
  },
  alternates: {
    canonical: "https://resumer.com/resume-builder",
  },
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderLanding />;
}
