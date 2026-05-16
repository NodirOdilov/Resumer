import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Iconic template preview.
 *
 * Authoritative business layout with serif fonts, centered executive header,
 * and achievement-focused section ordering (awards placed prominently).
 */
export function IconicPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('business', {
    awardsFirst: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    headingStyle: 'elegant',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default IconicPreview;
