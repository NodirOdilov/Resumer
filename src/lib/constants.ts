export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

export const STRIPE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_STRIPE_KEY || "";

export const ROUTES = {
  // Marketing
  HOME: "/",
  ABOUT: "/about",
  PRICING: "/pricing",
  CONTACT: "/contact",
  FAQ: "/faq",
  FEATURES: "/features",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // App / Dashboard
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
  BILLING: "/dashboard/billing",
  NOTIFICATIONS: "/dashboard/notifications",

  // Resume Builder
  RESUMES: "/dashboard/resumes",
  RESUME_NEW: "/dashboard/resumes/new",
  RESUME_EDIT: (id: string) => `/dashboard/resumes/${id}/edit` as const,
  RESUME_PREVIEW: (id: string) => `/dashboard/resumes/${id}/preview` as const,

  // CV Builder
  CVS: "/dashboard/cvs",
  CV_NEW: "/dashboard/cvs/new",
  CV_EDIT: (id: string) => `/dashboard/cvs/${id}/edit` as const,
  CV_PREVIEW: (id: string) => `/dashboard/cvs/${id}/preview` as const,

  // Cover Letter Builder
  COVER_LETTERS: "/dashboard/cover-letters",
  COVER_LETTER_NEW: "/dashboard/cover-letters/new",
  COVER_LETTER_EDIT: (id: string) =>
    `/dashboard/cover-letters/${id}/edit` as const,
  COVER_LETTER_PREVIEW: (id: string) =>
    `/dashboard/cover-letters/${id}/preview` as const,

  // Content / Blog
  BLOG: "/blog",
  BLOG_ARTICLE: (slug: string) => `/blog/${slug}` as const,
  BLOG_CATEGORY: (category: string) => `/blog/category/${category}` as const,

  // Resume Content
  RESUME_GUIDE: "/resume",
  RESUME_FORMAT: "/resume/format",
  RESUME_SUMMARY: "/resume/summary",
  RESUME_OBJECTIVE: "/resume/objective",
  RESUME_SKILLS: "/resume/skills",

  // CV Content
  CV_GUIDE: "/cv",
  CV_FORMAT: "/cv/format",
  CV_ACADEMIC: "/cv/academic",

  // Cover Letter Content
  COVER_LETTER_GUIDE: "/cover-letter",
  COVER_LETTER_FORMAT: "/cover-letter/format",

  // Galleries - Templates
  RESUME_TEMPLATES: "/resume-templates",
  RESUME_TEMPLATE_DETAIL: (slug: string) =>
    `/resume-templates/${slug}` as const,
  CV_TEMPLATES: "/cv-templates",
  CV_TEMPLATE_DETAIL: (slug: string) => `/cv-templates/${slug}` as const,
  COVER_LETTER_TEMPLATES: "/cover-letter-templates",
  COVER_LETTER_TEMPLATE_DETAIL: (slug: string) =>
    `/cover-letter-templates/${slug}` as const,

  // Galleries - Examples
  RESUME_EXAMPLES: "/resume-examples",
  RESUME_EXAMPLE_DETAIL: (slug: string) => `/resume-examples/${slug}` as const,
  CV_EXAMPLES: "/cv-examples",
  CV_EXAMPLE_DETAIL: (slug: string) => `/cv-examples/${slug}` as const,
  COVER_LETTER_EXAMPLES: "/cover-letter-examples",
  COVER_LETTER_EXAMPLE_DETAIL: (slug: string) =>
    `/cover-letter-examples/${slug}` as const,

  // Tools
  ATS_CHECKER: "/tools/ats-checker",
  RESUME_SCORER: "/tools/resume-scorer",
  SALARY_ANALYZER: "/tools/salary-analyzer",

  // Legal
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  COOKIE_POLICY: "/cookie-policy",

  // API
  API_AUTH_LOGIN: "/auth/login/",
  API_AUTH_REGISTER: "/auth/register/",
  API_AUTH_REFRESH: "/auth/token/refresh/",
  API_AUTH_LOGOUT: "/auth/logout/",
  API_AUTH_FORGOT_PASSWORD: "/auth/password/reset/",
  API_AUTH_RESET_PASSWORD: "/auth/password/reset/confirm/",
  API_AUTH_VERIFY_EMAIL: "/auth/email/verify/",
  API_USER_PROFILE: "/users/me/",
  API_RESUMES: "/resumes/",
  API_RESUME: (id: string) => `/resumes/${id}/` as const,
  API_CVS: "/cvs/",
  API_CV: (id: string) => `/cvs/${id}/` as const,
  API_COVER_LETTERS: "/cover-letters/",
  API_COVER_LETTER: (id: string) => `/cover-letters/${id}/` as const,
  API_TEMPLATES: "/templates/",
  API_EXAMPLES: "/examples/",
  API_ARTICLES: "/articles/",
  API_SUBSCRIPTIONS: "/subscriptions/",
  API_PAYMENTS: "/payments/",
  API_INVOICES: "/invoices/",
} as const;

export const LANGUAGES = [
  { code: "en-us", name: "English (US)", flag: "🇺🇸" },
  { code: "en-gb", name: "English (UK)", flag: "🇬🇧" },
  { code: "en-in", name: "English (India)", flag: "🇮🇳" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt-br", name: "Português (Brasil)", flag: "🇧🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
] as const;

export type SupportedLocale = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LOCALE: SupportedLocale = "en-us";

export const PAPER_SIZES = {
  a4: { width: 210, height: 297, unit: "mm" },
  letter: { width: 215.9, height: 279.4, unit: "mm" },
  legal: { width: 215.9, height: 355.6, unit: "mm" },
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
