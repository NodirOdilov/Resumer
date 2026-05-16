import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Squares template preview.
 *
 * Modern layout with square/rectangular accent elements and a geometric
 * design language. Uses bars for skills to echo the square motif.
 */
export function SquaresPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern', {
    sidebarPosition: 'left',
    sidebarWidth: '34%',
    showPhotoPlaceholder: false,
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default SquaresPreview;
