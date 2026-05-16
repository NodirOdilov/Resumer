import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/marketing/FAQSection";

export const metadata: Metadata = {
  title: "Тарифы и цены | Resumer",
  description:
    "Простые и прозрачные тарифы Resumer. Бесплатный план для начала, Pro для всех функций, Lifetime для безлимитного доступа без подписок.",
};

interface Tier {
  id: string;
  name: string;
  price: string;
  pricePeriod?: string;
  description: string;
  icon: typeof Zap;
  highlight?: boolean;
  ctaText: string;
  ctaHref: string;
  features: string[];
  notIncluded?: string[];
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    pricePeriod: "навсегда",
    description: "Идеально, чтобы попробовать конструктор и создать первое резюме.",
    icon: Zap,
    ctaText: "Начать бесплатно",
    ctaHref: "/signup",
    features: [
      "До 2 резюме одновременно",
      "10 базовых шаблонов",
      "Экспорт в PDF",
      "Авто-сохранение в браузере",
      "Базовые подсказки по контенту",
      "Совместимость с ATS",
    ],
    notIncluded: [
      "AI-улучшение текста",
      "Премиум-шаблоны",
      "Конструктор сопроводительных писем",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "490 ₽",
    pricePeriod: "в месяц",
    description: "Для активного поиска работы со всеми функциями.",
    icon: Sparkles,
    highlight: true,
    ctaText: "Перейти на Pro",
    ctaHref: "/account",
    features: [
      "Безлимит резюме, CV и писем",
      "Все 28+ премиум-шаблонов",
      "AI-улучшение и генерация текста",
      "Конструктор сопроводительных писем",
      "Конструктор CV (расширенный)",
      "Экспорт в PDF, DOCX, TXT",
      "Многостраничная вёрстка",
      "Обучение под конкретную вакансию",
      "Приоритетная поддержка по email",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "9 900 ₽",
    pricePeriod: "разовый платёж",
    description: "Один платёж — пожизненный доступ ко всем функциям Pro.",
    icon: Crown,
    ctaText: "Купить навсегда",
    ctaHref: "/account",
    features: [
      "Всё, что входит в Pro",
      "Без ежемесячных платежей",
      "Все будущие шаблоны",
      "Все будущие AI-функции",
      "Приоритетные обновления",
      "Личный успех-менеджер 30 дней",
      "Гарантия возврата 14 дней",
    ],
  },
];

const pricingFAQs = [
  {
    question: "Можно ли отменить подписку Pro?",
    answer:
      "Да, в любой момент. После отмены доступ к Pro-функциям сохраняется до конца оплаченного периода, а после автоматически переключается на Бесплатный тариф. Все ваши документы остаются доступными.",
  },
  {
    question: "Что включает гарантия возврата на Lifetime?",
    answer:
      "Если в течение 14 дней после покупки Lifetime тариф вам не подойдёт — возвращаем 100% оплаты без вопросов. Без бюрократии, без удержаний.",
  },
  {
    question: "В чём разница между Pro и Lifetime?",
    answer:
      "Функционально — никакой. И тот, и другой открывают все шаблоны, AI-функции и форматы экспорта. Разница только в модели оплаты: Pro — 490 ₽ в месяц, Lifetime — 9 900 ₽ единоразово (окупается за 20 месяцев).",
  },
  {
    question: "Есть ли скидки для студентов или некоммерческих организаций?",
    answer:
      "Да. Студенты с подтверждённым .edu или studsovet email получают 50% скидку на Pro в течение года. Сотрудники НКО — 30%. Напишите нам на support@resumer.com с подтверждением, и мы пришлём промокод.",
  },
  {
    question: "Какие способы оплаты вы принимаете?",
    answer:
      "Карты Visa, MasterCard, МИР, Apple Pay, Google Pay. Для юридических лиц — оплата по счёту с НДС. После оплаты Pro/Lifetime активируется автоматически в течение минуты.",
  },
  {
    question: "Что произойдёт с моими резюме, если я перейду на бесплатный тариф?",
    answer:
      "Все резюме сохраняются. Если их больше двух, лимит срабатывает на новые: вы не сможете создать третье, пока не удалите одно из существующих. Старые продолжают редактироваться и скачиваться.",
  },
  {
    question: "Можно ли сначала попробовать Pro бесплатно?",
    answer:
      "Да. При первой регистрации мы даём 7 дней Pro-доступа бесплатно — без банковской карты, без автосписания. Если понравится — можно перейти на платный план; если нет — без потерь вернётесь к Бесплатному.",
  },
  {
    question: "Покрывает ли Pro несколько устройств?",
    answer:
      "Да. Один аккаунт работает с любого количества устройств: ноутбук дома, телефон в дороге, компьютер на работе. Документы синхронизируются автоматически.",
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const Icon = tier.icon;
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        tier.highlight
          ? "border-[#0D47A1] bg-gradient-to-b from-blue-50/50 to-white shadow-xl ring-2 ring-[#0D47A1]/10"
          : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      {tier.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0D47A1] px-4 py-1 text-xs font-semibold text-white shadow-md">
          Популярный выбор
        </span>
      )}

      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
          tier.highlight
            ? "bg-[#0D47A1] text-white"
            : "bg-[#0D47A1]/10 text-[#0D47A1]"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
      <p className="mt-2 text-sm text-gray-600">{tier.description}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-gray-900">
          {tier.price}
        </span>
        {tier.pricePeriod && (
          <span className="text-sm text-gray-500">{tier.pricePeriod}</span>
        )}
      </div>

