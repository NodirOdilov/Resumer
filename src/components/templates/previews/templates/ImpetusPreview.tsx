import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Impetus template preview.
 *
 * High-energy creative layout with strong visual impact. Features a
 * bold gradient header and accent-colored section markers with
 * tag-based skills for a dynamic feel.
 */
export function ImpetusPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('creative', {
    sidebarPosition: 'right',
    sidebarWidth: '33%',
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
    headingStyle: 'accent-bg',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ImpetusPreview;
