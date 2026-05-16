"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Brain, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniResumePreview } from "@/components/templates/MiniResumePreview";

const features = [
  {
    icon: Zap,
    title: "Быстрое и интуитивное создание резюме.",
    description:
      "Создавайте резюме за минуты, а не за часы. Удобный drag-and-drop интерфейс и умное автозаполнение делают процесс простым. Выберите шаблон, введите данные — Resumer возьмёт форматирование на себя.",
    imageRight: true,
    color: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    icon: Brain,
    title: "Экспертная оптимизация в нужном контексте.",
    description:
      "Получайте AI-подсказки для улучшения резюме в реальном времени. Система анализирует ваш текст и предлагает сильные глаголы действия, чёткие формулировки и ключевые слова для прохождения ATS-фильтров.",
    imageRight: false,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    icon: Eye,
    title: "Интерактивный предпросмотр документа.",
    description:
      "Видите, как будет выглядеть резюме, прямо во время создания. Live-предпросмотр обновляется мгновенно. Переключайте шаблоны, меняйте раскладку и проверяйте разные форматы без ожидания.",
    imageRight: true,
    color: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="bg-brand-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Получите работу мечты с{" "}
            <span className="text-[#0D47A1]">современным</span> конструктором
            Resumer.
          </h2>
        </motion.div>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className={`flex flex-col items-center gap-10 lg:gap-16 ${
                  feature.imageRight ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-text sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-brand-text-secondary">
                    {feature.description}
                  </p>
                </div>

                {/* Real template preview — different template per feature */}
                <div className="flex flex-1 justify-center">
                  <div className="w-full max-w-md">
                    {index === 0 && (
                      <MiniResumePreview templateSlug="modern" primaryColor="#E65100" />
                    )}
                    {index === 1 && (
                      <div className="space-y-3">
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                          <div className="flex items-start gap-2">
                            <Brain className="mt-0.5 h-4 w-4 text-amber-500" />
                            <div className="flex-1 space-y-1">
                              <div className="text-xs font-medium text-amber-900">
                                AI-подсказка
                              </div>
                              <div className="text-[11px] text-amber-700">
                                «Замените «отвечал за» на «возглавил» и
                                добавьте конкретный результат в %.»
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <div className="flex items-start gap-2">
                            <svg
                              className="mt-0.5 h-4 w-4 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <div className="flex-1 space-y-1">
                              <div className="text-xs font-medium text-green-900">
                                ATS-оптимизировано
                              </div>
                              <div className="text-[11px] text-green-700">
                                Ваше резюме содержит все ключевые слова из
                                описания вакансии.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="overflow-hidden rounded-lg shadow-md">
                          <MiniResumePreview templateSlug="concept" primaryColor="#00695C" />
                        </div>
                      </div>
                    )}
                    {index === 2 && (
                      <MiniResumePreview templateSlug="diamond" primaryColor="#2E7D32" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            size="lg"
            className="h-14 px-10 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <Link href="/resume-builder">Создать резюме сейчас</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
