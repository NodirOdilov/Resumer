import type { Metadata } from "next";

interface SEOMetadataProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

/**
 * Generate Next.js metadata for a page.
 *
 * Usage in page files:
 * ```ts
 * import { generateSEOMetadata } from "@/lib/seo";
 *
 * export function generateMetadata() {
 *   return generateSEOMetadata({
 *     title: "Resume Builder",
 *     description: "Build your professional resume in minutes.",
 *   });
 * }
 * ```
 */
export function generateSEOMetadata({
  title,
  description,
  ogImage = "/og-default.png",
  canonical,
  noIndex = false,
}: SEOMetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resumer.com";
  const fullTitle = `${title} | Resumer`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      siteName: "Resumer",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`],
    },
    alternates: {
      canonical: canonical || undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
