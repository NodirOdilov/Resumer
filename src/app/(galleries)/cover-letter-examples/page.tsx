import type { Metadata } from "next";
import Link from "next/link";
import { EXAMPLE_CATEGORIES } from "@/components/examples/categories";
import { ExampleGrid } from "@/components/examples/ExampleGrid";
import { COVER_LETTER_EXAMPLES } from "@/lib/data/examples";

export const metadata: Metadata = {
  title: "Профессиональные примеры сопроводительных писем для любой работы | Resumer",
  description:
    "Просмотрите примеры сопроводительных писем в 18 отраслях. Узнайте, как писать убедительные сопроводительные письма для любой должности и уровня опыта.",
  keywords: [
    "примеры сопроводительных писем",
    "образцы сопроводительных писем",
    "сопроводительное письмо",
    "поиск работы",
    "Resumer",
  ],
  openGraph: {
    title: "Профессиональные примеры сопроводительных писем для любой работы | Resumer",
    description: "Просмотрите примеры сопроводительных писем в 18 отраслях.",
    type: "website",
  },
};

export default function CoverLetterExamplesPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Примеры сопроводительных писем</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Профессиональные примеры сопроводительных писем
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Откройте для себя примеры сопроводительных писем, которые дополнят ваше резюме и
            произведут сильное впечатление. Каждый пример написан экспертами по карьере для
            конкретных должностей и отраслей.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Просмотр по категориям</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMPLE_CATEGORIES.map((cat) => {
              const exCount = COVER_LETTER_EXAMPLES.filter((e) => e.category === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0D47A1]/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0D47A1]/10 text-[#0D47A1]">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{exCount} примеров</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Все примеры сопроводительных писем</h2>
          <ExampleGrid examples={COVER_LETTER_EXAMPLES} basePath="/cover-letter-examples" />
        </div>
      </section>
    </div>
  );
}
