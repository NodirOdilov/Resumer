'use client';

import { useMemo } from 'react';
import { useBuilderStore } from '@/stores/builderStore';

const SECTIONS = [
  'contact',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'certificates',
  'projects',
  'awards',
  'volunteer',
  'hobbies',
  'custom_sections',
] as const;

export function ProgressBar() {
  const content = useBuilderStore((s) => s.content);

  const percentage = useMemo(() => {
    let filled = 0;
    for (const section of SECTIONS) {
      const data = content[section];
      if (!data) continue;
      if (typeof data === 'string' && data.trim().length > 0) {
        filled++;
      } else if (Array.isArray(data) && data.length > 0) {
        filled++;
      } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const values = Object.values(data as Record<string, unknown>);
        if (values.some((v) => typeof v === 'string' && v.trim().length > 0)) {
          filled++;
        }
      }
    }
    return Math.round((filled / SECTIONS.length) * 100);
  }, [content]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="min-w-[3rem] text-right text-sm font-medium text-gray-600">
        {percentage}%
      </span>
    </div>
  );
}
