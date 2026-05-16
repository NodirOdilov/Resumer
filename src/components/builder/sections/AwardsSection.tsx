'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';

const awardEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Название награды обязательно'),
  issuer: z.string().default(''),
  date: z.string().default(''),
  description: z.string().default(''),
});

const awardsSchema = z.object({
  entries: z.array(awardEntrySchema),
});

type AwardsFormValues = z.infer<typeof awardsSchema>;

function createEmptyEntry(): AwardsFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    title: '',
    issuer: '',
    date: '',
    description: '',
  };
}

export function AwardsSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const savedAwards = (content.awards as AwardsFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useForm<AwardsFormValues>({
    resolver: zodResolver(awardsSchema),
    defaultValues: {
      entries: savedAwards.length > 0 ? savedAwards : [createEmptyEntry()],
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
    (entries: AwardsFormValues['entries']) => {
      updateContent('awards', entries);
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Награды и достижения</h3>
        <p className="mt-1 text-sm text-gray-500">
          Расскажите о наградах, отличиях и признании, которые вы получили.
        </p>
      </div>

      <ExpertTip tip="Указывайте награды, релевантные целевой должности. Поясните значимость награды." />

      <div className="space-y-4">
        {fields.map((field, index) => {
          const entryErrors = errors.entries?.[index];

          return (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Награда #{index + 1}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Название награды *"
                  placeholder="Сотрудник года"
                  error={entryErrors?.title?.message}
                  {...register(`entries.${index}.title`)}
                />
                <Input
                  label="Выдан"
                  placeholder="Название компании"
                  {...register(`entries.${index}.issuer`)}
                />
                <Input
                  label="Дата"
                  type="month"
                  {...register(`entries.${index}.date`)}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Описание"
                    placeholder="Краткое описание награды и её значимости..."
                    rows={2}
                    {...register(`entries.${index}.description`)}
                  />
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
        Добавить награду
      </Button>
    </div>
  );
}
