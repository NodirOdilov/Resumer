import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleDetail } from "@/components/examples/ExampleDetail";
import { CV_EXAMPLES } from "@/lib/data/examples";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CV_EXAMPLES.slice(0, 12).map((example) => ({ slug: example.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = CV_EXAMPLES.find((e) => e.slug === slug);
  if (!example) return { title: "Пример CV не найден" };

  return {
    title: `Пример: ${example.title} | Resumer`,
    description: `Посмотрите профессиональный пример «${example.title.toLowerCase()}» с детально проработанными разделами и экспертным оформлением. Используйте его как шаблон для собственного CV.`,
    keywords: [
      "пример CV",
      example.title.toLowerCase(),
      "профессиональное CV",
      "образец CV",
      "Resumer",
    ],
    openGraph: {
      title: `Пример: ${example.title} | Resumer`,
      description: `Профессиональный пример «${example.title.toLowerCase()}» с экспертными советами.`,
      type: "article",
    },
  };
}

export default async function CVExampleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const example = CV_EXAMPLES.find((e) => e.slug === slug);

  if (!example) {
    notFound();
  }

  const relatedExamples = CV_EXAMPLES.filter(
    (e) => e.category === example.category && e.slug !== example.slug
  ).slice(0, 4);

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <Link href="/cv-examples" className="hover:text-[#0D47A1]">Примеры CV</Link>
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
            templateUsed="Stockholm CV"
            description={`Этот пример «${example.title.toLowerCase()}» показывает, как представить вашу полную академическую и профессиональную историю в структурированном формате CV, подходящем для международных и академических заявок.`}
            keyHighlights={[
              "Полный раздел образования и квалификаций",
              "Подробная история публикаций и исследований",
              "Профессиональные ассоциации и членства",
              "Чёткая хронологическая организация",
              "Подходящая длина для формата CV",
            ]}
            relatedExamples={relatedExamples}
            basePath="/cv-examples"
            builderPath={`/cv-builder?example=${example.slug}`}
          />
        </div>
      </section>
    </div>
  );
}
