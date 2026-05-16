import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { RESUME_TEMPLATES } from "@/lib/data/templates";

export const metadata: Metadata = {
  title: "Free Resume Templates (Download & Customize) | Resumer",
  description: "Download free, professional resume templates. ATS-friendly designs available in multiple formats. No hidden costs.",
};

export default function FreeTemplatesPage() {
  const freeTemplates = RESUME_TEMPLATES.filter((t) => !t.isPremium);

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Home</Link>
            <span>/</span>
            <Link href="/resume" className="hover:text-[#0D47A1]">Resume</Link>
            <span>/</span>
            <span className="text-gray-900">Free Templates</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Free Resume Templates
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Download professional resume templates at no cost. Each template is ATS-tested,
            recruiter-approved, and easy to customize with our online builder.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <TemplateGrid templates={freeTemplates} basePath="/resume-builder" />
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Start with a free template</h2>
          <p className="mt-4 text-lg text-gray-600">
            Pick a template and start building. Our builder walks you through every section.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/resume-builder">Build your resume</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/resume/free-templates-word">Download for Word</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
