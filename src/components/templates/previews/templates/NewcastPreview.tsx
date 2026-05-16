import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Newcast template preview.
 *
 * Professional layout with a clean, news-column inspired design.
 * Features crisp section dividers and a structured, editorial feel.
 */
export function NewcastPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: false,
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
    headingStyle: 'underline',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default NewcastPreview;
