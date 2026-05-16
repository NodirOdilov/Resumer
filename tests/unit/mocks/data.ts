import type { User } from "@/types/user";
import type { Resume, ResumeSettings } from "@/types/resume";
import type { DocumentTemplate } from "@/types/template";
import type { Article } from "@/types/content";
import type { ResumeExample } from "@/types/example";
import type { AuthTokens } from "@/types/api";

// ── Auth Tokens ─────────────────────────────────────────────────────────────

export const mockTokens: AuthTokens = {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjk5OTk5OTk5OTl9.mock-access-token",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJleHAiOjk5OTk5OTk5OTl9.mock-refresh-token",
  expiresIn: 3600,
  tokenType: "Bearer",
};

// ── User ────────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: "user-1",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  avatar: "https://example.com/avatar.jpg",
  isEmailVerified: true,
  isActive: true,
  role: "user",
  plan: "free",
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-06-20T15:30:00Z",
};

export const mockAdminUser: User = {
  ...mockUser,
  id: "user-admin",
  email: "admin@resumer.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  plan: "premium",
};

// ── Resume Settings ─────────────────────────────────────────────────────────

export const mockResumeSettings: ResumeSettings = {
  fontFamily: "Inter",
  fontSize: 10,
  lineHeight: 1.5,
  primaryColor: "#0D47A1",
  secondaryColor: "#FF6F00",
  accentColor: "#00BFA5",
  backgroundColor: "#FFFFFF",
  textColor: "#1A1A2E",
  headingStyle: "uppercase",
  sectionSpacing: 16,
  itemSpacing: 8,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 15,
  marginRight: 15,
  paperSize: "a4",
  showPageNumbers: true,
  showIcons: true,
  showDividers: true,
  showDates: true,
  dateFormat: "MMM yyyy",
  columnsLayout: "single",
};

// ── Resume ──────────────────────────────────────────────────────────────────

export const mockResume: Resume = {
  id: "resume-1",
  userId: "user-1",
  title: "Software Engineer Resume",
  slug: "software-engineer-resume",
  templateId: "template-modern-1",
  locale: "en-us",
  isPublic: false,
  isDefault: true,
  status: "draft",
  settings: mockResumeSettings,
  sections: [
    {
      id: "section-experience",
      type: "work-experience",
      title: "Work Experience",
      isVisible: true,
      order: 1,
      data: [
        {
          id: "exp-1",
          company: "Acme Corp",
          position: "Senior Developer",
          startDate: "2022-01-01",
          endDate: null,
          isCurrent: true,
          location: "San Francisco, CA",
          employmentType: "full-time",
          description: "Leading frontend development team.",
          achievements: ["Improved page load by 40%"],
          technologies: ["React", "TypeScript"],
        },
      ],
    },
    {
      id: "section-education",
      type: "education",
      title: "Education",
      isVisible: true,
      order: 2,
      data: [
        {
          id: "edu-1",
          institution: "MIT",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2016-09-01",
          endDate: "2020-06-15",
          isCurrent: false,
          gpa: "3.8",
          description: "",
          location: "Cambridge, MA",
          achievements: ["Dean's List"],
        },
      ],
    },
    {
      id: "section-skills",
      type: "skills",
      title: "Skills",
      isVisible: true,
      order: 3,
      data: [
        {
          id: "skill-1",
          name: "TypeScript",
          level: "expert",
          category: "Programming",
          yearsOfExperience: 5,
        },
        {
          id: "skill-2",
          name: "React",
          level: "expert",
          category: "Frameworks",
          yearsOfExperience: 6,
        },
      ],
    },
  ],
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    headline: "Senior Software Engineer",
    email: "john@example.com",
    phone: "+1-555-123-4567",
    website: "https://johndoe.dev",
    linkedIn: "https://linkedin.com/in/johndoe",
    location: {
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postalCode: "94102",
    },
    photo: null,
    summary:
      "Experienced software engineer with 8+ years of experience building scalable web applications.",
  },
  versions: [],
  score: 85,
  lastModified: "2025-06-20T15:30:00Z",
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-06-20T15:30:00Z",
};

