import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Nexus template preview (bonus - professional).
 *
 * Premium professional template with a connected, network-inspired design.
 * Uses timeline markers and dot-based skills to suggest interconnection.
 */
export function NexusPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('professional', {
    showTimeline: true,
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    borderWidth: 3,
    headerLetterSpacing: 1,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default NexusPreview;
