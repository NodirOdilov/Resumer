import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Spectra template preview.
 *
 * Color-spectrum-inspired creative layout with vivid accents and a bold
 * gradient header. Right sidebar with dot-based skill indicators for
 * a unique visual texture.
 */
export function SpectraPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('creative', {
    sidebarPosition: 'right',
    sidebarWidth: '35%',
    skillsDisplay: 'dots',
    languagesDisplay: 'dots',
    headingStyle: 'accent-bg',
    gradientHeader: true,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default SpectraPreview;
