import type { Metadata } from "next";
import { ContentHub } from "@/components/shared/ContentHub";

export const metadata: Metadata = {
  title: "Помощь и руководства по CV | Resumer",
  description:
    "Узнайте, как написать CV, выбрать правильный формат и эффективно представить свою академическую и профессиональную историю.",
  keywords: [
    "помощь по CV",
    "руководства по CV",
    "как написать CV",
    "формат CV",
    "академическое CV",
    "Resumer",
  ],
};

export default function CVHubPage() {
  return (
    <ContentHub
      breadcrumbs={[{ label: "CV" }]}
      title="Помощь и руководства по CV"
      subtitle="Всё, что нужно для создания подробного curriculum vitae для академических, исследовательских и международных позиций."
      sections={[
        {
          title: "Руководства по CV",
          links: [
            { title: "Как написать CV", description: "Пошаговое руководство по написанию профессионального CV с нуля.", href: "/cv/how-to", badge: "Популярное" },
            { title: "Формат CV", description: "Узнайте о стандартах оформления CV и лучших практиках для разных областей.", href: "/cv/format" },
            { title: "CV против резюме", description: "Ключевые различия между CV и резюме, и когда использовать каждое.", href: "/resume/cv-vs-resume" },
          ],
        },
        {
          title: "Ресурсы CV",
          links: [
            { title: "Шаблоны CV", description: "Профессиональные шаблоны CV для академического и профессионального использования.", href: "/cv-templates" },
            { title: "Примеры CV", description: "Реальные примеры CV для разных отраслей и уровней карьеры.", href: "/cv-examples" },
            { title: "Конструктор CV", description: "Создайте своё CV онлайн с помощью нашего удобного конструктора.", href: "/cv-builder" },
          ],
        },
      ]}
      ctaTitle="Создайте своё CV сейчас"
      ctaDescription="Наш конструктор CV проведёт вас через создание подробного curriculum vitae с правильным оформлением и структурой."
      ctaButtonText="Создать CV"
      ctaButtonHref="/cv-builder"
    />
  );
}
