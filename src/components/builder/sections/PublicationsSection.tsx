'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';
import { cn } from '@/lib/utils';

const publicationEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Название обязательно'),
  journal_or_conference: z.string().min(1, 'Журнал или конференция обязательны'),
  date: z.string().default(''),
  doi: z.string().default(''),
  co_authors: z.array(z.string()).default([]),
  description: z.string().default(''),
});

const publicationsSchema = z.object({
  entries: z.array(publicationEntrySchema),
});

type PublicationsFormValues = z.infer<typeof publicationsSchema>;

function createEmptyEntry(): PublicationsFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    title: '',
    journal_or_conference: '',
    date: '',
    doi: '',
    co_authors: [],
    description: '',
  };
}

export function PublicationsSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [coAuthorInputs, setCoAuthorInputs] = useState<Record<number, string>>({});

  const savedPublications =
    (content.publications as PublicationsFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PublicationsFormValues>({
    resolver: zodResolver(publicationsSchema),
    defaultValues: {
      entries:
        savedPublications.length > 0 ? savedPublications : [createEmptyEntry()],
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
    (entries: PublicationsFormValues['entries']) => {
      updateContent('publications', entries);
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

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData('text/plain'));
    if (sourceIndex !== targetIndex) {
      move(sourceIndex, targetIndex);
    }
  };

  const addCoAuthor = (index: number) => {
    const name = (coAuthorInputs[index] || '').trim();
    if (!name) return;
    const current = formValues.entries[index]?.co_authors || [];
    setValue(`entries.${index}.co_authors`, [...current, name], {
      shouldValidate: true,
    });
    setCoAuthorInputs((prev) => ({ ...prev, [index]: '' }));
  };

  const removeCoAuthor = (entryIndex: number, authorIndex: number) => {
    const current = formValues.entries[entryIndex]?.co_authors || [];
    setValue(
      `entries.${entryIndex}.co_authors`,
      current.filter((_, i) => i !== authorIndex),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Публикации</h3>
        <p className="mt-1 text-sm text-gray-500">
          Перечислите ваши академические публикации, статьи и работы.
        </p>
      </div>

      <ExpertTip tip="По возможности указывайте ссылки DOI. Перечисляйте публикации в обратном хронологическом порядке и используйте единый формат цитирования." />

      <div className="space-y-4">
        {fields.map((field, index) => {
          const isCollapsed = collapsedIds.has(field.id);
          const entry = formValues.entries[index];
          const entryErrors = errors.entries?.[index];

          return (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={handleDrop(index)}
            >
              {/* Entry Header */}
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-gray-300" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {entry?.title || 'Без названия'}
                  </p>
                  {entry?.journal_or_conference && (
                    <p className="truncate text-xs text-gray-500">
                      {entry.journal_or_conference}
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

              {/* Entry Form */}
              {!isCollapsed && (
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Название публикации *"
                      placeholder="Новый подход к машинному обучению"
                      error={entryErrors?.title?.message}
                      {...register(`entries.${index}.title`)}
                    />
                    <Input
                      label="Журнал / Конференция *"
                      placeholder="Nature, IEEE, ACM SIGCHI"
                      error={entryErrors?.journal_or_conference?.message}
                      {...register(`entries.${index}.journal_or_conference`)}
                    />
                    <Input
                      label="Дата публикации"
                      type="month"
                      {...register(`entries.${index}.date`)}
                    />
                    <Input
                      label="DOI"
                      placeholder="10.1000/xyz123"
                      {...register(`entries.${index}.doi`)}
                    />
                  </div>

                  {/* Co-Authors */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Соавторы
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(entry?.co_authors || []).map((author, authorIdx) => (
                        <span
                          key={authorIdx}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {author}
                          <button
                            type="button"
                            onClick={() => removeCoAuthor(index, authorIdx)}
                            className="ml-0.5 rounded-full p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={coAuthorInputs[index] || ''}
                        onChange={(e) =>
                          setCoAuthorInputs((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCoAuthor(index);
                          }
                        }}
                        placeholder="Добавить имя соавтора"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-[#0D47A1] focus:outline-none focus:ring-1 focus:ring-[#0D47A1]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCoAuthor(index)}
                      >
                        Добавить
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    label="Описание / Аннотация"
                    placeholder="Краткое описание или аннотация публикации..."
                    rows={3}
                    {...register(`entries.${index}.description`)}
                  />
                </div>
              )}
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
        Добавить публикацию
      </Button>
    </div>
  );
}
