
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { enTranslations, ptTranslations } from '../data/translations';

type Language = 'pt' | 'en';
type Translation = { [key: string]: string };

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: { [key in Language]: Translation } = {
    pt: ptTranslations,
    en: enTranslations,
};

const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('mediaTools_language');
    if (savedLang && (savedLang === 'pt' || savedLang === 'en')) {
        return savedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'pt' ? 'pt' : 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
      localStorage.setItem('mediaTools_language', lang);
      setLanguageState(lang);
  };
  
  const toggleLanguage = useCallback(() => {
    setLanguageState(prevLang => (prevLang === 'pt' ? 'en' : 'pt'));
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = translations[language][key] || key;
    
    if (replacements) {
      Object.keys(replacements).forEach(repKey => {
        const value = String(replacements[repKey]);
        translation = translation.replace(new RegExp(`{{${repKey}}}`, 'g'), value);
      });
    }
    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};