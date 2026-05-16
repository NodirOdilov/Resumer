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

const experienceEntrySchema = z.object({
  id: z.string(),
  job_title: z.string().min(1, 'Должность обязательна'),
  company: z.string().min(1, 'Компания обязательна'),
  location: z.string().default(''),
  start_date: z.string().default(''),
  end_date: z.string().default(''),
  is_current: z.boolean().default(false),
  description: z.string().default(''),
});

const experienceSchema = z.object({
  entries: z.array(experienceEntrySchema),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

const PRE_WRITTEN_BULLETS: Record<string, string[]> = {
  'Инженер-программист': [
    'Разрабатывал и поддерживал веб-приложения на React, TypeScript и Node.js, обслуживающие более 100 тыс. пользователей',
    'Повысил производительность приложений на 40% за счёт оптимизации кода и стратегий кэширования',
    'Возглавил миграцию с монолитной архитектуры на микросервисы, сократив время развёртывания на 60%',
    'Наставлял 3 младших разработчиков и проводил код-ревью для поддержания высокого качества кода',
  ],
  'Маркетинг-менеджер': [
    'Управлял годовым маркетинговым бюджетом в $500 тыс., увеличив ROI на 25% по сравнению с прошлым годом',
    'Разрабатывал и реализовывал многоканальные маркетинговые кампании, привлёкшие более 10 тыс. квалифицированных лидов',
    'Увеличил вовлечённость в соцсетях на 150% за счёт стратегического создания контента и управления сообществом',
    'Сотрудничал с отделом продаж для согласования сообщений, что сократило цикл продаж на 20%',
  ],
  'Менеджер проектов': [
    'Руководил кросс-функциональной командой из 12 человек, реализовав проект на $2 млн в срок и на 10% ниже бюджета',
    'Внедрил гибкие методологии Agile, повысив скорость работы команды на 35% за 3 месяца',
    'Управлял ожиданиями стейкхолдеров в 5 отделах, поддерживая уровень удовлетворённости 95%',
    'Снизил проектные риски за счёт внедрения комплексной системы управления рисками',
  ],
};

const BULLET_JOB_TITLES = Object.keys(PRE_WRITTEN_BULLETS);

function createEmptyEntry(): ExperienceFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    job_title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  };
}

export function ExperienceSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [bulletMenuIndex, setBulletMenuIndex] = useState<number | null>(null);

  const savedExperience = (content.experience as ExperienceFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      entries: savedExperience.length > 0 ? savedExperience : [createEmptyEntry()],
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
    (entries: ExperienceFormValues['entries']) => {
      updateContent('experience', entries);
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

  const addBulletToDescription = (index: number, bullet: string) => {
    const current = formValues.entries[index]?.description || '';
    const newValue = current ? `${current}\n- ${bullet}` : `- ${bullet}`;
    setValue(`entries.${index}.description`, newValue, { shouldValidate: true });
    setBulletMenuIndex(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Опыт работы</h3>
        <p className="mt-1 text-sm text-gray-500">
          Укажите ваш опыт работы, начиная с самой последней должности.
        </p>
      </div>

      <ExpertTip tip="Сосредоточьтесь на достижениях, а не только на обязанностях. По возможности используйте цифры, чтобы количественно показать ваш вклад." />

      <SortableList
        items={fields}
        onReorder={handleReorder}
        renderItem={(field, index, dragHandleProps: DragHandleProps) => {
          const isCollapsed = collapsedIds.has(field.id);
          const entry = formValues.entries[index];
          const entryErrors = errors.entries?.[index];

          return (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              {/* Entry Header */}
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <DragHandle {...dragHandleProps} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {entry?.job_title || 'Без названия должности'}
                  </p>
                  {entry?.company && (
                    <p className="truncate text-xs text-gray-500">{entry.company}</p>
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

              {/* Entry Form */}
              {!isCollapsed && (
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Должность *"
                      placeholder="Инженер-программист"
                      error={entryErrors?.job_title?.message}
                      {...register(`entries.${index}.job_title`)}
                    />
                    <Input
                      label="Компания *"
                      placeholder="Google"
                      error={entryErrors?.company?.message}
                      {...register(`entries.${index}.company`)}
                    />
                    <Input
                      label="Местоположение"
                      placeholder="Москва, Россия"
                      {...register(`entries.${index}.location`)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Дата начала"
                        type="month"
                        {...register(`entries.${index}.start_date`)}
                      />
                      <div>
                        <Input
                          label="Дата окончания"
                          type="month"
                          disabled={entry?.is_current}
                          {...register(`entries.${index}.end_date`)}
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                      {...register(`entries.${index}.is_current`)}
                    />
                    Работаю здесь сейчас
                  </label>

                  <div className="relative">
                    <Textarea
                      label="Описание и достижения"
                      placeholder="- Возглавил команду из 5 инженеров, сдав проект раньше срока&#10;- Повысил производительность системы на 40%"
                      rows={5}
                      {...register(`entries.${index}.description`)}
                    />
                    <div className="mt-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setBulletMenuIndex(bulletMenuIndex === index ? null : index)
                        }
                        className="text-xs text-[#0D47A1] hover:underline"
                      >
                        + Добавить готовые пункты
                      </button>

                      {bulletMenuIndex === index && (
                        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 shadow-md">
                          <p className="mb-2 text-xs font-medium text-gray-500">
                            Выберите должность для подсказок:
                          </p>
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {BULLET_JOB_TITLES.map((title) => (
                              <button
                                key={title}
                                type="button"
                                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-[#0D47A1]/10 hover:text-[#0D47A1]"
                                onClick={() => {
                                  /* Just show the bullets below */
                                }}
                              >
                                {title}
                              </button>
                            ))}
                          </div>
                          <div className="space-y-1.5">
                            {PRE_WRITTEN_BULLETS['Инженер-программист'].map(
                              (bullet, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() =>
                                    addBulletToDescription(index, bullet)
                                  }
                                  className="w-full rounded border border-gray-100 px-3 py-2 text-left text-xs text-gray-600 hover:border-[#0D47A1]/20 hover:bg-[#0D47A1]/5"
                                >
                                  - {bullet}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
        Добавить ещё опыт
      </Button>
    </div>
  );
}
