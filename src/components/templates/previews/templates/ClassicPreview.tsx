import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Classic template preview.
 *
 * Traditional professional layout with clean section underlines,
 * straightforward typography, and a timeless design approach.
 */
export function ClassicPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: false,
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ClassicPreview;
