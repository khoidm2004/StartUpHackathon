import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/** Keeps `<html lang>` in sync with the active i18n locale. */
export function DocumentLang() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language.startsWith("fi") ? "fi" : "en";
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return null;
}
