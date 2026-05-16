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
 * Executive / elegant layout used by:
 * Iconic, Primo, Synergy, Vintage, Elevate
 *
 * Sophisticated centered header, serif fonts, elegant section borders,
 * achievement-focused layout, and professional appearance.
 */
export function ExecutiveLayout({ content, tokens }: LayoutProps) {
  const m = tokens.margins;
  const executiveTokens = {
    ...tokens,
    fontFamily: `Georgia, 'Times New Roman', serif`,
  };

  return (
    <div
      style={{
        fontFamily: `'Georgia', 'Times New Roman', serif`,
        fontSize: tokens.fontSize,
        lineHeight: tokens.lineHeight,
        color: '#1f2937',
        padding: `${m.top + 4}px ${m.right + 4}px ${m.bottom + 4}px ${m.left + 4}px`,
        backgroundColor: '#fff',
        minHeight: '100%',
      }}
    >
      <ContactHeader contact={content.contact} tokens={tokens} variant="executive" />
      <SummarySection summary={content.summary} tokens={executiveTokens} headingStyle="elegant" />
      <ExperienceSection entries={content.experience} tokens={executiveTokens} headingStyle="elegant" />
      <EducationSection entries={content.education} tokens={executiveTokens} headingStyle="elegant" />

      {/* Awards placed high -- achievement-focused */}
      <AwardsSection entries={content.awards} tokens={executiveTokens} headingStyle="elegant" />
      <CertificatesSection entries={content.certificates} tokens={executiveTokens} headingStyle="elegant" />
      <ProjectsSection entries={content.projects} tokens={executiveTokens} headingStyle="elegant" />
      <SkillsSection
        entries={content.skills}
        tokens={executiveTokens}
        headingStyle="elegant"
        displayMode="dots"
      />
      <LanguagesSection
        entries={content.languages}
        tokens={executiveTokens}
        headingStyle="elegant"
        displayMode="dots"
      />
      <VolunteerSection entries={content.volunteer} tokens={executiveTokens} headingStyle="elegant" />
    </div>
  );
}
