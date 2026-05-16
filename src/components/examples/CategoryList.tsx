"use client";

import { cn } from "@/lib/utils";
import { EXAMPLE_CATEGORIES, type ExampleCategory } from "./categories";

export type { ExampleCategory };
export { EXAMPLE_CATEGORIES };

const ICON_MAP: Record<string, React.ReactNode> = {
  calculator: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h8M8 14h3M13 14h3M8 18h3M13 18h3" /></svg>,
  palette: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c3.1 0 5.6-2.5 5.6-5.6C22 5.9 17.5 2 12 2z" /><circle cx="8" cy="10" r="1.5" /><circle cx="12" cy="7" r="1.5" /><circle cx="16" cy="10" r="1.5" /></svg>,
  "book-open": <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
  cpu: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>,
  utensils: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>,
  "heart-pulse": <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 0112 5.006a5 5 0 017.5 7.566z" /><path d="M5 12h2l3-3 4 6 3-3h2" /></svg>,
  monitor: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  shield: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  scale: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 3v18M2 7l10 2 10-2M4 15l4-8 4 8M16 15l4-8-4 8" /><path d="M2 15h8M14 15h8" /></svg>,
  wrench: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
  briefcase: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3" /></svg>,
  megaphone: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 11-5.8-1.6" /></svg>,
  building: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" /></svg>,
  home: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /></svg>,
  users: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  "graduation-cap": <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M22 10l-10-5L2 10l10 5 10-5zM6 12v5c3 3 9 3 12 0v-5" /></svg>,
  plane: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>,
  layers: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
};

interface CategoryListProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export function CategoryList({ activeCategory, onCategoryChange }: CategoryListProps) {
  return (
    <nav className="space-y-1">
      <button
        type="button"
        onClick={() => onCategoryChange("all")}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          activeCategory === "all"
            ? "bg-[#0D47A1]/10 text-[#0D47A1]"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span className="text-gray-400">
          {ICON_MAP.layers}
        </span>
        <span className="flex-1 text-left">Все категории</span>
        <span className="text-xs text-gray-400">
          {EXAMPLE_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0)}
        </span>
      </button>
      {EXAMPLE_CATEGORIES.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            activeCategory === category.slug
              ? "bg-[#0D47A1]/10 text-[#0D47A1]"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <span className={activeCategory === category.slug ? "text-[#0D47A1]" : "text-gray-400"}>
            {ICON_MAP[category.icon] || ICON_MAP.layers}
          </span>
          <span className="flex-1 text-left">{category.name}</span>
          <span className="text-xs text-gray-400">{category.count}</span>
        </button>
      ))}
    </nav>
  );
}
