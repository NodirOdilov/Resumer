import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TocItem {
  id: string;
  title: string;
}

interface ArticleSection {
  id: string;
  title: string;
  content: string;
}

interface ArticlePageProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle: string;
  lastUpdated: string;
  readTime: string;
  toc: TocItem[];
  sections: ArticleSection[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonHref: string;
  relatedLinks?: { label: string; href: string }[];
}

export function ArticlePage({
  breadcrumbs,
  title,
  subtitle,
  lastUpdated,
  readTime,
  toc,
  sections,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonHref,
  relatedLinks,
}: ArticlePageProps) {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>Обновлено: {lastUpdated}</span>
            <span>|</span>
            <span>Время чтения: {readTime}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-gray-900">Содержание</h2>
              <nav className="mt-3 space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#0D47A1]"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0 flex-1">
            <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-a:text-[#0D47A1] prose-a:no-underline hover:prose-a:underline">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2>{section.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>

      {relatedLinks && relatedLinks.length > 0 && (
        <section className="border-t border-gray-100 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900">Похожие материалы</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-all hover:border-[#0D47A1]/30 hover:text-[#0D47A1] hover:shadow-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
