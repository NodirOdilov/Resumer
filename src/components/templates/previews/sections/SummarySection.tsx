import React from 'react';
import type { StyleTokens } from '../types';

export interface SummarySectionProps {
  summary: string;
  tokens: StyleTokens;
  headingStyle?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
}

export function SummarySection({
  summary,
  tokens,
  headingStyle = 'underline',
}: SummarySectionProps) {
  if (!summary) return null;

  const fs = tokens.fontSize;

  return (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle
        title="Professional Summary"
        tokens={tokens}
        style={headingStyle}
      />
      <p
        style={{
          fontSize: fs,
          lineHeight: tokens.lineHeight,
          color: '#374151',
          margin: 0,
        }}
      >
        {summary}
      </p>
    </div>
  );
}

/* ── Shared heading used across sections ──────────────────────── */

export interface SectionTitleProps {
  title: string;
  tokens: StyleTokens;
  style?: 'underline' | 'accent-bg' | 'simple' | 'elegant';
}

export function SectionTitle({ title, tokens, style = 'underline' }: SectionTitleProps) {
  const fs = tokens.fontSize;

  if (style === 'accent-bg') {
    return (
      <div
        style={{
          fontSize: fs + 1,
          fontWeight: 700,
          color: '#fff',
          backgroundColor: tokens.primaryColor,
          padding: '4px 10px',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 1,
          borderRadius: 2,
        }}
      >
        {title}
      </div>
    );
  }

  if (style === 'simple') {
    return (
      <div
        style={{
          fontSize: fs + 1,
          fontWeight: 600,
          color: '#374151',
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
    );
  }

  if (style === 'elegant') {
    return (
      <div
        style={{
          fontSize: fs + 2,
          fontWeight: 600,
          fontFamily: `'Georgia', 'Times New Roman', serif`,
          color: tokens.primaryColor,
          marginBottom: 8,
          paddingBottom: 4,
          borderBottom: `1px solid ${tokens.primaryColor}40`,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
    );
  }

  /* underline (default) */
  return (
    <div
      style={{
        fontSize: fs + 2,
        fontWeight: 600,
        color: tokens.primaryColor,
        borderBottom: `1px solid #e5e7eb`,
        paddingBottom: 4,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {title}
    </div>
  );
}
