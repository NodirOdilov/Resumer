import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Clarity template preview (bonus - simple).
 *
 * Crystal-clear simple layout with maximum readability and clean structure.
 * Uses text-based skills and languages for an uncluttered appearance.
 */
export function ClarityPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('simple', {
    skillsDisplay: 'text',
    languagesDisplay: 'text',
    headingStyle: 'simple',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ClarityPreview;
