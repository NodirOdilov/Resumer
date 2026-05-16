"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/templates/TemplateCard";
import {
  RESUME_TEMPLATES,
  CV_TEMPLATES,
  COVER_LETTER_TEMPLATES,
} from "@/lib/data/templates";

const FEATURED_RESUMES = RESUME_TEMPLATES.slice(0, 8);
const FEATURED_CVS = CV_TEMPLATES.slice(0, 8);
const FEATURED_LETTERS = COVER_LETTER_TEMPLATES.slice(0, 8);

export function TemplateGallery() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Профессиональные шаблоны на любой случай
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Выбирайте из коллекции красиво оформленных ATS-шаблонов. Каждый
            создан, чтобы помочь вам выделиться.
          </p>
        </motion.div>

        <div className="mt-12">
          <Tabs defaultValue="resume" className="w-full">
            <div className="flex justify-center">
              <TabsList className="h-12 rounded-xl bg-gray-100 p-1">
                <TabsTrigger
                  value="resume"
                  className="rounded-lg px-6 py-2 text-sm font-medium"
                >
                  Резюме
                </TabsTrigger>
                <TabsTrigger
                  value="cover-letter"
                  className="rounded-lg px-6 py-2 text-sm font-medium"
                >
                  Сопроводительное
                </TabsTrigger>
                <TabsTrigger
                  value="cv"
                  className="rounded-lg px-6 py-2 text-sm font-medium"
                >
                  CV
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="resume" className="mt-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {FEATURED_RESUMES.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    basePath="/build-resume"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cover-letter" className="mt-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {FEATURED_LETTERS.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    basePath="/build-letter"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cv" className="mt-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {FEATURED_CVS.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    basePath="/build-cv"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link href="/resume-templates">Все шаблоны</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
