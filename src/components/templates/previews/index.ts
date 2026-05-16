// ── Main renderers ───────────────────────────────────────────────────────────
export { TemplateRenderer, getLayoutForSlug } from './TemplateRenderer';
export { CoverLetterRenderer } from './CoverLetterRenderer';

// ── Layout components ────────────────────────────────────────────────────────
export { ProfessionalLayout } from './layouts/ProfessionalLayout';
export { ModernLayout } from './layouts/ModernLayout';
export { CreativeLayout } from './layouts/CreativeLayout';
export { SimpleLayout } from './layouts/SimpleLayout';
export { ExecutiveLayout } from './layouts/ExecutiveLayout';

// ── Section components ───────────────────────────────────────────────────────
export {
  ContactHeader,
  SummarySection,
  SectionTitle,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  CertificatesSection,
  ProjectsSection,
  AwardsSection,
  VolunteerSection,
} from './sections';

// ── Types & utilities ────────────────────────────────────────────────────────
export type {
  TemplateRendererProps,
  CoverLetterRendererProps,
  LayoutProps,
  ResolvedContent,
  StyleTokens,
} from './types';

export {
  resolveContent,
  buildTokens,
  hexToRgba,
  SKILL_LEVEL_MAP,
  LANGUAGE_LEVEL_MAP,
} from './types';

// ── Base preview & template preview components ──────────────────────────────
export { BasePreview } from './BasePreview';
export type { TemplatePreviewProps, LayoutCategory, TemplateCustomization } from './BasePreview';
export { mergeCustomization } from './BasePreview';

export {
  TEMPLATE_PREVIEW_REGISTRY,
  getPreviewForSlug,
  getRegisteredSlugs,
  // Individual preview components
  CascadePreview,
  ClassicPreview,
  CubicPreview,
  DiamondPreview,
  EnfoldPreview,
  NewcastPreview,
  ValeraPreview,
  CrispPreview,
  MinimoPreview,
  NanicaPreview,
  SimplePreview,
  CeramicaPreview,
  DynamicPreview,
  InfluxPreview,
  LuminaPreview,
  ModernPreview,
  ProfilePreview,
  SquaresPreview,
  ConceptPreview,
  ImpetusPreview,
  InitialsPreview,
  MusePreview,
  SpectraPreview,
  VibesPreview,
  IconicPreview,
  PrimoPreview,
  SynergyPreview,
  VintagePreview,
  NexusPreview,
  AtlasPreview,
  HorizonPreview,
  ZenithPreview,
  ClarityPreview,
  ElevatePreview,
} from './templates';

// ── Template slug registry ───────────────────────────────────────────────────
// Maps every supported template slug to its layout family name.
// Useful for external consumers that need to know which layout a template uses.
export const TEMPLATE_SLUG_REGISTRY: Record<string, string> = {
  // Professional
  'cascade': 'professional',
  'classic': 'professional',
  'cubic': 'professional',
  'diamond': 'professional',
  'enfold': 'professional',
  'newcast': 'professional',
  'valera': 'professional',
  'nexus': 'professional',
  'atlas': 'professional',
  'executive-pro': 'professional',
  'corporate-edge': 'professional',
  'boardroom': 'professional',
  'director': 'professional',
  'academic': 'professional',

  // Modern
  'ceramica': 'modern',
  'dynamic': 'modern',
  'influx': 'modern',
  'lumina': 'modern',
  'modern': 'modern',
  'profile': 'modern',
  'squares': 'modern',
  'horizon': 'modern',
  'neon-pulse': 'modern',
  'gradient-flow': 'modern',
  'metro-style': 'modern',
  'tech-forward': 'modern',
  'startup-vibe': 'modern',

  // Creative
  'concept': 'creative',
  'impetus': 'creative',
  'initials': 'creative',
  'muse': 'creative',
  'spectra': 'creative',
  'vibes': 'creative',
  'zenith': 'creative',
  'artisan': 'creative',
  'portfolio-plus': 'creative',
  'infographic': 'creative',
  'color-blocks': 'creative',
  'designer': 'creative',

  // Simple
  'crisp': 'simple',
  'minimo': 'simple',
  'nanica': 'simple',
  'simple': 'simple',
  'clarity': 'simple',
  'minimal-clean': 'simple',
  'basic-starter': 'simple',
  'plain-text': 'simple',
  'whitespace': 'simple',
  'swiss-layout': 'simple',

  // Executive
  'iconic': 'executive',
  'primo': 'executive',
  'synergy': 'executive',
  'vintage': 'executive',
  'elevate': 'executive',
  'enterprise': 'executive',
  'consultant': 'executive',
  'financial': 'executive',
  'manager-pro': 'executive',
  'traditional': 'executive',
  'elegant-serif': 'executive',
  'timeless': 'executive',
  'heritage': 'executive',
};
