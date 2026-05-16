import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Horizon template preview (bonus - modern).
 *
 * Expansive modern layout with a wide left sidebar and a horizon-like
 * header band. Uses dots for skills and a spacious feel.
 */
export function HorizonPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern', {
    sidebarPosition: 'left',
    sidebarWidth: '36%',
    showPhotoPlaceholder: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default HorizonPreview;
