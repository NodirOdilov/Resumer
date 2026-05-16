import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "О Resumer | Наша миссия и команда",
  description: "Узнайте о миссии Resumer — помочь миллионам людей создавать профессиональные резюме. Познакомьтесь с нашей командой карьерных экспертов, дизайнеров и инженеров.",
};

const stats = [
  { value: "2M+", label: "Пользователей по всему миру" },
  { value: "1.7B+", label: "Загруженных документов" },
  { value: "150+", label: "Стран обслуживания" },
  { value: "4.8/5", label: "Средний рейтинг" },
];

const teamMembers = [
  { name: "Sarah Chen", role: "Генеральный директор и сооснователь", bio: "Бывший рекрутер Google с 15-летним опытом в подборе талантов." },
  { name: "Michael Rivera", role: "Технический директор и сооснователь", bio: "Бывший руководитель инженерного отдела Amazon. Создавал системы для миллионов пользователей." },
  { name: "Dr. Emily Watson", role: "Руководитель отдела карьерной науки", bio: "Доктор индустриальной психологии. Опубликованный исследователь в области найма." },
  { name: "James Park", role: "Вице-президент по продукту", bio: "Ранее руководил продуктом в LinkedIn Jobs и Indeed." },
  { name: "Anna Kowalski", role: "Руководитель отдела дизайна", bio: "Дизайнер, отмеченный наградами. Бывший ведущий дизайнер Canva." },
  { name: "David Thompson", role: "Вице-президент по разработке", bio: "Full-stack архитектор. Более 10 лет создаёт масштабируемые SaaS-платформы." },
  { name: "Maria Garcia", role: "Руководитель отдела контента", bio: "Карьерный коуч и автор книг по составлению резюме." },
  { name: "Alex Johnson", role: "Руководитель отдела ИИ", bio: "Исследователь машинного обучения. Бывший участник NLP-команды OpenAI." },
  { name: "Lisa Chang", role: "Руководитель отдела маркетинга", bio: "Эксперт по growth-маркетингу. Развила два стартапа от 0 до 1 млн пользователей." },
  { name: "Robert Kim", role: "Руководитель отдела клиентского успеха", bio: "Увлечён помощью людям в достижении карьерных целей." },
  { name: "Priya Sharma", role: "Старший эксперт по резюме", bio: "Сертифицированный профессиональный составитель резюме с сертификацией NRWA." },
  { name: "Tom Williams", role: "Старший фронтенд-инженер", bio: "Специалист по React, ориентирован на доступность и производительность." },
  { name: "Sophie Martin", role: "UX-исследователь", bio: "Эксперт по исследованию пользователей. Ежемесячно проводит интервью с более чем 200 соискателями." },
  { name: "Chris Lee", role: "Бэкенд-инженер", bio: "Эксперт по распределённым системам. Обеспечивает 99,99% времени безотказной работы." },
  { name: "Rachel Green", role: "Контент-стратег", bio: "Эксперт по SEO и контент-маркетингу с 8-летним опытом." },
  { name: "Daniel Brown", role: "Специалист по данным", bio: "Анализирует тенденции найма, чтобы наши шаблоны и советы оставались актуальными." },
  { name: "Olivia Davis", role: "Руководитель QA", bio: "Гарантирует, что каждый шаблон отображается идеально на всех устройствах." },
  { name: "Kevin Wilson", role: "DevOps-инженер", bio: "Специалист по инфраструктуре, обеспечивающий быстроту и безопасность платформы." },
  { name: "Jennifer Taylor", role: "Карьерный коуч", bio: "Помогает пользователям создавать убедительные истории для откликов." },
  { name: "Mark Anderson", role: "Мобильный разработчик", bio: "Создаёт мобильное редактирование резюме нового поколения." },
  { name: "Emma White", role: "Дизайнер шаблонов", bio: "Создаёт красивые, ATS-совместимые шаблоны, которыми пользуются миллионы." },
  { name: "Nathan Harris", role: "Инженер по безопасности", bio: "Защищает данные пользователей с помощью корпоративных мер безопасности." },
];

const mediaLogos = [
  "Forbes", "TechCrunch", "Business Insider", "The Muse", "Glassdoor", "Inc.", "Fast Company", "Wired",
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0D47A1]">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">О нас</span>
          </nav>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Помогаем миллионам получить работу мечты
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Основанная в 2020 году, компания Resumer возникла из простого наблюдения: создание
              профессионального резюме не должно занимать часы изматывающей работы с форматированием.
              Наша миссия — дать соискателям по всему миру инструменты, которые делают процесс
              трудоустройства проще, быстрее и эффективнее.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-[#0D47A1]">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Наша история</h2>
            <div className="mt-6 space-y-4 text-gray-600">
              <p>
                Всё началось, когда наши сооснователи Сара и Майкл осознали, что существующие
                инструменты для создания резюме либо слишком сложны для обычных пользователей,
                либо слишком примитивны, чтобы получить действительно профессиональный результат.
                Они решили создать что-то лучшее.
              </p>
              <p>
                Сегодня Resumer доверяют более 2 миллионов соискателей в более чем 150 странах.
                Наша платформа сочетает красивый дизайн с мощными технологиями, включая
                AI-ассистента для написания текстов и оптимизацию под ATS в реальном времени,
                чтобы помочь вам создавать документы, приносящие результат.
              </p>
              <p>
                Каждый разработанный нами шаблон протестирован на реальных HR-менеджерах и ATS-системах.
                Каждая создаваемая нами функция основана на отзывах нашего сообщества.
                Мы одержимы тем, чтобы помочь вам показать себя с лучшей стороны.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Наша команда</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0D47A1]/10">
                  <span className="text-lg font-bold text-[#0D47A1]">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm font-medium text-[#0D47A1]">{member.role}</p>
                <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">О нас писали</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {mediaLogos.map((logo) => (
              <div key={logo} className="flex h-12 items-center">
                <span className="text-xl font-bold text-gray-300">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Присоединяйтесь к миллионам соискателей</h2>
          <p className="mt-4 text-lg text-gray-600">
            Создайте профессиональное резюме, CV или сопроводительное письмо за считанные минуты с нашим простым в использовании конструктором.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/resume-builder">Создать резюме бесплатно</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
