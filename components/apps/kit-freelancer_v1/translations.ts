
import { pt } from './locales/pt/index';
import { en } from './locales/en/index';
import { flattenTranslations } from './utils/translations';

export const translations: Record<string, Record<string, string>> = {
  pt: flattenTranslations(pt),
  en: flattenTranslations(en),
};
