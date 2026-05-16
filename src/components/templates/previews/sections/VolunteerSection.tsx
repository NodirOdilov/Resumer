import React from 'react';
import type { VolunteerEntry } from '@/types';
import type { StyleTokens } from '../types';
import { SectionTitle } from './SummarySection';

export interface VolunteerSectionProps {
  entries: VolunteerEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
}

export function VolunteerSection({
  entries,
  tokens,
  headingStyle = 'underline',
}: VolunteerSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Volunteer Experience" tokens={tokens} style={headingStyle} />
      {entries.map((entry) => (
        <div key={entry.id} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: fs, color: '#1f2937' }}>{entry.role}</div>
            <div style={{ fontSize: fs - 2, color: '#9ca3af' }}>
              {entry.start_date}
              {' - '}
              {entry.is_current ? 'Present' : entry.end_date}
            </div>
          </div>
          <div style={{ fontSize: fs - 1, color: '#6b7280' }}>
            {entry.organization}
            {entry.location ? ` \u2014 ${entry.location}` : ''}
          </div>
          {entry.description && (
            <div
              style={{
                fontSize: fs - 1,
                color: '#374151',
                marginTop: 4,
                whiteSpace: 'pre-wrap',
              }}
            >
              {entry.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
