import React from 'react';
import type { AwardEntry } from '@/types';
import type { StyleTokens } from '../types';
import { SectionTitle } from './SummarySection';

export interface AwardsSectionProps {
  entries: AwardEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
}

export function AwardsSection({
  entries,
  tokens,
  headingStyle = 'underline',
}: AwardsSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Awards" tokens={tokens} style={headingStyle} />
      {entries.map((award) => (
        <div key={award.id} style={{ marginBottom: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: fs, color: '#1f2937' }}>{award.title}</div>
            {award.date && (
              <div style={{ fontSize: fs - 2, color: '#9ca3af' }}>{award.date}</div>
            )}
          </div>
          {award.issuer && (
            <div style={{ fontSize: fs - 1, color: '#6b7280' }}>{award.issuer}</div>
          )}
          {award.description && (
            <div style={{ fontSize: fs - 1, color: '#374151', marginTop: 2, whiteSpace: 'pre-wrap' }}>
              {award.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
