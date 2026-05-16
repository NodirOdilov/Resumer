export interface ExampleCategory {
  name: string;
  slug: string;
  count: number;
  icon: string;
}

export const EXAMPLE_CATEGORIES: ExampleCategory[] = [
  { name: "Бухгалтерия и финансы", slug: "accounting-finance", count: 18, icon: "calculator" },
  { name: "Творческие профессии", slug: "creative-fields", count: 15, icon: "palette" },
  { name: "Образование", slug: "education", count: 14, icon: "book-open" },
  { name: "Инженерия, технологии и наука", slug: "engineering-tech-science", count: 22, icon: "cpu" },
  { name: "Сфера общественного питания", slug: "food-service", count: 12, icon: "utensils" },
  { name: "Здравоохранение", slug: "healthcare", count: 20, icon: "heart-pulse" },
  { name: "Информационные технологии", slug: "information-technology", count: 24, icon: "monitor" },
  { name: "Правоохранительные органы", slug: "law-enforcement", count: 10, icon: "shield" },
  { name: "Юриспруденция", slug: "legal", count: 11, icon: "scale" },
  { name: "Ремонт и обслуживание", slug: "maintenance-repair", count: 13, icon: "wrench" },
  { name: "Менеджмент", slug: "management", count: 16, icon: "briefcase" },
  { name: "Маркетинг и коммуникации", slug: "marketing-communications", count: 17, icon: "megaphone" },
  { name: "Офис и администрирование", slug: "office-admin", count: 15, icon: "building" },
  { name: "Недвижимость", slug: "real-estate", count: 8, icon: "home" },
  { name: "Продажи и обслуживание клиентов", slug: "sales-customer-service", count: 19, icon: "users" },
  { name: "Студенты и стажировки", slug: "students-internships", count: 16, icon: "graduation-cap" },
  { name: "Путешествия и гостеприимство", slug: "travel-hospitality", count: 10, icon: "plane" },
  { name: "Другое", slug: "other", count: 20, icon: "layers" },
];
