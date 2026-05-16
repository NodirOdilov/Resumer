import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Cascade template preview.
 *
 * Professional single-column layout with bold accent-colored header border,
 * timeline-style experience entries, and skill level bars. The "cascade"
 * refers to the flowing top-to-bottom structure with stepped section dividers.
 */
export function CascadePreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: true,
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
    borderWidth: 3,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default CascadePreview;
