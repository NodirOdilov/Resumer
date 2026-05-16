'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';

const projectEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Название проекта обязательно'),
  description: z.string().default(''),
  url: z.string().default(''),
  technologies: z.array(z.string()).default([]),
});

const projectsSchema = z.object({
  entries: z.array(projectEntrySchema),
});

type ProjectsFormValues = z.infer<typeof projectsSchema>;

function createEmptyEntry(): ProjectsFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    url: '',
    technologies: [],
  };
}

export function ProjectsSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [tagInputs, setTagInputs] = useState<Record<number, string>>({});

  const savedProjects = (content.projects as ProjectsFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectsFormValues>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      entries: savedProjects.length > 0 ? savedProjects : [createEmptyEntry()],
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
    (entries: ProjectsFormValues['entries']) => {
      updateContent('projects', entries);
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

  const addTag = (index: number) => {
    const value = (tagInputs[index] || '').trim();
    if (!value) return;
    const current = formValues.entries[index]?.technologies || [];
    if (!current.includes(value)) {
      setValue(`entries.${index}.technologies`, [...current, value], {
        shouldValidate: true,
      });
    }
    setTagInputs((prev) => ({ ...prev, [index]: '' }));
  };

  const removeTag = (index: number, tagIndex: number) => {
    const current = formValues.entries[index]?.technologies || [];
    setValue(
      `entries.${index}.technologies`,
      current.filter((_, i) => i !== tagIndex),
      { shouldValidate: true }
    );
  };

  const handleTagKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(index);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Проекты</h3>
        <p className="mt-1 text-sm text-gray-500">
          Покажите личные или профессиональные проекты, демонстрирующие ваши навыки.
        </p>
      </div>

      <ExpertTip tip="Добавляйте ссылки на работающие проекты или репозитории на GitHub. Подчеркните использованные технологии и ваш конкретный вклад." />

      <div className="space-y-4">
        {fields.map((field, index) => {
          const entry = formValues.entries[index];
          const entryErrors = errors.entries?.[index];

          return (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Проект #{index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Название проекта *"
                    placeholder="Платформа электронной коммерции"
                    error={entryErrors?.name?.message}
                    {...register(`entries.${index}.name`)}
                  />
                  <Input
                    label="Ссылка"
                    type="url"
                    placeholder="https://github.com/user/project"
                    {...register(`entries.${index}.url`)}
                  />
                </div>

                <Textarea
                  label="Описание"
                  placeholder="Краткое описание проекта, вашей роли и ключевых результатов..."
                  rows={3}
                  {...register(`entries.${index}.description`)}
                />

                {/* Technologies Tag Input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Технологии
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-[#0D47A1] focus-within:ring-2 focus-within:ring-[#0D47A1]/50">
                    {(entry?.technologies || []).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center gap-1 rounded-full bg-[#0D47A1]/10 px-2.5 py-0.5 text-xs font-medium text-[#0D47A1]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index, tagIndex)}
                          className="rounded-full p-0.5 hover:bg-[#0D47A1]/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={
                        (entry?.technologies || []).length === 0
                          ? 'Введите и нажмите Enter...'
                          : 'Добавить ещё...'
                      }
                      value={tagInputs[index] || ''}
                      onChange={(e) =>
                        setTagInputs((prev) => ({ ...prev, [index]: e.target.value }))
                      }
                      onKeyDown={handleTagKeyDown(index)}
                      onBlur={() => addTag(index)}
                      className="min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                    />
                  </div>
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
        Добавить проект
      </Button>
    </div>
  );
}
