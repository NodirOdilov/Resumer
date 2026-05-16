'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';

// ── Recipient Section ────────────────────────────────────────────────────────

const recipientSchema = z.object({
  company_name: z.string().min(1, 'Название компании обязательно'),
  hiring_manager_name: z.string().default(''),
  hiring_manager_title: z.string().default(''),
  company_address: z.string().default(''),
  company_city: z.string().default(''),
  company_state: z.string().default(''),
  company_zip: z.string().default(''),
});

type RecipientFormValues = z.infer<typeof recipientSchema>;

export function RecipientSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const saved = (content.recipient as RecipientFormValues) || {};

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      company_name: saved.company_name || '',
      hiring_manager_name: saved.hiring_manager_name || '',
      hiring_manager_title: saved.hiring_manager_title || '',
      company_address: saved.company_address || '',
      company_city: saved.company_city || '',
      company_state: saved.company_state || '',
      company_zip: saved.company_zip || '',
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues));

  const syncToStore = useCallback(
    (data: RecipientFormValues) => {
      updateContent('recipient', data);
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
        <h3 className="text-lg font-semibold text-gray-900">Получатель</h3>
        <p className="mt-1 text-sm text-gray-500">
          Укажите данные человека и компании, которым вы пишете.
        </p>
      </div>

      <ExpertTip tip="Обращение к конкретному человеку в сопроводительном письме показывает вашу инициативность. Проверьте LinkedIn или сайт компании, чтобы найти имя HR-менеджера." />

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Название компании *"
            placeholder="ООО Акме"
            error={errors.company_name?.message}
            {...register('company_name')}
          />
          <Input
            label="Имя HR-менеджера"
            placeholder="Иванова Анна"
            {...register('hiring_manager_name')}
          />
          <Input
            label="Должность HR-менеджера"
            placeholder="Директор по разработке"
            {...register('hiring_manager_title')}
          />
          <Input
            label="Адрес компании"
            placeholder="ул. Ленина, 123, оф. 400"
            {...register('company_address')}
          />
          <Input
            label="Город"
            placeholder="Москва"
            {...register('company_city')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Регион"
              placeholder="Московская обл."
              {...register('company_state')}
            />
            <Input
              label="Индекс"
              placeholder="101000"
              {...register('company_zip')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Greeting Section ─────────────────────────────────────────────────────────

const greetingSchema = z.object({
  salutation: z.string().default('Уважаемый(ая)'),
  recipient_name: z.string().default(''),
  custom_greeting: z.string().default(''),
});

type GreetingFormValues = z.infer<typeof greetingSchema>;

const SALUTATION_OPTIONS = [
  'Уважаемый(ая)',
  'Здравствуйте',
  'Привет',
  'Тому, кого это касается',
  'Уважаемый HR-менеджер',
  'Уважаемая команда подбора',
  'Свой вариант',
];

export function GreetingSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const saved = (content.greeting as GreetingFormValues) || {};

  const { register, watch, setValue } = useForm<GreetingFormValues>({
    resolver: zodResolver(greetingSchema),
    defaultValues: {
      salutation: saved.salutation || 'Уважаемый(ая)',
      recipient_name: saved.recipient_name || '',
      custom_greeting: saved.custom_greeting || '',
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues));

  const syncToStore = useCallback(
    (data: GreetingFormValues) => {
      updateContent('greeting', data);
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

  const isCustom = formValues.salutation === 'Свой вариант';
  const isGeneric = ['Тому, кого это касается', 'Уважаемый HR-менеджер', 'Уважаемая команда подбора'].includes(
    formValues.salutation
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Приветствие</h3>
        <p className="mt-1 text-sm text-gray-500">
          Выберите, как обратиться к получателю.
        </p>
      </div>

      <ExpertTip tip="Использование имени HR-менеджера создаёт более личный контакт. «Уважаемый(ая) [Имя]» остаётся самым профессиональным обращением в сопроводительном письме." />

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Обращение
          </label>
          <select
            value={formValues.salutation}
            onChange={(e) =>
              setValue('salutation', e.target.value, { shouldValidate: true })
            }
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0D47A1] focus:outline-none focus:ring-1 focus:ring-[#0D47A1]"
          >
            {SALUTATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {!isGeneric && !isCustom && (
          <Input
            label="Имя получателя"
            placeholder="Иванова А."
            {...register('recipient_name')}
          />
        )}

        {isCustom && (
          <Input
            label="Своё приветствие"
            placeholder="Уважаемые члены отборочной комиссии"
            {...register('custom_greeting')}
          />
        )}

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">Предпросмотр:</p>
          <p className="mt-1 text-base text-gray-900">
            {isCustom
              ? formValues.custom_greeting || 'Уважаемые члены отборочной комиссии,'
              : isGeneric
                ? `${formValues.salutation},`
                : `${formValues.salutation} ${formValues.recipient_name || '[Имя]'},`}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Opening Section ──────────────────────────────────────────────────────────

const openingSchema = z.object({
  paragraph: z.string().min(1, 'Вводный абзац обязателен'),
});

type OpeningFormValues = z.infer<typeof openingSchema>;

const OPENING_TEMPLATES = [
  'Пишу, чтобы выразить большой интерес к должности [Должность] в компании [Компания]. Имея [X лет] опыта в [сфере], я уверен(а) в своей способности внести значимый вклад в вашу команду.',
  'Я с энтузиазмом узнал(а) о вакансии [Должность] в [Компания] на [источник]. Как [ваша должность] с увлечённостью [отрасль/сфера], считаю, что мой опыт идеально соответствует вашим потребностям.',
  'Следя за инновационной работой [Компания] в области [сфера], я рад(а) подать заявку на должность [Должность]. Мой опыт в [релевантная область] позволяет мне приносить пользу с первого дня.',
];

export function OpeningSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const saved = (content.opening as OpeningFormValues) || {};

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OpeningFormValues>({
    resolver: zodResolver(openingSchema),
    defaultValues: {
      paragraph: saved.paragraph || '',
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues));

  const syncToStore = useCallback(
    (data: OpeningFormValues) => {
      updateContent('opening', data);
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
        <h3 className="text-lg font-semibold text-gray-900">Вводный абзац</h3>
        <p className="mt-1 text-sm text-gray-500">
          Привлеките внимание читателя убедительным вступлением, в котором указана
          должность и ваш энтузиазм.
        </p>
      </div>

      <ExpertTip tip="Ваше вступление должно сразу привлечь внимание. Укажите конкретную должность, как вы о ней узнали, и одну убедительную причину, по которой вы подходите." />

      <Textarea
        label="Вводный абзац *"
        placeholder="Пишу, чтобы выразить большой интерес к..."
        rows={5}
        error={errors.paragraph?.message}
        {...register('paragraph')}
      />

      <div>
        <p className="mb-2 text-xs font-medium text-gray-500">
          Нужно вдохновение? Нажмите на шаблон, чтобы использовать его как основу:
        </p>
        <div className="space-y-2">
          {OPENING_TEMPLATES.map((template, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                setValue('paragraph', template, { shouldValidate: true })
              }
              className="w-full rounded-lg border border-gray-100 px-4 py-3 text-left text-xs text-gray-600 transition-colors hover:border-[#0D47A1]/20 hover:bg-[#0D47A1]/5"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Body Section ─────────────────────────────────────────────────────────────

const bodySchema = z.object({
  paragraph_1: z.string().min(1, 'Хотя бы один основной абзац обязателен'),
  paragraph_2: z.string().default(''),
  paragraph_3: z.string().default(''),
});

type BodyFormValues = z.infer<typeof bodySchema>;

export function BodySection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const saved = (content.body as BodyFormValues) || {};

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<BodyFormValues>({
    resolver: zodResolver(bodySchema),
    defaultValues: {
      paragraph_1: saved.paragraph_1 || '',
      paragraph_2: saved.paragraph_2 || '',
      paragraph_3: saved.paragraph_3 || '',
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues));

  const syncToStore = useCallback(
    (data: BodyFormValues) => {
      updateContent('body', data);
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
        <h3 className="text-lg font-semibold text-gray-900">Основные абзацы</h3>
        <p className="mt-1 text-sm text-gray-500">
          Раскройте свою квалификацию, опыт и причины, почему вы идеальный
          кандидат. Используйте 2–3 сфокусированных абзаца.
        </p>
      </div>

      <ExpertTip tip="Каждый основной абзац должен фокусироваться на одной ключевой теме: релевантный опыт, конкретные достижения или соответствие культуре компании. По возможности используйте конкретные примеры и метрики." />

      <div className="space-y-4">
        <Textarea
          label="Первый основной абзац *"
          placeholder="На моей текущей должности в [Компания] я [ключевое достижение]. Этот опыт дал мне [релевантные навыки], которые напрямую соответствуют требованиям этой позиции..."
          rows={5}
          error={errors.paragraph_1?.message}
          {...register('paragraph_1')}
        />

        <Textarea
          label="Второй основной абзац"
          placeholder="Помимо технических знаний, я обладаю [гибкими навыками/качествами]. Например, [конкретный пример, демонстрирующий это качество]..."
          rows={5}
          {...register('paragraph_2')}
        />

        <Textarea
          label="Третий основной абзац (необязательно)"
          placeholder="Меня особенно привлекает [Компания], потому что [причина]. Ваша приверженность [ценности/инициативе компании] перекликается с моей профессиональной философией..."
          rows={5}
          {...register('paragraph_3')}
        />
      </div>
    </div>
  );
}

// ── Closing Section ──────────────────────────────────────────────────────────

const closingSchema = z.object({
  paragraph: z.string().min(1, 'Заключительный абзац обязателен'),
  closing_phrase: z.string().default('С уважением'),
  signature_name: z.string().min(1, 'Ваше имя обязательно'),
});

type ClosingFormValues = z.infer<typeof closingSchema>;

const CLOSING_PHRASES = [
  'С уважением',
  'С наилучшими пожеланиями',
  'С наилучшими пожеланиями (kind regards)',
  'С почтением',
  'С тёплыми пожеланиями',
  'Спасибо',
  'С признательностью',
];

const CLOSING_TEMPLATES = [
  'Я рад(а) возможности применить свои навыки и страсть к делу в [Компания]. Буду рад(а) обсудить, как мой опыт может быть полезен вашей команде. Благодарю за рассмотрение моей кандидатуры.',
  'С нетерпением жду возможности внести вклад в дальнейший успех [Компания]. Готов(а) к собеседованию в удобное для вас время, со мной можно связаться по [телефон/email]. Спасибо за ваше время и внимание.',
];

export function ClosingSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);

  const saved = (content.closing as ClosingFormValues) || {};

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClosingFormValues>({
    resolver: zodResolver(closingSchema),
    defaultValues: {
      paragraph: saved.paragraph || '',
      closing_phrase: saved.closing_phrase || 'С уважением',
      signature_name: saved.signature_name || '',
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const prevRef = useRef(JSON.stringify(formValues));

  const syncToStore = useCallback(
    (data: ClosingFormValues) => {
      updateContent('closing', data);
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
        <h3 className="text-lg font-semibold text-gray-900">
          Заключение и подпись
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Завершите письмо призывом к действию и вашей подписью.
        </p>
      </div>

      <ExpertTip tip="Завершайте письмо чётким призывом к действию. Выразите энтузиазм, упомяните следующие шаги (например, собеседование) и поблагодарите читателя за уделённое время." />

      <Textarea
        label="Заключительный абзац *"
        placeholder="Я рад(а) возможности внести вклад в вашу команду..."
        rows={4}
        error={errors.paragraph?.message}
        {...register('paragraph')}
      />

      <div>
        <p className="mb-2 text-xs font-medium text-gray-500">
          Шаблоны заключения:
        </p>
        <div className="space-y-2">
          {CLOSING_TEMPLATES.map((template, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                setValue('paragraph', template, { shouldValidate: true })
              }
              className="w-full rounded-lg border border-gray-100 px-4 py-3 text-left text-xs text-gray-600 transition-colors hover:border-[#0D47A1]/20 hover:bg-[#0D47A1]/5"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Заключительная фраза
          </label>
          <select
            value={formValues.closing_phrase}
            onChange={(e) =>
              setValue('closing_phrase', e.target.value, {
                shouldValidate: true,
              })
            }
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0D47A1] focus:outline-none focus:ring-1 focus:ring-[#0D47A1]"
          >
            {CLOSING_PHRASES.map((phrase) => (
              <option key={phrase} value={phrase}>
                {phrase}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Ваше полное имя *"
          placeholder="Иванов Иван"
          error={errors.signature_name?.message}
          {...register('signature_name')}
        />
      </div>

      {/* Signature Preview */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-500">Предпросмотр подписи:</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-700">
            {formValues.closing_phrase || 'С уважением'},
          </p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            {formValues.signature_name || '[Ваше имя]'}
          </p>
        </div>
      </div>
    </div>
  );
}
