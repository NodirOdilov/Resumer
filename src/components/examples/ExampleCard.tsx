import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ExampleCardProps {
  title: string;
  slug: string;
  category: string;
  experienceLevel: string;
  thumbnail?: string;
  basePath: string;
}

export function ExampleCard({
  title,
  slug,
  category,
  experienceLevel,
  thumbnail,
  basePath,
}: ExampleCardProps) {
  return (
    <Link
      href={`${basePath}/${slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${title} example preview`}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-3/4 space-y-2 rounded border border-gray-200 bg-white p-3 shadow-sm">
              <div className="h-2.5 w-1/2 rounded bg-[#0D47A1]/15" />
              <div className="h-1.5 w-full rounded bg-gray-100" />
              <div className="h-1.5 w-5/6 rounded bg-gray-100" />
              <div className="mt-2 h-1.5 w-full rounded bg-gray-100" />
              <div className="h-1.5 w-4/5 rounded bg-gray-100" />
              <div className="mt-2 h-1.5 w-full rounded bg-gray-100" />
              <div className="h-1.5 w-3/4 rounded bg-gray-100" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-[#0D47A1] transition-colors">
          {title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs capitalize">
            {category}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {experienceLevel}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
