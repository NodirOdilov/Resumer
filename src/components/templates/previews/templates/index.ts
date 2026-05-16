import type React from 'react';
import type { TemplatePreviewProps } from '../BasePreview';

// ── Professional templates ──────────────────────────────────────────────────
import { CascadePreview } from './CascadePreview';
import { ClassicPreview } from './ClassicPreview';
import { CubicPreview } from './CubicPreview';
import { DiamondPreview } from './DiamondPreview';
import { EnfoldPreview } from './EnfoldPreview';
import { NewcastPreview } from './NewcastPreview';
import { ValeraPreview } from './ValeraPreview';

// ── Simple templates ────────────────────────────────────────────────────────
import { CrispPreview } from './CrispPreview';
import { MinimoPreview } from './MinimoPreview';
import { NanicaPreview } from './NanicaPreview';
import { SimplePreview } from './SimplePreview';

// ── Modern templates ────────────────────────────────────────────────────────
import { CeramicaPreview } from './CeramicaPreview';
import { DynamicPreview } from './DynamicPreview';
import { InfluxPreview } from './InfluxPreview';
import { LuminaPreview } from './LuminaPreview';
import { ModernPreview } from './ModernPreview';
import { ProfilePreview } from './ProfilePreview';
import { SquaresPreview } from './SquaresPreview';

// ── Creative templates ──────────────────────────────────────────────────────
import { ConceptPreview } from './ConceptPreview';
import { ImpetusPreview } from './ImpetusPreview';
import { InitialsPreview } from './InitialsPreview';
import { MusePreview } from './MusePreview';
import { SpectraPreview } from './SpectraPreview';
import { VibesPreview } from './VibesPreview';

// ── Business templates ──────────────────────────────────────────────────────
import { IconicPreview } from './IconicPreview';
import { PrimoPreview } from './PrimoPreview';
import { SynergyPreview } from './SynergyPreview';

// ── Classic templates ───────────────────────────────────────────────────────
import { VintagePreview } from './VintagePreview';

// ── Bonus templates ─────────────────────────────────────────────────────────
import { NexusPreview } from './NexusPreview';
import { AtlasPreview } from './AtlasPreview';
import { HorizonPreview } from './HorizonPreview';
import { ZenithPreview } from './ZenithPreview';
import { ClarityPreview } from './ClarityPreview';
import { ElevatePreview } from './ElevatePreview';

// ── Re-exports ──────────────────────────────────────────────────────────────

export {
  // Professional
  CascadePreview,
  ClassicPreview,
  CubicPreview,
  DiamondPreview,
  EnfoldPreview,
  NewcastPreview,
  ValeraPreview,
  // Simple
  CrispPreview,
  MinimoPreview,
  NanicaPreview,
  SimplePreview,
  // Modern
  CeramicaPreview,
  DynamicPreview,
  InfluxPreview,
  LuminaPreview,
  ModernPreview,
  ProfilePreview,
  SquaresPreview,
  // Creative
  ConceptPreview,
  ImpetusPreview,
  InitialsPreview,
  MusePreview,
  SpectraPreview,
  VibesPreview,
  // Business
  IconicPreview,
  PrimoPreview,
  SynergyPreview,
  // Classic
  VintagePreview,
  // Bonus
  NexusPreview,
  AtlasPreview,
  HorizonPreview,
  ZenithPreview,
  ClarityPreview,
  ElevatePreview,
};

// ── Template preview registry ───────────────────────────────────────────────
// Maps template slugs to their React preview components.

type PreviewComponent = React.ComponentType<TemplatePreviewProps>;

export const TEMPLATE_PREVIEW_REGISTRY: Record<string, PreviewComponent> = {
  // Professional
  'cascade': CascadePreview,
  'classic': ClassicPreview,
  'cubic': CubicPreview,
  'diamond': DiamondPreview,
  'enfold': EnfoldPreview,
  'newcast': NewcastPreview,
  'valera': ValeraPreview,

  // Simple
  'crisp': CrispPreview,
  'minimo': MinimoPreview,
  'nanica': NanicaPreview,
  'simple': SimplePreview,

  // Modern
  'ceramica': CeramicaPreview,
  'dynamic': DynamicPreview,
  'influx': InfluxPreview,
  'lumina': LuminaPreview,
  'modern': ModernPreview,
  'profile': ProfilePreview,
  'squares': SquaresPreview,

  // Creative
  'concept': ConceptPreview,
  'impetus': ImpetusPreview,
  'initials': InitialsPreview,
  'muse': MusePreview,
  'spectra': SpectraPreview,
  'vibes': VibesPreview,

  // Business
  'iconic': IconicPreview,
  'primo': PrimoPreview,
  'synergy': SynergyPreview,

  // Classic
  'vintage': VintagePreview,

  // Bonus
  'nexus': NexusPreview,
  'atlas': AtlasPreview,
  'horizon': HorizonPreview,
  'zenith': ZenithPreview,
  'clarity': ClarityPreview,
  'elevate': ElevatePreview,
};

/**
 * Look up the preview component for a given template slug.
 * Falls back to CascadePreview (professional default) for unknown slugs.
 */
export function getPreviewForSlug(slug: string): PreviewComponent {
  return TEMPLATE_PREVIEW_REGISTRY[slug] || CascadePreview;
}

/**
 * Get all registered template slugs.
 */
export function getRegisteredSlugs(): string[] {
  return Object.keys(TEMPLATE_PREVIEW_REGISTRY);
}
