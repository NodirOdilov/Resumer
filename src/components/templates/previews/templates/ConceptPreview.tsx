import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Concept template preview.
 *
 * Creative layout with a bold gradient header and two-column body.
 * Right sidebar holds skills and awards with accent-background headings.
 */
export function ConceptPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('creative', {
    sidebarPosition: 'right',
    sidebarWidth: '35%',
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ConceptPreview;
