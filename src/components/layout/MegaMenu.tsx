"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  LayoutTemplate,
  BookOpen,
  PenTool,
  AlignLeft,
  Gift,
  Briefcase,
  Search,
  Users,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  Star,
  CheckCircle,
  Lightbulb,
  Target,
  Award,
  Compass,
  type LucideIcon,
} from "lucide-react";

interface SubLink {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

const MEGA_MENU_DATA: Record<string, SubLink[]> = {
  "Резюме": [
    { label: "Конструктор резюме", href: "/resume-builder", description: "Создайте профессиональное резюме за минуты", icon: PenTool },
    { label: "Шаблоны резюме", href: "/resume-templates", description: "Профессионально разработанные шаблоны", icon: LayoutTemplate },
    { label: "Примеры резюме", href: "/resume-examples", description: "Готовые примеры по индустриям", icon: BookOpen },
    { label: "Как написать резюме", href: "/resume/how-to", description: "Пошаговое руководство", icon: FileText },
    { label: "Формат резюме", href: "/resume/format", description: "Выберите подходящий формат", icon: AlignLeft },
    { label: "Бесплатные шаблоны", href: "/resume/free-templates", description: "Начните с бесплатных шаблонов", icon: Gift },
  ],
  "CV": [
    { label: "Конструктор CV", href: "/cv-builder", description: "Создайте развёрнутое CV", icon: PenTool },
    { label: "Шаблоны CV", href: "/cv-templates", description: "Профессиональные шаблоны для любой сферы", icon: LayoutTemplate },
    { label: "Примеры CV", href: "/cv-examples", description: "Готовые CV по профессиям", icon: BookOpen },
    { label: "Как написать CV", href: "/cv/how-to", description: "Полное руководство по CV", icon: FileText },
    { label: "Формат CV", href: "/cv/format", description: "Правила форматирования", icon: AlignLeft },
    { label: "CV против резюме", href: "/cv", description: "Ключевые различия", icon: HelpCircle },
  ],
  "Сопроводительное": [
    { label: "Конструктор писем", href: "/cover-letter-builder", description: "Убедительное сопроводительное письмо", icon: PenTool },
    { label: "Шаблоны писем", href: "/cover-letter-templates", description: "Профессиональные шаблоны", icon: LayoutTemplate },
    { label: "Примеры писем", href: "/cover-letter-examples", description: "Готовые примеры писем", icon: BookOpen },
    { label: "Как написать письмо", href: "/cover-letter/how-to", description: "Создайте письмо, которое получит работу", icon: FileText },
    { label: "Формат письма", href: "/cover-letter/format", description: "Правила форматирования", icon: AlignLeft },
    { label: "Бесплатные шаблоны", href: "/cover-letter/free-templates-word", description: "Начните бесплатно", icon: Gift },
  ],
  "Поиск работы": [
    { label: "Стратегии поиска", href: "/job-search/strategies", description: "Эффективные стратегии поиска работы", icon: Search },
    { label: "Нетворкинг", href: "/job-search/networking", description: "Стройте профессиональные связи", icon: Users },
    { label: "LinkedIn-профиль", href: "/job-search/linkedin", description: "Оптимизируйте LinkedIn", icon: Briefcase },
    { label: "Советы по откликам", href: "/job-search/tips", description: "Выделяйтесь среди кандидатов", icon: Target },
    { label: "Удалённая работа", href: "/job-search/remote", description: "Найдите удалённые вакансии", icon: Compass },
    { label: "Переговоры о зарплате", href: "/job-search/salary", description: "Договаривайтесь о достойной оплате", icon: TrendingUp },
  ],
  "Собеседования": [
    { label: "Подготовка к собеседованию", href: "/job-interviews/preparation", description: "Готовьтесь к любому формату", icon: CheckCircle },
    { label: "Частые вопросы", href: "/job-interviews/questions", description: "Готовые ответы на типичные вопросы", icon: MessageSquare },
    { label: "Советы для собеседования", href: "/job-interviews/tips", description: "Экспертные советы для успеха", icon: Star },
    { label: "Письмо благодарности", href: "/job-interviews/thank-you", description: "Follow-up после интервью", icon: FileText },
    { label: "Телефонное интервью", href: "/job-interviews/phone", description: "Пройдите телефонный скрининг", icon: Lightbulb },
    { label: "Видео-интервью", href: "/job-interviews/video", description: "Профессионально на камере", icon: Award },
  ],
  "Карьерные советы": [
    { label: "Развитие карьеры", href: "/career-advice/development", description: "План профессионального роста", icon: TrendingUp },
    { label: "Смена карьеры", href: "/career-advice/change", description: "Карьерные переходы", icon: Compass },
    { label: "Развитие навыков", href: "/career-advice/skills", description: "Определите и развивайте навыки", icon: Award },
    { label: "Советы для рабочего места", href: "/career-advice/workplace", description: "Преуспевайте на работе", icon: Users },
    { label: "Профессиональный рост", href: "/career-advice/growth", description: "Стратегии продвижения", icon: Target },
    { label: "Баланс работы и жизни", href: "/career-advice/balance", description: "Здоровые границы", icon: Lightbulb },
  ],
  "О нас": [
    { label: "О Resumer", href: "/about", description: "Наша миссия и команда", icon: Star },
    { label: "Тарифы", href: "/pricing", description: "Free, Pro, Lifetime — выберите свой", icon: Award },
    { label: "Блог", href: "/blog", description: "Все материалы по карьере и работе", icon: BookOpen },
    { label: "Связаться с нами", href: "/contact", description: "Свяжитесь с командой", icon: MessageSquare },
    { label: "Редакционные стандарты", href: "/editorial-guidelines", description: "Стандарты нашего контента", icon: FileText },
    { label: "Политика конфиденциальности", href: "/privacy-policy", description: "Как мы защищаем данные", icon: CheckCircle },
  ],
};

interface MegaMenuProps {
  item: string;
  onClose: () => void;
}

export function MegaMenu({ item, onClose }: MegaMenuProps) {
  const links = MEGA_MENU_DATA[item];

  if (!links) return null;

  return (
    <div
      className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
      onMouseLeave={onClose}
    >
      <div className="w-[600px] rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[#0D47A1]">{item}</h3>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {links.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={`${link.href}-${idx}`}
                href={link.href}
                className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-gray-50"
                onClick={onClose}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0D47A1]/10 text-[#0D47A1]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{link.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
