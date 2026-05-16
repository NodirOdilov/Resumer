import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { RESUME_TEMPLATES } from "@/lib/data/templates";

export const metadata: Metadata = {
  title: "Шаблоны резюме для Google Docs (бесплатно) | Resumer",
  description:
    "Бесплатные шаблоны резюме для редактирования в Google Docs. Профессиональные дизайны, которые можно скопировать и настроить.",
};

export default function GoogleDocsTemplatesPage() {
  const templates = RESUME_TEMPLATES.filter((t) => !t.isPremium).slice(0, 8);

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">
              Главная
            </Link>
            <span>/</span>
            <Link href="/resume" className="hover:text-[#0D47A1]">
              Резюме
            </Link>
            <span>/</span>
            <span className="text-gray-900">Шаблоны для Google Docs</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Шаблоны резюме для Google Docs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Профессиональные шаблоны резюме, оптимизированные для Google Docs.
            Все шаблоны бесплатные и совместимы с ATS-системами.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-8 rounded-xl bg-blue-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Как использовать шаблоны
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>
                Нажмите «Использовать шаблон» — откроется наш редактор с этим
                шаблоном
              </li>
              <li>Заполните свои данные с подсказками AI</li>
              <li>Скачайте готовое резюме в PDF</li>
              <li>
                Также можно экспортировать в DOCX и открыть в Google Docs для
                дальнейшего редактирования
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                basePath="/build-resume"
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/build-resume">Создать резюме сейчас</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
