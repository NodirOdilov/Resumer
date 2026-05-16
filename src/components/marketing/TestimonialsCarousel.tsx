"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Анна Соколова",
    role: "Маркетинг-менеджер",
    rating: 5,
    text: "Resumer помог мне получить работу мечты в крупной компании. Шаблоны выглядят потрясающе, а AI-подсказки сделали моё резюме намного сильнее. Три приглашения на собеседование в первую неделю!",
    avatar: "АС",
  },
  {
    name: "Дмитрий Иванов",
    role: "Software Engineer",
    rating: 5,
    text: "Как разработчику мне нужно было чистое, профессиональное резюме. Resumer справился идеально. ATS-оптимизированные шаблоны прошли автоматический отбор, и я получил несколько офферов.",
    avatar: "ДИ",
  },
  {
    name: "Екатерина Волкова",
    role: "UX-дизайнер",
    rating: 5,
    text: "Live-предпросмотр — это нечто. Я видела, как выглядит резюме, прямо во время создания. Шаблоны современные и элегантные, идеальны для креативного специалиста.",
    avatar: "ЕВ",
  },
  {
    name: "Алексей Морозов",
    role: "Финансовый аналитик",
    rating: 4,
    text: "Не получалось уместить опыт на одной странице. Подсказки Resumer помогли расставить приоритеты. В итоге — лаконичное и убедительное резюме, которое заметили.",
    avatar: "АМ",
  },
  {
    name: "Мария Петрова",
    role: "Product Manager",
    rating: 5,
    text: "Смена профессии пугала, но Resumer сделал обновление резюме лёгким. Конструктор сопроводительных писем — приятный бонус. Через две недели у меня было несколько собеседований.",
    avatar: "МП",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsCarousel() {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-brand-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Что говорят наши пользователи
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-text-secondary">
            Присоединяйтесь к тысячам специалистов, которые уже создали резюме
            мечты в Resumer.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="mx-auto max-w-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-brand-border bg-white p-8 shadow-sm sm:p-10"
              >
                <StarRating rating={testimonials[current].rating} />
                <p className="mt-4 text-lg leading-relaxed text-brand-text-secondary">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D47A1] text-sm font-semibold text-white">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text">
                      {testimonials[current].name}
                    </p>
                    <p className="text-sm text-brand-text-muted">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  index === current
                    ? "w-8 bg-[#0D47A1]"
                    : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Перейти к отзыву ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
