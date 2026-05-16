import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleDetail } from "@/components/examples/ExampleDetail";
import { COVER_LETTER_EXAMPLES } from "@/lib/data/examples";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COVER_LETTER_EXAMPLES.slice(0, 12).map((example) => ({
    slug: example.slug,
  }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = COVER_LETTER_EXAMPLES.find((e) => e.slug === slug);
  if (!example) return { title: "Пример сопроводительного письма не найден" };

  return {
    title: `Пример: ${example.title} | Resumer`,
    description: `Посмотрите профессиональный пример «${example.title.toLowerCase()}» с экспертными советами по написанию. Используйте его как вдохновение для собственного сопроводительного письма.`,
    keywords: [
      "пример сопроводительного письма",
      example.title.toLowerCase(),
      "сопроводительное письмо",
      "образец письма",
      "Resumer",
    ],
    openGraph: {
      title: `Пример: ${example.title} | Resumer`,
      description: `Профессиональный пример «${example.title.toLowerCase()}» с экспертными советами.`,
      type: "article",
    },
  };
}

export default async function CoverLetterExampleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const example = COVER_LETTER_EXAMPLES.find((e) => e.slug === slug);

  if (!example) {
    notFound();
  }

  const relatedExamples = COVER_LETTER_EXAMPLES.filter(
    (e) => e.category === example.category && e.slug !== example.slug
  ).slice(0, 4);

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-8">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <Link href="/cover-letter-examples" className="hover:text-[#0D47A1]">Примеры сопроводительных писем</Link>
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
            templateUsed="New York Letter"
            description={`Этот пример «${example.title.toLowerCase()}» демонстрирует, как написать убедительное сопроводительное письмо, которое дополнит ваше резюме и побудит менеджеров по найму пригласить вас на собеседование.`}
            keyHighlights={[
              "Сильное вступление, привлекающее внимание",
              "Конкретные примеры, связанные с требованиями вакансии",
              "Профессиональный тон с индивидуальностью",
              "Чёткий призыв к действию в заключении",
              "Правильное оформление делового письма",
            ]}
            relatedExamples={relatedExamples}
            basePath="/cover-letter-examples"
            builderPath={`/cover-letter-builder?example=${example.slug}`}
          />
        </div>
      </section>
    </div>
  );
}
