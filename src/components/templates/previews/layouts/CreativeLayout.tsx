import React from 'react';
import type { LayoutProps } from '../types';
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
} from '../sections';

/**
 * Creative layout used by:
 * Concept, Impetus, Initials, Muse, Spectra, Vibes, Zenith
 *
 * Bold header with accent background, icon-styled section markers,
 * unique typography emphasis, and skill tags instead of bars.
 */
export function CreativeLayout({ content, tokens }: LayoutProps) {
  const m = tokens.margins;
  const fs = tokens.fontSize;

  return (
    <div
      style={{
        fontFamily: `'${tokens.fontFamily}', sans-serif`,
        fontSize: fs,
        lineHeight: tokens.lineHeight,
        color: '#333',
        backgroundColor: '#fff',
        minHeight: '100%',
      }}
    >
      {/* Bold gradient header */}
      <ContactHeader contact={content.contact} tokens={tokens} variant="creative" />

      {/* Content area */}
      <div
        style={{
          padding: `20px ${m.right}px ${m.bottom}px ${m.left}px`,
        }}
      >
        <SummarySection
          summary={content.summary}
          tokens={tokens}
          headingStyle="accent-bg"
        />

        {/* Two-column content for variety */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left - main sections */}
          <div style={{ flex: 1.2 }}>
            <ExperienceSection
              entries={content.experience}
              tokens={tokens}
              headingStyle="accent-bg"
            />
            <EducationSection
              entries={content.education}
              tokens={tokens}
              headingStyle="accent-bg"
            />
            <ProjectsSection
              entries={content.projects}
              tokens={tokens}
              headingStyle="accent-bg"
            />
            <VolunteerSection
              entries={content.volunteer}
              tokens={tokens}
              headingStyle="accent-bg"
            />
          </div>

          {/* Right - compact sections */}
          {(content.skills.length > 0 ||
            content.languages.length > 0 ||
            content.certificates.length > 0 ||
            content.awards.length > 0) && (
            <div style={{ width: '35%', flexShrink: 0 }}>
              <SkillsSection
                entries={content.skills}
                tokens={tokens}
                headingStyle="accent-bg"
                displayMode="tags"
              />
              <LanguagesSection
                entries={content.languages}
                tokens={tokens}
                headingStyle="accent-bg"
                displayMode="text"
              />
              <CertificatesSection
                entries={content.certificates}
                tokens={tokens}
                headingStyle="accent-bg"
              />
              <AwardsSection
                entries={content.awards}
                tokens={tokens}
                headingStyle="accent-bg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
