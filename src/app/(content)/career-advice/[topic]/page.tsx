import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/shared/TopicPage";
import { CAREER_TOPICS, ALL_CAREER_SLUGS } from "@/lib/data/career-topics";

interface PageProps {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  return ALL_CAREER_SLUGS.slice(0, 6).map((topic) => ({ topic }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const data = CAREER_TOPICS[topic];
  if (!data) return { title: "Материал не найден" };
  return {
    title: `${data.title} | Resumer`,
    description: data.intro,
  };
}

export default async function CareerAdviceTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const data = CAREER_TOPICS[topic];
  if (!data) notFound();

  const related = (data.relatedSlugs ?? [])
    .map((slug) => CAREER_TOPICS[slug])
    .filter(Boolean)
    .map((t) => ({ slug: t.slug, title: t.title }));

  return <TopicPage topic={data} related={related} />;
}
