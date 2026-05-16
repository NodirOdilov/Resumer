'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';

const customItemSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  description: z.string().default(''),
});

const customSectionSchema = z.object({
  section_name: z.string().default(''),
  entries: z.array(customItemSchema),
});

type CustomSectionFormValues = z.infer<typeof customSectionSchema>;

interface SavedCustomSection {
  section_name?: string;
  entries?: Array<{ id: string; title: string; description: string }>;
}

function createEmptyEntry(): CustomSectionFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
  };
}

export function CustomSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const savedCustom = (content.custom_sections as SavedCustomSection) || {};

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useForm<CustomSectionFormValues>({
    resolver: zodResolver(customSectionSchema),
    defaultValues: {
      section_name: savedCustom.section_name || '',
      entries:
        savedCustom.entries && savedCustom.entries.length > 0
          ? savedCustom.entries
          : [createEmptyEntry()],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues));

  const syncToStore = useCallback(
    (values: CustomSectionFormValues) => {
      updateContent('custom_sections', values);
    },
    [updateContent]
  );

  useEffect(() => {
    const serialized = JSON.stringify(formValues);
    if (serialized !== prevRef.current) {
      prevRef.current = serialized;
      syncToStore(formValues);
    }
  }, [formValues, syncToStore]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Свой раздел</h3>
        <p className="mt-1 text-sm text-gray-500">
          Создайте свой раздел с собственным заголовком и содержимым.
        </p>
      </div>

      <ExpertTip tip="Используйте собственные разделы для уникального контента — публикаций, выступлений или профессиональных членств, которые не вписываются в стандартные разделы." />

      {/* Section Name */}
      <Input
        label="Название раздела"
        placeholder="напр., Публикации, Выступления, Членства"
        {...register('section_name')}
      />

      {/* Dynamic Items */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Элемент #{index + 1}
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
              <Input
                label="Заголовок"
                placeholder="Заголовок элемента"
                {...register(`entries.${index}.title`)}
              />
              <Textarea
                label="Описание"
                placeholder="Опишите этот элемент..."
                rows={3}
                {...register(`entries.${index}.description`)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => append(createEmptyEntry())}
        className="w-full gap-2 border-dashed"
      >
        <Plus className="h-4 w-4" />
        Добавить элемент
      </Button>
    </div>
  );
}
