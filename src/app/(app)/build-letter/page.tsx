'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilderStore } from '@/stores/builderStore';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { DownloadPanel } from '@/components/builder/DownloadPanel';

const COVER_LETTER_SECTIONS = [
  'recipient',
  'greeting',
  'opening',
  'body',
  'closing',
  'signature',
] as const;

export default function BuildLetterPage() {
  const searchParams = useSearchParams();
  const activeStep = useBuilderStore((s) => s.activeStep);
  const setDocumentType = useBuilderStore((s) => s.setDocumentType);
  const setActiveSection = useBuilderStore((s) => s.setActiveSection);

  useEffect(() => {
    setDocumentType('cover_letter');
  }, [setDocumentType]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (
      section &&
      COVER_LETTER_SECTIONS.includes(section as typeof COVER_LETTER_SECTIONS[number])
    ) {
      setActiveSection(section);
    }
  }, [searchParams, setActiveSection]);

  return (
    <div className="min-h-screen bg-gray-50">
      {activeStep === 1 && <TemplateSelector />}
      {activeStep === 2 && <BuilderLayout />}
      {activeStep === 3 && <DownloadPanel />}
    </div>
  );
}
