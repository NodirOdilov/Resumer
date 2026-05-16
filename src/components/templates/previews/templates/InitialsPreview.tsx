import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Initials template preview.
 *
 * Creative layout that emphasizes the candidate's initials as a personal
 * branding element. Uses a prominent header with large initials and a
 * two-column body with skills shown as tags.
 */
export function InitialsPreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('creative', {
    sidebarPosition: 'right',
    sidebarWidth: '35%',
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
    headerLetterSpacing: 3,
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default InitialsPreview;
