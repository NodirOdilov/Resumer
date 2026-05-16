"use client";

import { useEffect, useRef, useState } from "react";
import { TemplateRenderer } from "@/components/templates/previews/TemplateRenderer";
import { SAMPLE_CONTENT } from "@/lib/data/sample-resume-content";

interface MiniResumePreviewProps {
  templateSlug?: string;
  primaryColor?: string;
  className?: string;
}

const REAL_WIDTH = 700; // px — A4-ish render width

/**
 * Renders a real resume template at A4 size and scales it down to fit
 * whatever container it's dropped into. Used as a credible visual element
 * across marketing sections (hero, steps, features, etc.) instead of
 * abstract placeholder shapes.
 */
export function MiniResumePreview({
  templateSlug = "cubic",
  primaryColor = "#0D47A1",
  className = "",
}: MiniResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

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
    color: primaryColor,
    font: "Inter",
    fontSize: 14,
    lineSpacing: 1.5,
    margins: { top: 24, right: 24, bottom: 24, left: 24 },
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ${className}`}
    >
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
          templateSlug={templateSlug}
          content={SAMPLE_CONTENT}
          settings={settings}
        />
      </div>
    </div>
  );
}
