import React, { useMemo } from 'react';
import type { LayoutProps, StyleTokens, ResolvedContent } from './types';
import { resolveContent, buildTokens, hexToRgba } from './types';
import type { DocumentSettings } from '@/types';
import {
  ContactHeader,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  CertificatesSection,
  ProjectsSection,
  AwardsSection,
  VolunteerSection,
} from './sections';

// ---------------------------------------------------------------------------
// Template preview prop types
// ---------------------------------------------------------------------------

export interface TemplatePreviewProps {
  content: Record<string, unknown>;
  settings: DocumentSettings;
  template: {
    slug: string;
    name: string;
    category: string;
    [key: string]: unknown;
  };
}

// ---------------------------------------------------------------------------
// Layout category type
// ---------------------------------------------------------------------------

export type LayoutCategory =
  | 'professional'
  | 'simple'
  | 'modern'
  | 'creative'
  | 'business'
  | 'classic';

// ---------------------------------------------------------------------------
// Template customization options
// ---------------------------------------------------------------------------

export interface TemplateCustomization {
  /** Layout family to use */
  layout: LayoutCategory;
  /** Contact header variant */
  headerVariant: 'professional' | 'modern' | 'creative' | 'simple' | 'executive';
  /** Section heading style */
  headingStyle: 'underline' | 'simple' | 'accent-bg' | 'elegant' | 'border-left' | 'boxed';
  /** Skills display mode */
  skillsDisplay: 'bars' | 'dots' | 'tags' | 'text';
  /** Languages display mode */
  languagesDisplay: 'bars' | 'dots' | 'text';
  /** Whether to show timeline markers on experience */
  showTimeline: boolean;
  /** Sidebar placement for two-column layouts */
  sidebarPosition: 'left' | 'right' | 'none';
  /** Sidebar width percentage (for two-column layouts) */
  sidebarWidth: string;
  /** Override font family (if template uses a specific font family) */
  fontFamilyOverride?: string;
  /** Extra top-level container styles */
  containerStyle?: React.CSSProperties;
  /** Header background color override */
  headerBgColor?: string;
  /** Whether to use a gradient header */
  gradientHeader?: boolean;
  /** Custom accent border width */
  borderWidth?: number;
  /** Section order override */
  sectionOrder?: string[];
  /** Whether awards should appear before skills (executive style) */
  awardsFirst?: boolean;
  /** Custom letter spacing for headers */
  headerLetterSpacing?: number;
  /** Whether to show photo placeholder in sidebar */
  showPhotoPlaceholder?: boolean;
  /** Compact sidebar sections */
  compactSidebar?: boolean;
}

// ---------------------------------------------------------------------------
// Default customization per layout category
// ---------------------------------------------------------------------------

const LAYOUT_DEFAULTS: Record<LayoutCategory, TemplateCustomization> = {
  professional: {
    layout: 'professional',
    headerVariant: 'professional',
    headingStyle: 'underline',
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
    showTimeline: true,
    sidebarPosition: 'none',
    sidebarWidth: '34%',
    showPhotoPlaceholder: false,
    compactSidebar: false,
  },
  simple: {
    layout: 'simple',
    headerVariant: 'simple',
    headingStyle: 'simple',
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
    showTimeline: false,
    sidebarPosition: 'none',
    sidebarWidth: '34%',
    showPhotoPlaceholder: false,
    compactSidebar: false,
  },
  modern: {
    layout: 'modern',
    headerVariant: 'modern',
    headingStyle: 'underline',
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    showTimeline: false,
    sidebarPosition: 'left',
    sidebarWidth: '34%',
    showPhotoPlaceholder: true,
    compactSidebar: false,
  },
  creative: {
    layout: 'creative',
    headerVariant: 'creative',
    headingStyle: 'accent-bg',
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
    showTimeline: false,
    sidebarPosition: 'right',
    sidebarWidth: '35%',
    showPhotoPlaceholder: false,
    compactSidebar: false,
  },
  business: {
    layout: 'business',
    headerVariant: 'executive',
    headingStyle: 'elegant',
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    showTimeline: false,
    sidebarPosition: 'none',
    sidebarWidth: '34%',
    fontFamilyOverride: "Georgia, 'Times New Roman', serif",
    awardsFirst: true,
    showPhotoPlaceholder: false,
    compactSidebar: false,
  },
  classic: {
    layout: 'classic',
    headerVariant: 'executive',
    headingStyle: 'elegant',
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    showTimeline: false,
    sidebarPosition: 'none',
    sidebarWidth: '34%',
    fontFamilyOverride: "Georgia, 'Times New Roman', serif",
    awardsFirst: true,
    showPhotoPlaceholder: false,
    compactSidebar: false,
  },
};

