import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextData {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextData>({} as LanguageContextData);

const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const savedLang = window.localStorage.getItem('language');
        if (savedLang === 'pt' || savedLang === 'en') {
            return savedLang;
        }
        // Fallback to browser language
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'en') {
            return 'en';
        }
    }
    return 'pt'; // Default to Portuguese
};


export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prevLang => (prevLang === 'pt' ? 'en' : 'pt'));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextData {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
