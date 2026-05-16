import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TopicSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface TopicData {
  slug: string;
  title: string;
  intro: string;
  hubSlug: string; // e.g. "career-advice", "job-search", "job-interviews"
  hubLabel: string; // e.g. "Карьерные советы"
  sections: TopicSection[];
  ctaTitle?: string;
  ctaText?: string;
  ctaButtonText?: string;
  ctaButtonHref?: string;
  relatedSlugs?: string[];
}

interface TopicPageProps {
  topic: TopicData;
  related?: { slug: string; title: string }[];
}

export function TopicPage({ topic, related }: TopicPageProps) {
  return (
    <div className="bg-white">
      {/* Breadcrumbs + Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">
              Главная
            </Link>
            <span>/</span>
            <Link href={`/${topic.hubSlug}`} className="hover:text-[#0D47A1]">
              {topic.hubLabel}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{topic.title}</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {topic.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            {topic.intro}
          </p>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12 lg:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
          {topic.sections.map((section, idx) => (
            <section
              key={idx}
              className={idx > 0 ? "mt-10" : ""}
              id={`section-${idx + 1}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-gray-700"
                  >
                    {p}
                  </p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#0D47A1]" />
                      <span className="text-base leading-relaxed text-gray-700">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {topic.ctaTitle || "Готовы сделать следующий шаг?"}
          </h2>
          <p className="mt-3 text-base text-gray-600">
            {topic.ctaText ||
              "Создайте резюме, которое произведёт впечатление на работодателей за минуты."}
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href={topic.ctaButtonHref || "/build-resume"}>
                {topic.ctaButtonText || "Создать резюме"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="border-t border-gray-100 py-12">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900">
              Похожие материалы
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${topic.hubSlug}/${r.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-[#0D47A1]/30 hover:shadow-md"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {r.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-[#0D47A1]" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
