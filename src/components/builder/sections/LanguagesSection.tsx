'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';
import { cn } from '@/lib/utils';

const LANGUAGE_SUGGESTIONS = [
  'Английский', 'Испанский', 'Французский', 'Немецкий', 'Итальянский', 'Португальский', 'Русский',
  'Китайский (Мандарин)', 'Китайский (Кантонский)', 'Японский', 'Корейский', 'Арабский',
  'Хинди', 'Бенгальский', 'Урду', 'Турецкий', 'Вьетнамский', 'Тайский', 'Индонезийский',
  'Малайский', 'Тагальский', 'Суахили', 'Нидерландский', 'Шведский', 'Норвежский', 'Датский',
  'Финский', 'Польский', 'Чешский', 'Словацкий', 'Венгерский', 'Румынский', 'Болгарский',
  'Хорватский', 'Сербский', 'Словенский', 'Литовский', 'Латышский', 'Эстонский',
  'Греческий', 'Иврит', 'Персидский (Фарси)', 'Узбекский', 'Казахский', 'Украинский',
  'Грузинский', 'Армянский', 'Азербайджанский', 'Каталанский', 'Баскский', 'Галисийский',
  'Валлийский', 'Ирландский', 'Шотландский гэльский', 'Исландский', 'Албанский', 'Македонский',
  'Боснийский', 'Черногорский', 'Люксембургский', 'Мальтийский', 'Африкаанс',
  'Амхарский', 'Сомалийский', 'Хауса', 'Йоруба', 'Игбо', 'Зулусский', 'Коса',
  'Пушту', 'Панджаби', 'Тамильский', 'Телугу', 'Каннада', 'Малаялам', 'Маратхи',
  'Гуджарати', 'Сингальский', 'Непальский', 'Бирманский', 'Кхмерский', 'Лаосский',
  'Монгольский', 'Тибетский', 'Маори', 'Самоанский', 'Гавайский', 'Навахо',
  'Чероки', 'Кечуа', 'Гуарани', 'Науатль', 'Эсперанто', 'Латынь',
  'Санскрит', 'Жестовый язык (ASL)', 'Жестовый язык (BSL)',
];

const PROFICIENCY_LEVELS = [
  { value: 'native', label: 'Родной', color: 'bg-green-500' },
  { value: 'fluent', label: 'Свободный', color: 'bg-blue-500' },
  { value: 'advanced', label: 'Продвинутый', color: 'bg-sky-500' },
  { value: 'intermediate', label: 'Средний', color: 'bg-amber-500' },
  { value: 'basic', label: 'Базовый', color: 'bg-orange-500' },
] as const;

const languageEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Язык обязателен'),
  proficiency: z.enum(['native', 'fluent', 'advanced', 'intermediate', 'basic']).default('intermediate'),
});

const languagesSchema = z.object({
  entries: z.array(languageEntrySchema),
});

type LanguagesFormValues = z.infer<typeof languagesSchema>;

function createEmptyEntry(): LanguagesFormValues['entries'][number] {
  return {
    id: crypto.randomUUID(),
    name: '',
    proficiency: 'intermediate',
  };
}

export function LanguagesSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const savedLanguages = (content.languages as LanguagesFormValues['entries']) || [];

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LanguagesFormValues>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      entries: savedLanguages.length > 0 ? savedLanguages : [createEmptyEntry()],
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
    (entries: LanguagesFormValues['entries']) => {
      updateContent('languages', entries);
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
    const existing = new Set(formValues.entries.map((e) => e.name.toLowerCase()));
    return LANGUAGE_SUGGESTIONS.filter(
      (l) => l.toLowerCase().includes(query) && !existing.has(l.toLowerCase())
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
        <h3 className="text-lg font-semibold text-gray-900">Языки</h3>
        <p className="mt-1 text-sm text-gray-500">
          Перечислите языки, которыми вы владеете, и уровень владения.
        </p>
      </div>

      <ExpertTip tip="Будьте честны в оценке владения языком. Работодатели могут проверить ваши языковые навыки во время собеседования." />

      <div className="space-y-3">
        {fields.map((field, index) => {
          const entry = formValues.entries[index];
          const entryErrors = errors.entries?.[index];

          return (
            <div
              key={field.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="relative flex-1">
                <input
                  {...register(`entries.${index}.name`)}
                  placeholder="Язык"
                  onChange={(e) => {
                    register(`entries.${index}.name`).onChange(e);
                    setSearchQuery(e.target.value);
                    setAutocompleteIndex(index);
                  }}
                  onFocus={() => {
                    setAutocompleteIndex(index);
                    setSearchQuery(entry?.name || '');
                  }}
                  onBlur={() => setTimeout(() => setAutocompleteIndex(null), 200)}
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

              <select
                {...register(`entries.${index}.proficiency`)}
                className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm focus:border-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/50"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => remove(index)}
                className="shrink-0 rounded p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
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
        Добавить язык
      </Button>
    </div>
  );
}
