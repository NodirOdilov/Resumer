'use client';

import { useTranslation } from 'react-i18next';
import { usePreferencesStore } from '@/stores/preferencesStore';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-us', name: 'English (US)', nativeName: 'English (US)' },
  { code: 'en-gb', name: 'English (UK)', nativeName: 'English (UK)' },
  { code: 'en-in', name: 'English (India)', nativeName: 'English (India)' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', nativeName: 'Português (BR)' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'uz', name: 'Uzbek', nativeName: "Oʻzbekcha" },
];

export function useI18n(namespace?: string | string[]) {
  const { t, i18n } = useTranslation(namespace);
  const setStoreLanguage = usePreferencesStore((s) => s.setLanguage);

  const currentLanguage = i18n.language;

  async function changeLanguage(languageCode: string) {
    await i18n.changeLanguage(languageCode);
    setStoreLanguage(languageCode);
  }

  return {
    t,
    currentLanguage,
    changeLanguage,
    languages: SUPPORTED_LANGUAGES,
    i18n,
  };
}
