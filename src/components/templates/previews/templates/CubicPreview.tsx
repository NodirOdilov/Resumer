import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Cubic template preview.
 *
 * Professional layout with geometric accent elements, structured sections,
 * and a modern take on the professional format with bolder heading borders.
 */
export function CubicPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: true,
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
    borderWidth: 4,
    containerStyle: {
      borderTop: '6px solid var(--primary-color, #2563eb)',
    },
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default CubicPreview;
