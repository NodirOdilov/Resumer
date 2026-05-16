"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Download,
  Palette,
  Brain,
  GraduationCap,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/marketing/FAQSection";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { CV_TEMPLATES } from "@/lib/data/templates";

const FEATURED_TEMPLATES = CV_TEMPLATES.slice(0, 8);

const features = [
  {
    icon: GraduationCap,
    title: "Готов к академической карьере",
    description:
      "Шаблоны, разработанные для академических и научных позиций — с разделами для публикаций, конференций, грантов и преподавания.",
  },
  {
    icon: Shield,
    title: "Совместимость с ATS",
    description:
      "Чистое форматирование, проходящее через системы отбора кандидатов, при этом сохраняющее элегантный профессиональный вид.",
  },
  {
    icon: Brain,
    title: "Умные подсказки контента",
    description:
      "AI-рекомендации, адаптированные под написание CV, включая академические формулировки и описание исследований.",
  },
  {
    icon: Palette,
    title: "Гибкие раскладки",
    description:
      "Поддержка нескольких страниц с настраиваемыми разделами. Добавляйте публикации, сертификаты, проекты и т.д.",
  },
  {
    icon: Globe,
    title: "Международные стандарты",
    description:
      "Шаблоны, соответствующие международным стандартам CV — подходят для отклика в Европе, Азии и других регионах.",
  },
  {
    icon: Download,
    title: "Экспорт в PDF",
    description:
      "Скачивайте CV в идеально отформатированном PDF. Поддержка нескольких страниц охватывает весь ваш опыт.",
  },
];

const steps = [
  {
    number: "1",
    title: "Выберите шаблон CV",
    description:
      "Просматривайте коллекцию CV-шаблонов для академических, научных и международных откликов. Каждый поддерживает несколько страниц и развёрнутые разделы.",
  },
  {
    number: "2",
    title: "Заполните опыт",
    description:
      "Добавьте образование, научный опыт, публикации, навыки и многое другое. Пошаговый редактор поможет структурировать содержание с подсказками для CV.",
  },
  {
    number: "3",
    title: "Скачайте и откликайтесь",
    description:
      "Просмотрите готовое CV, настройте дизайн и экспортируйте в PDF. Откликайтесь на академические, научные или международные позиции уверенно.",
  },
];

