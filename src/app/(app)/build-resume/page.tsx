'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilderStore } from '@/stores/builderStore';
import { useResume } from '@/hooks/useResume';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { DownloadPanel } from '@/components/builder/DownloadPanel';

export default function BuildResumePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const activeStep = useBuilderStore((s) => s.activeStep);
  const documentId = useBuilderStore((s) => s.documentId);
  const setDocumentType = useBuilderStore((s) => s.setDocumentType);
  const setDocumentId = useBuilderStore((s) => s.setDocumentId);
  const setContent = useBuilderStore((s) => s.setContent);
  const setTemplate = useBuilderStore((s) => s.setTemplate);
  const updateSettings = useBuilderStore((s) => s.updateSettings);
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);

  useEffect(() => {
    setDocumentType('resume');
  }, [setDocumentType]);

  // If we land on the new-document URL (no ?id=) but a previous session left
  // a document loaded, clear the builder so the user starts fresh.
  useEffect(() => {
    if (!id && documentId) {
      resetBuilder();
    }
  }, [id, documentId, resetBuilder]);

  // Load an existing resume when ?id=… is present and we haven't already
  // loaded that document into the builder store.
  const { data: resume } = useResume(id);
  useEffect(() => {
    if (!resume) return;
    if (documentId === resume.id) return;
    setDocumentId(resume.id);
    setContent((resume as { content?: Record<string, unknown> }).content ?? {});
    if ((resume as { settings?: Record<string, unknown> }).settings) {
      updateSettings(
        (resume as { settings: Record<string, unknown> }).settings as never,
      );
    }
    const tpl = (resume as { template?: unknown }).template;
    if (tpl && typeof tpl === 'object') {
      setTemplate(tpl as never);
    }
    // Skip step 1 (template choice) when editing an existing doc.
    useBuilderStore.setState({ activeStep: 2 });
  }, [
    resume,
    documentId,
    setDocumentId,
    setContent,
    updateSettings,
    setTemplate,
  ]);

  // When ?template= is present we stay on step 1 by default; the selector
  // can read the param itself if it wants pre-selection.

  return (
    <div className="min-h-screen bg-gray-50">
      {activeStep === 1 && <TemplateSelector />}
      {activeStep === 2 && <BuilderLayout />}
      {activeStep === 3 && <DownloadPanel />}
    </div>
  );
}
