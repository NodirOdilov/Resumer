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
 * Simple / minimalist layout used by:
 * Crisp, Minimo, Nanica, Simple, Clarity
 *
 * Minimalist design with subtle dividers, maximum whitespace,
 * and clean typography.
 */
export function SimpleLayout({ content, tokens }: LayoutProps) {
  const m = tokens.margins;

  return (
    <div
      style={{
        fontFamily: `'${tokens.fontFamily}', sans-serif`,
        fontSize: tokens.fontSize,
        lineHeight: tokens.lineHeight,
        color: '#374151',
        padding: `${m.top + 8}px ${m.right + 8}px ${m.bottom + 8}px ${m.left + 8}px`,
        backgroundColor: '#fff',
        minHeight: '100%',
      }}
    >
      <ContactHeader contact={content.contact} tokens={tokens} variant="simple" />
      <SummarySection summary={content.summary} tokens={tokens} headingStyle="simple" />
      <ExperienceSection entries={content.experience} tokens={tokens} headingStyle="simple" />
      <EducationSection entries={content.education} tokens={tokens} headingStyle="simple" />
      <SkillsSection
        entries={content.skills}
        tokens={tokens}
        headingStyle="simple"
        displayMode="tags"
      />
      <ProjectsSection entries={content.projects} tokens={tokens} headingStyle="simple" />
      <CertificatesSection entries={content.certificates} tokens={tokens} headingStyle="simple" />
      <LanguagesSection
        entries={content.languages}
        tokens={tokens}
        headingStyle="simple"
        displayMode="text"
      />
      <AwardsSection entries={content.awards} tokens={tokens} headingStyle="simple" />
      <VolunteerSection entries={content.volunteer} tokens={tokens} headingStyle="simple" />
    </div>
  );
}
