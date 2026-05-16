import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Atlas template preview (bonus - professional).
 *
 * Global-minded professional layout with a bold header and structured
 * sections. Uses bar-based skills and languages for a comprehensive
 * at-a-glance overview.
 */
export function AtlasPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: true,
    skillsDisplay: 'bars',
    languagesDisplay: 'bars',
    headingStyle: 'underline',
    headerVariant: 'modern',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default AtlasPreview;
