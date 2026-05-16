import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Synergy template preview.
 *
 * Collaborative-minded business layout that balances formality with
 * approachability. Uses elegant section dividers and dot-based indicators.
 */
export function SynergyPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('business', {
    awardsFirst: false,
    skillsDisplay: 'bars',
    languagesDisplay: 'dots',
    headingStyle: 'elegant',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default SynergyPreview;
