import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAREER_TOPICS } from "@/lib/data/career-topics";
import { JOB_SEARCH_TOPICS } from "@/lib/data/job-search-topics";
import { INTERVIEW_TOPICS } from "@/lib/data/interview-topics";

export const metadata: Metadata = {
  title: "Блог Resumer: советы по карьере, поиску работы и собеседованиям",
  description:
    "Лучшие материалы о карьере, резюме, поиске работы и собеседованиях. Практические советы от экспертов индустрии — без воды.",
};

interface ArticleCard {
  title: string;
  intro: string;
  href: string;
  category: string;
  categoryColor: string;
}

const ARTICLES: ArticleCard[] = [
  // Career advice
  ...Object.values(CAREER_TOPICS).map((t) => ({
    title: t.title,
    intro: t.intro,
    href: `/career-advice/${t.slug}`,
    category: "Карьера",
    categoryColor: "bg-emerald-50 text-emerald-700",
  })),
  // Job search
  ...Object.values(JOB_SEARCH_TOPICS).map((t) => ({
    title: t.title,
    intro: t.intro,
    href: `/job-search/${t.slug}`,
    category: "Поиск работы",
    categoryColor: "bg-blue-50 text-blue-700",
  })),
  // Interviews
  ...Object.values(INTERVIEW_TOPICS).map((t) => ({
    title: t.title,
    intro: t.intro,
    href: `/job-interviews/${t.slug}`,
    category: "Собеседования",
    categoryColor: "bg-purple-50 text-purple-700",
  })),
];

const FEATURED = [ARTICLES[0], ARTICLES[6], ARTICLES[12]];
const REST = ARTICLES.slice(3).filter(
  (a) => !FEATURED.find((f) => f.href === a.href),
);

export default function BlogIndexPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">
              Главная
            </Link>
            <span>/</span>
            <span className="text-gray-900">Блог</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D47A1]/10">
              <BookOpen className="h-6 w-6 text-[#0D47A1]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Блог Resumer
              </h1>
              <p className="mt-1 text-gray-600">
                Практические материалы о карьере, поиске работы и собеседованиях.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Главные материалы
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {FEATURED.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                  <div className="flex h-full flex-col justify-between">
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${article.categoryColor}`}
                    >
                      {article.category}
                    </span>
                    <BookOpen className="h-12 w-12 text-[#0D47A1]/30" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#0D47A1]">
                    {article.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-gray-600">
                    {article.intro}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#0D47A1]">
                    Читать
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category navigation */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">По разделам</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/career-advice"
              className="group flex items-center justify-between rounded-xl border border-emerald-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
            >
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Карьера
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  Карьерные советы
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  6 материалов о развитии карьеры
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-emerald-700" />
            </Link>

            <Link
              href="/job-search"
              className="group flex items-center justify-between rounded-xl border border-blue-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md"
            >
              <div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Поиск работы
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  Стратегии поиска
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  6 материалов о поиске работы
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-blue-700" />
            </Link>

            <Link
              href="/job-interviews"
              className="group flex items-center justify-between rounded-xl border border-purple-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-purple-400 hover:shadow-md"
            >
              <div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  Собеседования
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  Подготовка и советы
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  7 материалов о собеседованиях
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-purple-700" />
            </Link>
          </div>
        </div>
      </section>

      {/* All articles */}
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Все материалы
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REST.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#0D47A1]/30 hover:shadow-md"
              >
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${article.categoryColor}`}
                >
                  {article.category}
                </span>
                <h3 className="mt-3 text-base font-semibold text-gray-900 transition-colors group-hover:text-[#0D47A1]">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-600">
                  {article.intro}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Готовы применить советы на практике?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Создайте резюме за минуты и получите больше приглашений.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/build-resume">Создать резюме</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
