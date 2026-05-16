import React from 'react';
import { BasePreview, mergeCustomization } from '../BasePreview';
import type { TemplatePreviewProps } from '../BasePreview';

/**
 * Profile template preview.
 *
 * Profile-focused modern layout with a prominent photo placeholder
 * and personal branding emphasis. Sidebar on the right for this variant.
 */
export function ProfilePreview({ content, settings, template }: TemplatePreviewProps) {
  const customization = mergeCustomization('modern', {
    sidebarPosition: 'right',
    sidebarWidth: '34%',
    showPhotoPlaceholder: true,
    skillsDisplay: 'tags',
    languagesDisplay: 'text',
  });

  return <BasePreview content={content} settings={settings} customization={customization} />;
}

export default ProfilePreview;
