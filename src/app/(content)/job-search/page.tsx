import type { Metadata } from "next";
import { ContentHub } from "@/components/shared/ContentHub";

export const metadata: Metadata = {
  title: "Стратегии и советы по поиску работы | Resumer",
  description:
    "Экспертные стратегии поиска работы: где искать вакансии, советы по нетворкингу, отслеживание заявок и многое другое.",
  keywords: [
    "поиск работы",
    "стратегии поиска работы",
    "нетворкинг",
    "вакансии",
    "карьера",
    "Resumer",
  ],
};

export default function JobSearchPage() {
  return (
    <ContentHub
      breadcrumbs={[{ label: "Поиск работы" }]}
      title="Стратегии и советы по поиску работы"
      subtitle="Проверенные стратегии для поиска подходящих возможностей и быстрого получения работы мечты."
      sections={[
        {
          title: "Основы поиска работы",
          links: [
            { title: "Где искать работу", description: "Лучшие сайты вакансий, корпоративные страницы и скрытые каналы для поиска объявлений.", href: "/job-search#find-jobs" },
            { title: "Нетворкинг для поиска работы", description: "Как использовать свою сеть контактов, чтобы узнавать о возможностях до их публикации.", href: "/job-search#networking" },
            { title: "Учёт откликов", description: "Системы и стратегии для эффективного управления несколькими заявками.", href: "/job-search#tracking" },
            { title: "Онлайн-присутствие", description: "Оптимизируйте свой профиль LinkedIn и онлайн-присутствие для рекрутеров.", href: "/job-search#online-presence" },
          ],
        },
        {
          title: "Стратегия откликов",
          links: [
            { title: "Адаптация откликов", description: "Как настраивать резюме и сопроводительное письмо под каждую позицию.", href: "/resume/targeted" },
            { title: "Дополнительные обращения", description: "Когда и как профессионально напоминать о своём отклике.", href: "/job-search#follow-up" },
            { title: "Исследование зарплат", description: "Как изучить уровень зарплат и понять свою рыночную стоимость.", href: "/job-search#salary" },
          ],
        },
      ]}
      ctaTitle="Подготовьте материалы для откликов"
      ctaDescription="Создайте профессиональное резюме и сопроводительное письмо, которые помогут вам выделиться в поиске работы."
      ctaButtonText="Создать резюме"
      ctaButtonHref="/resume-builder"
    />
  );
}