export const mockResumeListItem = {
  id: "resume-1",
  title: "Software Engineer Resume",
  slug: "software-engineer-resume",
  templateId: "template-modern-1",
  isPublic: false,
  status: "draft" as const,
  lastModified: "2025-06-20T15:30:00Z",
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-06-20T15:30:00Z",
};

// ── Template ────────────────────────────────────────────────────────────────

export const mockTemplate: DocumentTemplate = {
  id: "template-modern-1",
  name: "Modern Professional",
  slug: "modern-professional",
  description: "A clean, modern resume template perfect for tech professionals.",
  thumbnail: "https://example.com/templates/modern-professional-thumb.jpg",
  previewImages: [
    "https://example.com/templates/modern-professional-1.jpg",
    "https://example.com/templates/modern-professional-2.jpg",
  ],
  category: "modern",
  type: "resume",
  isPremium: false,
  isFeatured: true,
  isNew: true,
  popularity: 950,
  rating: 4.8,
  reviewCount: 234,
  colorSchemes: [
    {
      id: "cs-blue",
      name: "Ocean Blue",
      primaryColor: "#0D47A1",
      secondaryColor: "#FF6F00",
      accentColor: "#00BFA5",
      backgroundColor: "#FFFFFF",
      textColor: "#1A1A2E",
      headingColor: "#0D47A1",
      subtitleColor: "#555555",
      borderColor: "#E0E0E0",
      linkColor: "#0D47A1",
    },
  ],
  defaultColorScheme: "cs-blue",
  supportedLayouts: ["single", "double", "sidebar-left"],
  defaultLayout: "single",
  fontPairings: [
    {
      id: "fp-inter",
      name: "Inter & Source Sans",
      headingFont: "Inter",
      bodyFont: "Source Sans 3",
      headingWeight: 700,
      bodyWeight: 400,
    },
  ],
  defaultFontPairing: "fp-inter",
  tags: ["modern", "clean", "professional", "tech"],
  industries: ["technology", "engineering", "finance"],
  experienceLevels: ["mid-level", "senior"],
  createdAt: "2024-12-01T00:00:00Z",
  updatedAt: "2025-03-15T00:00:00Z",
};

export const mockPremiumTemplate: DocumentTemplate = {
  ...mockTemplate,
  id: "template-exec-1",
  name: "Executive Suite",
  slug: "executive-suite",
  description: "Premium executive-level resume template.",
  category: "executive",
  isPremium: true,
  isFeatured: false,
  isNew: false,
  popularity: 720,
  rating: 4.9,
  reviewCount: 156,
};

// ── Article ─────────────────────────────────────────────────────────────────

