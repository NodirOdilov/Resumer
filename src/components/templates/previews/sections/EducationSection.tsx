import React from 'react';
import type { EducationEntry } from '@/types';
import type { StyleTokens } from '../types';
import { SectionTitle } from './SummarySection';

export interface EducationSectionProps {
  entries: EducationEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
}

export function EducationSection({
  entries,
  tokens,
  headingStyle = 'underline',
}: EducationSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Education" tokens={tokens} style={headingStyle} />
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
            <div style={{ fontWeight: 600, fontSize: fs, color: '#1f2937' }}>
              {entry.institution}
            </div>
            <div style={{ fontSize: fs - 2, color: '#9ca3af' }}>
              {entry.start_date}
              {entry.end_date ? ` - ${entry.end_date}` : ''}
            </div>
          </div>
          <div style={{ fontSize: fs - 1, color: '#6b7280' }}>
            {entry.degree}
            {entry.field_of_study ? ` in ${entry.field_of_study}` : ''}
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
