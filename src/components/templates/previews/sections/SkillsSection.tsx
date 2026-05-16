import React from 'react';
import type { SkillEntry } from '@/types';
import type { StyleTokens } from '../types';
import { SKILL_LEVEL_MAP } from '../types';
import { SectionTitle } from './SummarySection';

export interface SkillsSectionProps {
  entries: SkillEntry[];
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
  /** bars | tags | dots */
  displayMode?: 'bars' | 'tags' | 'dots';
}

export function SkillsSection({
  entries,
  tokens,
  headingStyle = 'underline',
  displayMode = 'bars',
}: SkillsSectionProps) {
  if (entries.length === 0) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle title="Skills" tokens={tokens} style={headingStyle} />

      {displayMode === 'bars' && (
        <div>
          {entries.map((skill) => {
            const pct = SKILL_LEVEL_MAP[skill.level] || 50;
            return (
              <div key={skill.id} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: fs - 1,
                    marginBottom: 2,
                    color: '#374151',
                  }}
                >
                  <span>{skill.name}</span>
                  <span style={{ color: '#9ca3af', fontSize: fs - 2, textTransform: 'capitalize' }}>
                    {skill.level}
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

      {displayMode === 'tags' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {entries.map((skill) => (
            <span
              key={skill.id}
              style={{
                padding: '3px 12px',
                fontSize: fs - 2,
                borderRadius: 14,
                backgroundColor: tokens.primaryColor + '15',
                color: tokens.primaryColor,
                border: `1px solid ${tokens.primaryColor}30`,
                fontWeight: 500,
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}

      {displayMode === 'dots' && (
        <div>
          {entries.map((skill) => {
            const filled = Math.ceil((SKILL_LEVEL_MAP[skill.level] || 50) / 20);
            return (
              <div
                key={skill.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                  fontSize: fs - 1,
                  color: '#374151',
                }}
              >
                <span>{skill.name}</span>
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
