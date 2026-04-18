import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import fi from "../locales/fi.json";

/** localStorage key for persisted UI language */
export const LANGUAGE_STORAGE_KEY = "geo-studio-lang";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fi: { translation: fi },
  },
  fallbackLng: "en",
  supportedLngs: ["en", "fi"],
  interpolation: { escapeValue: false },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: LANGUAGE_STORAGE_KEY,
  },
});

export default i18n;
