import { useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = useCallback((key: string, options?: Record<string, string | number>) => {
    const langDict = translations[language] || translations.pt;
    let text = langDict[key] || key;
    
    if (options && typeof text === 'string') {
        Object.keys(options).forEach(optionKey => {
            const regex = new RegExp(`{{${optionKey}}}`, 'g');
            text = text.replace(regex, String(options[optionKey]));
        });
    }

    return text;
  }, [language]);

  return { t, language };
};
