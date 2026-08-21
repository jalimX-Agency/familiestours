'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, locales, defaultLocale, translations, Translations } from '@/i18n/translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  switchLocale: (newLocale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children, defaultLoc = defaultLocale }: { children: ReactNode; defaultLoc?: Locale }) {
  const [locale, setLocale] = useState<Locale>(defaultLoc);

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    // Update URL without reload
    window.history.pushState({}, '', `/${newLocale}${window.location.pathname.slice(3) || ''}`);
  };

  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export { locales, type Locale };
