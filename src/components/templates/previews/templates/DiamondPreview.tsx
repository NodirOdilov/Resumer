import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Diamond template preview.
 *
 * Polished professional layout with refined typography, subtle accent colors,
 * and a diamond-shaped decorative element motif in the section headers.
 */
export function DiamondPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    headerLetterSpacing: 1,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default DiamondPreview;
