"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

interface BreadcrumbsProps {
  className?: string;
  homeLabel?: string;
}

export function Breadcrumbs({ className, homeLabel = "Home" }: BreadcrumbsProps) {
  const pathname = usePathname();

  const segments = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((segment, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      return {
        label: formatSegment(segment),
        href,
        isLast: index === parts.length - 1,
      };
    });
  }, [pathname]);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("py-3", className)}>
      <ol className="flex items-center gap-1.5 text-sm text-gray-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-[#0D47A1]"
          >
            <Home className="h-3.5 w-3.5" />
            <span>{homeLabel}</span>
          </Link>
        </li>

        {segments.map((segment) => (
          <li key={segment.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            {segment.isLast ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {segment.label}
              </span>
            ) : (
              <Link
                href={segment.href}
                className="transition-colors hover:text-[#0D47A1]"
              >
                {segment.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
