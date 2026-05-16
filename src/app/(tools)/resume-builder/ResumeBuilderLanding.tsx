"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Zap,
  Shield,
  Download,
  Palette,
  Brain,
  Eye,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/marketing/FAQSection";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { RESUME_TEMPLATES } from "@/lib/data/templates";

const FEATURED_TEMPLATES = RESUME_TEMPLATES.slice(0, 8);

const features = [
  {
    icon: Zap,
    title: "Быстро и просто",
    description:
      "Создайте резюме менее чем за 10 минут с удобным drag-and-drop интерфейсом. Никаких дизайнерских навыков.",
  },
  {
    icon: Shield,
    title: "Совместимость с ATS",
    description:
      "Каждый шаблон оптимизирован для прохождения через системы отбора кандидатов — ваше резюме доходит до живого рекрутера.",
  },
  {
    icon: Brain,
    title: "AI-подсказки",
    description:
      "Получайте подсказки в реальном времени: сильные глаголы действия, ключевые слова и оптимизация под вашу вакансию.",
  },
  {
    icon: Palette,
    title: "Профессиональные шаблоны",
    description:
      "Выбирайте из 30+ профессионально разработанных шаблонов. Настраивайте цвета, шрифты и раскладку.",
  },
  {
    icon: Eye,
    title: "Live-предпросмотр",
    description:
      "Видите изменения в реальном времени. Переключайте шаблоны мгновенно без потери содержимого.",
  },
  {
    icon: Download,
    title: "Экспорт в PDF",
    description:
      "Скачивайте готовое резюме в PDF высокого качества для откликов. Можно скачивать повторно после изменений.",
  },
];

const steps = [
  {
    number: "1",
    title: "Выберите шаблон",
    description:
      "Просматривайте коллекцию профессионально разработанных шаблонов. Каждый прошёл ATS-тестирование и одобрен рекрутерами. Выберите подходящий вашей сфере.",
  },
  {
    number: "2",
    title: "Заполните данные",
    description:
      "Введите личную информацию, опыт работы, образование и навыки. Умный редактор поможет с подсказками и AI-рекомендациями для каждого раздела.",
  },
  {
    number: "3",
    title: "Скачайте и откликайтесь",
    description:
      "Просмотрите готовое резюме в live-предпросмотре, внесите финальные правки и скачайте PDF. Откликайтесь на вакансии уверенно.",
  },
];

const resumeBuilderFAQs = [
  {
    question: "Что такое конструктор резюме?",
    answer:
      "Конструктор резюме — это онлайн-инструмент, упрощающий создание профессионального резюме. Вместо форматирования с нуля вы выбираете шаблон, заполняете данные, а инструмент берёт дизайн и раскладку на себя. Resumer также включает AI-оптимизацию для усиления вашего контента.",
  },
  {
    question: "Бесплатный ли конструктор резюме?",
    answer:
      "Да, Resumer предлагает бесплатный тариф для создания и редактирования резюме на базовых шаблонах. Премиум открывает все шаблоны, AI-подсказки, конструктор сопроводительных писем и неограниченный экспорт PDF.",
  },
  {
    question: "Сколько времени занимает создание резюме?",
    answer:
      "Большинство пользователей завершают резюме за 10–15 минут. Если у вас уже есть опыт работы и образование под рукой, может занять ещё меньше. Интуитивный интерфейс и готовые подсказки значительно ускоряют процесс.",
  },
  {
    question: "Можно ли настраивать шаблоны?",
    answer:
      "Безусловно. Можно настраивать шрифты, цвета, порядок разделов и раскладку. Можно добавлять, удалять или менять местами разделы под свои нужды. Все изменения отображаются в реальном времени.",
  },
  {
    question: "Шаблоны проходят ATS?",
    answer:
      "Да, все шаблоны Resumer спроектированы и протестированы на совместимость с ATS. Чистое форматирование, стандартные заголовки и правильная структура документа — резюме корректно распознаётся автоматическими системами.",
  },
  {
    question: "Можно ли создать несколько резюме?",
    answer:
      "Да, можно создавать и сохранять несколько резюме под разные вакансии. Это особенно полезно при отклике в разные сферы или роли с акцентом на разных навыках.",
  },
  {
    question: "В каких форматах можно скачать резюме?",
    answer:
      "Резюме можно скачать в PDF — самом востребованном формате для откликов. PDF сохраняет форматирование на любом устройстве и в любой программе.",
  },
  {
    question: "Можно ли импортировать существующее резюме?",
    answer:
      "Да, Resumer поддерживает импорт резюме из PDF или Word. Парсер извлекает данные и автоматически заполняет поля шаблона, экономя время.",
  },
  {
    question: "Как работают AI-подсказки?",
    answer:
      "По мере заполнения резюме AI анализирует ваш текст и предлагает улучшения в реальном времени: более сильные глаголы действия, оптимизацию пунктов, релевантные ключевые слова и предупреждения о типичных ошибках.",
  },
  {
    question: "Безопасны ли мои данные?",
    answer:
      "Да, безопасность данных — приоритет. Все данные шифруются при передаче и хранении. Мы никогда не передаём личную информацию третьим лицам. Аккаунт и все данные можно удалить в любой момент.",
  },
  {
    question: "Можно ли поделиться резюме?",
    answer:
      "Да, можно создать ссылку для просмотра резюме онлайн. Также можно экспортировать PDF и отправить его по email или мессенджерам.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function ResumeBuilderLanding() {
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
              Профессиональный{" "}
              <span className="text-[#0D47A1]">конструктор резюме</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-text-secondary sm:text-xl">
              Создайте резюме, которое получит работу, за минуты. Выбирайте из
              шаблонов от экспертов, получайте AI-подсказки и скачивайте готовое
              резюме в PDF.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <Link href="/build-resume">Создать резюме</Link>
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
            Создайте резюме всего за{" "}
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
              Всё для создания{" "}
              <span className="text-[#0D47A1]">выдающегося резюме</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-text-secondary">
              Resumer объединяет профессиональный дизайн с мощными инструментами
              для создания идеального резюме.
            </p>
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

      {/* Real templates */}
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
              Выберите из{" "}
              <span className="text-[#0D47A1]">профессиональных шаблонов</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-text-secondary">
              Каждый шаблон разработан профессионалами, протестирован
              рекрутерами и оптимизирован под ATS.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_TEMPLATES.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                basePath="/build-resume"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/resume-templates">Все шаблоны</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0D47A1] py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Почему выбирают Resumer?
            </h2>
          </motion.div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: "30+", label: "Профессиональных шаблонов" },
              { stat: "10М+", label: "Созданных резюме" },
              { stat: "4.5/5", label: "Рейтинг пользователей" },
              { stat: "93%", label: "Получают приглашения" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <p className="text-4xl font-extrabold text-white">{item.stat}</p>
                <p className="mt-2 text-sm text-white/70">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
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
              Что делает резюме отличным?
            </h2>
            <div className="mt-10 space-y-4 text-left">
              {[
                "Чёткое профессиональное форматирование, удобное для сканирования",
                "Сильные глаголы действия и измеримые достижения",
                "Ключевые слова под описание целевой вакансии",
                "Краткое summary с вашим ценностным предложением",
                "Раздел навыков, организованный по уровню",
                "Чистый дизайн, проходящий через ATS-системы",
                "Единое форматирование без орфографических ошибок",
                "Актуальные контактные данные",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#0D47A1]" />
                  <span className="text-base text-brand-text-secondary">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <Link href="/build-resume">Создать резюме сейчас</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection title="Частые вопросы о резюме" items={resumeBuilderFAQs} />
    </>
  );
}
