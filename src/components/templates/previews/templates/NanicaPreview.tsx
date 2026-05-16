import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Nanica template preview.
 *
 * Compact, space-efficient simple layout ideal for shorter resumes.
 * Uses a subtle accent color and clean dividers between sections.
 */
export function NanicaPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('simple', {
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
    headingStyle: 'simple',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default NanicaPreview;
