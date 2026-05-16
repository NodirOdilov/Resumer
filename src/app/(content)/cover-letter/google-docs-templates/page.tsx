import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { COVER_LETTER_TEMPLATES } from "@/lib/data/templates";

export const metadata: Metadata = {
  title: "Шаблоны сопроводительных писем для Google Docs | Resumer",
  description:
    "Бесплатные шаблоны сопроводительных писем для Google Docs. Профессиональные дизайны, готовые к использованию.",
};

export default function GoogleDocsTemplatesPage() {
  const templates = COVER_LETTER_TEMPLATES.filter((t) => !t.isPremium).slice(0, 8);

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">
              Главная
            </Link>
            <span>/</span>
            <Link href="/cover-letter" className="hover:text-[#0D47A1]">
              Сопроводительное
            </Link>
            <span>/</span>
            <span className="text-gray-900">Шаблоны для Google Docs</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Шаблоны сопроводительных писем для Google Docs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Бесплатные шаблоны сопроводительных писем, которые можно открыть и
            редактировать в нашем конструкторе, а затем экспортировать в DOCX
            для Google Docs.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                basePath="/build-letter"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Нужна AI-помощь в написании?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Наш конструктор предлагает AI-подсказки, которых нет в Google Docs.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/cover-letter-builder">
                Попробовать конструктор
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
