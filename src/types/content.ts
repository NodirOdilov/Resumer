export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  category: ArticleCategory;
  tags: Tag[];
  readingTime: number;
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  locale: string;
  relatedArticles: string[];
  tableOfContents: TableOfContentsItem[];
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  title: string;
  company: string;
  website: string;
  linkedIn: string;
  twitter: string;
  articleCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: string;
}

export type ArticleCategory =
  | "resume-writing"
  | "cv-writing"
  | "cover-letter-writing"
  | "job-search"
  | "career-advice"
  | "interview-tips"
  | "salary-negotiation"
  | "workplace"
  | "industry-insights"
  | "skills-development"
  | "networking"
  | "personal-branding"
  | "remote-work"
  | "freelancing";

export interface ArticleCategoryInfo {
  slug: ArticleCategory;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children: TableOfContentsItem[];
}

export interface ArticleFilter {
  categories: ArticleCategory[];
  tags: string[];
  authors: string[];
  search: string;
  sortBy: ArticleSortOption;
}

export type ArticleSortOption =
  | "newest"
  | "oldest"
  | "popular"
  | "most-liked"
  | "title-asc"
  | "title-desc";

export interface ArticleComment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  parentId: string | null;
  likes: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies: ArticleComment[];
}
