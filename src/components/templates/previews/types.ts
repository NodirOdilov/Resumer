import type {
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  SkillEntry,
  LanguageEntry,
  CertificateEntry,
  ProjectEntry,
  AwardEntry,
  VolunteerEntry,
  DocumentSettings,
} from '@/types';

/** Resolved content with fallback defaults applied */
export interface ResolvedContent {
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
}

/** Style tokens derived from DocumentSettings + template color */
export interface StyleTokens {
  primaryColor: string;
  primaryColorLight: string;
  primaryColorFaint: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: { top: number; right: number; bottom: number; left: number };
}

/** Props every layout receives */
export interface LayoutProps {
  content: ResolvedContent;
  tokens: StyleTokens;
}

/** Props for the top-level renderer */
export interface TemplateRendererProps {
  templateSlug: string;
  content: Record<string, unknown>;
  settings: DocumentSettings;
}

/** Props for the cover letter renderer */
export interface CoverLetterRendererProps {
  templateSlug: string;
  content: {
    recipientName?: string;
    recipientTitle?: string;
    recipientCompany?: string;
    recipientAddress?: string;
    senderName?: string;
    senderAddress?: string;
    senderEmail?: string;
    senderPhone?: string;
    date?: string;
    greeting?: string;
    body?: string;
    closing?: string;
    signature?: string;
  };
  settings: DocumentSettings;
}

/** Skill level numeric mapping */
export const SKILL_LEVEL_MAP: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

/** Language proficiency numeric mapping */
export const LANGUAGE_LEVEL_MAP: Record<string, number> = {
  beginner: 20,
  intermediate: 40,
  advanced: 60,
  fluent: 80,
  native: 100,
};

/** Resolve raw builder content into typed content with defaults */
export function resolveContent(raw: Record<string, unknown>): ResolvedContent {
  const contact = (raw.contact as ContactInfo) || {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    linkedin: '',
    website: '',
  };

  return {
    contact,
    summary: (raw.summary as string) || '',
    experience: (raw.experience as ExperienceEntry[]) || [],
    education: (raw.education as EducationEntry[]) || [],
    skills: (raw.skills as SkillEntry[]) || [],
    languages: (raw.languages as LanguageEntry[]) || [],
    certificates: (raw.certificates as CertificateEntry[]) || [],
    projects: (raw.projects as ProjectEntry[]) || [],
    awards: (raw.awards as AwardEntry[]) || [],
    volunteer: (raw.volunteer as VolunteerEntry[]) || [],
  };
}

/** Build style tokens from DocumentSettings */
export function buildTokens(settings: DocumentSettings): StyleTokens {
  const color = settings.color || '#2563eb';
  return {
    primaryColor: color,
    primaryColorLight: color + '40',
    primaryColorFaint: color + '15',
    fontFamily: settings.font || 'Inter',
    fontSize: settings.fontSize || 14,
    lineHeight: settings.lineSpacing || 1.5,
    margins: settings.margins || { top: 24, right: 24, bottom: 24, left: 24 },
  };
}

/**
 * Hex color to rgba string.
 * Accepts "#RRGGBB" or "#RGB".
 */
export function hexToRgba(hex: string, alpha: number): string {
  let r = 0,
    g = 0,
    b = 0;
  const h = hex.replace('#', '');
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else if (h.length >= 6) {
    r = parseInt(h.substring(0, 2), 16);
    g = parseInt(h.substring(2, 4), 16);
    b = parseInt(h.substring(4, 6), 16);
  }
  return `rgba(${r},${g},${b},${alpha})`;
}
