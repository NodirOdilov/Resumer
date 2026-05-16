'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';
import { SortableList, DragHandle, type DragHandleProps } from '@/components/builder/SortableList';

const DEGREE_OPTIONS = [
  { value: 'high_school', label: 'Аттестат о среднем образовании' },
  { value: 'associate', label: 'Среднее специальное' },
  { value: 'bachelor', label: 'Бакалавр' },
  { value: 'master', label: 'Магистр' },
  { value: 'phd', label: 'Кандидат/Доктор наук (Ph.D.)' },
  { value: 'diploma', label: 'Диплом' },
];

const educationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Учебное заведение обязательно'),
  degree: z.string().min(1, 'Степень обязательна'),
  field_of_study: z.string().default(''),
  start_date: z.string().default(''),
  end_date: z.string().default(''),
  gpa: z.string().default(''),
  description: z.string().default(''),
});

const educationSchema = z.object({
  entries: z.array(educationEntrySchema),
});

type EducationFormValues = z.infer<typeof educationSchema>;

function createEmptyEntry(): EducationFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    gpa: '',
    description: '',
  };
}

export function EducationSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const savedEducation = (content.education as EducationFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      entries: savedEducation.length > 0 ? savedEducation : [createEmptyEntry()],
    },
    mode: 'onChange',
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'entries',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues.entries));

  const syncToStore = useCallback(
    (entries: EducationFormValues['entries']) => {
      updateContent('education', entries);
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

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReorder = useCallback(
    (activeIndex: number, overIndex: number) => {
      move(activeIndex, overIndex);
    },
    [move]
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Образование</h3>
        <p className="mt-1 text-sm text-gray-500">
          Добавьте сведения об образовании, начиная с самого последнего.
        </p>
      </div>

      <ExpertTip tip="Укажите релевантные курсы, отличия или академические достижения, связанные с должностью, на которую вы претендуете." />

      <SortableList
        items={fields}
        onReorder={handleReorder}
        renderItem={(field, index, dragHandleProps: DragHandleProps) => {
          const isCollapsed = collapsedIds.has(field.id);
          const entry = formValues.entries[index];
          const entryErrors = errors.entries?.[index];

          return (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <DragHandle {...dragHandleProps} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {entry?.institution || 'Без названия'}
                  </p>
                  {entry?.degree && (
                    <p className="truncate text-xs text-gray-500">
                      {DEGREE_OPTIONS.find((d) => d.value === entry.degree)?.label || entry.degree}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleCollapse(field.id)}
                  className="shrink-0 rounded p-1 text-gray-400 hover:text-gray-600"
                >
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="shrink-0 rounded p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {!isCollapsed && (
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Учебное заведение *"
                      placeholder="Московский государственный университет"
                      error={entryErrors?.institution?.message}
                      {...register(`entries.${index}.institution`)}
                    />
                    <div className="w-full space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Степень *
                      </label>
                      <select
                        {...register(`entries.${index}.degree`)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D47A1]/50 focus-visible:border-[#0D47A1]"
                      >
                        <option value="">Выберите степень</option>
                        {DEGREE_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      {entryErrors?.degree?.message && (
                        <p className="text-sm text-red-500">{entryErrors.degree.message}</p>
                      )}
                    </div>
                    <Input
                      label="Специальность"
                      placeholder="Информатика и вычислительная техника"
                      {...register(`entries.${index}.field_of_study`)}
                    />
                    <Input
                      label="Средний балл"
                      placeholder="4.8 / 5.0"
                      {...register(`entries.${index}.gpa`)}
                    />
                    <Input
                      label="Дата начала"
                      type="month"
                      {...register(`entries.${index}.start_date`)}
                    />
                    <Input
                      label="Дата окончания"
                      type="month"
                      {...register(`entries.${index}.end_date`)}
                    />
                  </div>

                  <Textarea
                    label="Описание"
                    placeholder="Релевантные курсы, отличия, активности..."
                    rows={3}
                    {...register(`entries.${index}.description`)}
                  />
                </div>
              )}
            </div>
          );
        }}
      />

      <Button
        variant="outline"
        onClick={() => append(createEmptyEntry())}
        className="w-full gap-2 border-dashed"
      >
        <Plus className="h-4 w-4" />
        Добавить ещё образование
      </Button>
    </div>
  );
}
