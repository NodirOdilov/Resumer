import React from 'react';
import type { ProjectEntry } from '@/types';
import type { StyleTokens } from '../types';
import { SectionTitle } from './SummarySection';

export interface ProjectsSectionProps {
  entries: ProjectEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
}

export function ProjectsSection({
  entries,
  tokens,
  headingStyle = 'underline',
}: ProjectsSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Projects" tokens={tokens} style={headingStyle} />
      {entries.map((proj) => (
        <div key={proj.id} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: fs, color: '#1f2937' }}>
              {proj.name}
              {proj.url && (
                <span style={{ fontWeight: 400, fontSize: fs - 2, color: '#6b7280', marginLeft: 6 }}>
                  {proj.url}
                </span>
              )}
            </div>
            {(proj.start_date || proj.end_date) && (
              <div style={{ fontSize: fs - 2, color: '#9ca3af' }}>
                {proj.start_date}
                {proj.end_date ? ` - ${proj.end_date}` : ''}
              </div>
            )}
          </div>
          {proj.description && (
            <div
              style={{
                fontSize: fs - 1,
                color: '#374151',
                marginTop: 4,
                whiteSpace: 'pre-wrap',
              }}
            >
              {proj.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
