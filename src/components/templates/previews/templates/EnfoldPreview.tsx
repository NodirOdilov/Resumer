import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Enfold template preview.
 *
 * Professional layout with an enveloping header design, where the name
 * and contact details are wrapped in a subtle accent background band.
 */
export function EnfoldPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: true,
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
    headerVariant: 'modern',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default EnfoldPreview;
