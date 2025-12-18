
import { useCallback } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language, setLanguage } = useLanguage();

  const t = useCallback((key: string, options?: Record<string, string | number>) => {
    const langDict = translations[language as 'pt' | 'en'] || translations.pt;
    let text = langDict[key] || translations.pt[key] || key;
    
    if (options && typeof text === 'string') {
        Object.keys(options).forEach(optionKey => {
            const regex = new RegExp(`{{${optionKey}}}`, 'g');
            text = text.replace(regex, String(options[optionKey]));
        });
    }

    return text;
  }, [language]);

  const toggleLanguage = () => {
    const languages: ('pt' | 'en' | 'es')[] = ['pt', 'en', 'es'];
    const currentIndex = languages.indexOf(language as any);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  }

  return { t, language, toggleLanguage };
};
