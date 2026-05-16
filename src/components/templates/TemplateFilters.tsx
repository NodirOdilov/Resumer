"use client";

import { cn } from "@/lib/utils";

const FILTER_OPTIONS = [
  { label: "Все", value: "all" },
  { label: "Профессиональные", value: "professional" },
  { label: "Простые", value: "simple" },
  { label: "Современные", value: "modern" },
  { label: "Креативные", value: "creative" },
  { label: "Бизнес", value: "executive" },
  { label: "Классические", value: "elegant" },
] as const;

interface TemplateFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function TemplateFilters({ activeFilter, onFilterChange }: TemplateFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onFilterChange(option.value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            activeFilter === option.value
              ? "bg-[#0D47A1] text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export { FILTER_OPTIONS };
