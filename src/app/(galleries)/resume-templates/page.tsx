import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { RESUME_TEMPLATES } from "@/lib/data/templates";

export const metadata: Metadata = {
  title: "Профессиональные шаблоны резюме | Resumer",
  description:
    "Выберите из 28+ профессиональных шаблонов резюме, оптимизированных для ATS. Современные, креативные, простые и классические дизайны помогут вам получить работу мечты.",
  keywords: [
    "шаблоны резюме",
    "профессиональное резюме",
    "ATS резюме",
    "современные шаблоны",
    "креативные резюме",
    "Resumer",
  ],
  openGraph: {
    title: "Профессиональные шаблоны резюме | Resumer",
    description:
      "Выберите из 28+ профессиональных шаблонов резюме, оптимизированных для ATS. Современные, креативные, простые и классические дизайны.",
    type: "website",
  },
};

export default function ResumeTemplatesPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Шаблоны резюме</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Профессиональные шаблоны резюме
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Выбирайте из нашей коллекции шаблонов резюме, совместимых с ATS. Каждый шаблон
            разработан экспертами по карьере и менеджерами по найму, чтобы помочь вам создать
            резюме, которое заметят.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <TemplateGrid templates={RESUME_TEMPLATES} basePath="/resume-builder" />
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Готовы создать своё резюме?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Выберите шаблон и начните создавать профессиональное резюме за считанные минуты.
            Наш конструктор проведёт вас через каждый раздел с экспертными советами и подсказками
            на основе ИИ.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/resume-builder">Начать создавать резюме</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
