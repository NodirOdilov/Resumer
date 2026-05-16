import type { Metadata } from "next";
import { CVBuilderLanding } from "./CVBuilderLanding";

export const metadata: Metadata = {
  title: "Professional CV Builder — Create Your CV Online | Resumer",
  description:
    "Build a comprehensive, professional CV in minutes with Resumer. Academic-ready templates, guided content, and PDF export. Ideal for academic, research, and international job applications.",
  keywords: [
    "CV builder",
    "online CV builder",
    "professional CV maker",
    "curriculum vitae builder",
    "academic CV",
    "CV templates",
  ],
  openGraph: {
    title: "Professional CV Builder — Resumer",
    description:
      "Build a comprehensive, professional CV in minutes. Academic-ready templates and guided content.",
    type: "website",
    url: "https://resumer.com/cv-builder",
  },
  alternates: {
    canonical: "https://resumer.com/cv-builder",
  },
};

export default function CVBuilderPage() {
  return <CVBuilderLanding />;
}
