import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Minimo template preview.
 *
 * Ultra-minimalist design with the absolute minimum visual chrome.
 * Relies on typography and whitespace for visual hierarchy.
 */
export function MinimoPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('simple', {
    skillsDisplay: 'text',
    languagesDisplay: 'text',
    headingStyle: 'simple',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default MinimoPreview;
