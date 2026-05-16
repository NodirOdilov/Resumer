import React, { useEffect, useMemo, useState } from 'react';
import type { CoverLetterRendererProps } from './types';
import { buildTokens } from './types';
import { getLayoutForSlug } from './TemplateRenderer';

/**
 * Render a cover letter preview with template-matching styling.
 *
 * The visual style (colors, fonts) inherits from the same template slug
 * mapping used for resumes so the two documents look cohesive.
 */
export function CoverLetterRenderer({
  templateSlug,
  content,
  settings,
}: CoverLetterRendererProps) {
  const tokens = useMemo(() => buildTokens(settings), [settings]);
  const m = tokens.margins;
  const fs = tokens.fontSize;

  /* Determine whether the matched layout family uses serif fonts */
  const Layout = getLayoutForSlug(templateSlug);
  const isExecutive = Layout.name === 'ExecutiveLayout';
  const fontFamily = isExecutive
    ? `'Georgia', 'Times New Roman', serif`
    : `'${tokens.fontFamily}', sans-serif`;

  // Render the date only after mount so SSR (timezone unknown) and client
  // agree. Falls back to an empty string during the first paint.
  const [todayClient, setTodayClient] = useState<string>('');
  useEffect(() => {
    setTodayClient(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    );
  }, []);
  const today = content.date || todayClient;

  return (
    <div
      style={{
        fontFamily,
        fontSize: fs,
        lineHeight: tokens.lineHeight,
        color: '#1f2937',
        padding: `${m.top + 8}px ${m.right + 8}px ${m.bottom + 8}px ${m.left + 8}px`,
        backgroundColor: '#fff',
        minHeight: '100%',
      }}
    >
      {/* ── Sender info ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        {content.senderName && (
          <div
            style={{
              fontSize: fs * 1.6,
              fontWeight: 700,
              color: tokens.primaryColor,
              marginBottom: 4,
            }}
          >
            {content.senderName}
          </div>
        )}
        {content.senderAddress && (
          <div style={{ fontSize: fs - 1, color: '#6b7280' }}>{content.senderAddress}</div>
        )}
        <div style={{ fontSize: fs - 1, color: '#6b7280' }}>
          {[content.senderEmail, content.senderPhone].filter(Boolean).join('  |  ')}
        </div>
      </div>

      {/* ── Date ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20, fontSize: fs, color: '#374151' }}>{today}</div>

      {/* ── Recipient info ───────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        {content.recipientName && (
          <div style={{ fontWeight: 600, fontSize: fs }}>{content.recipientName}</div>
        )}
        {content.recipientTitle && (
          <div style={{ fontSize: fs - 1, color: '#6b7280' }}>{content.recipientTitle}</div>
        )}
        {content.recipientCompany && (
          <div style={{ fontSize: fs - 1, color: '#6b7280' }}>{content.recipientCompany}</div>
        )}
        {content.recipientAddress && (
          <div style={{ fontSize: fs - 1, color: '#6b7280' }}>{content.recipientAddress}</div>
        )}
      </div>

      {/* ── Greeting ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 16, fontSize: fs }}>
        {content.greeting || 'Dear Hiring Manager,'}
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      {content.body && (
        <div style={{ marginBottom: 24 }}>
          {content.body.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                marginBottom: 12,
                fontSize: fs,
                lineHeight: tokens.lineHeight,
                textAlign: 'justify',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* ── Closing ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 6, fontSize: fs }}>
        {content.closing || 'Sincerely,'}
      </div>

      {/* ── Signature ────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 32,
          fontSize: fs,
          fontWeight: 600,
          color: tokens.primaryColor,
        }}
      >
        {content.signature || content.senderName || ''}
      </div>

      {/* ── Accent line at bottom matching template color ─────── */}
      <div
        style={{
          marginTop: 48,
          borderTop: `3px solid ${tokens.primaryColor}`,
          paddingTop: 8,
        }}
      />
    </div>
  );
}