      <Button
        asChild
        size="lg"
        variant={tier.highlight ? "default" : "outline"}
        className="mt-6"
      >
        <Link href={tier.ctaHref}>{tier.ctaText}</Link>
      </Button>

      <div className="mt-8 space-y-3 border-t border-gray-100 pt-6">
        {tier.features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0D47A1]" />
            <span className="text-sm text-gray-700">{f}</span>
          </div>
        ))}
        {tier.notIncluded?.map((f, i) => (
          <div key={`x-${i}`} className="flex items-start gap-3 opacity-60">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-gray-400">
              —
            </span>
            <span className="text-sm text-gray-500 line-through">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-blue-50/40 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1100px] px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Простые тарифы. <span className="text-[#0D47A1]">Без скрытых платежей.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Создайте первое резюме бесплатно. Когда понадобится больше — выбирайте
            Pro или Lifetime. Отмена в любой момент, гарантия возврата 14 дней.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TIERS.map((tier) => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Сравнение тарифов
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Возможность
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Бесплатный
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#0D47A1]">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Lifetime
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Количество резюме", "До 2", "Безлимит", "Безлимит"],
                  ["Шаблоны", "10 базовых", "Все 28+", "Все 28+"],
                  ["AI-улучшение текста", "—", "✓", "✓"],
                  ["Конструктор писем", "—", "✓", "✓"],
                  ["Конструктор CV", "—", "✓", "✓"],
                  ["Форматы экспорта", "PDF", "PDF, DOCX, TXT", "PDF, DOCX, TXT"],
                  ["Будущие функции", "—", "Включены", "Включены навсегда"],
                  ["Поддержка", "Помощь по FAQ", "Email-приоритет", "Личный менеджер 30 дн."],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {row[0]}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-600">
                      {row[1]}
                    </td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-[#0D47A1]">
                      {row[2]}
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-700">
                      {row[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FAQSection title="Частые вопросы о тарифах" items={pricingFAQs} />

      <section className="border-t border-gray-100 bg-[#0D47A1] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Не уверены, какой тариф выбрать?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Начните бесплатно. Большинству пользователей хватает Free на первое
            резюме — а Pro можно подключить позже, когда понадобится.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="h-14 bg-white px-10 text-base font-semibold text-[#0D47A1] hover:bg-gray-100"
            >
              <Link href="/build-resume">Создать резюме бесплатно</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
