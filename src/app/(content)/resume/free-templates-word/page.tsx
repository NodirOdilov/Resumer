import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { RESUME_TEMPLATES } from "@/lib/data/templates";

export const metadata: Metadata = {
  title: "Бесплатные шаблоны резюме для Word (DOCX) | Resumer",
  description:
    "Скачайте бесплатные шаблоны резюме для Microsoft Word. DOCX-файлы, готовые к редактированию.",
};

export default function FreeTemplatesWordPage() {
  const freeTemplates = RESUME_TEMPLATES.filter((t) => !t.isPremium).slice(0, 12);

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
            <span className="text-gray-900">Бесплатные шаблоны для Word</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Бесплатные шаблоны резюме для Word
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Откройте любой шаблон в нашем конструкторе, заполните своими
            данными и экспортируйте в DOCX, чтобы продолжить редактирование в
            Microsoft Word.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {freeTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                basePath="/build-resume"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Лучше использовать онлайн-конструктор?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Получите live-предпросмотр, AI-подсказки и экспорт в PDF, DOCX или
            PNG в один клик.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/resume-builder">Попробовать конструктор</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
