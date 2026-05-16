import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const NAMESPACES = ["common", "builder", "templates", "marketing"] as const;

export type I18nNamespace = (typeof NAMESPACES)[number];

// Inline fallback resources so the app renders correctly even before any
// translation file has loaded over the network. Public/i18n/{lng}/*.json
// supplements these for non-default languages.
const FALLBACK_RESOURCES = {
  "en-us": {
    common: {
      app: { name: "Resumer", tagline: "Build a resume that gets you hired." },
      nav: {
        signin: "Sign in",
        signup: "Sign up",
        dashboard: "Dashboard",
        myDocuments: "My documents",
        templates: "Templates",
        examples: "Examples",
      },
      actions: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        download: "Download",
        edit: "Edit",
        next: "Next",
        previous: "Previous",
      },
    },
    builder: {
      step1: "Choose template",
      step2: "Edit content",
      step3: "Download",
    },
    templates: {},
    marketing: {},
  },
};

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Inline default-locale resources so the UI renders without waiting for
    // an HTTP roundtrip. Other locales lazy-load from /i18n/.
    resources: FALLBACK_RESOURCES,

    backend: {
      loadPath: "/i18n/{{lng}}/{{ns}}.json",
      // Skip network fetches for the default locale (already inlined above).
      allowMultiLoading: false,
    },

    detection: {
      order: ["path", "cookie", "navigator", "htmlTag"],
      lookupFromPathIndex: 0,
      lookupCookie: "i18next",
      caches: ["cookie"],
    },

    fallbackLng: "en-us",
    lng: "en-us",
    supportedLngs: [
      "en-us",
      "en-gb",
      "en-in",
      "de",
      "fr",
      "es",
      "it",
      "pt-br",
      "ru",
      "tr",
      "uz",
    ],
    ns: [...NAMESPACES],
    defaultNS: "common",
    // If a key is missing in the requested namespace, fall back to common
    // before returning the key itself.
    fallbackNS: "common",
    // Don't crash on missing translation files — just log in dev.
    partialBundledLanguages: true,
    saveMissing: false,
    parseMissingKeyHandler: (key) => key,

    interpolation: {
      escapeValue: false,
    },

    react: {
      // Disabling Suspense avoids a blank screen on first paint; missing keys
      // gracefully fall back to the inline en-us resources above.
      useSuspense: false,
    },

    debug: false,
  });

export default i18n;
