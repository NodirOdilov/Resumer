import Link from "next/link";

import { APP_VERSION } from "@/lib/version";

const RESUME_LINKS = [
  { label: "Конструктор резюме", href: "/resume-builder" },
  { label: "Шаблоны резюме", href: "/resume-templates" },
  { label: "Примеры резюме", href: "/resume-examples" },
  { label: "Как написать резюме", href: "/resume/how-to" },
  { label: "Формат резюме", href: "/resume/format" },
  { label: "Резюме (summary)", href: "/resume/summary" },
  { label: "Цель резюме", href: "/resume/objective" },
  { label: "Навыки в резюме", href: "/resume/skills" },
  { label: "Бесплатные шаблоны", href: "/resume/free-templates" },
];

const CV_LINKS = [
  { label: "Конструктор CV", href: "/cv-builder" },
  { label: "Шаблоны CV", href: "/cv-templates" },
  { label: "Примеры CV", href: "/cv-examples" },
  { label: "Как написать CV", href: "/cv/how-to" },
  { label: "Формат CV", href: "/cv/format" },
];

const COVER_LETTER_LINKS = [
  { label: "Конструктор писем", href: "/cover-letter-builder" },
  { label: "Шаблоны писем", href: "/cover-letter-templates" },
  { label: "Примеры писем", href: "/cover-letter-examples" },
  { label: "Как написать письмо", href: "/cover-letter/how-to" },
  { label: "Формат письма", href: "/cover-letter/format" },
  { label: "Советы", href: "/cover-letter/tips" },
  { label: "Универсальное письмо", href: "/cover-letter/generic" },
];

const SUPPORT_LINKS = [
  { label: "О нас", href: "/about" },
  { label: "Тарифы", href: "/pricing" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "/contact" },
  { label: "Редакционные стандарты", href: "/editorial-guidelines" },
  { label: "О нас писали", href: "/featured-in" },
  { label: "Политика конфиденциальности", href: "/privacy-policy" },
  { label: "Условия использования", href: "/terms-of-service" },
  { label: "Cookie", href: "/cookies-and-tracking" },
  { label: "Доступность", href: "/accessibility" },
  { label: "Защита от мошенничества", href: "/fraud-awareness" },
];

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-600 transition-colors hover:text-[#0D47A1]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Резюме" links={RESUME_LINKS} />
          <FooterColumn title="CV" links={CV_LINKS} />
          <FooterColumn title="Сопроводительное" links={COVER_LETTER_LINKS} />
          <FooterColumn title="Поддержка" links={SUPPORT_LINKS} />
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              &copy; 2026 Resumer v{APP_VERSION}. Все права защищены.
            </p>
            <a
              href="https://github.com/NodirOdilov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#0D47A1]"
            >
              <span>Разработчик:</span>
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-medium">Nodir Odilov</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
