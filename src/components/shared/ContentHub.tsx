import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ContentLink {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

interface ContentHubProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle: string;
  sections: {
    title: string;
    links: ContentLink[];
  }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonHref: string;
}

export function ContentHub({
  breadcrumbs,
  title,
  subtitle,
  sections,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonHref,
}: ContentHubProps) {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#0D47A1]">{crumb.label}</Link>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">{subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">{section.title}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0D47A1]/30"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0D47A1] transition-colors">
                        {link.title}
                      </h3>
                      {link.badge && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{link.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">{ctaTitle}</h2>
          <p className="mt-4 text-lg text-gray-600">{ctaDescription}</p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href={ctaButtonHref}>{ctaButtonText}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
