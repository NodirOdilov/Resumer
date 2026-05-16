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

const volunteerEntrySchema = z.object({
  id: z.string(),
  organization: z.string().min(1, 'Организация обязательна'),
  role: z.string().default(''),
  start_date: z.string().default(''),
  end_date: z.string().default(''),
  is_current: z.boolean().default(false),
  description: z.string().default(''),
});

const volunteerSchema = z.object({
  entries: z.array(volunteerEntrySchema),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

function createEmptyEntry(): VolunteerFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    organization: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  };
}

export function VolunteerSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const savedVolunteer = (content.volunteer as VolunteerFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      entries: savedVolunteer.length > 0 ? savedVolunteer : [createEmptyEntry()],
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
    (entries: VolunteerFormValues['entries']) => {
      updateContent('volunteer', entries);
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
        <h3 className="text-lg font-semibold text-gray-900">Волонтёрский опыт</h3>
        <p className="mt-1 text-sm text-gray-500">
          Покажите ваше участие в общественной жизни и волонтёрскую работу.
        </p>
      </div>

      <ExpertTip tip="Волонтёрский опыт может быть таким же значимым, как и опыт работы. Подчеркните лидерские роли и измеримые результаты." />

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
                  Волонтёрство #{index + 1}
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
                    label="Организация *"
                    placeholder="Красный Крест"
                    error={entryErrors?.organization?.message}
                    {...register(`entries.${index}.organization`)}
                  />
                  <Input
                    label="Роль"
                    placeholder="Координатор мероприятий"
                    {...register(`entries.${index}.role`)}
                  />
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

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                    {...register(`entries.${index}.is_current`)}
                  />
                  Сейчас волонтёрю здесь
                </label>

                <Textarea
                  label="Описание"
                  placeholder="Опишите ваши обязанности и достигнутый эффект..."
                  rows={3}
                  {...register(`entries.${index}.description`)}
                />
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
        Добавить волонтёрский опыт
      </Button>
    </div>
  );
}
