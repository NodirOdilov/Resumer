'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Palette, Loader2 } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { useUiStore } from '@/stores/uiStore';
import { useDebouncedValue } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import type { DocumentTemplate } from '@/types';

export function LivePreview() {
  const content = useBuilderStore((s) => s.content);
  const settings = useBuilderStore((s) => s.settings);
  const template = useBuilderStore((s) => s.template);
  const setTemplate = useBuilderStore((s) => s.setTemplate);
  const previewZoom = useUiStore((s) => s.previewZoom);
  const setPreviewZoom = useUiStore((s) => s.setPreviewZoom);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const debouncedContent = useDebouncedValue(content, 500);
  const debouncedSettings = useDebouncedValue(settings, 500);

  const previewHtml = useMemo(() => {
    const contact = (debouncedContent.contact as Record<string, string>) || {};
    const summary = (debouncedContent.summary as string) || '';
    const experience = (debouncedContent.experience as Array<Record<string, unknown>>) || [];
    const education = (debouncedContent.education as Array<Record<string, unknown>>) || [];
    const skills = (debouncedContent.skills as Array<Record<string, unknown>>) || [];
    const themeColor = debouncedSettings.color || '#0D47A1';
    const font = debouncedSettings.font || 'Inter';
    const fontSize = debouncedSettings.fontSize || 14;
    const lineSpacing = debouncedSettings.lineSpacing || 1.5;
    const m = debouncedSettings.margins || { top: 24, right: 24, bottom: 24, left: 24 };

    return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: '${font}', sans-serif;
    font-size: ${fontSize}px;
    line-height: ${lineSpacing};
    color: #333;
    padding: ${m.top}px ${m.right}px ${m.bottom}px ${m.left}px;
    background: #fff;
  }
  .header { border-bottom: 3px solid ${themeColor}; padding-bottom: 16px; margin-bottom: 16px; }
  .name { font-size: ${fontSize * 2}px; font-weight: 700; color: ${themeColor}; }
  .contact-row { font-size: ${fontSize - 2}px; color: #666; margin-top: 4px; }
  .section { margin-bottom: 16px; }
  .section-title {
    font-size: ${fontSize + 2}px; font-weight: 600; color: ${themeColor};
    border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .entry { margin-bottom: 10px; }
  .entry-title { font-weight: 600; }
  .entry-subtitle { color: #666; font-size: ${fontSize - 1}px; }
  .entry-date { color: #999; font-size: ${fontSize - 2}px; }
  .entry-desc { margin-top: 4px; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag {
    background: ${themeColor}15; color: ${themeColor}; border: 1px solid ${themeColor}30;
    padding: 2px 10px; border-radius: 12px; font-size: ${fontSize - 2}px;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="name">${contact.first_name || 'Your'} ${contact.last_name || 'Name'}</div>
    <div class="contact-row">
      ${[contact.email, contact.phone, contact.city].filter(Boolean).join(' &bull; ') || 'your.email@example.com'}
    </div>
    ${contact.linkedin ? `<div class="contact-row">${contact.linkedin}</div>` : ''}
  </div>
  ${summary ? `<div class="section"><div class="section-title">Professional Summary</div><p>${summary}</p></div>` : ''}
  ${
    experience.length > 0
      ? `<div class="section"><div class="section-title">Experience</div>${experience
          .map(
            (e) =>
              `<div class="entry"><div class="entry-title">${e.job_title || ''}</div><div class="entry-subtitle">${e.company || ''}${e.location ? ` &mdash; ${e.location}` : ''}</div><div class="entry-date">${e.start_date || ''} - ${e.is_current ? 'Present' : e.end_date || ''}</div>${e.description ? `<div class="entry-desc">${e.description}</div>` : ''}</div>`
          )
          .join('')}</div>`
      : ''
  }
  ${
    education.length > 0
      ? `<div class="section"><div class="section-title">Education</div>${education
          .map(
            (e) =>
              `<div class="entry"><div class="entry-title">${e.institution || ''}</div><div class="entry-subtitle">${e.degree || ''}${e.field_of_study ? ` in ${e.field_of_study}` : ''}</div><div class="entry-date">${e.start_date || ''} - ${e.end_date || ''}</div></div>`
          )
          .join('')}</div>`
      : ''
  }
  ${
    skills.length > 0
      ? `<div class="section"><div class="section-title">Skills</div><div class="skills-grid">${skills.map((s) => `<span class="skill-tag">${(s as Record<string, string>).name || ''}</span>`).join('')}</div></div>`
      : ''
  }
</body>
</html>`;
  }, [debouncedContent, debouncedSettings]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTotalPages(1);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [previewHtml]);

  const handleTemplateChange = (t: DocumentTemplate) => {
    setTemplate(t);
    setTemplateModalOpen(false);
  };

  return (
    <div className="flex h-full flex-col bg-gray-100">
      {/* Controls */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewZoom(previewZoom - 10)}
            disabled={previewZoom <= 50}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3rem] text-center text-xs font-medium text-gray-600">
            {previewZoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewZoom(previewZoom + 10)}
            disabled={previewZoom >= 150}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setTemplateModalOpen(true)}
          className="h-8 gap-1.5 text-xs"
        >
          <Palette className="h-3.5 w-3.5" />
          Change Template
        </Button>
      </div>

      {/* Preview Area */}
      <div className="relative flex-1 overflow-auto p-4">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/80">
            <Loader2 className="h-8 w-8 animate-spin text-[#0D47A1]" />
          </div>
        )}
        <div
          ref={previewRef}
          className="mx-auto origin-top"
          style={{
            width: '210mm',
            minHeight: '297mm',
            transform: `scale(${previewZoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            srcDoc={previewHtml}
            title="Resume Preview"
            className="h-[297mm] w-full border border-gray-300 bg-white shadow-lg"
            sandbox="allow-same-origin"
          />
        </div>
      </div>

      {/* Template Change Modal */}
      <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Template</DialogTitle>
          </DialogHeader>
          <TemplateSelector isModal onSelect={handleTemplateChange} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
