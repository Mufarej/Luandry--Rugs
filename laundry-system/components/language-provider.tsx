'use client';

import { createContext, useContext, useCallback, ReactNode, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  messages: Record<string, string>;
  changeLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { language, messages, isRTL } = useLanguage();

  const t = (key: string, defaultValue?: string): string => {
    return messages[key] || defaultValue || key;
  };

  return { t, language, isRTL };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get saved language preference or browser language
    const saved = localStorage.getItem('language') as Language | null;
    const lang = saved || (typeof navigator !== 'undefined' && navigator.language.startsWith('ar') ? 'ar' : 'en');
    
    setLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Load translations
    fetch(`/locales/${lang}/common.json`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load translations:', err);
        setIsLoading(false);
      });
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    fetch(`/locales/${lang}/common.json`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Failed to load translations:', err));
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, messages, changeLanguage, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}
