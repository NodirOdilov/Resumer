"use client";

import { useState, useMemo } from "react";
import { ExampleCard } from "./ExampleCard";
import { CategoryList, EXAMPLE_CATEGORIES } from "./CategoryList";

export interface ExampleItem {
  title: string;
  slug: string;
  category: string;
  experienceLevel: string;
  thumbnail?: string;
}

interface ExampleGridProps {
  examples: ExampleItem[];
  basePath: string;
}

export function ExampleGrid({ examples, basePath }: ExampleGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExamples = useMemo(() => {
    let result = examples;
    if (activeCategory !== "all") {
      result = result.filter((e) => e.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query)
      );
    }
    return result;
  }, [examples, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-24">
          <div className="mb-4">
            <input
              type="search"
              placeholder="Поиск примеров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D47A1]/50 focus-visible:border-[#0D47A1]"
            />
          </div>
          <CategoryList
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Показано {filteredExamples.length} {filteredExamples.length === 1 ? "пример" : "примеров"}
            {activeCategory !== "all" && (
              <span>
                {" "}в категории{" "}
                <span className="font-medium text-gray-700">
                  {EXAMPLE_CATEGORIES.find((c) => c.slug === activeCategory)?.name}
                </span>
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredExamples.map((example) => (
            <ExampleCard key={example.slug} {...example} basePath={basePath} />
          ))}
        </div>

        {filteredExamples.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">Примеры не найдены.</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-2 text-sm font-medium text-[#0D47A1] hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