// ---------------------------------------------------------------------------
// Helper: merge customization with defaults
// ---------------------------------------------------------------------------

export function mergeCustomization(
  layout: LayoutCategory,
  overrides: Partial<TemplateCustomization> = {}
): TemplateCustomization {
  return { ...LAYOUT_DEFAULTS[layout], ...overrides };
}

// ---------------------------------------------------------------------------
// Sidebar sections renderer (used by modern and creative layouts)
// ---------------------------------------------------------------------------

function SidebarSections({
  content,
  tokens,
  customization,
}: {
  content: ResolvedContent;
  tokens: StyleTokens;
  customization: TemplateCustomization;
}) {
  const sidebarTokens = { ...tokens, primaryColor: '#fff' };

  return (
    <>
      <SkillsSection
        entries={content.skills}
        tokens={sidebarTokens}
        headingStyle="simple"
        displayMode={customization.skillsDisplay}
      />
      <LanguagesSection
        entries={content.languages}
        tokens={sidebarTokens}
        headingStyle="simple"
        displayMode={customization.languagesDisplay}
      />
      <CertificatesSection
        entries={content.certificates}
        tokens={sidebarTokens}
        headingStyle="simple"
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main sections renderer
// ---------------------------------------------------------------------------

function MainSections({
  content,
  tokens,
  customization,
}: {
  content: ResolvedContent;
  tokens: StyleTokens;
  customization: TemplateCustomization;
}) {
  const hs = customization.headingStyle;
  const hasSidebar = customization.sidebarPosition !== 'none';

  if (customization.awardsFirst) {
    return (
      <>
        <SummarySection summary={content.summary} tokens={tokens} headingStyle={hs} />
        <ExperienceSection
          entries={content.experience}
          tokens={tokens}
          headingStyle={hs}
          showTimeline={customization.showTimeline}
        />
        <EducationSection entries={content.education} tokens={tokens} headingStyle={hs} />
        <AwardsSection entries={content.awards} tokens={tokens} headingStyle={hs} />
        <CertificatesSection entries={content.certificates} tokens={tokens} headingStyle={hs} />
        <ProjectsSection entries={content.projects} tokens={tokens} headingStyle={hs} />
        {!hasSidebar && (
          <>
            <SkillsSection
              entries={content.skills}
              tokens={tokens}
              headingStyle={hs}
              displayMode={customization.skillsDisplay}
            />
            <LanguagesSection
              entries={content.languages}
              tokens={tokens}
              headingStyle={hs}
              displayMode={customization.languagesDisplay}
            />
          </>
        )}
        <VolunteerSection entries={content.volunteer} tokens={tokens} headingStyle={hs} />
      </>
    );
  }

  return (
    <>
      <SummarySection summary={content.summary} tokens={tokens} headingStyle={hs} />
      <ExperienceSection
        entries={content.experience}
        tokens={tokens}
        headingStyle={hs}
        showTimeline={customization.showTimeline}
      />
      <EducationSection entries={content.education} tokens={tokens} headingStyle={hs} />
      {!hasSidebar && (
        <>
          <SkillsSection
            entries={content.skills}
            tokens={tokens}
            headingStyle={hs}
            displayMode={customization.skillsDisplay}
          />
        </>
      )}
      <ProjectsSection entries={content.projects} tokens={tokens} headingStyle={hs} />
      {!hasSidebar && (
        <>
          <CertificatesSection entries={content.certificates} tokens={tokens} headingStyle={hs} />
          <LanguagesSection
            entries={content.languages}
            tokens={tokens}
            headingStyle={hs}
            displayMode={customization.languagesDisplay}
          />
        </>
      )}
      <AwardsSection entries={content.awards} tokens={tokens} headingStyle={hs} />
      <VolunteerSection entries={content.volunteer} tokens={tokens} headingStyle={hs} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Creative two-column renderer
// ---------------------------------------------------------------------------

function CreativeTwoColumn({
  content,
  tokens,
  customization,
}: {
  content: ResolvedContent;
  tokens: StyleTokens;
  customization: TemplateCustomization;
}) {
  const hs = customization.headingStyle;
  const hasSideContent =
    content.skills.length > 0 ||
    content.languages.length > 0 ||
    content.certificates.length > 0 ||
    content.awards.length > 0;

  const mainColumn = (
    <div style={{ flex: 1.2 }}>
      <ExperienceSection entries={content.experience} tokens={tokens} headingStyle={hs} />
      <EducationSection entries={content.education} tokens={tokens} headingStyle={hs} />
      <ProjectsSection entries={content.projects} tokens={tokens} headingStyle={hs} />
      <VolunteerSection entries={content.volunteer} tokens={tokens} headingStyle={hs} />
    </div>
  );

  const sideColumn = hasSideContent ? (
    <div style={{ width: customization.sidebarWidth, flexShrink: 0 }}>
      <SkillsSection
        entries={content.skills}
        tokens={tokens}
        headingStyle={hs}
        displayMode={customization.skillsDisplay}
      />
      <LanguagesSection
        entries={content.languages}
        tokens={tokens}
        headingStyle={hs}
        displayMode={customization.languagesDisplay}
      />
      <CertificatesSection entries={content.certificates} tokens={tokens} headingStyle={hs} />
      <AwardsSection entries={content.awards} tokens={tokens} headingStyle={hs} />
    </div>
  ) : null;

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {customization.sidebarPosition === 'left' ? (
        <>
          {sideColumn}
          {mainColumn}
        </>
      ) : (
        <>
          {mainColumn}
          {sideColumn}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BasePreview component
// ---------------------------------------------------------------------------

export function BasePreview({
  content: rawContent,
  settings,
  customization,
}: {
  content: Record<string, unknown>;
  settings: DocumentSettings;
  customization: TemplateCustomization;
}) {
  const content = useMemo(() => resolveContent(rawContent), [rawContent]);
  const baseTokens = useMemo(() => buildTokens(settings), [settings]);

  const tokens: StyleTokens = useMemo(() => {
    if (customization.fontFamilyOverride) {
      return { ...baseTokens, fontFamily: customization.fontFamilyOverride };
    }
    return baseTokens;
  }, [baseTokens, customization.fontFamilyOverride]);

  const m = tokens.margins;
  const fs = tokens.fontSize;
  const contact = content.contact;

  // ── Modern sidebar layout ──────────────────────────────────────────────
  if (
    customization.layout === 'modern' &&
    customization.sidebarPosition !== 'none'
  ) {
    const fullName =
      [contact.first_name, contact.last_name].filter(Boolean).join(' ') || 'Your Name';
    const contactParts = [contact.email, contact.phone, contact.city].filter(Boolean);
    const links = [contact.linkedin, contact.website].filter(Boolean);

    const sidebar = (
      <div
        style={{
          width: customization.sidebarWidth,
          flexShrink: 0,
          backgroundColor: tokens.primaryColor,
          color: '#fff',
          padding: `${m.top + 8}px 16px ${m.bottom}px ${m.left}px`,
        }}
      >
        {customization.showPhotoPlaceholder && (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: fs * 2,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {(contact.first_name?.[0] || '').toUpperCase()}
            {(contact.last_name?.[0] || '').toUpperCase()}
          </div>
        )}
        <div
          style={{
            fontSize: fs * 1.4,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {fullName}
        </div>
        {contactParts.length > 0 && (
          <div
            style={{
              fontSize: fs - 2,
              opacity: 0.85,
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            {contactParts.join(' | ')}
          </div>
        )}
        {links.length > 0 && (
          <div
            style={{
              fontSize: fs - 2,
              opacity: 0.75,
              textAlign: 'center',
              marginBottom: 20,
              wordBreak: 'break-all' as const,
            }}
          >
            {links.join(' | ')}
          </div>
        )}
        <SidebarSections content={content} tokens={tokens} customization={customization} />
      </div>
    );

    const main = (
      <div style={{ flex: 1, padding: `${m.top}px ${m.right}px ${m.bottom}px 24px` }}>
        <MainSections content={content} tokens={tokens} customization={customization} />
      </div>
    );

    return (
      <div
        style={{
          fontFamily: `'${tokens.fontFamily}', sans-serif`,
          fontSize: fs,
          lineHeight: tokens.lineHeight,
          color: '#333',
          backgroundColor: '#fff',
          display: 'flex',
          minHeight: '100%',
          ...customization.containerStyle,
        }}
      >
        {customization.sidebarPosition === 'left' ? (
          <>
            {sidebar}
            {main}
          </>
        ) : (
          <>
            {main}
            {sidebar}
          </>
        )}
      </div>
    );
  }

  // ── Creative layout with header + two-column body ──────────────────────
  if (customization.layout === 'creative') {
    return (
      <div
        style={{
          fontFamily: `'${tokens.fontFamily}', sans-serif`,
          fontSize: fs,
          lineHeight: tokens.lineHeight,
          color: '#333',
          backgroundColor: '#fff',
          minHeight: '100%',
          ...customization.containerStyle,
        }}
      >
        <ContactHeader
          contact={contact}
          tokens={tokens}
          variant={customization.headerVariant}
        />
        <div style={{ padding: `20px ${m.right}px ${m.bottom}px ${m.left}px` }}>
          <SummarySection
            summary={content.summary}
            tokens={tokens}
            headingStyle={customization.headingStyle}
          />
          <CreativeTwoColumn
            content={content}
            tokens={tokens}
            customization={customization}
          />
        </div>
      </div>
    );
  }

  // ── Single-column layouts (professional, simple, business, classic) ────
  const fontFamily = customization.fontFamilyOverride
    ? customization.fontFamilyOverride
    : `'${tokens.fontFamily}', sans-serif`;

  const padding =
    customization.layout === 'simple'
      ? `${m.top + 8}px ${m.right + 8}px ${m.bottom + 8}px ${m.left + 8}px`
      : customization.layout === 'business' || customization.layout === 'classic'
        ? `${m.top + 4}px ${m.right + 4}px ${m.bottom + 4}px ${m.left + 4}px`
        : `${m.top}px ${m.right}px ${m.bottom}px ${m.left}px`;

  const textColor =
    customization.layout === 'simple'
      ? '#374151'
      : customization.layout === 'business' || customization.layout === 'classic'
        ? '#1f2937'
        : '#333';

  return (
    <div
      style={{
        fontFamily,
        fontSize: fs,
        lineHeight: tokens.lineHeight,
        color: textColor,
        padding,
        backgroundColor: '#fff',
        minHeight: '100%',
        ...customization.containerStyle,
      }}
    >
      <ContactHeader
        contact={contact}
        tokens={tokens}
        variant={customization.headerVariant}
      />
      <MainSections content={content} tokens={tokens} customization={customization} />
    </div>
  );
}

export default BasePreview;
