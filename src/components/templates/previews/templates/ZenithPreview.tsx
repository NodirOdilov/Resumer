import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Zenith template preview (bonus - creative).
 *
 * Peak-inspired creative layout that aims for the highest visual impact.
 * Bold gradient header with left-side compact sections for a distinctive
 * two-column body arrangement.
 */
export function ZenithPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('creative', {
    sidebarPosition: 'left',
    sidebarWidth: '33%',
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    headingStyle: 'accent-bg',
    gradientHeader: true,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ZenithPreview;
