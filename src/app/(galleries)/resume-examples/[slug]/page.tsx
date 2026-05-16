import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleDetail } from "@/components/examples/ExampleDetail";
import { RESUME_EXAMPLES } from "@/lib/data/examples";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render only the first 12 most popular examples at build time. The
// remaining ~270 are generated on-demand on first visit (ISR), which keeps
// the deployment well under Vercel Hobby's output-size limit.
export async function generateStaticParams() {
  return RESUME_EXAMPLES.slice(0, 12).map((example) => ({
    slug: example.slug,
  }));
}

// Allow ISR for any slug not pre-rendered above.
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = RESUME_EXAMPLES.find((e) => e.slug === slug);
  if (!example) return { title: "Пример резюме не найден" };

  return {
    title: `Пример: ${example.title} | Resumer`,
    description: `Посмотрите профессиональный пример «${example.title.toLowerCase()}» с экспертными советами и рекомендациями по оформлению. Используйте его как шаблон для собственного резюме.`,
    keywords: [
      "пример резюме",
      example.title.toLowerCase(),
      "профессиональное резюме",
      "образец резюме",
      "Resumer",
    ],
    openGraph: {
      title: `Пример: ${example.title} | Resumer`,
      description: `Профессиональный пример «${example.title.toLowerCase()}» с экспертными советами.`,
      type: "article",
    },
  };
}

export default async function ResumeExampleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const example = RESUME_EXAMPLES.find((e) => e.slug === slug);

  if (!example) {
    notFound();
  }

  const relatedExamples = RESUME_EXAMPLES.filter(
    (e) => e.category === example.category && e.slug !== example.slug
  ).slice(0, 4);

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <Link href="/resume-examples" className="hover:text-[#0D47A1]">Примеры резюме</Link>
            <span>/</span>
            <span className="text-gray-900">{example.title}</span>
          </nav>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <ExampleDetail
            title={example.title}
            slug={example.slug}
            category={example.category}
            experienceLevel={example.experienceLevel}
            templateUsed="Toronto"
            description={`Этот пример резюме «${example.title.toLowerCase()}» демонстрирует, как эффективно представить ваши квалификации, навыки и опыт. Он соответствует современным отраслевым стандартам и лучшим практикам совместимости с ATS.`}
            keyHighlights={[
              "Оформление и ключевые слова, оптимизированные под ATS",
              "Чёткая организация разделов с сильными глаголами действия",
              "Достижения в цифрах и измеримые результаты",
              "Профессиональное резюме, адаптированное под должность",
              "Релевантные навыки представлены на видном месте",
            ]}
            relatedExamples={relatedExamples}
            basePath="/resume-examples"
            builderPath={`/resume-builder?example=${example.slug}`}
          />
        </div>
      </section>
    </div>
  );
}
