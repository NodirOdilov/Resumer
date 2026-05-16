import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Dynamic template preview.
 *
 * Energetic modern layout with a bold left sidebar and dynamic color usage.
 * Skills displayed as progress dots with a vivid primary color.
 */
export function DynamicPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern', {
    sidebarPosition: 'left',
    sidebarWidth: '32%',
    showPhotoPlaceholder: true,
    skillsDisplay: 'bars',
    languagesDisplay: 'dots',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default DynamicPreview;
