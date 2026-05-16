import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Valera template preview.
 *
 * Professional layout with bold header typography, strong accent underlines,
 * and a confident, authoritative design language.
 */
export function ValeraPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    borderWidth: 4,
    headerLetterSpacing: 2,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ValeraPreview;
