import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Ceramica template preview.
 *
 * Modern sidebar layout with smooth, ceramic-tile-inspired color blocks.
 * Left sidebar with photo placeholder, skills, and languages.
 */
export function CeramicaPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern', {
    sidebarPosition: 'left',
    sidebarWidth: '34%',
    showPhotoPlaceholder: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default CeramicaPreview;
