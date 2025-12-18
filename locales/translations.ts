
import { pt } from './pt/index';
import { en } from './en/index';
import { es } from './es/index';
import { flattenTranslations } from '../utils/translations';

export const translations: Record<string, Record<string, string>> = {
  pt: flattenTranslations(pt),
  en: flattenTranslations(en),
  es: flattenTranslations(es)
};
