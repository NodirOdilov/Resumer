'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';

const interestsSchema = z.object({
  entries: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Название интереса обязательно'),
    })
  ),
});

type InterestsFormValues = z.infer<typeof interestsSchema>;

function createEmptyEntry(): InterestsFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    name: '',
  };
}

export function InterestsSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [inputValue, setInputValue] = useState('');

  const savedHobbies = (content.hobbies as InterestsFormValues['entries']) || [];

  const {
    control,
    watch,
    setValue,
  } = useForm<InterestsFormValues>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      entries: savedHobbies.length > 0 ? savedHobbies : [],
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
    (entries: InterestsFormValues['entries']) => {
      updateContent('hobbies', entries);
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

  const addInterest = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const exists = formValues.entries.some(
      (e) => e.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      append({ id: crypto.randomUUID(), name: trimmed });
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Хобби и интересы</h3>
        <p className="mt-1 text-sm text-gray-500">
          Добавьте личные интересы, которые раскрывают вашу индивидуальность.
        </p>
      </div>

      <ExpertTip tip="Выбирайте хобби, которые отражают положительные качества: командную работу (командные виды спорта), творчество (искусство, музыка) или дисциплину (единоборства, шахматы)." />

      {/* Current Interests */}
      {fields.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <span
              key={field.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm"
            >
              {formValues.entries[index]?.name}
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите интерес и нажмите Enter..."
          className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus:border-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/50"
        />
        <Button
          variant="outline"
          onClick={addInterest}
          disabled={!inputValue.trim()}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          Интересы пока не добавлены. Введите выше и нажмите Enter, чтобы добавить.
        </p>
      )}
    </div>
  );
}
