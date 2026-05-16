import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/shared/TopicPage";
import {
  INTERVIEW_TOPICS,
  ALL_INTERVIEW_SLUGS,
} from "@/lib/data/interview-topics";

interface PageProps {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  return ALL_INTERVIEW_SLUGS.slice(0, 6).map((topic) => ({ topic }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const data = INTERVIEW_TOPICS[topic];
  if (!data) return { title: "Материал не найден" };
  return {
    title: `${data.title} | Resumer`,
    description: data.intro,
  };
}

export default async function InterviewTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const data = INTERVIEW_TOPICS[topic];
  if (!data) notFound();

  const related = (data.relatedSlugs ?? [])
    .map((slug) => INTERVIEW_TOPICS[slug])
    .filter(Boolean)
    .map((t) => ({ slug: t.slug, title: t.title }));

  return <TopicPage topic={data} related={related} />;
}
