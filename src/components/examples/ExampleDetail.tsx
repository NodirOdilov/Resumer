"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExampleCard } from "./ExampleCard";
import type { ExampleItem } from "./ExampleGrid";

interface ExampleDetailProps {
  title: string;
  slug: string;
  category: string;
  experienceLevel: string;
  templateUsed: string;
  thumbnail?: string;
  description: string;
  keyHighlights: string[];
  relatedExamples: ExampleItem[];
  basePath: string;
  builderPath: string;
}

export function ExampleDetail({
  title,
  category,
  experienceLevel,
  templateUsed,
  thumbnail,
  description,
  keyHighlights,
  relatedExamples,
  basePath,
  builderPath,
}: ExampleDetailProps) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={`${title} — полный предпросмотр`}
                className="w-full"
              />
            ) : (
              <div className="aspect-[3/4] w-full bg-gray-50 p-8">
                <div className="mx-auto max-w-sm space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="h-4 w-2/3 rounded bg-[#0D47A1]/20" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-5/6 rounded bg-gray-200" />
                  <div className="mt-4 h-3 w-1/3 rounded bg-gray-300" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-5/6 rounded bg-gray-200" />
                  <div className="h-2 w-4/5 rounded bg-gray-200" />
                  <div className="mt-4 h-3 w-1/3 rounded bg-gray-300" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-3/4 rounded bg-gray-200" />
                  <div className="h-2 w-5/6 rounded bg-gray-200" />
                  <div className="mt-4 h-3 w-1/3 rounded bg-gray-300" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-4/5 rounded bg-gray-200" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <div className="sticky top-24 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">{category}</Badge>
                <Badge variant="outline" className="capitalize">{experienceLevel}</Badge>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">{description}</p>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Детали</h3>
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Должность</span>
                  <span className="font-medium text-gray-900">{title}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Опыт</span>
                  <span className="font-medium capitalize text-gray-900">{experienceLevel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Шаблон</span>
                  <span className="font-medium text-gray-900">{templateUsed}</span>
                </div>
              </div>
            </div>

            {keyHighlights.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Ключевые особенности</h3>
                <ul className="space-y-2">
                  {keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button asChild size="lg" className="w-full">
              <Link href={builderPath}>Использовать этот пример как шаблон</Link>
            </Button>
          </div>
        </div>
      </div>

      {relatedExamples.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Похожие примеры</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedExamples.slice(0, 4).map((example) => (
              <ExampleCard key={example.slug} {...example} basePath={basePath} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