export const mockArticle: Article = {
  id: "article-1",
  title: "How to Write the Perfect Resume in 2025",
  slug: "how-to-write-perfect-resume-2025",
  excerpt: "Learn the latest tips and strategies for crafting a resume that stands out.",
  content:
    "<h2>Introduction</h2><p>Writing a resume can be challenging...</p><h2>Key Sections</h2><p>Every resume should include...</p>",
  coverImage: "https://example.com/articles/perfect-resume.jpg",
  author: {
    id: "author-1",
    name: "Jane Smith",
    slug: "jane-smith",
    bio: "Career expert with 15 years of experience in HR and recruitment.",
    avatar: "https://example.com/authors/jane-smith.jpg",
    title: "Senior Career Advisor",
    company: "Resumer",
    website: "https://janesmith.com",
    linkedIn: "https://linkedin.com/in/janesmith",
    twitter: "https://twitter.com/janesmith",
    articleCount: 42,
  },
  category: "resume-writing",
  tags: [
    {
      id: "tag-1",
      name: "Resume Tips",
      slug: "resume-tips",
      description: "Tips and tricks for resume writing",
      articleCount: 25,
      color: "#0D47A1",
    },
    {
      id: "tag-2",
      name: "Career Growth",
      slug: "career-growth",
      description: "Articles about career advancement",
      articleCount: 18,
      color: "#00BFA5",
    },
  ],
  readingTime: 8,
  publishedAt: "2025-05-10T09:00:00Z",
  updatedAt: "2025-05-15T14:00:00Z",
  isPublished: true,
  isFeatured: true,
  viewCount: 15420,
  likeCount: 342,
  commentCount: 28,
  seoTitle: "How to Write the Perfect Resume in 2025 | Resumer",
  seoDescription:
    "Master the art of resume writing with our comprehensive guide.",
  seoKeywords: ["resume writing", "resume tips", "2025 resume"],
  locale: "en-us",
  relatedArticles: ["article-2", "article-3"],
  tableOfContents: [
    {
      id: "toc-1",
      title: "Introduction",
      level: 2,
      children: [],
    },
    {
      id: "toc-2",
      title: "Key Sections",
      level: 2,
      children: [],
    },
  ],
};

// ── Example ─────────────────────────────────────────────────────────────────

export const mockExample: ResumeExample = {
  id: "example-1",
  title: "Software Engineer Resume Example",
  slug: "software-engineer-resume-example",
  description:
    "A professional resume example for software engineers at the mid-senior level.",
  thumbnail: "https://example.com/examples/software-engineer.jpg",
  previewImages: [
    "https://example.com/examples/software-engineer-1.jpg",
    "https://example.com/examples/software-engineer-2.jpg",
  ],
  category: "technology",
  industry: "Software Development",
  jobTitle: "Software Engineer",
  experienceLevel: "mid-level",
  templateId: "template-modern-1",
  templateName: "Modern Professional",
  content: {
    personalInfo: {
      name: "Alex Johnson",
      headline: "Full-Stack Software Engineer",
      summary:
        "Passionate engineer with 5+ years building production web applications.",
    },
    sections: [
      {
        type: "work-experience",
        title: "Work Experience",
        items: [
          {
            company: "TechCorp",
            position: "Senior Software Engineer",
            startDate: "2021-03",
            endDate: "Present",
            description: "Led development of core product features.",
          },
        ],
      },
      {
        type: "education",
        title: "Education",
        items: [
          {
            institution: "Stanford University",
            degree: "B.S. Computer Science",
            startDate: "2014",
            endDate: "2018",
          },
        ],
      },
    ],
  },
  tips: [
    "Quantify your achievements with metrics",
    "Include relevant technical skills",
    "Tailor your resume for each application",
  ],
  keywords: [
    "software engineer",
    "developer",
    "full-stack",
    "React",
    "Node.js",
  ],
  rating: 4.7,
  reviewCount: 189,
  viewCount: 52340,
  isFeatured: true,
  locale: "en-us",
  seoTitle: "Software Engineer Resume Example | Resumer",
  seoDescription:
    "Professional software engineer resume example with tips and best practices.",
  createdAt: "2025-02-01T00:00:00Z",
  updatedAt: "2025-05-20T00:00:00Z",
};

// ── Paginated Response Helpers ──────────────────────────────────────────────

export function makePaginatedResponse<T>(data: T[], total?: number) {
  const totalItems = total ?? data.length;
  return {
    success: true,
    data,
    message: "Success",
    timestamp: new Date().toISOString(),
    pagination: {
      page: 1,
      pageSize: 20,
      totalItems,
      totalPages: Math.ceil(totalItems / 20),
      hasNextPage: totalItems > 20,
      hasPreviousPage: false,
    },
  };
}

export function makeApiResponse<T>(data: T) {
  return {
    success: true,
    data,
    message: "Success",
    timestamp: new Date().toISOString(),
  };
}
