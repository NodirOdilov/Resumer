"use client";

import { motion } from "framer-motion";
import { MiniResumePreview } from "@/components/templates/MiniResumePreview";

const steps = [
  {
    number: "1",
    title: "Заполните поля и наблюдайте за результатом в реальном времени.",
    description:
      "Resumer упрощает создание резюме. Просто выберите шаблон, заполните данные — и ваше резюме оживает прямо во время набора текста. Никаких сложных настроек или дизайнерских навыков.",
    imageRight: true,
  },
  {
    number: "2",
    title: "Придайте документу профессиональный и элегантный вид.",
    description:
      "Выбирайте из десятков профессионально разработанных шаблонов. Настраивайте цвета, шрифты и расположение под свой стиль и желаемую вакансию. Каждый шаблон протестирован рекрутерами и проходит ATS-фильтры.",
    imageRight: false,
  },
  {
    number: "3",
    title: "Скачайте резюме, отправьте, получайте больше приглашений.",
    description:
      "Экспортируйте готовое резюме в PDF и начинайте откликаться. Наши резюме оптимизированы для прохождения ATS-систем и впечатляют HR-менеджеров. Получайте больше собеседований с резюме, которое выделяется.",
    imageRight: true,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function StepsSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Создайте резюме всего за{" "}
            <span className="text-[#0D47A1]">3 шага</span>.
          </h2>
        </motion.div>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`flex flex-col items-center gap-10 lg:gap-16 ${
                step.imageRight ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0D47A1] text-xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-brand-text sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-brand-text-secondary">
                  {step.description}
                </p>
              </div>

              <div className="flex flex-1 justify-center">
                <div className="w-full max-w-md">
                  {index === 0 && (
                    <MiniResumePreview templateSlug="newcast" primaryColor="#1565C0" />
                  )}
                  {index === 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="opacity-50">
                        <MiniResumePreview templateSlug="cubic" primaryColor="#0D47A1" />
                      </div>
                      <div className="ring-2 ring-[#0D47A1] ring-offset-2 rounded-xl">
                        <MiniResumePreview templateSlug="diamond" primaryColor="#2E7D32" />
                      </div>
                      <div className="opacity-50">
                        <MiniResumePreview templateSlug="enfold" primaryColor="#C62828" />
                      </div>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="space-y-4">
                      <div className="mx-auto w-3/4">
                        <MiniResumePreview templateSlug="vibes" primaryColor="#6A1B9A" />
                      </div>
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 rounded-lg bg-[#0D47A1] px-4 py-2">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          <span className="text-xs font-medium text-white">
                            Скачать PDF
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
