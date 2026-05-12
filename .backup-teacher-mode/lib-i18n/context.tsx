"use client";

import * as React from "react";
import { dictionaries, LOCALES, type Locale } from "./translations";

const STORAGE_KEY = "hcis.locale";
const DEFAULT_LOCALE: Locale = "ko";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === "ko" || saved === "en")) {
        setLocaleState(saved);
      }
    } catch {
      // ignore storage failures
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale, hydrated]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[locale];
      let value = dict[key] ?? dictionaries.en[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }
      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export { LOCALES, type Locale };
