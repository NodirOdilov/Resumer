'use client';

import { useCallback } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import { useResume, useUpdateResume } from '@/hooks/useResume';
import { useAutoSave } from '@/hooks/useAutoSave';
import api from '@/lib/api';
import type { DocumentTemplate, DownloadFormat } from '@/types';

export function useBuilder() {
  const store = useBuilderStore();
  const updateResumeMutation = useUpdateResume();

  const { data: resumeData } = useResume(store.documentId);

  // Save function used by auto-save
  const saveFn = useCallback(
    async (data: Record<string, unknown>) => {
      if (!store.documentId) return;
      store.setIsSaving(true);
      try {
        await updateResumeMutation.mutateAsync({
          id: store.documentId,
          content: data as Record<string, unknown>,
          settings: store.settings,
        });
        store.markSaved();
      } catch {
        store.setIsSaving(false);
        throw new Error('Failed to save resume');
      }
    },
    [store, updateResumeMutation],
  );

  // Derive a server-side "updated at" timestamp so the auto-save hook can
  // compare it against any IndexedDB draft.
  const serverUpdatedAt = resumeData?.updated_at
    ? new Date(resumeData.updated_at).getTime()
    : null;

  const {
    isSaving,
    lastSavedAt,
    saveNow,
    pendingLocalDraft,
    acceptLocalDraft,
    discardLocalDraft,
  } = useAutoSave({
    data: store.content,
    saveFn,
    enabled: store.isDirty && store.documentId !== null,
    documentId: store.documentId,
    serverUpdatedAt,
  });

  // Load a resume into the builder
  const loadResume = useCallback(
    (id: string) => {
      store.setDocumentId(id);
      // When resumeData arrives via useResume, we sync it into the store
      if (resumeData && resumeData.id === id) {
        store.setContent(resumeData.content as Record<string, unknown>);
        store.updateSettings(resumeData.settings);
        if (resumeData.template) {
          store.setTemplate(resumeData.template);
        }
        store.setDocumentType(resumeData.document_type);
        store.setVersions(resumeData.versions);
      }
    },
    [store, resumeData],
  );

  // Restore a local draft that was found in IndexedDB
  const restoreLocalDraft = useCallback(() => {
    if (pendingLocalDraft) {
      store.setContent(pendingLocalDraft.data as Record<string, unknown>);
      acceptLocalDraft();
    }
  }, [pendingLocalDraft, store, acceptLocalDraft]);

  // Switch template
  const switchTemplate = useCallback(
    async (template: DocumentTemplate) => {
      store.setTemplate(template);
      if (store.documentId) {
        await updateResumeMutation.mutateAsync({
          id: store.documentId,
          template_id: template.id,
        });
      }
    },
    [store, updateResumeMutation],
  );

  // Download document in specified format
  const downloadDocument = useCallback(
    async (format: DownloadFormat) => {
      if (!store.documentId) return;

      const response = await api.get(`/resumes/${store.documentId}/download/`, {
        params: { format },
        responseType: 'blob',
      });

      const blob = new Blob([response.data as BlobPart]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const extension = format === 'docx' ? 'docx' : format;
      link.download = `resume.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    [store.documentId],
  );

  return {
    // State from store
    documentType: store.documentType,
    documentId: store.documentId,
    activeStep: store.activeStep,
    activeSection: store.activeSection,
    template: store.template,
    content: store.content,
    settings: store.settings,
    isDirty: store.isDirty,
    versions: store.versions,

    // Auto-save state
    isSaving,
    lastSavedAt,
    saveNow,

    // Local draft recovery
    pendingLocalDraft,
    restoreLocalDraft,
    discardLocalDraft,

    // Store actions
    updateContent: store.updateContent,
    updateSettings: store.updateSettings,
    setActiveSection: store.setActiveSection,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    resetBuilder: store.resetBuilder,
    setDocumentType: store.setDocumentType,

    // History actions
    undo: store.undo,
    redo: store.redo,

    // Combined actions
    loadResume,
    switchTemplate,
    downloadDocument,
  };
}
