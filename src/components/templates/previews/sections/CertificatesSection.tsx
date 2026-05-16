import React from 'react';
import type { CertificateEntry } from '@/types';
import type { StyleTokens } from '../types';
import { SectionTitle } from './SummarySection';

export interface CertificatesSectionProps {
  entries: CertificateEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
}

export function CertificatesSection({
  entries,
  tokens,
  headingStyle = 'underline',
}: CertificatesSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Certifications" tokens={tokens} style={headingStyle} />
      {entries.map((cert) => (
        <div key={cert.id} style={{ marginBottom: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: fs, color: '#1f2937' }}>{cert.name}</div>
            {cert.date && (
              <div style={{ fontSize: fs - 2, color: '#9ca3af' }}>{cert.date}</div>
            )}
          </div>
          {cert.issuer && (
            <div style={{ fontSize: fs - 1, color: '#6b7280' }}>{cert.issuer}</div>
          )}
          {cert.description && (
            <div style={{ fontSize: fs - 1, color: '#374151', marginTop: 2 }}>
              {cert.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
