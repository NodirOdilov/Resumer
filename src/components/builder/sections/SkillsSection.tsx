'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';
import { cn } from '@/lib/utils';

const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
  'Swift', 'Kotlin', 'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js',
  'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails',
  'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Bootstrap', 'Material UI',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
  'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins', 'GitHub Actions',
  'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'Microservices',
  'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
  'Data Analysis', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel',
  'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'InVision',
  'SEO', 'Google Analytics', 'Facebook Ads', 'Google Ads', 'Content Marketing',
  'Project Management', 'Team Leadership', 'Communication', 'Problem Solving',
  'Critical Thinking', 'Time Management', 'Negotiation', 'Public Speaking',
  'Customer Service', 'Sales', 'Business Development', 'Strategic Planning',
  'Financial Analysis', 'Budgeting', 'Risk Management', 'Quality Assurance',
  'Technical Writing', 'Copywriting', 'Editing', 'Research',
  'AutoCAD', 'SolidWorks', 'MATLAB', 'R', 'Tableau', 'SPSS',
  'Linux', 'Windows Server', 'Network Administration', 'Cybersecurity',
  'Blockchain', 'Solidity', 'Web3', 'Smart Contracts',
  'UI/UX Design', 'User Research', 'Wireframing', 'Prototyping',
  'Video Editing', 'Final Cut Pro', 'Adobe Premiere', 'After Effects',
  'Salesforce', 'HubSpot', 'SAP', 'Oracle', 'QuickBooks',
];

const skillEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Название навыка обязательно'),
  level: z.number().min(1).max(5).default(3),
  category: z.enum(['hard', 'soft']).default('hard'),
});

const skillsSchema = z.object({
  entries: z.array(skillEntrySchema),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

function createEmptyEntry(): SkillsFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    name: '',
    level: 3,
    category: 'hard',
  };
}

export function SkillsSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const savedSkills = (content.skills as SkillsFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      entries: savedSkills.length > 0 ? savedSkills : [createEmptyEntry()],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues.entries));

  const syncToStore = useCallback(
    (entries: SkillsFormValues['entries']) => {
      updateContent('skills', entries);
    },
    [updateContent]
  );

  useEffect(() => {
    const serialized = JSON.stringify(formValues.entries);
    if (serialized !== prevRef.current) {
      prevRef.current = serialized;
      syncToStore(formValues.entries);
    }
  }, [formValues.entries, syncToStore]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1) return [];
    const query = searchQuery.toLowerCase();
    const existingNames = new Set(formValues.entries.map((e) => e.name.toLowerCase()));
    return SKILL_SUGGESTIONS.filter(
      (s) => s.toLowerCase().includes(query) && !existingNames.has(s.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery, formValues.entries]);

  const selectSuggestion = (index: number, name: string) => {
    setValue(`entries.${index}.name`, name, { shouldValidate: true });
    setAutocompleteIndex(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Навыки</h3>
        <p className="mt-1 text-sm text-gray-500">
          Добавьте релевантные навыки и оцените уровень владения.
        </p>
      </div>

      <ExpertTip tip="Используйте сочетание технических (hard) и гибких (soft) навыков. Подбирайте навыки под описание вакансии для лучшей совместимости с ATS." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((field, index) => {
          const entry = formValues.entries[index];
          const entryErrors = errors.entries?.[index];

          return (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <div className="relative flex-1">
                  <input
                    {...register(`entries.${index}.name`)}
                    placeholder="Название навыка"
                    onChange={(e) => {
                      register(`entries.${index}.name`).onChange(e);
                      setSearchQuery(e.target.value);
                      setAutocompleteIndex(index);
                    }}
                    onFocus={() => {
                      setAutocompleteIndex(index);
                      setSearchQuery(entry?.name || '');
                    }}
                    onBlur={() => {
                      setTimeout(() => setAutocompleteIndex(null), 200);
                    }}
                    className={cn(
                      'h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/50',
                      entryErrors?.name && 'border-red-500'
                    )}
                  />
                  {autocompleteIndex === index && filteredSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onMouseDown={() => selectSuggestion(index, suggestion)}
                          className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="shrink-0 rounded p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Level Stars */}
              <div className="mt-2 flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setValue(`entries.${index}.level`, star, { shouldValidate: true })
                      }
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          'h-4 w-4 transition-colors',
                          star <= (entry?.level || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setValue(`entries.${index}.category`, 'hard', { shouldValidate: true })
                    }
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                      entry?.category === 'hard'
                        ? 'bg-[#0D47A1] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    )}
                  >
                    Технические
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setValue(`entries.${index}.category`, 'soft', { shouldValidate: true })
                    }
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                      entry?.category === 'soft'
                        ? 'bg-[#0D47A1] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    )}
                  >
                    Гибкие
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={() => append(createEmptyEntry())}
        className="w-full gap-2 border-dashed"
      >
        <Plus className="h-4 w-4" />
        Добавить навык
      </Button>
    </div>
  );
}
