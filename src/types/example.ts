export interface ResumeExample {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewImages: string[];
  category: ExampleCategory;
  industry: string;
  jobTitle: string;
  experienceLevel: ExampleExperienceLevel;
  templateId: string;
  templateName: string;
  content: ExampleContent;
  tips: string[];
  keywords: string[];
  rating: number;
  reviewCount: number;
  viewCount: number;
  isFeatured: boolean;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export type ExampleCategory =
  | "technology"
  | "healthcare"
  | "finance"
  | "education"
  | "marketing"
  | "engineering"
  | "design"
  | "sales"
  | "legal"
  | "hospitality"
  | "government"
  | "non-profit"
  | "science"
  | "retail"
  | "construction"
  | "transportation"
  | "media"
  | "real-estate"
  | "consulting"
  | "other";

export type ExampleExperienceLevel =
  | "student"
  | "entry-level"
  | "mid-level"
  | "senior"
  | "executive"
  | "career-change";

export interface ExampleContent {
  personalInfo: {
    name: string;
    headline: string;
    summary: string;
  };
  sections: ExampleSection[];
}

export interface ExampleSection {
  type: string;
  title: string;
  items: Record<string, unknown>[];
}

export interface CoverLetterExample {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: ExampleCategory;
  industry: string;
  jobTitle: string;
  experienceLevel: ExampleExperienceLevel;
  templateId: string;
  templateName: string;
  content: CoverLetterContent;
  tips: string[];
  keywords: string[];
  rating: number;
  reviewCount: number;
  viewCount: number;
  isFeatured: boolean;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterContent {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signOff: string;
}

export interface ExampleFilter {
  categories: ExampleCategory[];
  experienceLevels: ExampleExperienceLevel[];
  industries: string[];
  search: string;
  sortBy: ExampleSortOption;
}

export type ExampleSortOption =
  | "popular"
  | "rating"
  | "newest"
  | "title-asc"
  | "title-desc";
