import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Muse template preview.
 *
 * Artistically inspired creative layout with elegant section headers
 * and a harmonious color palette. Uses a left sidebar placement
 * for a different visual flow from other creative templates.
 */
export function MusePreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('creative', {
    sidebarPosition: 'left',
    sidebarWidth: '32%',
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
    headingStyle: 'accent-bg',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default MusePreview;
