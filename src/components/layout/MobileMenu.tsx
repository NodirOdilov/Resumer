"use client";

import * as React from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SubLink {
  label: string;
  href: string;
}

const MOBILE_MENU_DATA: Record<string, SubLink[]> = {
  "Резюме": [
    { label: "Конструктор резюме", href: "/resume-builder" },
    { label: "Шаблоны резюме", href: "/resume-templates" },
    { label: "Примеры резюме", href: "/resume-examples" },
    { label: "Как написать резюме", href: "/resume/how-to" },
    { label: "Формат резюме", href: "/resume/format" },
    { label: "Бесплатные шаблоны", href: "/resume/free-templates" },
  ],
  "CV": [
    { label: "Конструктор CV", href: "/cv-builder" },
    { label: "Шаблоны CV", href: "/cv-templates" },
    { label: "Примеры CV", href: "/cv-examples" },
    { label: "Как написать CV", href: "/cv/how-to" },
    { label: "Формат CV", href: "/cv/format" },
    { label: "CV против резюме", href: "/cv" },
  ],
  "Сопроводительное": [
    { label: "Конструктор писем", href: "/cover-letter-builder" },
    { label: "Шаблоны писем", href: "/cover-letter-templates" },
    { label: "Примеры писем", href: "/cover-letter-examples" },
    { label: "Как написать письмо", href: "/cover-letter/how-to" },
    { label: "Формат письма", href: "/cover-letter/format" },
    { label: "Бесплатные шаблоны", href: "/cover-letter/free-templates-word" },
  ],
  "Поиск работы": [
    { label: "Стратегии поиска", href: "/job-search/strategies" },
    { label: "Нетворкинг", href: "/job-search/networking" },
    { label: "LinkedIn-профиль", href: "/job-search/linkedin" },
    { label: "Советы по откликам", href: "/job-search/tips" },
    { label: "Удалённая работа", href: "/job-search/remote" },
    { label: "Переговоры о зарплате", href: "/job-search/salary" },
  ],
  "Собеседования": [
    { label: "Подготовка к собеседованию", href: "/job-interviews/preparation" },
    { label: "Частые вопросы", href: "/job-interviews/questions" },
    { label: "Советы для собеседования", href: "/job-interviews/tips" },
    { label: "Письмо благодарности", href: "/job-interviews/thank-you" },
    { label: "Телефонное интервью", href: "/job-interviews/phone" },
    { label: "Видео-интервью", href: "/job-interviews/video" },
  ],
  "Карьерные советы": [
    { label: "Развитие карьеры", href: "/career-advice/development" },
    { label: "Смена карьеры", href: "/career-advice/change" },
    { label: "Развитие навыков", href: "/career-advice/skills" },
    { label: "Советы для рабочего места", href: "/career-advice/workplace" },
    { label: "Профессиональный рост", href: "/career-advice/growth" },
    { label: "Баланс работы и жизни", href: "/career-advice/balance" },
  ],
  "О нас": [
    { label: "О Resumer", href: "/about" },
    { label: "Тарифы", href: "/pricing" },
    { label: "Блог", href: "/blog" },
    { label: "Связаться с нами", href: "/contact" },
    { label: "Редакционные стандарты", href: "/editorial-guidelines" },
  ],
};

const NAV_ITEMS = Object.keys(MOBILE_MENU_DATA);

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
  const [subMenuView, setSubMenuView] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setExpandedItem(null);
      setSubMenuView(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          {subMenuView ? (
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-gray-700"
              onClick={() => setSubMenuView(null)}
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </button>
          ) : (
            <span className="text-xl font-bold" style={{ color: "#0D47A1" }}>
              Resumer
            </span>
          )}
          <button
            type="button"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {subMenuView ? (
            <div className="px-4 py-2">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                {subMenuView}
              </h3>
              <div className="space-y-1">
                {MOBILE_MENU_DATA[subMenuView]?.map((link, idx) => (
                  <Link
                    key={`${link.href}-${idx}`}
                    href={link.href}
                    className="block rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0D47A1]"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-2">
              {NAV_ITEMS.map((item) => {
                const isExpanded = expandedItem === item;
                const subLinks = MOBILE_MENU_DATA[item];

                return (
                  <div key={item} className="border-b border-gray-100">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-3.5 text-left text-base font-medium text-gray-900"
                      onClick={() =>
                        setExpandedItem(isExpanded ? null : item)
                      }
                    >
                      {item}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-gray-500 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>

                    {isExpanded && subLinks && (
                      <div className="pb-3 space-y-1">
                        {subLinks.map((link, idx) => (
                          <Link
                            key={`${link.href}-${idx}`}
                            href={link.href}
                            className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#0D47A1]"
                            onClick={onClose}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-4">
          <Link href="/account" onClick={onClose}>
            <Button className="w-full">Личный кабинет</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
