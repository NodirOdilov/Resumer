import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Vintage template preview.
 *
 * Classic, timeless layout inspired by traditional printed resumes.
 * Uses serif fonts, refined borders, and elegant section headings
 * that evoke a vintage typographic style.
 */
export function VintagePreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('classic', {
    awardsFirst: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    headingStyle: 'elegant',
    fontFamilyOverride: "Georgia, 'Times New Roman', serif",
    headerLetterSpacing: 3,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default VintagePreview;
