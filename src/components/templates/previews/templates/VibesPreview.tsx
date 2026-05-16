import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Vibes template preview.
 *
 * Casual and expressive creative layout with a relaxed visual rhythm.
 * Uses tag-based skills and text-only languages for a laid-back feel.
 */
export function VibesPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('creative', {
    sidebarPosition: 'right',
    sidebarWidth: '34%',
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
    headingStyle: 'accent-bg',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default VibesPreview;
