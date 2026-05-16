import type {
  Education,
  WorkExperience,
  Skill,
  Language,
  Certificate,
  Project,
  Award,
  Volunteer,
  Interest,
  CustomSection,
  Location,
} from "./user";

export interface Resume {
  id: string;
  userId: string;
  title: string;
  slug: string;
  templateId: string;
  locale: string;
  isPublic: boolean;
  isDefault: boolean;
  status: ResumeStatus;
  settings: ResumeSettings;
  sections: ResumeSection[];
  personalInfo: ResumePersonalInfo;
  versions: ResumeVersion[];
  score: number | null;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
}

export type ResumeStatus = "draft" | "published" | "archived";

export interface ResumePersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  website: string;
  linkedIn: string;
  location: Location;
  photo: string | null;
  summary: string;
}

export interface ResumeSection {
  id: string;
  type: ResumeSectionType;
  title: string;
  isVisible: boolean;
  order: number;
  data: ResumeSectionData;
}

export type ResumeSectionType =
  | "personal-info"
  | "summary"
  | "work-experience"
  | "education"
  | "skills"
  | "languages"
  | "certificates"
  | "projects"
  | "awards"
  | "volunteer"
  | "interests"
  | "references"
  | "custom";

export type ResumeSectionData =
  | Education[]
  | WorkExperience[]
  | Skill[]
  | Language[]
  | Certificate[]
  | Project[]
  | Award[]
  | Volunteer[]
  | Interest[]
  | ResumeReference[]
  | CustomSection;

export interface ResumeReference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface ResumeSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingStyle: HeadingStyle;
  sectionSpacing: number;
  itemSpacing: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  paperSize: PaperSize;
  showPageNumbers: boolean;
  showIcons: boolean;
  showDividers: boolean;
  showDates: boolean;
  dateFormat: string;
  columnsLayout: ColumnsLayout;
}

export type HeadingStyle =
  | "uppercase"
  | "capitalize"
  | "normal"
  | "bold-underline";

export type PaperSize = "a4" | "letter" | "legal";

export type ColumnsLayout = "single" | "double" | "sidebar-left" | "sidebar-right";

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: number;
  label: string;
  snapshot: Omit<Resume, "versions">;
  createdAt: string;
  createdBy: string;
}

export interface ResumeAnalysis {
  score: number;
  suggestions: ResumeSuggestion[];
  keywords: KeywordAnalysis;
  atsCompatibility: AtsCompatibility;
}

export interface ResumeSuggestion {
  id: string;
  type: "improvement" | "warning" | "error";
  section: ResumeSectionType;
  message: string;
  details: string;
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  overused: string[];
  score: number;
}

export interface AtsCompatibility {
  score: number;
  issues: string[];
  recommendations: string[];
}
