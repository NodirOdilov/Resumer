"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "Что такое конструктор резюме?",
    answer:
      "Конструктор резюме — это онлайн-инструмент, который помогает быстро и легко создать профессиональное резюме. Вместо того чтобы начинать с нуля в текстовом редакторе, конструктор предлагает готовые шаблоны, подсказки по содержанию и инструменты форматирования. Resumer также включает AI-оптимизацию, чтобы ваше резюме прошло ATS-фильтры.",
  },
  {
    question: "Как составить резюме?",
    answer:
      "Создать резюме в Resumer просто. Выберите шаблон, подходящий вашей сфере и опыту. Заполните личные данные, опыт работы, образование и навыки. Наш конструктор ведёт вас по каждому разделу с подсказками и примерами. Вы видите предпросмотр в реальном времени. Когда готово — скачайте PDF и начинайте откликаться на вакансии.",
  },
  {
    question: "Что нужно включать в резюме?",
    answer:
      "Сильное резюме включает контактную информацию, профессиональное резюме (summary), опыт работы с измеримыми достижениями, образование и релевантные навыки. В зависимости от сферы можно добавить разделы о сертификатах, проектах, волонтёрстве или публикациях. Шаблоны Resumer содержат все необходимые разделы — настраивайте под себя.",
  },
  {
    question: "Какой длины должно быть резюме?",
    answer:
      "Для большинства специалистов подходит одностраничное резюме, особенно при опыте работы менее 10 лет. Старшие специалисты или академические работники могут использовать две страницы. Главное — лаконичность и релевантность вакансии. Шаблоны Resumer помогают эффективно разместить контент на 1–2 страницах.",
  },
  {
    question: "Какой формат резюме лучший?",
    answer:
      "Три основных формата: обратно-хронологический, функциональный и комбинированный. Обратно-хронологический — самый популярный, его предпочитают рекрутеры; в нём сначала указывается последний опыт. Функциональный фокусируется на навыках — полезен при смене карьеры. Комбинированный объединяет оба подхода. Resumer предлагает шаблоны во всех форматах.",
  },
  {
    question: "Ваши шаблоны проходят ATS?",
    answer:
      "Да, все шаблоны Resumer оптимизированы под ATS (Applicant Tracking System) — программы, которыми работодатели сканируют резюме. Наши шаблоны используют чистое форматирование, стандартные заголовки разделов и корректную структуру документа. Ваше резюме попадёт к живому рекрутеру, а не отфильтруется автоматикой.",
  },
  {
    question: "Можно ли скачать резюме в PDF?",
    answer:
      "Конечно. Resumer позволяет скачать готовое резюме в PDF — самом востребованном формате для откликов. PDF сохраняет форматирование на любом устройстве и в любой программе. Скачивайте резюме в любой момент и перезагружайте после обновлений.",
  },
  {
    question: "Сколько стоит Resumer?",
    answer:
      "У Resumer есть бесплатный тариф для создания резюме на базовых шаблонах. Для доступа к премиум-шаблонам, AI-оптимизации, конструктору сопроводительных писем и неограниченным PDF-скачиваниям доступны месячные и годовые подписки. Подробности на странице тарифов.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-brand-border">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[#0D47A1]"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-base font-medium text-brand-text sm:text-lg">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-brand-text-muted transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-base leading-relaxed text-brand-text-secondary">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

interface FAQSectionProps {
  title?: string;
  items?: FAQItem[];
}

export function FAQSection({ title = "Часто задаваемые вопросы", items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const faqs = items ?? defaultFAQs;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            {title}
          </h2>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
