"use client";

import * as React from "react";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  label: string;
  flag: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: "en-us", label: "English (US)", flag: "US", nativeName: "English" },
  { code: "en-gb", label: "English (UK)", flag: "GB", nativeName: "English" },
  { code: "en-in", label: "English (India)", flag: "IN", nativeName: "English" },
  { code: "de", label: "German", flag: "DE", nativeName: "Deutsch" },
  { code: "fr", label: "French", flag: "FR", nativeName: "Français" },
  { code: "es", label: "Spanish", flag: "ES", nativeName: "Español" },
  { code: "it", label: "Italian", flag: "IT", nativeName: "Italiano" },
  { code: "pt-br", label: "Portuguese (Brazil)", flag: "BR", nativeName: "Português" },
  { code: "ru", label: "Russian", flag: "RU", nativeName: "Русский" },
  { code: "tr", label: "Turkish", flag: "TR", nativeName: "Türkçe" },
  { code: "uz", label: "Uzbek", flag: "UZ", nativeName: "Oʻzbekcha" },
];

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
  className?: string;
}

export function LanguageSwitcher({
  currentLanguage = "en-us",
  onLanguageChange,
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selectedLanguage = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium text-xs text-gray-400 mr-1">
          {selectedLanguage.flag}
        </span>
        <span>{selectedLanguage.label}</span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 z-50 mt-1 max-h-72 w-56 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {LANGUAGES.map((language) => {
            const isSelected = language.code === currentLanguage;
            return (
              <li
                key={language.code}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-100",
                  isSelected && "bg-[#0D47A1]/5 text-[#0D47A1]"
                )}
                onClick={() => {
                  onLanguageChange?.(language.code);
                  setIsOpen(false);
                }}
              >
                <span className="w-5 text-center text-xs font-medium text-gray-400">
                  {language.flag}
                </span>
                <span className="flex-1">
                  {language.label}
                  <span className="ml-1 text-xs text-gray-400">
                    ({language.nativeName})
                  </span>
                </span>
                {isSelected && <Check className="h-4 w-4 text-[#0D47A1]" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
