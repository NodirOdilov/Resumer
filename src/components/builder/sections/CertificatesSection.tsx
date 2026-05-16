'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';

const certificateEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Название сертификата обязательно'),
  issuer: z.string().default(''),
  issue_date: z.string().default(''),
  expiry_date: z.string().default(''),
  credential_id: z.string().default(''),
  credential_url: z.string().default(''),
});

const certificatesSchema = z.object({
  entries: z.array(certificateEntrySchema),
});

type CertificatesFormValues = z.infer<typeof certificatesSchema>;

function createEmptyEntry(): CertificatesFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
  };
}

export function CertificatesSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const savedCerts = (content.certificates as CertificatesFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useForm<CertificatesFormValues>({
    resolver: zodResolver(certificatesSchema),
    defaultValues: {
      entries: savedCerts.length > 0 ? savedCerts : [createEmptyEntry()],
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
    (entries: CertificatesFormValues['entries']) => {
      updateContent('certificates', entries);
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
        <h3 className="text-lg font-semibold text-gray-900">Сертификаты</h3>
        <p className="mt-1 text-sm text-gray-500">
          Добавьте профессиональные сертификаты и лицензии.
        </p>
      </div>

      <ExpertTip tip="Указывайте сертификаты, релевантные вакансии. Если срок действия сертификата истёк, упоминайте его только если он всё ещё признан в вашей отрасли." />

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
                  Сертификат #{index + 1}
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
                  label="Название сертификата *"
                  placeholder="AWS Solutions Architect"
                  error={entryErrors?.name?.message}
                  {...register(`entries.${index}.name`)}
                />
                <Input
                  label="Выдан"
                  placeholder="Amazon Web Services"
                  {...register(`entries.${index}.issuer`)}
                />
                <Input
                  label="Дата выдачи"
                  type="month"
                  {...register(`entries.${index}.issue_date`)}
                />
                <Input
                  label="Срок действия (необязательно)"
                  type="month"
                  {...register(`entries.${index}.expiry_date`)}
                />
                <Input
                  label="ID сертификата"
                  placeholder="ABC123XYZ"
                  {...register(`entries.${index}.credential_id`)}
                />
                <Input
                  label="Ссылка на сертификат"
                  type="url"
                  placeholder="https://verify.example.com/cert/123"
                  {...register(`entries.${index}.credential_url`)}
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
        Добавить сертификат
      </Button>
    </div>
  );
}
