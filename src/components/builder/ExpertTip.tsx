'use client';

import { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';

interface ExpertTipProps {
  tip: string;
}

export function ExpertTip({ tip }: ExpertTipProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <p className="flex-1 text-sm text-amber-800">{tip}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="shrink-0 rounded p-0.5 text-amber-400 hover:text-amber-600 transition-colors"
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
