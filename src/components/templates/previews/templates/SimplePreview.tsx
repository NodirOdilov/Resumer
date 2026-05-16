import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Simple template preview.
 *
 * The most straightforward layout with clean lines, standard spacing,
 * and maximum readability. An excellent default choice.
 */
export function SimplePreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('simple');

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default SimplePreview;
