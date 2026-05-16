export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  role: UserRole;
  plan: UserPlan;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "user" | "admin" | "moderator";

export type UserPlan = "free" | "pro" | "premium" | "enterprise";

export interface UserProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  phone: string;
  website: string;
  linkedIn: string;
  github: string;
  twitter: string;
  location: Location;
  dateOfBirth: string | null;
  nationality: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  projects: Project[];
  awards: Award[];
  volunteer: Volunteer[];
  interests: Interest[];
  customSections: CustomSection[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  gpa: string;
  description: string;
  location: string;
  achievements: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string;
  employmentType: EmploymentType;
  description: string;
  achievements: string[];
  technologies: string[];
}

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship"
  | "volunteer"
  | "self-employed";

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
  yearsOfExperience: number;
}

export type SkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert"
  | "master";

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
  isNative: boolean;
}

export type LanguageProficiency =
  | "elementary"
  | "limited-working"
  | "professional-working"
  | "full-professional"
  | "native-bilingual";

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  doesNotExpire: boolean;
  credentialId: string;
  credentialUrl: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  repositoryUrl: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  technologies: string[];
  highlights: string[];
  role: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  url: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  cause: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  highlights: string[];
}

export interface Interest {
  id: string;
  name: string;
  keywords: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  url: string;
}
