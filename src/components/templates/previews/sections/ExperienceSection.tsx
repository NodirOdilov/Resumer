import React from 'react';
import type { ExperienceEntry } from '@/types';
import type { StyleTokens } from '../types';
import { SectionTitle } from './SummarySection';

export interface ExperienceSectionProps {
  entries: ExperienceEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
  /** show timeline line on the left */
  showTimeline?: boolean;
}

export function ExperienceSection({
  entries,
  tokens,
  headingStyle = 'underline',
  showTimeline = false,
}: ExperienceSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Experience" tokens={tokens} style={headingStyle} />
      <div style={{ position: 'relative' }}>
        {showTimeline && (
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 6,
              bottom: 6,
              width: 2,
              backgroundColor: tokens.primaryColor + '30',
            }}
          />
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              marginBottom: 12,
              paddingLeft: showTimeline ? 18 : 0,
              position: 'relative',
            }}
          >
            {showTimeline && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: tokens.primaryColor,
                }}
              />
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: fs, color: '#1f2937' }}>
                {entry.job_title}
              </div>
              <div style={{ fontSize: fs - 2, color: '#9ca3af' }}>
                {entry.start_date}
                {' - '}
                {entry.is_current ? 'Present' : entry.end_date}
              </div>
            </div>
            <div style={{ fontSize: fs - 1, color: '#6b7280' }}>
              {entry.company}
              {entry.location ? ` \u2014 ${entry.location}` : ''}
            </div>
            {entry.description && (
              <div
                style={{
                  fontSize: fs - 1,
                  lineHeight: tokens.lineHeight,
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
    </div>
  );
}
