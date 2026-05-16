// ── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

// ── Document & Resume ────────────────────────────────────────────────────────

export type DocumentType = 'resume' | 'cv' | 'cover_letter';

export interface DocumentTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  thumbnail_url: string;
  preview_url: string;
  is_premium: boolean;
  colors: string[];
  description: string;
}

export interface ContactInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  linkedin: string;
  website: string;
}

export interface ExperienceEntry {
  id: string;
  job_title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  field_of_study: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner';
}

export interface CertificateEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  description: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  url: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface VolunteerEntry {
  id: string;
  role: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

export interface HobbyEntry {
  id: string;
  name: string;
}

export interface CustomSectionEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface ResumeContent {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  languages: LanguageEntry[];
  certificates: CertificateEntry[];
  projects: ProjectEntry[];
  awards: AwardEntry[];
  volunteer: VolunteerEntry[];
  hobbies: HobbyEntry[];
  custom_sections: CustomSectionEntry[];
  [key: string]: unknown;
}

export interface DocumentSettings {
  color: string;
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ResumeVersion {
  id: string;
  version_number: number;
  label: string;
  created_at: string;
  content: ResumeContent;
  settings: DocumentSettings;
}

export interface Resume {
  id: string;
  title: string;
  slug: string;
  document_type: DocumentType;
  template: DocumentTemplate;
  content: ResumeContent;
  settings: DocumentSettings;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user: string;
  versions: ResumeVersion[];
}

export interface ResumeListItem {
  id: string;
  title: string;
  slug: string;
  document_type: DocumentType;
  template: Pick<DocumentTemplate, 'id' | 'name' | 'thumbnail_url'>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateResumeData {
  title: string;
  document_type: DocumentType;
  template_id: string;
}

export interface UpdateResumeData {
  title?: string;
  template_id?: string;
  content?: Partial<ResumeContent>;
  settings?: Partial<DocumentSettings>;
  is_public?: boolean;
}

// ── API ──────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  status_code?: number;
}

// ── WebSocket ────────────────────────────────────────────────────────────────

export interface WebSocketMessage {
  type: 'content_update' | 'settings_update' | 'preview_request';
  payload: Record<string, unknown>;
}

export interface WebSocketResponse {
  type: 'preview_html' | 'error' | 'ack';
  payload: {
    html?: string;
    error?: string;
    timestamp?: string;
  };
}

// ── Download ─────────────────────────────────────────────────────────────────

export type DownloadFormat = 'pdf' | 'docx' | 'png' | 'json';
