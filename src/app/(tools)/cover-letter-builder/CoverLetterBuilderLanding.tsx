"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Zap,
  Download,
  Palette,
  Brain,
  Target,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/marketing/FAQSection";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { COVER_LETTER_TEMPLATES } from "@/lib/data/templates";

const FEATURED_TEMPLATES = COVER_LETTER_TEMPLATES.slice(0, 8);

const features = [
  {
    icon: Brain,
    title: "AI-помощник написания",
    description:
      "Получайте AI-сгенерированный контент письма на основе резюме и описания вакансии. Персонализация в несколько кликов.",
  },
  {
    icon: Palette,
    title: "Совпадающие шаблоны",
    description:
      "Выбирайте шаблоны писем, которые идеально сочетаются с дизайном резюме — единый профессиональный комплект.",
  },
  {
    icon: Target,
    title: "Под конкретную вакансию",
    description:
      "Адаптируйте письмо под каждую вакансию: целевые ключевые слова, упоминания компании и релевантный опыт.",
  },
  {
    icon: Zap,
    title: "Быстро и просто",
    description:
      "Создайте профессиональное сопроводительное письмо менее чем за 5 минут. Редактор проводит через каждый абзац.",
  },
  {
    icon: MessageCircle,
    title: "Экспертный тон",
    description:
      "Идеальный баланс между профессиональным и человечным. AI обеспечивает уверенный и искренний голос письма.",
  },
  {
    icon: Download,
    title: "Экспорт в PDF",
    description:
      "Скачивайте письмо в PDF, идеально сочетающемся с резюме. Отправляйте как единый комплект документов.",
  },
];

const steps = [
  {
    number: "1",
    title: "Выберите подходящий шаблон",
    description:
      "Выберите шаблон письма, дополняющий ваше резюме. Наши дизайны делают пакет документов цельным и профессиональным.",
  },
  {
    number: "2",
    title: "Пишите с AI-помощником",
    description:
      "Введите данные вакансии и позвольте AI сгенерировать адаптированный текст. Настраивайте вступление, основную часть и заключение с подсказками.",
  },
  {
    number: "3",
    title: "Скачайте и отправьте",
    description:
      "Просмотрите письмо, внесите финальные правки и скачайте PDF. Объедините с резюме для откликов, которые впечатляют HR-менеджеров.",
  },
];