const cvBuilderFAQs = [
  {
    question: "Что такое CV?",
    answer:
      "CV (Curriculum Vitae) — это развёрнутый документ, описывающий всю вашу академическую и профессиональную историю. В отличие от резюме, которое обычно занимает одну страницу, CV может состоять из нескольких страниц и включать образование, исследования, публикации, выступления, гранты, награды и другие академические активности.",
  },
  {
    question: "Чем CV отличается от резюме?",
    answer:
      "Резюме — это краткое 1–2-страничное обобщение релевантного опыта под конкретную вакансию. CV — это более полный документ, охватывающий всю академическую и профессиональную историю без ограничения страниц. CV обычно используют для академических, научных и международных позиций; резюме — для большинства корпоративных вакансий.",
  },
  {
    question: "Когда использовать CV вместо резюме?",
    answer:
      "Используйте CV при отклике на академические позиции, научные роли, стипендии, гранты или вакансии в странах, где CV — стандарт (большая часть Европы, Азии, Ближнего Востока). В США и Канаде CV в основном используют в академической среде. Для большинства корпоративных ролей в этих регионах предпочитают резюме.",
  },
  {
    question: "Какие разделы должно содержать CV?",
    answer:
      "Полное CV должно включать: контакты, профессиональное/научное summary, образование, опыт работы, публикации, выступления, исследовательский опыт, гранты, награды, профессиональные членства, преподавательский опыт и навыки. Разделы можно добавлять и убирать в зависимости от стадии карьеры.",
  },
  {
    question: "Какой длины должно быть CV?",
    answer:
      "В отличие от резюме, у CV нет жёсткого лимита страниц. У начинающих специалистов CV может занимать 2–3 страницы, у старших академиков — 10+ страниц. Главное — включить всю релевантную информацию без воды. Качество и релевантность важнее длины.",
  },
  {
    question: "Можно ли настраивать шаблоны CV?",
    answer:
      "Да, все шаблоны CV полностью настраиваемые. Можно менять цвета, шрифты, порядок разделов и раскладку. Можно добавить разделы для публикаций, сертификатов, языков или любой другой релевантной категории.",
  },
  {
    question: "Подходят ли шаблоны для международных откликов?",
    answer:
      "Да, наши шаблоны CV соответствуют международным стандартам форматирования. Они подходят для откликов в Европе, Азии, на Ближнем Востоке и т.д. По желанию можно добавить фото, дату рождения или гражданство, как требуют отдельные страны.",
  },
  {
    question: "Можно ли включить публикации и исследования?",
    answer:
      "Безусловно. Конструктор CV содержит выделенные разделы для публикаций, научных проектов, выступлений на конференциях и академических вкладов. Цитаты можно форматировать в разных академических стилях.",
  },
  {
    question: "Бесплатный ли конструктор CV?",
    answer:
      "Resumer предлагает бесплатный тариф с базовыми CV-шаблонами. Премиум открывает все шаблоны, AI-подсказки, неограниченные PDF-скачивания и экспорт нескольких страниц.",
  },
  {
    question: "Можно ли превратить резюме в CV?",
    answer:
      "Да. Можно начать с данных существующего резюме и расширить его до полноценного CV, добавив дополнительные разделы. Конструктор позволяет легко импортировать содержимое резюме.",
  },
  {
    question: "Как оформить публикации в CV?",
    answer:
      "Конструктор поддерживает несколько форматов цитирования: APA, MLA, Chicago и Harvard. Публикации можно группировать по типу (статьи, книги, конференц-доклады) или хронологически.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function CVBuilderLanding() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0D47A1]/5 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 text-center sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D47A1]/10">
              <FileText className="h-8 w-8 text-[#0D47A1]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
              Профессиональный <span className="text-[#0D47A1]">конструктор CV</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-text-secondary sm:text-xl">
              Создайте развёрнутое CV для академических, научных и
              международных откликов. Поддержка нескольких страниц, разделы для
              публикаций и профессиональное форматирование.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <Link href="/build-cv">Создать CV</Link>
              </Button>
              <span className="text-sm text-brand-text-muted">
                Бесплатный старт. Без банковской карты.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.h2
            className="text-center text-3xl font-bold tracking-tight text-brand-text sm:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            Создайте CV всего за{" "}
            <span className="text-[#0D47A1]">3 простых шага</span>
          </motion.h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0D47A1] text-2xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-brand-text">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-brand-text-secondary">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-brand-surface-alt py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
              Создан для{" "}
              <span className="text-[#0D47A1]">академического превосходства</span>
            </h2>
          </motion.div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="rounded-xl border border-brand-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D47A1]/10">
                    <Icon className="h-6 w-6 text-[#0D47A1]" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-text">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-text-secondary">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates — real previews */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
              <span className="text-[#0D47A1]">Шаблоны CV</span> для любой сферы
            </h2>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_TEMPLATES.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} basePath="/build-cv" />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/cv-templates">Все шаблоны CV</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0D47A1] py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Готовы создать своё CV?
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Тысячи академиков и специалистов доверяют Resumer для создания
              своего CV.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-14 bg-white px-10 text-base font-semibold text-[#0D47A1] hover:bg-gray-100"
              >
                <Link href="/build-cv">Начать бесплатно</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What to include in your CV */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
              Что включить в CV
            </h2>
            <div className="mt-10 space-y-4 text-left">
              {[
                "Полные контакты и профессиональное онлайн-присутствие",
                "Подробная история образования с степенями и наградами",
                "Научный опыт и описания проектов",
                "Список публикаций в правильном академическом формате",
                "Выступления на конференциях и приглашённые доклады",
                "Гранты, стипендии и полученное финансирование",
                "Преподавательский опыт и наставничество",
                "Профессиональные членства и сертификаты",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#0D47A1]" />
                  <span className="text-base text-brand-text-secondary">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection title="Частые вопросы о CV" items={cvBuilderFAQs} />
    </>
  );
}
