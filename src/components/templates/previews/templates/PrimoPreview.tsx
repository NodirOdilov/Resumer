import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Primo template preview.
 *
 * Premium business layout with refined serif typography and a distinguished
 * executive header. Emphasizes credentials and achievements.
 */
export function PrimoPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('business', {
    awardsFirst: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    headingStyle: 'elegant',
    headerLetterSpacing: 3,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default PrimoPreview;
