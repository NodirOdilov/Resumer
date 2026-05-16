"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CoverLetterCTA() {
  return (
    <section className="bg-[#0D47A1] py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Left: Cover letter preview */}
          <motion.div
            className="flex flex-1 justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-sm">
              <div className="rounded-xl bg-white p-6 shadow-2xl">
                <div className="text-[14px] font-bold text-gray-900">
                  Анна Иванова
                </div>
                <div className="mt-0.5 text-[10px] text-gray-500">
                  anna.ivanova@email.com · Москва
                </div>
                <div className="my-3 h-px bg-gray-200" />
                <div className="text-[10px] text-gray-700">
                  <div className="font-semibold">Уважаемый менеджер по персоналу,</div>
                  <p className="mt-2 leading-relaxed">
                    Я пишу, чтобы выразить интерес к позиции Senior Software
                    Engineer в вашей компании. С более чем 7-летним опытом
                    разработки масштабируемых web-приложений я уверен, что
                    смогу внести значительный вклад в команду.
                  </p>
                  <p className="mt-2 leading-relaxed">
                    На текущей должности в Yandex я возглавил миграцию
                    монолита на микросервисы, ускорив релизы на 40%. Эти
                    результаты я готов воспроизвести и в вашей команде.
                  </p>
                  <p className="mt-2 leading-relaxed">
                    Спасибо за рассмотрение моей кандидатуры. Буду рад
                    обсудить, как я могу принести пользу вашей компании.
                  </p>
                  <p className="mt-3 font-semibold">С уважением,</p>
                  <p className="font-semibold">Анна Иванова</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-6xl font-extrabold text-white sm:text-7xl">50%</p>
            <p className="mt-2 text-xl font-semibold text-white/90 sm:text-2xl">
              рекрутеров ждут от вас сопроводительное письмо.
            </p>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              Дополните резюме сопроводительным письмом и обойдите других
              кандидатов. Качественное письмо показывает мотивацию и помогает
              выделиться на конкурентном рынке труда.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-14 bg-white px-10 text-base font-semibold text-[#0D47A1] transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-lg"
              >
                <Link href="/cover-letter-builder">
                  Создать сопроводительное письмо
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
