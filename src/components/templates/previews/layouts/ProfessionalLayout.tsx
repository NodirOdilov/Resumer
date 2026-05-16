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
 * Professional layout used by:
 * Cascade, Classic, Cubic, Diamond, Enfold, Newcast, Valera, Nexus, Atlas
 *
 * Clean single-column layout with bold section headings,
 * accent-color underlines, and timeline-style experience.
 * Skills rendered as level bars.
 */
export function ProfessionalLayout({ content, tokens }: LayoutProps) {
  const m = tokens.margins;

  return (
    <div
      style={{
        fontFamily: `'${tokens.fontFamily}', sans-serif`,
        fontSize: tokens.fontSize,
        lineHeight: tokens.lineHeight,
        color: '#333',
        padding: `${m.top}px ${m.right}px ${m.bottom}px ${m.left}px`,
        backgroundColor: '#fff',
        minHeight: '100%',
      }}
    >
      <ContactHeader contact={content.contact} tokens={tokens} variant="professional" />
      <SummarySection summary={content.summary} tokens={tokens} headingStyle="underline" />
      <ExperienceSection
        entries={content.experience}
        tokens={tokens}
        headingStyle="underline"
        showTimeline
      />
      <EducationSection entries={content.education} tokens={tokens} headingStyle="underline" />
      <SkillsSection
        entries={content.skills}
        tokens={tokens}
        headingStyle="underline"
        displayMode="bars"
      />
      <ProjectsSection entries={content.projects} tokens={tokens} headingStyle="underline" />
      <CertificatesSection entries={content.certificates} tokens={tokens} headingStyle="underline" />
      <LanguagesSection
        entries={content.languages}
        tokens={tokens}
        headingStyle="underline"
        displayMode="bars"
      />
      <AwardsSection entries={content.awards} tokens={tokens} headingStyle="underline" />
      <VolunteerSection entries={content.volunteer} tokens={tokens} headingStyle="underline" />
    </div>
  );
}
