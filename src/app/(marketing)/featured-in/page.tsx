import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "О нас писали | Пресса и СМИ о Resumer",
  description: "Resumer в прессе. Читайте статьи и обзоры от Forbes, TechCrunch, Business Insider и других ведущих изданий.",
};

const mediaFeatures = [
  { publication: "Forbes", title: "10 лучших конструкторов резюме, которые действительно помогают найти работу", date: "Январь 2026", excerpt: "Resumer выделяется сочетанием красивых шаблонов и по-настоящему полезного AI-ассистента для написания текстов..." },
  { publication: "TechCrunch", title: "Resumer привлекает 15 млн долларов для демократизации создания профессиональных резюме", date: "Ноябрь 2025", excerpt: "AI-конструктор резюме стартапа привлёк более 2 миллионов пользователей с момента запуска в 2020 году..." },
  { publication: "Business Insider", title: "Я попробовал 7 конструкторов резюме. Вот тот, который я бы действительно рекомендовал", date: "Декабрь 2025", excerpt: "После тестирования всех крупных конструкторов резюме на рынке Resumer обеспечил наилучший баланс простоты использования и профессиональных результатов..." },
  { publication: "The Muse", title: "Как ИИ меняет способ написания резюме", date: "Февраль 2026", excerpt: "AI-ассистент Resumer не просто предлагает шаблонные фразы — он адаптирует контент под вашу конкретную отрасль и должность..." },
  { publication: "Glassdoor", title: "5 лучших бесплатных инструментов для соискателей в 2026 году", date: "Январь 2026", excerpt: "Бесплатный тариф Resumer предоставляет достаточно функций для создания отполированного, ATS-совместимого резюме без единого цента..." },
  { publication: "Inc.", title: "Этот стартап помогает миллионам успешно проходить отбор на работу", date: "Октябрь 2025", excerpt: "Благодаря шаблонам, протестированным реальными HR-менеджерами, и встроенной оптимизации под ATS, Resumer убирает догадки из процесса написания резюме..." },
  { publication: "Fast Company", title: "Самые инновационные карьерные технологические компании 2026 года", date: "Март 2026", excerpt: "Resumer заслужил место в нашем списке, сочетая дизайнерское совершенство с практическими, основанными на данных карьерными рекомендациями..." },
  { publication: "Wired", title: "AI-конструкторы резюме: стоят ли они того?", date: "Февраль 2026", excerpt: "Среди протестированных нами AI-инструментов для резюме Resumer создал наиболее естественно звучащий контент, сохранив при этом аутентичный голос пользователя..." },
];

export default function FeaturedInPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">О нас писали</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Resumer в прессе
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Узнайте, что говорят о Resumer ведущие издания. Мы гордимся признанием
            самых авторитетных мировых СМИ.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {mediaFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-400">{feature.publication}</span>
                  <span className="text-sm text-gray-400">{feature.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.excerpt}</p>
                <button className="mt-4 text-sm font-medium text-[#0D47A1] hover:underline">
                  Читать полностью
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Запросы СМИ</h2>
          <p className="mt-3 text-gray-600">
            Для запросов прессы, интервью или медиа-китов, пожалуйста, свяжитесь с нашим отделом по связям с общественностью.
          </p>
          <a href="mailto:press@resumer.com" className="mt-3 inline-block font-medium text-[#0D47A1] hover:underline">
            press@resumer.com
          </a>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Узнайте, почему Resumer доверяют миллионы</h2>
          <p className="mt-4 text-lg text-gray-600">
            Присоединяйтесь к более чем 2 миллионам пользователей, которые уже создали профессиональные резюме на нашей платформе.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/resume-builder">Создать бесплатное резюме</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