const coverLetterFAQs = [
  {
    question: "Что такое сопроводительное письмо?",
    answer:
      "Сопроводительное письмо — это одностраничный документ, прикладываемый к резюме при отклике на вакансию. Оно представляет вас работодателю, объясняет интерес к позиции, выделяет наиболее релевантные качества и показывает, как ваш опыт соответствует требованиям. Качественное письмо может выделить вас среди других кандидатов.",
  },
  {
    question: "Действительно ли нужно сопроводительное письмо?",
    answer:
      "Хотя оно не всегда требуется, письмо значительно повышает шансы. Исследования показывают, что 50% рекрутеров ждут сопроводительное письмо, а 26% считают его важным при принятии решения. Хорошо написанное письмо демонстрирует усилие, энтузиазм и коммуникационные навыки, которые резюме не покажет.",
  },
  {
    question: "Какой длины должно быть сопроводительное письмо?",
    answer:
      "Сопроводительное письмо должно занимать одну страницу — обычно 250–400 слов. Структура: вступление, привлекающее внимание, 1–2 абзаца основной части с релевантным опытом и заключение с призывом к действию. Кратко и по делу.",
  },
  {
    question: "Что должно быть в сопроводительном письме?",
    answer:
      "Письмо должно включать: ваши контакты, дату, данные работодателя, приветствие, цепляющее вступление, основные абзацы, связывающие опыт с требованиями вакансии, заключение с призывом к действию и подпись. Фокусируйтесь на том, что вы можете дать компании.",
  },
  {
    question: "Как начать сопроводительное письмо?",
    answer:
      "Начните с сильного вступления, сразу привлекающего внимание. Укажите позицию, как вы её нашли, и убедительную причину, почему вы — отличный кандидат. Избегайте общих фраз вроде «Я пишу, чтобы откликнуться на...». Лучше начать с достижения, общего знакомства или искреннего интереса к компании.",
  },
  {
    question: "Должны ли дизайны письма и резюме совпадать?",
    answer:
      "Да, совпадающие дизайны письма и резюме создают аккуратный и цельный пакет документов. Единое форматирование, шрифты и цвета демонстрируют внимание к деталям и профессионализм. Шаблоны Resumer спроектированы парами.",
  },
  {
    question: "Можно ли использовать одно письмо для всех откликов?",
    answer:
      "Нет, письмо нужно адаптировать под каждую вакансию. Шаблонные письма легко определяются рекрутерами и существенно снижают ваши шансы. Адаптируйте текст под конкретную компанию, роль и требования. AI-помощник ускоряет это.",
  },
  {
    question: "Как работает AI-помощник?",
    answer:
      "AI анализирует ваше резюме и описание вакансии, генерируя персонализированный контент письма. Предлагает релевантные достижения, помогает подобрать язык под требования и обеспечивает профессиональный тон. Полный контроль за редактированием остаётся за вами.",
  },
  {
    question: "Можно ли скачать письмо в PDF?",
    answer:
      "Да, письмо можно скачать в PDF высокого качества с сохранением форматирования на любом устройстве. Резюме и письмо можно скачать как комплект.",
  },
  {
    question: "Бесплатный ли конструктор?",
    answer:
      "Resumer предлагает бесплатный тариф для создания писем на базовых шаблонах. Премиум открывает все шаблоны, AI-помощника, неограниченные экспорты и комплекты резюме+письмо.",
  },
  {
    question: "Как закончить сопроводительное письмо?",
    answer:
      "Завершайте сильным заключительным абзацем, повторно подчёркивая интерес, обобщая, почему вы подходите, и добавляя призыв к действию: «Буду рад обсудить, как мой опыт может принести пользу вашей команде». Подписывайтесь профессионально: «С уважением» или «С наилучшими пожеланиями» с вашим именем.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function CoverLetterBuilderLanding() {
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
              <Mail className="h-8 w-8 text-[#0D47A1]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
              Конструктор{" "}
              <span className="text-[#0D47A1]">сопроводительных писем</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-text-secondary sm:text-xl">
              Создайте идеальное сопроводительное письмо за минуты с
              AI-помощью. Шаблоны, идеально сочетающиеся с резюме, и контент,
              адаптированный под каждую вакансию.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <Link href="/build-letter">Создать письмо</Link>
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
            Создайте письмо за{" "}
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
              Всё для{" "}
              <span className="text-[#0D47A1]">убедительного письма</span>
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

      {/* Templates */}
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
              <span className="text-[#0D47A1]">Шаблоны писем</span>, которые
              сочетаются с резюме
            </h2>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_TEMPLATES.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                basePath="/build-letter"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/cover-letter-templates">Все шаблоны писем</Link>
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
              Готовы выделиться среди других кандидатов?
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Создайте сопроводительное письмо, которое действительно ценит
              работодатель.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-14 bg-white px-10 text-base font-semibold text-[#0D47A1] hover:bg-gray-100"
              >
                <Link href="/build-letter">Начать бесплатно</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tips */}
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
              Что делает письмо отличным?
            </h2>
            <div className="mt-10 space-y-4 text-left">
              {[
                "Сильное вступление, сразу привлекающее внимание",
                "Конкретные примеры релевантного опыта и достижений",
                "Адаптация под конкретную компанию и вакансию",
                "Демонстрация знаний о компании и её ценностях",
                "Уверенный, но человечный тон письма",
                "Чёткий призыв к действию в заключении",
                "Безупречная грамматика и форматирование",
                "Длина не больше одной страницы",
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
      <FAQSection
        title="Частые вопросы о сопроводительных письмах"
        items={coverLetterFAQs}
      />
    </>
  );
}
