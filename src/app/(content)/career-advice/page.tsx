import type { Metadata } from "next";
import { ContentHub } from "@/components/shared/ContentHub";

export const metadata: Metadata = {
  title: "Карьерные советы и профессиональное развитие | Resumer",
  description:
    "Экспертные карьерные советы по профессиональному развитию, смене карьеры, рабочим навыкам и долгосрочному планированию карьеры.",
  keywords: [
    "карьерные советы",
    "профессиональное развитие",
    "смена карьеры",
    "рабочие навыки",
    "карьерный рост",
    "Resumer",
  ],
};

export default function CareerAdvicePage() {
  return (
    <ContentHub
      breadcrumbs={[{ label: "Карьерные советы" }]}
      title="Карьерные советы и профессиональное развитие"
      subtitle="Экспертное руководство для каждого этапа вашей карьеры — от первой работы до руководящих должностей."
      sections={[
        {
          title: "Планирование карьеры",
          links: [
            { title: "Планирование карьерного пути", description: "Как наметить траекторию карьеры и поставить достижимые цели.", href: "/career-advice#career-path" },
            { title: "Руководство по смене карьеры", description: "Пошаговое руководство по успешному переходу в новую профессию.", href: "/career-advice#career-change" },
            { title: "Профессиональное развитие", description: "Стратегии непрерывного обучения и развития навыков.", href: "/career-advice#development" },
            { title: "Личный бренд", description: "Создайте профессиональный бренд, который привлекает возможности.", href: "/career-advice#branding" },
          ],
        },
        {
          title: "Рабочие навыки",
          links: [
            { title: "Лидерские навыки", description: "Развивайте лидерские способности на каждом уровне карьеры.", href: "/career-advice#leadership" },
            { title: "Коммуникативные навыки", description: "Улучшайте профессиональное общение в письменной форме, устных выступлениях и презентациях.", href: "/career-advice#communication" },
            { title: "Тайм-менеджмент", description: "Техники продуктивности для управления нагрузкой и приоритетами.", href: "/career-advice#time-management" },
            { title: "Советы по удалённой работе", description: "Преуспейте в удалённой и гибридной рабочей среде.", href: "/career-advice#remote-work" },
          ],
        },
        {
          title: "Карьерный рост",
          links: [
            { title: "Получение повышения", description: "Стратегии позиционирования себя для повышения и продвижения по службе.", href: "/career-advice#promotion" },
            { title: "Переговоры о зарплате", description: "Как договариваться о зарплате на любом этапе карьеры.", href: "/career-advice#salary" },
            { title: "Наставничество", description: "Поиск и поддержание отношений с наставником для карьерного роста.", href: "/career-advice#mentorship" },
          ],
        },
      ]}
      ctaTitle="Сделайте следующий шаг в карьере"
      ctaDescription="Обновите своё резюме, чтобы отразить ваш рост. Наш конструктор делает поддержание актуальности документов простым."
      ctaButtonText="Обновить резюме"
      ctaButtonHref="/resume-builder"
    />
  );
}
