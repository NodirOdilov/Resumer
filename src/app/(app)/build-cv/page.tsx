'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilderStore } from '@/stores/builderStore';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { DownloadPanel } from '@/components/builder/DownloadPanel';

const CV_EXTRA_SECTIONS = [
  'publications',
  'conferences',
  'research',
  'teaching',
  'grants',
] as const;

export default function BuildCVPage() {
  const searchParams = useSearchParams();
  const activeStep = useBuilderStore((s) => s.activeStep);
  const setDocumentType = useBuilderStore((s) => s.setDocumentType);
  const setActiveSection = useBuilderStore((s) => s.setActiveSection);

  useEffect(() => {
    setDocumentType('cv');
  }, [setDocumentType]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && CV_EXTRA_SECTIONS.includes(section as typeof CV_EXTRA_SECTIONS[number])) {
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
