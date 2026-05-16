'use client';

import { X } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLOR_SWATCHES = [
  '#0D47A1',
  '#1B5E20',
  '#B71C1C',
  '#4A148C',
  '#E65100',
  '#00695C',
  '#263238',
  '#880E4F',
];

const FONT_OPTIONS = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'PT Sans', label: 'PT Sans' },
  { value: 'Nunito', label: 'Nunito' },
];

const MARGIN_OPTIONS = [
  { value: 'narrow', label: 'Узкие', margins: { top: 16, right: 16, bottom: 16, left: 16 } },
  { value: 'normal', label: 'Обычные', margins: { top: 24, right: 24, bottom: 24, left: 24 } },
  { value: 'wide', label: 'Широкие', margins: { top: 32, right: 32, bottom: 32, left: 32 } },
];

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const settings = useBuilderStore((s) => s.settings);
  const updateSettings = useBuilderStore((s) => s.updateSettings);

  const currentMarginValue =
    MARGIN_OPTIONS.find(
      (m) =>
        m.margins.top === settings.margins.top &&
        m.margins.right === settings.margins.right
    )?.value || 'normal';

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Настройки</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Color Scheme */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Цветовая схема
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateSettings({ color })}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                    settings.color === color
                      ? 'border-gray-900 ring-2 ring-gray-900/20'
                      : 'border-gray-200'
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Выбрать цвет ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label
              htmlFor="settings-font"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Шрифт
            </label>
            <select
              id="settings-font"
              value={settings.font}
              onChange={(e) => updateSettings({ font: e.target.value })}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus:border-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/50"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label
              htmlFor="settings-fontsize"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Размер шрифта: {settings.fontSize}pt
            </label>
            <input
              id="settings-fontsize"
              type="range"
              min={8}
              max={14}
              step={1}
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
              className="w-full accent-[#0D47A1]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>8pt</span>
              <span>14pt</span>
            </div>
          </div>

          {/* Line Spacing */}
          <div>
            <label
              htmlFor="settings-linespacing"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Межстрочный интервал: {settings.lineSpacing.toFixed(1)}
            </label>
            <input
              id="settings-linespacing"
              type="range"
              min={1.0}
              max={2.0}
              step={0.1}
              value={settings.lineSpacing}
              onChange={(e) => updateSettings({ lineSpacing: Number(e.target.value) })}
              className="w-full accent-[#0D47A1]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1.0</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Поля
            </label>
            <div className="flex gap-2">
              {MARGIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateSettings({ margins: opt.margins })}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                    currentMarginValue === opt.value
                      ? 'border-[#0D47A1] bg-[#0D47A1]/5 text-[#0D47A1]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
