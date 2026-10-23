import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import english from '../locales/en';
import hindi from '../locales/hi';

const catalog = { en: english, hi: hindi };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = window.localStorage.getItem('civic-desk-language');
    return catalog[saved] ? saved : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem('civic-desk-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: next => { if (catalog[next]) setLanguage(next); },
    t: key => catalog[language][key] || english[key] || key
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
