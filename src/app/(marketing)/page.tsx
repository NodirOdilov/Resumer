import type { Metadata } from "next";
import {
  HeroSection,
  TrustpilotBadge,
  StepsSection,
  FeaturesSection,
  TemplateGallery,
  CoverLetterCTA,
  TestimonialsCarousel,
  FAQSection,
} from "@/components/marketing";

export const metadata: Metadata = {
  title: "Resumer — Professional Resume Builder | Create Your Resume Online",
  description:
    "Create a job-winning resume in minutes with Resumer. Professional templates, AI-powered suggestions, and ATS-friendly formatting. Build your resume, CV, or cover letter for free.",
  keywords: [
    "resume builder",
    "resume maker",
    "CV builder",
    "cover letter builder",
    "professional resume",
    "ATS-friendly resume",
    "resume templates",
    "online resume builder",
  ],
  openGraph: {
    title: "Resumer — Professional Resume Builder",
    description:
      "Create a job-winning resume in minutes. Professional templates, AI-powered suggestions, and ATS-friendly formatting.",
    type: "website",
    url: "https://resumer.com",
    siteName: "Resumer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resumer — Professional Resume Builder",
    description:
      "Create a job-winning resume in minutes. Professional templates, AI-powered suggestions, and ATS-friendly formatting.",
  },
  alternates: {
    canonical: "https://resumer.com",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustpilotBadge />
      <StepsSection />
      <FeaturesSection />
      <TemplateGallery />
      <CoverLetterCTA />
      <TestimonialsCarousel />
      <FAQSection />
    </>
  );
}
