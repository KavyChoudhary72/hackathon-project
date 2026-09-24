"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

type Locale = "en" | "hi";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string, fallback?: string) => string;
}

const dictionaries: Record<Locale, any> = { en, hi };

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (keyPath: string) => keyPath,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("foodlink_locale") as Locale;
    if (saved === "en" || saved === "hi") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("foodlink_locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (keyPath: string, fallback?: string): string => {
    const keys = keyPath.split(".");
    let current = dictionaries[locale];
    for (const k of keys) {
      if (!current || current[k] === undefined) {
        // Fallback to English if missing in Hindi
        let fallbackVal = dictionaries["en"];
        for (const fk of keys) {
          if (!fallbackVal || fallbackVal[fk] === undefined) return fallback || keyPath;
          fallbackVal = fallbackVal[fk];
        }
        return typeof fallbackVal === "string" ? fallbackVal : fallback || keyPath;
      }
      current = current[k];
    }
    return typeof current === "string" ? current : fallback || keyPath;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
