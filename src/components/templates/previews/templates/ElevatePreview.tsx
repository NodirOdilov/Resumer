import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Elevate template preview (bonus - business).
 *
 * Premium business layout designed for career advancement. Features
 * an executive header with refined serif typography and achievement-first
 * section ordering to highlight leadership and accomplishments.
 */
export function ElevatePreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('business', {
    awardsFirst: true,
    skillsDisplay: 'bars',
    languagesDisplay: 'dots',
    headingStyle: 'elegant',
    headerLetterSpacing: 2,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ElevatePreview;
