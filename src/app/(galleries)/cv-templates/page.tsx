import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { CV_TEMPLATES } from "@/lib/data/templates";

export const metadata: Metadata = {
  title: "Профессиональные шаблоны CV | Resumer",
  description:
    "Просмотрите более 24 профессиональных шаблонов CV для академических, исследовательских и международных позиций. Дизайн, оптимизированный для ATS, с одобренной экспертами вёрсткой.",
  keywords: [
    "шаблоны CV",
    "академическое CV",
    "научное CV",
    "международное CV",
    "ATS CV",
    "Resumer",
  ],
  openGraph: {
    title: "Профессиональные шаблоны CV | Resumer",
    description:
      "Просмотрите более 24 профессиональных шаблонов CV для академических, исследовательских и международных позиций.",
    type: "website",
  },
};

export default function CVTemplatesPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Шаблоны CV</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Профессиональные шаблоны CV
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Создайте подробное curriculum vitae с помощью наших экспертно разработанных шаблонов.
            Идеально подходят для академических должностей, исследовательских позиций и
            международных заявок.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <TemplateGrid templates={CV_TEMPLATES} basePath="/cv-builder" />
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Готовы создать своё CV?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Выберите шаблон и составьте подробное CV, которое продемонстрирует вашу полную
            профессиональную и академическую историю. Наш конструктор делает это просто.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/cv-builder">Начать создавать CV</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
