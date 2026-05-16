import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Influx template preview.
 *
 * Modern layout with a flowing sidebar design and smooth transitions
 * between sections. Uses a wider sidebar to accommodate more content.
 */
export function InfluxPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern', {
    sidebarPosition: 'left',
    sidebarWidth: '36%',
    showPhotoPlaceholder: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default InfluxPreview;
