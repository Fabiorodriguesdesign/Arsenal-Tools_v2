import React, { useState } from 'react';
import Input from '../../../shared/Input';
import Button from '../../../shared/Button';
import { useTranslation } from '../../../../hooks/useTranslation';
import { Language } from '../../../../types/resume';
import { CloseIconSmall } from '../../../shared/Icons';

interface LanguageListProps {
  languages: Language[];
  onLanguagesChange: (data: Language[]) => void;
}

const LanguageList: React.FC<LanguageListProps> = ({ languages, onLanguagesChange }) => {
  const { t } = useTranslation();
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState<Language['level']>('intermediate');

  const handleAddLanguage = () => {
    if (!newLanguage.trim()) return;
    const lang: Language = {
      id: Date.now().toString() + Math.random(),
      name: newLanguage.trim(),
      level: newLanguageLevel,
    };
    onLanguagesChange([...languages, lang]);
    setNewLanguage('');
    setNewLanguageLevel('intermediate');
  };

  const removeLanguage = (id: string) => {
    onLanguagesChange(languages.filter((l) => l.id !== id));
  };

  const getLevelLabel = (level: string) => {
    return t(`resumeBuilder.languages.level.${level}`);
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3 text-light-text dark:text-dark-text">{t('resumeBuilder.languages.title')}</h3>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-end">
        <div className="flex-grow w-full">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder={t('resumeBuilder.languages.input.placeholder')}
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('resumeBuilder.languages.level.label')}</label>
          <select
            value={newLanguageLevel}
            onChange={(e) => setNewLanguageLevel(e.target.value as Language['level'])}
            className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
          >
            <option value="basic">{t('resumeBuilder.languages.level.basic')}</option>
            <option value="intermediate">{t('resumeBuilder.languages.level.intermediate')}</option>
            <option value="advanced">{t('resumeBuilder.languages.level.advanced')}</option>
            <option value="fluent">{t('resumeBuilder.languages.level.fluent')}</option>
            <option value="native">{t('resumeBuilder.languages.level.native')}</option>
          </select>
        </div>
        <Button onClick={handleAddLanguage} disabled={!newLanguage.trim()} className="w-full sm:w-auto">
          {t('resumeBuilder.languages.add')}
        </Button>
      </div>

      <div className="space-y-2">
        {languages.length === 0 && (
          <p className="text-sm text-light-muted dark:text-dark-muted italic">{t('resumeBuilder.languages.empty')}</p>
        )}
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center justify-between p-3 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border animate-fadeIn"
          >
            <div>
              <span className="font-semibold text-light-text dark:text-dark-text">{lang.name}</span>
              <span className="mx-2 text-light-border dark:text-dark-border">|</span>
              <span className="text-sm text-light-muted dark:text-dark-muted">{getLevelLabel(lang.level)}</span>
            </div>
            <button
              onClick={() => removeLanguage(lang.id)}
              className="p-1 text-light-muted hover:text-danger transition-colors rounded focus:outline-none focus:ring-2 focus:ring-danger"
              aria-label={t('common.removeAriaLabel', { item: lang.name })}
            >
              <CloseIconSmall />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageList;