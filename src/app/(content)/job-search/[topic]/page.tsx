import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/shared/TopicPage";
import {
  JOB_SEARCH_TOPICS,
  ALL_JOB_SEARCH_SLUGS,
} from "@/lib/data/job-search-topics";

interface PageProps {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  return ALL_JOB_SEARCH_SLUGS.slice(0, 6).map((topic) => ({ topic }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const data = JOB_SEARCH_TOPICS[topic];
  if (!data) return { title: "Материал не найден" };
  return {
    title: `${data.title} | Resumer`,
    description: data.intro,
  };
}

export default async function JobSearchTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const data = JOB_SEARCH_TOPICS[topic];
  if (!data) notFound();

  const related = (data.relatedSlugs ?? [])
    .map((slug) => JOB_SEARCH_TOPICS[slug])
    .filter(Boolean)
    .map((t) => ({ slug: t.slug, title: t.title }));

  return <TopicPage topic={data} related={related} />;
}
