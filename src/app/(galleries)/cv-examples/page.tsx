import type { Metadata } from "next";
import Link from "next/link";
import { EXAMPLE_CATEGORIES } from "@/components/examples/categories";
import { ExampleGrid } from "@/components/examples/ExampleGrid";
import { CV_EXAMPLES } from "@/lib/data/examples";

export const metadata: Metadata = {
  title: "Профессиональные примеры CV для любой области | Resumer",
  description:
    "Просмотрите профессиональные примеры CV в 18 отраслях. Идеально подходят для академических, исследовательских и международных заявок. Используйте любой пример как отправную точку.",
  keywords: [
    "примеры CV",
    "образцы CV",
    "академическое CV",
    "научное CV",
    "международное CV",
    "Resumer",
  ],
  openGraph: {
    title: "Профессиональные примеры CV для любой области | Resumer",
    description: "Просмотрите профессиональные примеры CV в 18 отраслях.",
    type: "website",
  },
};

export default function CVExamplesPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Примеры CV</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Профессиональные примеры CV
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Изучите экспертно составленные примеры CV для академических, исследовательских и
            международных позиций. Каждый пример демонстрирует правильную структуру, содержание
            и оформление CV.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Просмотр по категориям</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMPLE_CATEGORIES.map((cat) => {
              const exCount = CV_EXAMPLES.filter((e) => e.category === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0D47A1]/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0D47A1]/10 text-[#0D47A1]">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Все примеры CV</h2>
          <ExampleGrid examples={CV_EXAMPLES} basePath="/cv-examples" />
        </div>
      </section>
    </div>
  );
}
