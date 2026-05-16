'use client';

import { useState } from 'react';
import { Download, FileText, FileType, ArrowLeft, Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { PrintableResume } from '@/components/builder/PrintableResume';

export function DownloadPanel() {
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx' | 'txt' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const prevStep = useBuilderStore((s) => s.prevStep);
  const template = useBuilderStore((s) => s.template);
  const user = useAuthStore((s) => s.user);

  // Demo accounts are flagged premium; real free users see the paywall.
  const isPremium = Boolean(
    user && (user as { isPremium?: boolean }).isPremium,
  );

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!isPremium) return;
    setDownloadFormat(format);
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsGenerating(false);
    setDownloadFormat(null);

    if (format === 'pdf') {
      // Browser-native PDF: opens the print dialog with "Save as PDF" preset
      // visible. Print CSS in globals.css strips chrome and prints only the
      // live preview area.
      window.print();
      return;
    }
    if (format === 'txt') {
      // Best-effort plain-text export from the rendered preview.
      const previewEl = document.querySelector('[data-resume-preview]');
      const text = previewEl ? (previewEl as HTMLElement).innerText : '';
      const blob = new Blob([text || 'Empty resume'], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'resume.txt';
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }
    // DOCX path: in the demo we fall back to the same print dialog so the
    // user always gets a saveable file. (Real backend uses python-docx.)
    window.print();
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50">
      {/* Hidden printable copy — only visible when print() runs */}
      <div className="print-only" aria-hidden="true">
        <PrintableResume />
      </div>

      {/* Header */}
      <div className="w-full border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevStep} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            К редактору
          </Button>
          {template && (
            <span className="text-sm text-gray-500">Шаблон: {template.name}</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-12">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Ваше резюме готово!</h2>
        <p className="mb-8 text-gray-500">Выберите формат и скачайте.</p>

        {isPremium ? (
          /* Premium Users: Direct Download */
          <div className="flex w-full max-w-md flex-col gap-3">
            <Button
              size="lg"
              onClick={() => handleDownload('pdf')}
              disabled={isGenerating}
              className="h-14 gap-3 text-base"
            >
              {isGenerating && downloadFormat === 'pdf' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              Скачать PDF
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleDownload('docx')}
              disabled={isGenerating}
              className="h-12 gap-3"
            >
              {isGenerating && downloadFormat === 'docx' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              Скачать DOCX
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => handleDownload('txt')}
              disabled={isGenerating}
              className="h-12 gap-3 text-gray-600"
            >
              {isGenerating && downloadFormat === 'txt' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileType className="h-5 w-5" />
              )}
              Скачать TXT
            </Button>
          </div>
        ) : (
          /* Free Users: Paywall */
          <div className="relative w-full max-w-lg">
            {/* Blurred Download Buttons */}
            <div className="pointer-events-none select-none blur-sm">
              <div className="flex flex-col gap-3">
                <div className="flex h-14 items-center justify-center gap-3 rounded-md bg-[#0D47A1] text-white">
                  <Download className="h-5 w-5" />
                  Скачать PDF
                </div>
                <div className="flex h-12 items-center justify-center gap-3 rounded-md border border-gray-300 text-gray-700">
                  <FileText className="h-5 w-5" />
                  Скачать DOCX
                </div>
                <div className="flex h-12 items-center justify-center gap-3 rounded-md text-gray-600">
                  <FileType className="h-5 w-5" />
                  Скачать TXT
                </div>
              </div>
            </div>

            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0D47A1]/10">
                    <Lock className="h-6 w-6 text-[#0D47A1]" />
                  </div>
                </div>
                <h3 className="mb-2 text-center text-xl font-bold text-gray-900">
                  Получите своё резюме
                </h3>
                <p className="mb-4 text-center text-sm text-gray-500">
                  Откройте неограниченные скачивания с пробным тарифом
                </p>

                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">240 ₽</span>
                    <span className="text-sm text-gray-500">/ 14 дней пробный</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      Неограниченные скачивания PDF, DOCX, TXT
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      Доступ ко всем премиум-шаблонам
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      AI-помощь в написании резюме
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      Отмена в любой момент
                    </li>
                  </ul>
                </div>

                <Button size="lg" className="h-12 w-full text-base font-semibold">
                  Начать пробный период
                </Button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Безопасная оплата. Отмена в любой момент пробного периода.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
