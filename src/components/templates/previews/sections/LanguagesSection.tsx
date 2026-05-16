import React from 'react';
import type { LanguageEntry } from '@/types';
import type { StyleTokens } from '../types';
import { LANGUAGE_LEVEL_MAP } from '../types';
import { SectionTitle } from './SummarySection';

export interface LanguagesSectionProps {
  entries: LanguageEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
  displayMode?: 'bars' | 'text' | 'dots';
}

export function LanguagesSection({
  entries,
  tokens,
  headingStyle = 'underline',
  displayMode = 'bars',
}: LanguagesSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Languages" tokens={tokens} style={headingStyle} />

      {displayMode === 'bars' && (
        <div>
          {entries.map((lang) => {
            const pct = LANGUAGE_LEVEL_MAP[lang.proficiency] || 40;
            return (
              <div key={lang.id} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: fs - 1,
                    marginBottom: 2,
                    color: '#374151',
                  }}
                >
                  <span>{lang.name}</span>
                  <span style={{ color: '#9ca3af', fontSize: fs - 2, textTransform: 'capitalize' }}>
                    {lang.proficiency}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    backgroundColor: '#e5e7eb',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: tokens.primaryColor,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {displayMode === 'text' && (
        <div>
          {entries.map((lang) => (
            <div
              key={lang.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: fs - 1,
                color: '#374151',
                marginBottom: 4,
              }}
            >
              <span>{lang.name}</span>
              <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                {lang.proficiency}
              </span>
            </div>
          ))}
        </div>
      )}

      {displayMode === 'dots' && (
        <div>
          {entries.map((lang) => {
            const filled = Math.ceil((LANGUAGE_LEVEL_MAP[lang.proficiency] || 40) / 20);
            return (
              <div
                key={lang.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                  fontSize: fs - 1,
                  color: '#374151',
                }}
              >
                <span>{lang.name}</span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor:
                          dot <= filled ? tokens.primaryColor : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
