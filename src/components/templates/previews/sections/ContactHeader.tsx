import React from 'react';
import type { ContactInfo } from '@/types';
import type { StyleTokens } from '../types';

export interface ContactHeaderProps {
  contact: ContactInfo;
  tokens: StyleTokens;
  /** visual variant used by different layout families */
  variant?: 'professional' | 'modern' | 'creative' | 'simple' | 'executive';
}

export function ContactHeader({ contact, tokens, variant = 'professional' }: ContactHeaderProps) {
  const fullName =
    [contact.first_name, contact.last_name].filter(Boolean).join(' ') || 'Your Name';

  const contactParts = [contact.email, contact.phone, contact.city].filter(Boolean);
  const links = [contact.linkedin, contact.website].filter(Boolean);

  const fs = tokens.fontSize;

  /* ── variant styles ─────────────────────────────────────────── */

  if (variant === 'modern') {
    return (
      <div
        style={{
          padding: '20px 24px',
          backgroundColor: tokens.primaryColor,
          color: '#fff',
          fontFamily: tokens.fontFamily,
        }}
      >
        <div style={{ fontSize: fs * 2, fontWeight: 700 }}>{fullName}</div>
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs - 1, marginTop: 6, opacity: 0.9 }}>
            {contactParts.join('  |  ')}
          </div>
        )}
        {links.length > 0 && (
          <div style={{ fontSize: fs - 2, marginTop: 4, opacity: 0.8 }}>
            {links.join('  |  ')}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'creative') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '28px 24px 20px',
          background: `linear-gradient(135deg, ${tokens.primaryColor}, ${tokens.primaryColor}cc)`,
          color: '#fff',
          fontFamily: tokens.fontFamily,
        }}
      >
        <div style={{ fontSize: fs * 2.2, fontWeight: 800, letterSpacing: 1 }}>{fullName}</div>
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs - 1, marginTop: 8, letterSpacing: 0.5, opacity: 0.9 }}>
            {contactParts.join('  \u2022  ')}
          </div>
        )}
        {links.length > 0 && (
          <div style={{ fontSize: fs - 2, marginTop: 4, opacity: 0.8 }}>
            {links.join('  \u2022  ')}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div
        style={{
          fontFamily: tokens.fontFamily,
          paddingBottom: 12,
          marginBottom: 16,
          borderBottom: `1px solid #e5e7eb`,
        }}
      >
        <div style={{ fontSize: fs * 1.8, fontWeight: 600, color: '#1f2937' }}>{fullName}</div>
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs - 1, marginTop: 4, color: '#6b7280' }}>
            {contactParts.join('  \u00b7  ')}
          </div>
        )}
        {links.length > 0 && (
          <div style={{ fontSize: fs - 2, marginTop: 2, color: '#9ca3af' }}>
            {links.join('  \u00b7  ')}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'executive') {
    return (
      <div
        style={{
          fontFamily: `'Georgia', 'Times New Roman', serif`,
          textAlign: 'center',
          paddingBottom: 16,
          marginBottom: 20,
          borderBottom: `2px solid ${tokens.primaryColor}`,
        }}
      >
        <div
          style={{
            fontSize: fs * 2,
            fontWeight: 700,
            color: tokens.primaryColor,
            textTransform: 'uppercase',
            letterSpacing: 3,
          }}
        >
          {fullName}
        </div>
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs - 1, marginTop: 8, color: '#4b5563', letterSpacing: 0.5 }}>
            {contactParts.join('  \u2014  ')}
          </div>
        )}
        {links.length > 0 && (
          <div style={{ fontSize: fs - 2, marginTop: 4, color: '#6b7280' }}>
            {links.join('  \u2014  ')}
          </div>
        )}
      </div>
    );
  }

  /* professional (default) */
  return (
    <div
      style={{
        fontFamily: tokens.fontFamily,
        borderBottom: `3px solid ${tokens.primaryColor}`,
        paddingBottom: 16,
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: fs * 2, fontWeight: 700, color: tokens.primaryColor }}>
        {fullName}
      </div>
      {contactParts.length > 0 && (
        <div style={{ fontSize: fs - 2, color: '#666', marginTop: 4 }}>
          {contactParts.join('  \u2022  ')}
        </div>
      )}
      {links.length > 0 && (
        <div style={{ fontSize: fs - 2, color: '#888', marginTop: 2 }}>
          {links.join('  \u2022  ')}
        </div>
      )}
    </div>
  );
}
