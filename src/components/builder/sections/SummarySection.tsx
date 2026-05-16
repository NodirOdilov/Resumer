'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, ChevronDown, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';
import api from '@/lib/api';

const MAX_CHARS = 400;

const summarySchema = z.object({
  summary: z.string().max(MAX_CHARS, `Максимум ${MAX_CHARS} символов`).default(''),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

const PRE_WRITTEN_SUMMARIES: Record<string, string[]> = {
  'Software Engineer': [
    'Results-driven Software Engineer with 5+ years of experience designing, developing, and deploying scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about writing clean code and building user-centric solutions.',
    'Innovative software engineer skilled in full-stack development with expertise in modern JavaScript frameworks. Track record of delivering high-quality software on time while collaborating effectively with cross-functional teams.',
  ],
  'Marketing Manager': [
    'Strategic Marketing Manager with 7+ years of experience driving brand growth through data-driven campaigns. Expertise in digital marketing, content strategy, and team leadership. Consistently delivered 20%+ ROI improvement across campaigns.',
    'Creative marketing professional with proven ability to develop and execute comprehensive marketing strategies. Skilled in SEO, social media marketing, and analytics with a focus on measurable results.',
  ],
  'Project Manager': [
    'PMP-certified Project Manager with 8+ years of experience leading cross-functional teams to deliver complex projects on time and within budget. Strong expertise in Agile methodologies and stakeholder management.',
    'Dynamic project manager with a proven track record of managing multi-million dollar projects across diverse industries. Excellent communicator with strong analytical and problem-solving skills.',
  ],
  'Graphic Designer': [
    'Creative Graphic Designer with 4+ years of experience crafting compelling visual identities for brands across various industries. Proficient in Adobe Creative Suite, Figma, and responsive web design.',
    'Detail-oriented designer passionate about creating beautiful, functional designs. Experienced in branding, UI/UX design, and print media with a portfolio of award-winning work.',
  ],
  'Data Analyst': [
    'Analytical Data Analyst with 3+ years of experience transforming complex datasets into actionable business insights. Skilled in Python, SQL, Tableau, and statistical modeling.',
    'Data-driven analyst with expertise in business intelligence, reporting, and predictive analytics. Proven ability to communicate findings to non-technical stakeholders and drive data-informed decisions.',
  ],
};

const JOB_TITLES = Object.keys(PRE_WRITTEN_SUMMARIES);

export function SummarySection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');

  const savedSummary = (content.summary as string) || '';

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary: savedSummary },
    mode: 'onChange',
  });

  const summaryValue = watch('summary');
  const prevRef = useRef(summaryValue);

  const syncToStore = useCallback(
    (value: string) => {
      updateContent('summary', value);
    },
    [updateContent]
  );

  useEffect(() => {
    if (summaryValue !== prevRef.current) {
      prevRef.current = summaryValue;
      syncToStore(summaryValue);
    }
  }, [summaryValue, syncToStore]);

  const charCount = summaryValue.length;

  const handleSelectSuggestion = (text: string) => {
    setValue('summary', text, { shouldValidate: true });
    setSuggestionsOpen(false);
  };

  const [aiBusy, setAiBusy] = useState(false);
  const handleAiRewrite = async () => {
    if (aiBusy) return;
    setAiBusy(true);
    try {
      if (summaryValue.trim()) {
        const { data } = await api.post<{ improved_text: string }>(
          '/builder/ai/rewrite/',
          { text: summaryValue, section_type: 'summary' },
        );
        setValue('summary', data.improved_text || summaryValue, {
          shouldValidate: true,
        });
      } else {
        const { data } = await api.post<{ generated_text: string }>(
          '/builder/ai/generate/',
          {
            job_title: selectedJob || 'professional',
            section_type: 'summary',
          },
        );
        setValue('summary', data.generated_text || '', {
          shouldValidate: true,
        });
      }
    } catch {
      // Mock adapter never throws on AI endpoints — but if a real backend
      // does, leave the original text untouched.
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Профессиональное описание</h3>
        <p className="mt-1 text-sm text-gray-500">
          Кратко опишите ваш профессиональный опыт и ключевые сильные стороны.
        </p>
      </div>

      <ExpertTip tip="Используйте глаголы действия и измеримые достижения. Например: «Увеличил продажи на 30% в Q3 2024» сильнее, чем «Отвечал за продажи»." />

      {/* Pre-written Suggestions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setSuggestionsOpen(!suggestionsOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <span>Готовые описания по должности</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${suggestionsOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {suggestionsOpen && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Выберите должность
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                aria-label="Выберите должность"
                title="Выберите должность"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus:border-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/50"
              >
                <option value="">Выберите...</option>
                {JOB_TITLES.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            {selectedJob && PRE_WRITTEN_SUMMARIES[selectedJob] && (
              <div className="space-y-2">
                {PRE_WRITTEN_SUMMARIES[selectedJob].map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSuggestion(text)}
                    className="w-full rounded-md border border-gray-100 bg-gray-50 p-3 text-left text-sm text-gray-700 transition-colors hover:border-[#0D47A1]/30 hover:bg-[#0D47A1]/5"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <Textarea
          label="Описание"
          placeholder="Мотивированный специалист с X+ годами опыта в..."
          rows={6}
          maxLength={MAX_CHARS}
          error={errors.summary?.message}
          {...register('summary')}
        />
        <div className="flex items-center justify-between">
          <span
            className={`text-xs ${
              charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {charCount} / {MAX_CHARS}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            disabled={aiBusy}
            onClick={handleAiRewrite}
          >
            {aiBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Wand2 className="h-3.5 w-3.5" />
            )}
            {summaryValue.trim() ? 'Улучшить с AI' : 'Сгенерировать с AI'}
          </Button>
        </div>
      </div>
    </div>
  );
}
