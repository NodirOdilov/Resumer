'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, X, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useBuilderStore } from '@/stores/builderStore';
import { ExpertTip } from '@/components/builder/ExpertTip';
import { PhotoCropper } from '@/components/builder/PhotoCropper';
import type { ContactInfo } from '@/types';

const COUNTRIES = [
  'Россия', 'Беларусь', 'Казахстан', 'Украина', 'Узбекистан', 'Кыргызстан',
  'Грузия', 'Армения', 'Азербайджан', 'Таджикистан',
  'США', 'Великобритания', 'Канада', 'Австралия', 'Германия', 'Франция',
  'Испания', 'Италия', 'Нидерланды', 'Швеция', 'Норвегия', 'Дания', 'Финляндия',
  'Швейцария', 'Австрия', 'Бельгия', 'Ирландия', 'Португалия', 'Польша',
  'Чехия', 'Япония', 'Южная Корея', 'Китай', 'Индия', 'Бразилия',
  'Мексика', 'Аргентина', 'Турция', 'Сингапур', 'Новая Зеландия',
  'ЮАР', 'Нигерия', 'Египет', 'ОАЭ', 'Саудовская Аравия', 'Израиль',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const contactSchema = z.object({
  first_name: z.string().min(1, 'Введите имя'),
  last_name: z.string().min(1, 'Введите фамилию'),
  email: z.string().min(1, 'Введите email').email('Введите корректный email'),
  phone: z.string().optional().default(''),
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  zip_code: z.string().optional().default(''),
  country: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  website: z.string().optional().default(''),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const content = useBuilderStore((s) => s.content);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savedContact = (content.contact || {}) as Partial<ContactInfo>;

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: savedContact.first_name || '',
      last_name: savedContact.last_name || '',
      email: savedContact.email || '',
      phone: savedContact.phone || '',
      address: savedContact.address || '',
      city: savedContact.city || '',
      state: savedContact.state || '',
      zip_code: savedContact.zip_code || '',
      country: savedContact.country || '',
      linkedin: savedContact.linkedin || '',
      website: savedContact.website || '',
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const prevValuesRef = useRef(JSON.stringify(formValues));

  const syncToStore = useCallback(
    (values: ContactFormValues) => {
      updateContent('contact', values);
    },
    [updateContent]
  );

  useEffect(() => {
    const serialized = JSON.stringify(formValues);
    if (serialized !== prevValuesRef.current) {
      prevValuesRef.current = serialized;
      syncToStore(formValues);
    }
  }, [formValues, syncToStore]);

  const processFile = useCallback((file: File) => {
    setPhotoError(null);

    if (!file.type.startsWith('image/')) {
      setPhotoError('Выберите файл изображения (JPG, PNG и т.п.).');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setPhotoError('Размер изображения должен быть меньше 5 МБ.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      processFile(file);
      // Reset the input so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFile]
  );

  const handleCropComplete = useCallback(
    (croppedBlob: Blob) => {
      const previewUrl = URL.createObjectURL(croppedBlob);

      // Revoke previous preview URL to avoid memory leak
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }

      setPhotoPreview(previewUrl);
      setRawImageSrc(null);

      // Store the photo as a data URL in the builder store
      const reader = new FileReader();
      reader.onloadend = () => {
        updateContent('photo', reader.result as string);
      };
      reader.readAsDataURL(croppedBlob);
    },
    [photoPreview, updateContent]
  );

  const removePhoto = useCallback(() => {
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setRawImageSrc(null);
    updateContent('photo', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [photoPreview, updateContent]);

  // Drag and drop handlers for the upload area
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  // Load saved photo on mount
  useEffect(() => {
    const savedPhoto = content.photo as string | null | undefined;
    if (savedPhoto && !photoPreview) {
      setPhotoPreview(savedPhoto);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Контактная информация</h3>
        <p className="mt-1 text-sm text-gray-500">
          Дайте работодателям знать, как с вами связаться.
        </p>
      </div>

      <ExpertTip tip="Поддерживайте контакты в актуальном состоянии. Используйте профессиональный email и убедитесь, что ваш профиль LinkedIn обновлён." />

      {/* Photo Upload with Crop */}
      <div className="flex items-start gap-4">
        <div className="relative">
          {photoPreview ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                aria-label="Remove photo"
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              {/* Click to re-crop */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change photo"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-opacity hover:bg-black/30 hover:opacity-100"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed bg-gray-50 text-gray-400 transition-colors ${
                isDragOver
                  ? 'border-[#0D47A1] bg-[#0D47A1]/5 text-[#0D47A1]'
                  : 'border-gray-300 hover:border-[#0D47A1] hover:text-[#0D47A1]'
              }`}
            >
              {isDragOver ? (
                <Upload className="h-6 w-6" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            aria-label="Upload profile photo"
            onChange={handlePhotoUpload}
          />
        </div>
        <div className="text-sm text-gray-500">
          <p className="font-medium text-gray-700">Добавить фото</p>
          <p>Нажмите или перетащите изображение. JPG, PNG или WebP, до 5 МБ.</p>
          <p className="mt-0.5 text-xs">После выбора можно обрезать и изменить размер.</p>
          {photoError && (
            <p className="mt-1 text-sm text-red-500">{photoError}</p>
          )}
        </div>
      </div>

      {/* Photo Cropper Modal */}
      {rawImageSrc && (
        <PhotoCropper
          open={cropperOpen}
          onOpenChange={(open) => {
            setCropperOpen(open);
            if (!open) {
              setRawImageSrc(null);
            }
          }}
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Имя *"
          placeholder="Иван"
          error={errors.first_name?.message}
          {...register('first_name')}
        />
        <Input
          label="Фамилия *"
          placeholder="Иванов"
          error={errors.last_name?.message}
          {...register('last_name')}
        />
        <Input
          label="Email *"
          type="email"
          placeholder="ivan.ivanov@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Телефон"
          type="tel"
          placeholder="+7 (999) 123-45-67"
          {...register('phone')}
        />
        <div className="sm:col-span-2">
          <Input
            label="Адрес"
            placeholder="ул. Тверская, 12"
            {...register('address')}
          />
        </div>
        <Input
          label="Город"
          placeholder="Москва"
          {...register('city')}
        />
        <Input
          label="Регион / Область"
          placeholder="Московская область"
          {...register('state')}
        />
        <Input
          label="Индекс"
          placeholder="125009"
          {...register('zip_code')}
        />
        <div className="w-full space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Страна
          </label>
          <select
            {...register('country')}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D47A1]/50 focus-visible:border-[#0D47A1]"
          >
            <option value="">Выберите страну</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="LinkedIn"
          type="url"
          placeholder="https://linkedin.com/in/ivanov"
          {...register('linkedin')}
        />
        <Input
          label="Личный сайт"
          type="url"
          placeholder="https://ivanov.dev"
          {...register('website')}
        />
      </div>
    </div>
  );
}
