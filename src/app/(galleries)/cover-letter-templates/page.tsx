import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { COVER_LETTER_TEMPLATES } from "@/lib/data/templates";

export const metadata: Metadata = {
  title: "Профессиональные шаблоны сопроводительных писем | Resumer",
  description:
    "Просмотрите более 20 шаблонов сопроводительных писем, разработанных в дополнение к вашему резюме. Профессиональные, современные и креативные дизайны, которые производят отличное первое впечатление.",
  keywords: [
    "шаблоны сопроводительных писем",
    "сопроводительное письмо",
    "профессиональное письмо",
    "поиск работы",
    "Resumer",
  ],
  openGraph: {
    title: "Профессиональные шаблоны сопроводительных писем | Resumer",
    description:
      "Просмотрите более 20 шаблонов сопроводительных писем, разработанных в дополнение к вашему резюме.",
    type: "website",
  },
};

export default function CoverLetterTemplatesPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Шаблоны сопроводительных писем</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Профессиональные шаблоны сопроводительных писем
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Дополните своё резюме подходящим шаблоном сопроводительного письма. Наши дизайны
            созданы, чтобы производить сильное впечатление и помочь вам выделиться среди других
            кандидатов.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <TemplateGrid templates={COVER_LETTER_TEMPLATES} basePath="/cover-letter-builder" />
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Создайте сопроводительное письмо</h2>
          <p className="mt-4 text-lg text-gray-600">
            Выберите шаблон и составьте убедительное сопроводительное письмо за считанные минуты.
            Наш конструктор предоставляет рекомендации с учётом отрасли, чтобы помочь вам
            написать яркий текст.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/cover-letter-builder">Начать создавать сопроводительное письмо</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
