import type { ColumnsLayout } from "./resume";

export interface DocumentTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewImages: string[];
  category: TemplateCategory;
  type: DocumentType;
  isPremium: boolean;
  isFeatured: boolean;
  isNew: boolean;
  popularity: number;
  rating: number;
  reviewCount: number;
  colorSchemes: TemplateColorScheme[];
  defaultColorScheme: string;
  supportedLayouts: ColumnsLayout[];
  defaultLayout: ColumnsLayout;
  fontPairings: FontPairing[];
  defaultFontPairing: string;
  tags: string[];
  industries: string[];
  experienceLevels: ExperienceLevel[];
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = "resume" | "cv" | "cover-letter";

export type TemplateCategory =
  | "professional"
  | "modern"
  | "creative"
  | "simple"
  | "academic"
  | "technical"
  | "executive"
  | "minimalist"
  | "elegant"
  | "bold";

export type ExperienceLevel =
  | "entry-level"
  | "mid-level"
  | "senior"
  | "executive"
  | "student"
  | "career-change";

export interface TemplateColorScheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  subtitleColor: string;
  borderColor: string;
  linkColor: string;
}

export interface FontPairing {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  bodyWeight: number;
}

export interface TemplateFilter {
  categories: TemplateCategory[];
  types: DocumentType[];
  isPremium: boolean | null;
  industries: string[];
  experienceLevels: ExperienceLevel[];
  search: string;
  sortBy: TemplateSortOption;
}

export type TemplateSortOption =
  | "popularity"
  | "rating"
  | "newest"
  | "name-asc"
  | "name-desc";
