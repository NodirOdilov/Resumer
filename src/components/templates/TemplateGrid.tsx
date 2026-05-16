"use client";

import { useState, useMemo } from "react";
import { TemplateCard } from "./TemplateCard";
import { TemplateFilters } from "./TemplateFilters";
import type { DocumentTemplate } from "@/types/template";

interface TemplateGridProps {
  templates: DocumentTemplate[];
  basePath?: string;
}

export function TemplateGrid({ templates, basePath }: TemplateGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "all") return templates;
    return templates.filter((t) => t.category === activeFilter);
  }, [templates, activeFilter]);

  return (
    <div className="space-y-8">
      <TemplateFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} basePath={basePath} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">В этой категории шаблоны не найдены.</p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="mt-2 text-sm font-medium text-[#0D47A1] hover:underline"
          >
            Показать все шаблоны
          </button>
        </div>
      )}
    </div>
  );
}
