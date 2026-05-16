import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Modern template preview.
 *
 * The flagship modern layout with left sidebar, photo placeholder,
 * and a balanced two-column design that works for all industries.
 */
export function ModernPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern');

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ModernPreview;
