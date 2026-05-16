"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MiniResumePreview } from "@/components/templates/MiniResumePreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#0D47A1]/5 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 xl:px-12">
        {/* Left: Text content */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
            Резюме и{" "}
            <span className="text-[#0D47A1]">сопроводительное письмо</span>,
            которое получит работу
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-text-secondary sm:text-xl lg:max-w-none">
            Создайте мощное резюме и сопроводительное письмо за несколько минут.
            Заставьте рекрутеров захотеть нанять именно вас. Получите работу
            мечты.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            >
              <Link href="/resume-builder">Создать резюме</Link>
            </Button>
            <span className="text-sm text-brand-text-muted">
              Без банковской карты
            </span>
          </div>
        </motion.div>

        {/* Right: Resume preview placeholder */}
        <motion.div
          className="flex flex-1 justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -bottom-3 -right-3 h-full w-full rounded-xl bg-[#0D47A1]/10" />
            <div className="relative">
              <MiniResumePreview templateSlug="cubic" primaryColor="#0D47A1" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
