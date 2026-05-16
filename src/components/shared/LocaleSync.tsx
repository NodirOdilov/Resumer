"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LOCALE_MAP: Record<string, string> = {
  uk: "en-gb",
  in: "en-in",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  br: "pt-br",
  ru: "ru",
  tr: "tr",
  uz: "uz",
};

interface LocaleSyncProps {
  locale: string;
}

export default function LocaleSync({ locale }: LocaleSyncProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = LOCALE_MAP[locale];
    if (lng && i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [locale, i18n]);

  return null;
}
