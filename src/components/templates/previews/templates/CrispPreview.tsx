import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Crisp template preview.
 *
 * Clean minimalist design with sharp, crisp lines and ample whitespace.
 * Uses tag-based skills display and text-only language proficiency.
 */
export function CrispPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('simple', {
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default CrispPreview;
