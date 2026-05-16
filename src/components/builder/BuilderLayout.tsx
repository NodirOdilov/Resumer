'use client';

import { useCallback, useState } from 'react';
import { Settings, ArrowLeft, Eye, PenLine } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { useBuilder } from '@/hooks/useBuilder';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/builder/ProgressBar';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { BuilderForm } from '@/components/builder/BuilderForm';
import { LivePreview } from '@/components/builder/LivePreview';
import { SettingsPanel } from '@/components/builder/SettingsPanel';
import { cn } from '@/lib/utils';

export function BuilderLayout() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const prevStep = useBuilderStore((s) => s.prevStep);
  const nextStep = useBuilderStore((s) => s.nextStep);
  const template = useBuilderStore((s) => s.template);
  const isSaving = useBuilderStore((s) => s.isSaving);
  const lastSavedAt = useBuilderStore((s) => s.lastSavedAt);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const { saveNow } = useBuilder();

  const handleSave = useCallback(() => {
    void saveNow();
  }, [saveNow]);

  useKeyboardShortcuts({
    onSave: handleSave,
    onUndo: undo,
    onRedo: redo,
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/* Top Bar */}
      <header className="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <Button variant="ghost" size="sm" onClick={prevStep} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Шаблоны</span>
        </Button>

        <div className="flex-1">
          <ProgressBar />
        </div>

        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-xs text-gray-400">Сохранение...</span>
          )}
          {!isSaving && lastSavedAt && (
            <span className="hidden text-xs text-gray-400 sm:inline">
              Сохранено
            </span>
          )}

          {template && (
            <span className="hidden rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 lg:inline">
              {template.name}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="gap-1.5"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Настройки</span>
          </Button>

          <Button size="sm" onClick={nextStep}>
            Скачать
          </Button>
        </div>
      </header>

      {/* Mobile Toggle */}
      <div className="flex border-b border-gray-200 bg-white lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('form')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
            mobileView === 'form'
              ? 'border-b-2 border-[#0D47A1] text-[#0D47A1]'
              : 'text-gray-500'
          )}
        >
          <PenLine className="h-4 w-4" />
          Редактировать
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
            mobileView === 'preview'
              ? 'border-b-2 border-[#0D47A1] text-[#0D47A1]'
              : 'text-gray-500'
          )}
        >
          <Eye className="h-4 w-4" />
          Предпросмотр
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Sidebar + Form */}
        <div
          className={cn(
            'flex flex-1 overflow-hidden lg:flex lg:w-[60%] lg:max-w-[60%]',
            mobileView === 'preview' && 'hidden lg:flex'
          )}
        >
          {/* Sidebar */}
          <aside className="hidden w-52 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-3 md:block">
            <BuilderSidebar />
          </aside>

          {/* Form */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <BuilderForm />
          </main>
        </div>

        {/* Right Panel: Preview */}
        <div
          className={cn(
            'hidden border-l border-gray-200 lg:block lg:w-[40%]',
            mobileView === 'preview' && 'block w-full lg:block lg:w-[40%]'
          )}
        >
          <LivePreview />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
