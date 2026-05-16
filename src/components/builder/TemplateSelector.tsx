'use client';

import { useState, useMemo } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DocumentTemplate } from '@/types';

const CATEGORIES = [
  { id: 'All', label: 'Все' },
  { id: 'Professional', label: 'Профессиональные' },
  { id: 'Simple', label: 'Простые' },
  { id: 'Modern', label: 'Современные' },
  { id: 'Creative', label: 'Креативные' },
  { id: 'Business', label: 'Бизнес' },
  { id: 'Classic', label: 'Классические' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const TEMPLATES: (DocumentTemplate & { isNew?: boolean })[] = [
  { id: '1', name: 'Executive Pro', slug: 'executive-pro', category: 'Professional', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3'], description: 'Чистый исполнительный стиль', isNew: false },
  { id: '2', name: 'Corporate Edge', slug: 'corporate-edge', category: 'Professional', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#263238', '#37474F', '#455A64', '#546E7A', '#607D8B'], description: 'Корпоративный стиль', isNew: false },
  { id: '3', name: 'Boardroom', slug: 'boardroom', category: 'Professional', thumbnail_url: '', preview_url: '', is_premium: true, colors: ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#4CAF50'], description: 'Премиум для топ-менеджмента', isNew: true },
  { id: '4', name: 'Director', slug: 'director', category: 'Professional', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#0D47A1', '#1565C0', '#1976D2', '#42A5F5', '#90CAF9'], description: 'Резюме директора', isNew: false },
  { id: '5', name: 'Minimal Clean', slug: 'minimal-clean', category: 'Simple', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD'], description: 'Минималистичный и чистый', isNew: false },
  { id: '6', name: 'Basic Starter', slug: 'basic-starter', category: 'Simple', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#37474F', '#455A64', '#546E7A', '#78909C', '#B0BEC5'], description: 'Простой стартовый шаблон', isNew: false },
  { id: '7', name: 'Plain Text', slug: 'plain-text', category: 'Simple', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#212121', '#424242', '#616161', '#9E9E9E', '#E0E0E0'], description: 'Текстовая раскладка', isNew: false },
  { id: '8', name: 'Whitespace', slug: 'whitespace', category: 'Simple', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#455A64', '#546E7A', '#607D8B', '#78909C', '#90A4AE'], description: 'Просторная раскладка', isNew: false },
  { id: '9', name: 'Neon Pulse', slug: 'neon-pulse', category: 'Modern', thumbnail_url: '', preview_url: '', is_premium: true, colors: ['#00BCD4', '#00ACC1', '#0097A7', '#00838F', '#006064'], description: 'Неоновый современный стиль', isNew: true },
  { id: '10', name: 'Gradient Flow', slug: 'gradient-flow', category: 'Modern', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#7B1FA2', '#8E24AA', '#9C27B0', '#AB47BC', '#CE93D8'], description: 'Градиентный современный вид', isNew: false },
  { id: '11', name: 'Metro Style', slug: 'metro-style', category: 'Modern', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#E65100', '#EF6C00', '#F57C00', '#FB8C00', '#FFA726'], description: 'В стиле Metro', isNew: false },
  { id: '12', name: 'Tech Forward', slug: 'tech-forward', category: 'Modern', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#1A237E', '#283593', '#303F9F', '#3949AB', '#5C6BC0'], description: 'Для IT-индустрии', isNew: true },
  { id: '13', name: 'Artisan', slug: 'artisan', category: 'Creative', thumbnail_url: '', preview_url: '', is_premium: true, colors: ['#AD1457', '#C2185B', '#D81B60', '#E91E63', '#F06292'], description: 'Креативная раскладка', isNew: false },
  { id: '14', name: 'Portfolio Plus', slug: 'portfolio-plus', category: 'Creative', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#6A1B9A', '#7B1FA2', '#8E24AA', '#9C27B0', '#BA68C8'], description: 'Витрина портфолио', isNew: false },
  { id: '15', name: 'Infographic', slug: 'infographic', category: 'Creative', thumbnail_url: '', preview_url: '', is_premium: true, colors: ['#00695C', '#00796B', '#00897B', '#009688', '#4DB6AC'], description: 'Инфографический стиль', isNew: true },
  { id: '16', name: 'Color Blocks', slug: 'color-blocks', category: 'Creative', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#F44336', '#E91E63', '#9C27B0', '#2196F3', '#4CAF50'], description: 'Яркие цветные блоки', isNew: false },
  { id: '17', name: 'Enterprise', slug: 'enterprise', category: 'Business', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#66BB6A'], description: 'Корпоративный бизнес', isNew: false },
  { id: '18', name: 'Consultant', slug: 'consultant', category: 'Business', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#42A5F5'], description: 'Раскладка консультанта', isNew: false },
  { id: '19', name: 'Financial', slug: 'financial', category: 'Business', thumbnail_url: '', preview_url: '', is_premium: true, colors: ['#004D40', '#00695C', '#00796B', '#00897B', '#009688'], description: 'Финансовый сектор', isNew: false },
  { id: '20', name: 'Manager Pro', slug: 'manager-pro', category: 'Business', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#263238', '#37474F', '#455A64', '#546E7A', '#78909C'], description: 'Профессиональный менеджер', isNew: true },
  { id: '21', name: 'Traditional', slug: 'traditional', category: 'Classic', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#3E2723', '#4E342E', '#5D4037', '#6D4C41', '#8D6E63'], description: 'Традиционная классика', isNew: false },
  { id: '22', name: 'Elegant Serif', slug: 'elegant-serif', category: 'Classic', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#1A237E', '#283593', '#303F9F', '#3949AB', '#5C6BC0'], description: 'Элегантная типографика', isNew: false },
  { id: '23', name: 'Timeless', slug: 'timeless', category: 'Classic', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#212121', '#424242', '#616161', '#757575', '#9E9E9E'], description: 'Вне времени', isNew: false },
  { id: '24', name: 'Heritage', slug: 'heritage', category: 'Classic', thumbnail_url: '', preview_url: '', is_premium: true, colors: ['#BF360C', '#D84315', '#E64A19', '#F4511E', '#FF7043'], description: 'Наследие классики', isNew: false },
  { id: '25', name: 'Startup Vibe', slug: 'startup-vibe', category: 'Modern', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#FF6F00', '#FF8F00', '#FFA000', '#FFB300', '#FFC107'], description: 'Стартап-культура', isNew: true },
  { id: '26', name: 'Academic', slug: 'academic', category: 'Professional', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#4CAF50'], description: 'Академический стиль', isNew: false },
  { id: '27', name: 'Designer', slug: 'designer', category: 'Creative', thumbnail_url: '', preview_url: '', is_premium: true, colors: ['#880E4F', '#AD1457', '#C2185B', '#D81B60', '#EC407A'], description: 'Витрина дизайнера', isNew: true },
  { id: '28', name: 'Swiss Layout', slug: 'swiss-layout', category: 'Simple', thumbnail_url: '', preview_url: '', is_premium: false, colors: ['#B71C1C', '#C62828', '#D32F2F', '#E53935', '#EF5350'], description: 'Швейцарский дизайн', isNew: false },
];

const CATEGORY_LABEL_RU: Record<string, string> = {
  Professional: 'Профессиональные',
  Simple: 'Простые',
  Modern: 'Современные',
  Creative: 'Креативные',
  Business: 'Бизнес',
  Classic: 'Классические',
};

interface TemplateSelectorProps {
  isModal?: boolean;
  onSelect?: (template: DocumentTemplate) => void;
}

/**
 * Renders a realistic mini resume preview with actual readable text. The
 * card is rendered at A4-aspect, so when scaled into the 3:4 thumbnail it
 * looks just like a recruiter would see it.
 *
 * The trick: render at a fixed "real" size (320×420 logical px) using
 * actual readable typography, then `transform: scale(...)` it into the
 * card so the whole resume — text and all — is legible.
 */
const SAMPLE = {
  name: "Анна Иванова",
  title: "Senior Software Engineer",
  email: "anna.ivanova@email.com",
  phone: "+7 (999) 123-45-67",
  location: "Москва, Россия",
  summary:
    "Senior Software Engineer с 7+ годами опыта в разработке масштабируемых web-приложений. Эксперт по React, Node.js и облачным архитектурам. Веду команды до 8 разработчиков, поставляю продукт быстро и качественно.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Yandex",
      date: "2022 — наст. время",
      bullets: [
        "Возглавил миграцию с монолита на микросервисы, ускорив релизы на 40%.",
        "Спроектировал API-шлюз, обслуживающий 50М+ запросов в день.",
        "Менторил 4 инженеров, двое из них продвинулись до senior.",
      ],
    },
    {
      title: "Software Engineer",
      company: "Avito",
      date: "2019 — 2022",
      bullets: [
        "Разработал систему рекомендаций, повысив CTR на 18%.",
        "Оптимизировал backend, снизив p95-латентность с 320 до 90 мс.",
      ],
    },
  ],
  education: {
    degree: "МГУ — Прикладная математика",
    date: "2015 — 2019",
  },
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
    "Python",
  ],
};

function TemplatePreview({ template }: { template: DocumentTemplate }) {
  const primary = template.colors?.[0] ?? "#0D47A1";
  const accent = template.colors?.[2] ?? primary;
  const isSidebar =
    template.category === "Modern" || template.category === "Creative";
  const isClassic = template.category === "Classic";

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {isSidebar ? (
        <SidebarLayout primary={primary} accent={accent} />
      ) : isClassic ? (
        <ClassicLayout primary={primary} accent={accent} />
      ) : (
        <SingleColumnLayout primary={primary} accent={accent} />
      )}
    </div>
  );
}

function SingleColumnLayout({
  primary,
  accent,
}: {
  primary: string;
  accent: string;
}) {
  return (
    <div
      className="h-full w-full bg-white text-[8px] leading-[1.35] text-gray-800"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Coloured header */}
      <div
        className="px-4 py-3 text-white"
        style={{ backgroundColor: primary }}
      >
        <div className="text-[14px] font-bold leading-tight">{SAMPLE.name}</div>
        <div className="mt-0.5 text-[9px] opacity-90">{SAMPLE.title}</div>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[7px] opacity-85">
          <span>{SAMPLE.email}</span>
          <span>•</span>
          <span>{SAMPLE.phone}</span>
          <span>•</span>
          <span>{SAMPLE.location}</span>
        </div>
      </div>

      <div className="space-y-2 px-4 py-3">
        {/* Summary */}
        <section>
          <div
            className="mb-1 border-b pb-0.5 text-[8px] font-bold uppercase tracking-wider"
            style={{ color: accent, borderColor: `${accent}60` }}
          >
            Краткое описание
          </div>
          <p className="text-[7.5px] leading-snug text-gray-700">
            {SAMPLE.summary}
          </p>
        </section>

        {/* Experience */}
        <section>
          <div
            className="mb-1 border-b pb-0.5 text-[8px] font-bold uppercase tracking-wider"
            style={{ color: accent, borderColor: `${accent}60` }}
          >
            Опыт работы
          </div>
          <div className="space-y-1.5">
            {SAMPLE.experience.map((job, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[8px] font-semibold text-gray-900">
                    {job.title}
                  </div>
                  <div className="shrink-0 text-[6.5px] text-gray-500">
                    {job.date}
                  </div>
                </div>
                <div className="text-[7px] text-gray-600">{job.company}</div>
                <ul className="mt-0.5 space-y-0.5 pl-2">
                  {job.bullets.slice(0, idx === 0 ? 3 : 2).map((b, i) => (
                    <li
                      key={i}
                      className="relative pl-1.5 text-[6.5px] leading-snug text-gray-700"
                    >
                      <span className="absolute left-0 top-[3px] h-0.5 w-0.5 rounded-full bg-gray-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <div
            className="mb-1 border-b pb-0.5 text-[8px] font-bold uppercase tracking-wider"
            style={{ color: accent, borderColor: `${accent}60` }}
          >
            Образование
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-[7.5px] font-semibold text-gray-900">
              {SAMPLE.education.degree}
            </div>
            <div className="text-[6.5px] text-gray-500">
              {SAMPLE.education.date}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <div
            className="mb-1 border-b pb-0.5 text-[8px] font-bold uppercase tracking-wider"
            style={{ color: accent, borderColor: `${accent}60` }}
          >
            Навыки
          </div>
          <div className="flex flex-wrap gap-1">
            {SAMPLE.skills.map((s, i) => (
              <span
                key={i}
                className="rounded px-1.5 py-0.5 text-[6.5px] text-gray-700"
                style={{ backgroundColor: `${accent}20` }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SidebarLayout({
  primary,
  accent,
}: {
  primary: string;
  accent: string;
}) {
  return (
    <div
      className="flex h-full w-full text-[7px] leading-[1.4] text-gray-800"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        className="flex w-[120px] flex-col gap-2.5 p-3 text-white"
        style={{ backgroundColor: primary }}
      >
        <div className="mx-auto h-12 w-12 rounded-full bg-white/25" />
        <div>
          <div className="text-[10px] font-bold leading-tight">
            {SAMPLE.name.split(" ")[0]}
          </div>
          <div className="text-[10px] font-bold leading-tight">
            {SAMPLE.name.split(" ")[1]}
          </div>
          <div className="mt-0.5 text-[6.5px] opacity-85">{SAMPLE.title}</div>
        </div>

        <div>
          <div className="mb-0.5 text-[7px] font-bold uppercase tracking-wide opacity-90">
            Контакты
          </div>
          <div className="space-y-0.5 text-[6px] opacity-90">
            <div>{SAMPLE.email}</div>
            <div>{SAMPLE.phone}</div>
            <div>{SAMPLE.location}</div>
          </div>
        </div>

        <div>
          <div className="mb-0.5 text-[7px] font-bold uppercase tracking-wide opacity-90">
            Навыки
          </div>
          <div className="space-y-0.5 text-[6px] opacity-95">
            {SAMPLE.skills.slice(0, 6).map((s, i) => (
              <div key={i}>• {s}</div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-0.5 text-[7px] font-bold uppercase tracking-wide opacity-90">
            Образование
          </div>
          <div className="text-[6px] opacity-95">{SAMPLE.education.degree}</div>
          <div className="text-[5.5px] opacity-75">{SAMPLE.education.date}</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 space-y-2 p-3">
        <section>
          <div
            className="mb-1 text-[8px] font-bold uppercase tracking-wider"
            style={{ color: accent }}
          >
            Краткое описание
          </div>
          <p className="text-[7px] leading-snug text-gray-700">
            {SAMPLE.summary}
          </p>
        </section>

        <section>
          <div
            className="mb-1 text-[8px] font-bold uppercase tracking-wider"
            style={{ color: accent }}
          >
            Опыт работы
          </div>
          <div className="space-y-1.5">
            {SAMPLE.experience.map((job, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[7.5px] font-semibold text-gray-900">
                    {job.title}
                  </div>
                  <div className="shrink-0 text-[6px] text-gray-500">
                    {job.date}
                  </div>
                </div>
                <div className="text-[6.5px] italic text-gray-600">
                  {job.company}
                </div>
                <ul className="mt-0.5 space-y-0.5">
                  {job.bullets.slice(0, idx === 0 ? 3 : 2).map((b, i) => (
                    <li
                      key={i}
                      className="relative pl-2 text-[6px] leading-snug text-gray-700"
                    >
                      <span
                        className="absolute left-0 top-[3px] h-0.5 w-0.5 rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ClassicLayout({
  primary,
  accent,
}: {
  primary: string;
  accent: string;
}) {
  return (
    <div
      className="h-full w-full bg-white px-5 py-4 text-[8px] leading-[1.45] text-gray-800"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Centered classic header */}
      <div className="border-b-2 pb-2 text-center" style={{ borderColor: primary }}>
        <div
          className="text-[16px] font-bold tracking-wide"
          style={{ color: primary }}
        >
          {SAMPLE.name}
        </div>
        <div className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-gray-700">
          {SAMPLE.title}
        </div>
        <div className="mt-1 text-[6.5px] text-gray-600">
          {SAMPLE.email} · {SAMPLE.phone} · {SAMPLE.location}
        </div>
      </div>

      <div className="mt-2.5 space-y-2.5">
        <section>
          <div
            className="mb-1 text-center text-[8px] font-bold uppercase tracking-[0.25em]"
            style={{ color: primary }}
          >
            Профиль
          </div>
          <p className="text-[7.5px] leading-relaxed text-gray-700">
            {SAMPLE.summary}
          </p>
        </section>

        <section>
          <div
            className="mb-1 text-center text-[8px] font-bold uppercase tracking-[0.25em]"
            style={{ color: primary }}
          >
            Опыт
          </div>
          <div className="space-y-1.5">
            {SAMPLE.experience.map((job, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[8px] font-bold text-gray-900">
                    {job.title}, {job.company}
                  </div>
                  <div className="shrink-0 text-[6.5px] italic text-gray-500">
                    {job.date}
                  </div>
                </div>
                <ul className="mt-0.5 space-y-0.5 pl-2">
                  {job.bullets.slice(0, idx === 0 ? 2 : 1).map((b, i) => (
                    <li
                      key={i}
                      className="relative pl-2 text-[6.5px] leading-snug text-gray-700"
                    >
                      <span
                        className="absolute left-0 top-[2px]"
                        style={{ color: accent }}
                      >
                        ◆
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div
            className="mb-1 text-center text-[8px] font-bold uppercase tracking-[0.25em]"
            style={{ color: primary }}
          >
            Навыки
          </div>
          <p className="text-center text-[7px] text-gray-700">
            {SAMPLE.skills.join(" · ")}
          </p>
        </section>
      </div>
    </div>
  );
}

export function TemplateSelector({ isModal = false, onSelect }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const setTemplate = useBuilderStore((s) => s.setTemplate);
  const nextStep = useBuilderStore((s) => s.nextStep);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'All') return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const handleSelect = (template: DocumentTemplate) => {
    if (onSelect) {
      onSelect(template);
    } else {
      setTemplate(template);
      nextStep();
    }
  };

  return (
    <div className={cn('mx-auto w-full', isModal ? 'px-0' : 'max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8')}>
      {!isModal && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Выберите шаблон для резюме
          </h2>
          <p className="mt-2 text-gray-500">
            Выберите шаблон, чтобы начать. Сменить можно в любой момент.
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === category.id
                ? 'bg-[#0D47A1] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleSelect(template)}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              'group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all duration-200',
              hoveredId === template.id
                ? 'scale-[1.02] border-[#0D47A1] shadow-lg'
                : 'border-gray-200 shadow-sm hover:shadow-md'
            )}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              {/* Real template preview */}
              <TemplatePreview template={template} />

              {/* New / Pro badges */}
              {template.isNew && (
                <div className="absolute right-2 top-2 z-10">
                  <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5">
                    NEW
                  </Badge>
                </div>
              )}
              {template.is_premium && (
                <div className="absolute left-2 top-2 z-10">
                  <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                    PRO
                  </Badge>
                </div>
              )}

              {/* Hover overlay with action button */}
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg">
                  Использовать
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 px-3 py-3">
              <h3 className="text-sm font-semibold text-gray-900">
                {template.name}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {CATEGORY_LABEL_RU[template.category] || template.category}
              </p>
              <div className="mt-2 flex gap-1">
                {template.colors.slice(0, 5).map((color, i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
