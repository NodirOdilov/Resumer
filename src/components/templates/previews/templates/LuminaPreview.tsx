import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Lumina template preview.
 *
 * Light and luminous modern layout with a bright sidebar and clean main column.
 * Features dots for skills and languages with refined spacing.
 */
export function LuminaPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern', {
    sidebarPosition: 'left',
    sidebarWidth: '33%',
    showPhotoPlaceholder: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default LuminaPreview;
