"use client";

import * as React from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

/**
 * SEOHead component that sets document metadata client-side.
 *
 * For server-side metadata in Next.js App Router pages, use
 * `generateSEOMetadata` from `@/lib/seo` in your page's
 * `generateMetadata` export instead.
 */
export function SEOHead({
  title,
  description,
  ogImage = "/og-default.png",
  canonical,
}: SEOHeadProps) {
  React.useEffect(() => {
    document.title = `${title} | Resumer`;

    const setMeta = (property: string, content: string) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const setNameMeta = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setNameMeta("description", description);
    setMeta("og:title", `${title} | Resumer`);
    setMeta("og:description", description);
    setMeta("og:image", ogImage);

    if (canonical) {
      let link = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, ogImage, canonical]);

  return null;
}
