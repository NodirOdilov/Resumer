import React from 'react';
import type { LayoutProps } from '../types';
import { hexToRgba } from '../types';
import {
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  CertificatesSection,
  ProjectsSection,
  AwardsSection,
  VolunteerSection,
} from '../sections';

/**
 * Modern two-column sidebar layout used by:
 * Ceramica, Dynamic, Influx, Lumina, Modern, Profile, Squares, Horizon
 *
 * Left sidebar with photo placeholder, skills, and languages.
 * Main column with experience and education.
 */
export function ModernLayout({ content, tokens }: LayoutProps) {
  const m = tokens.margins;
  const fs = tokens.fontSize;
  const contact = content.contact;
  const fullName =
    [contact.first_name, contact.last_name].filter(Boolean).join(' ') || 'Your Name';
  const contactParts = [contact.email, contact.phone, contact.city].filter(Boolean);
  const links = [contact.linkedin, contact.website].filter(Boolean);

  const sidebarWidth = '34%';

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
      }}
    >
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <div
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          backgroundColor: tokens.primaryColor,
          color: '#fff',
          padding: `${m.top + 8}px ${16}px ${m.bottom}px ${m.left}px`,
        }}
      >
        {/* Photo placeholder */}
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

        {/* Name */}
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

        {/* Contact info */}
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
              wordBreak: 'break-all',
            }}
          >
            {links.join(' | ')}
          </div>
        )}

        {/* Sidebar sections with inverted colors */}
        <SkillsSection
          entries={content.skills}
          tokens={{ ...tokens, primaryColor: '#fff' }}
          headingStyle="simple"
          displayMode="dots"
        />
        <LanguagesSection
          entries={content.languages}
          tokens={{ ...tokens, primaryColor: '#fff' }}
          headingStyle="simple"
          displayMode="dots"
        />
        <CertificatesSection
          entries={content.certificates}
          tokens={{ ...tokens, primaryColor: '#fff' }}
          headingStyle="simple"
        />
      </div>

      {/* ── Main Column ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: `${m.top}px ${m.right}px ${m.bottom}px 24px`,
        }}
      >
        <SummarySection
          summary={content.summary}
          tokens={tokens}
          headingStyle="underline"
        />
        <ExperienceSection
          entries={content.experience}
          tokens={tokens}
          headingStyle="underline"
        />
        <EducationSection
          entries={content.education}
          tokens={tokens}
          headingStyle="underline"
        />
        <ProjectsSection
          entries={content.projects}
          tokens={tokens}
          headingStyle="underline"
        />
        <AwardsSection
          entries={content.awards}
          tokens={tokens}
          headingStyle="underline"
        />
        <VolunteerSection
          entries={content.volunteer}
          tokens={tokens}
          headingStyle="underline"
        />
      </div>
    </div>
  );
}
