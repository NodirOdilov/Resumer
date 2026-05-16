"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TemplateRenderer } from "@/components/templates/previews/TemplateRenderer";
import { SAMPLE_CONTENT } from "@/lib/data/sample-resume-content";
import type { DocumentTemplate } from "@/types/template";

interface TemplateCardProps {
  template: DocumentTemplate;
  basePath?: string;
}

/**
 * Render the full template at A4 size, then scale it down with CSS so it
 * fits perfectly inside the 3:4 thumbnail container regardless of how wide
 * the parent grid cell ends up at the user's viewport.
 */
const REAL_WIDTH = 700; // px — close to A4 at the assumed font size

export function TemplateCard({
  template,
  basePath = "/resume-builder",
}: TemplateCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth;
      if (width > 0) setScale(width / REAL_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const settings = {
    color: template.colorSchemes?.[0]?.primaryColor || "#0D47A1",
    font: "Inter",
    fontSize: 14,
    lineSpacing: 1.5,
    margins: { top: 24, right: 24, bottom: 24, left: 24 },
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] w-full overflow-hidden bg-white"
      >
        {/* Real template at A4 size, scaled down to fit the thumbnail. */}
        <div
          className="origin-top-left"
          style={{
            width: `${REAL_WIDTH}px`,
            height: `${REAL_WIDTH * (4 / 3)}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <TemplateRenderer
            templateSlug={template.slug}
            content={SAMPLE_CONTENT}
            settings={settings}
          />
        </div>

        {template.isNew && (
          <div className="absolute left-3 top-3 z-10">
            <Badge className="bg-green-500 text-white hover:bg-green-600">
              NEW
            </Badge>
          </div>
        )}

        {template.isPremium && (
          <div className="absolute right-3 top-3 z-10">
            <Badge className="bg-amber-500 text-white hover:bg-amber-600">
              PRO
            </Badge>
          </div>
        )}

        {/* Hover overlay with action button */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
          <Button asChild size="lg" className="shadow-lg">
            <Link href={`${basePath}?template=${template.slug}`}>
              Использовать шаблон
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{template.name}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge variant="secondary" className="capitalize text-xs">
            {template.category}
          </Badge>
          {template.rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {template.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
