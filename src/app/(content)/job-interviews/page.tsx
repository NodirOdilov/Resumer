import type { Metadata } from "next";
import { ContentHub } from "@/components/shared/ContentHub";

export const metadata: Metadata = {
  title: "Подготовка к собеседованиям и советы | Resumer",
  description:
    "Готовьтесь к собеседованиям с экспертными руководствами по типичным вопросам, языку тела, видео-собеседованиям и переговорам.",
  keywords: [
    "собеседование",
    "подготовка к собеседованию",
    "вопросы на собеседовании",
    "видео-собеседование",
    "Resumer",
  ],
};

export default function JobInterviewsPage() {
  return (
    <ContentHub
      breadcrumbs={[{ label: "Собеседования" }]}
      title="Подготовка к собеседованиям и советы"
      subtitle="От подготовки до последующего обращения — всё, что нужно, чтобы блестяще пройти собеседование."
      sections={[
        {
          title: "Подготовка к собеседованию",
          links: [
            { title: "Как подготовиться к собеседованию", description: "Полный чек-лист для подготовки к собеседованию: от исследования компании до выбора одежды.", href: "/job-interviews#prepare" },
            { title: "Типичные вопросы на собеседовании", description: "50 самых популярных вопросов на собеседовании с экспертными примерами ответов.", href: "/job-interviews#common-questions", badge: "Популярное" },
            { title: "Поведенческие вопросы", description: "Освойте метод STAR для поведенческих и ситуационных вопросов.", href: "/job-interviews#behavioral" },
            { title: "Вопросы интервьюеру", description: "Умные вопросы, которые показывают ваш интерес и помогают оценить позицию.", href: "/job-interviews#ask-interviewer" },
          ],
        },
        {
          title: "Виды собеседований",
          links: [
            { title: "Телефонные собеседования", description: "Советы по созданию хорошего впечатления по телефону.", href: "/job-interviews#phone" },
            { title: "Видео-собеседования", description: "Настройка, технологии и этикет для виртуальных собеседований.", href: "/job-interviews#video" },
            { title: "Панельные собеседования", description: "Как уверенно общаться с несколькими интервьюерами одновременно.", href: "/job-interviews#panel" },
            { title: "Технические собеседования", description: "Стратегии подготовки к программистским задачам и техническим оценкам.", href: "/job-interviews#technical" },
          ],
        },
        {
          title: "После собеседования",
          links: [
            { title: "Благодарственное письмо", description: "Как написать благодарственное письмо, которое усилит вашу кандидатуру.", href: "/job-interviews#thank-you" },
            { title: "Переговоры о зарплате", description: "Стратегии для обсуждения зарплаты и пакета льгот.", href: "/job-interviews#negotiation" },
            { title: "Оценка предложений о работе", description: "Как сравнивать несколько предложений и принимать правильное решение.", href: "/job-interviews#evaluate-offers" },
          ],
        },
      ]}
      ctaTitle="Сначала получите приглашение на собеседование"
      ctaDescription="Отличное резюме открывает двери. Создайте такое, которое продемонстрирует вашу квалификацию."
      ctaButtonText="Создать резюме"
      ctaButtonHref="/resume-builder"
    />
  );
}
