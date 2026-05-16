/**
 * Sample resume content used to render realistic previews in template
 * galleries. Populated with content that looks credible at a glance.
 */
import type {
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  SkillEntry,
  LanguageEntry,
} from "@/types";

export const SAMPLE_CONTACT: ContactInfo = {
  first_name: "Анна",
  last_name: "Иванова",
  job_title: "Senior Software Engineer",
  email: "anna.ivanova@email.com",
  phone: "+7 (999) 123-45-67",
  address: "ул. Тверская, 12",
  city: "Москва",
  state: "",
  zip_code: "125009",
  country: "Россия",
  linkedin: "linkedin.com/in/anna-ivanova",
  website: "annaivanova.dev",
};

export const SAMPLE_SUMMARY =
  "Senior Software Engineer с 7+ годами опыта в разработке масштабируемых web-приложений. Эксперт по React, Node.js и облачным архитектурам. Веду команды до 8 разработчиков, поставляю продукт быстро и качественно.";

export const SAMPLE_EXPERIENCE: ExperienceEntry[] = [
  {
    id: "exp-1",
    job_title: "Senior Software Engineer",
    company: "Yandex",
    location: "Москва, Россия",
    start_date: "2022-03",
    end_date: "",
    current: true,
    description:
      "• Возглавил миграцию с монолита на микросервисы, ускорив релизы на 40%.\n• Спроектировал API-шлюз, обслуживающий 50М+ запросов в день.\n• Менторил 4 инженеров, двое из них продвинулись до senior.\n• Выстроил процесс code review и тестирования, снизив количество багов в проде на 35%.",
  },
  {
    id: "exp-2",
    job_title: "Software Engineer",
    company: "Avito",
    location: "Москва, Россия",
    start_date: "2019-06",
    end_date: "2022-02",
    current: false,
    description:
      "• Разработал систему рекомендаций, повысив CTR на 18%.\n• Оптимизировал backend, снизив p95-латентность с 320 до 90 мс.\n• Внедрил automated end-to-end тестирование на критичных user flows.",
  },
  {
    id: "exp-3",
    job_title: "Junior Developer",
    company: "Mail.ru Group",
    location: "Москва, Россия",
    start_date: "2017-09",
    end_date: "2019-05",
    current: false,
    description:
      "• Поддерживал и развивал внутренние инструменты для команды дата-инженеров.\n• Запустил dashboard аналитики, который ежедневно используется 200+ сотрудниками.",
  },
];

export const SAMPLE_EDUCATION: EducationEntry[] = [
  {
    id: "edu-1",
    degree: "Магистр",
    field_of_study: "Прикладная математика и информатика",
    school: "МГУ им. М.В. Ломоносова",
    location: "Москва",
    start_date: "2015-09",
    end_date: "2019-06",
    current: false,
    gpa: "4.8 / 5.0",
    description:
      "Дипломная работа по системам распределённых вычислений. С отличием.",
  },
];

export const SAMPLE_SKILLS: SkillEntry[] = [
  { id: "s1", name: "TypeScript", level: "expert" },
  { id: "s2", name: "React", level: "expert" },
  { id: "s3", name: "Node.js", level: "advanced" },
  { id: "s4", name: "PostgreSQL", level: "advanced" },
  { id: "s5", name: "AWS", level: "advanced" },
  { id: "s6", name: "Docker", level: "intermediate" },
  { id: "s7", name: "GraphQL", level: "advanced" },
  { id: "s8", name: "Python", level: "intermediate" },
];

export const SAMPLE_LANGUAGES: LanguageEntry[] = [
  { id: "l1", name: "Русский", level: "native" },
  { id: "l2", name: "English", level: "fluent" },
  { id: "l3", name: "Deutsch", level: "intermediate" },
];

export const SAMPLE_CONTENT: Record<string, unknown> = {
  contact: SAMPLE_CONTACT,
  summary: SAMPLE_SUMMARY,
  experience: SAMPLE_EXPERIENCE,
  education: SAMPLE_EDUCATION,
  skills: SAMPLE_SKILLS,
  languages: SAMPLE_LANGUAGES,
  certificates: [],
  projects: [],
  awards: [],
  volunteer: [],
};
