import React, { useMemo } from 'react';
import type { TemplateRendererProps, LayoutProps } from './types';
import { resolveContent, buildTokens } from './types';
import { ProfessionalLayout } from './layouts/ProfessionalLayout';
import { ModernLayout } from './layouts/ModernLayout';
import { CreativeLayout } from './layouts/CreativeLayout';
import { SimpleLayout } from './layouts/SimpleLayout';
import { ExecutiveLayout } from './layouts/ExecutiveLayout';

/* ─────────────────────────────────────────────────────────────────────────────
 * Template slug  ->  Layout component mapping
 *
 * Every template slug used by the app is mapped here.
 * Adding a new template only requires adding one entry.
 * ────────────────────────────────────────────────────────────────────────── */

type LayoutComponent = React.ComponentType<LayoutProps>;

const TEMPLATE_LAYOUT_MAP: Record<string, LayoutComponent> = {
  /* ── Professional templates ──────────────────────────────────── */
  'cascade': ProfessionalLayout,
  'classic': ProfessionalLayout,
  'cubic': ProfessionalLayout,
  'diamond': ProfessionalLayout,
  'enfold': ProfessionalLayout,
  'newcast': ProfessionalLayout,
  'valera': ProfessionalLayout,
  'nexus': ProfessionalLayout,
  'atlas': ProfessionalLayout,
  'executive-pro': ProfessionalLayout,
  'corporate-edge': ProfessionalLayout,
  'boardroom': ProfessionalLayout,
  'director': ProfessionalLayout,
  'academic': ProfessionalLayout,

  /* ── Modern templates ────────────────────────────────────────── */
  'ceramica': ModernLayout,
  'dynamic': ModernLayout,
  'influx': ModernLayout,
  'lumina': ModernLayout,
  'modern': ModernLayout,
  'profile': ModernLayout,
  'squares': ModernLayout,
  'horizon': ModernLayout,
  'neon-pulse': ModernLayout,
  'gradient-flow': ModernLayout,
  'metro-style': ModernLayout,
  'tech-forward': ModernLayout,
  'startup-vibe': ModernLayout,

  /* ── Creative templates ──────────────────────────────────────── */
  'concept': CreativeLayout,
  'impetus': CreativeLayout,
  'initials': CreativeLayout,
  'muse': CreativeLayout,
  'spectra': CreativeLayout,
  'vibes': CreativeLayout,
  'zenith': CreativeLayout,
  'artisan': CreativeLayout,
  'portfolio-plus': CreativeLayout,
  'infographic': CreativeLayout,
  'color-blocks': CreativeLayout,
  'designer': CreativeLayout,

  /* ── Simple templates ────────────────────────────────────────── */
  'crisp': SimpleLayout,
  'minimo': SimpleLayout,
  'nanica': SimpleLayout,
  'simple': SimpleLayout,
  'clarity': SimpleLayout,
  'minimal-clean': SimpleLayout,
  'basic-starter': SimpleLayout,
  'plain-text': SimpleLayout,
  'whitespace': SimpleLayout,
  'swiss-layout': SimpleLayout,

  /* ── Executive / elegant templates ───────────────────────────── */
  'iconic': ExecutiveLayout,
  'primo': ExecutiveLayout,
  'synergy': ExecutiveLayout,
  'vintage': ExecutiveLayout,
  'elevate': ExecutiveLayout,
  'enterprise': ExecutiveLayout,
  'consultant': ExecutiveLayout,
  'financial': ExecutiveLayout,
  'manager-pro': ExecutiveLayout,
  'traditional': ExecutiveLayout,
  'elegant-serif': ExecutiveLayout,
  'timeless': ExecutiveLayout,
  'heritage': ExecutiveLayout,
};

/**
 * Look up the layout component for a given template slug.
 * Returns `ProfessionalLayout` as a safe default for unknown slugs.
 */
export function getLayoutForSlug(slug: string): LayoutComponent {
  return TEMPLATE_LAYOUT_MAP[slug] || ProfessionalLayout;
}

/**
 * Main template renderer.
 *
 * Usage:
 * ```tsx
 * <TemplateRenderer
 *   templateSlug={template.slug}
 *   content={builderContent}
 *   settings={builderSettings}
 * />
 * ```
 */
export function TemplateRenderer({ templateSlug, content, settings }: TemplateRendererProps) {
  const resolved = useMemo(() => resolveContent(content), [content]);
  const tokens = useMemo(() => buildTokens(settings), [settings]);

  const Layout = getLayoutForSlug(templateSlug);

  return <Layout content={resolved} tokens={tokens} />;
}
