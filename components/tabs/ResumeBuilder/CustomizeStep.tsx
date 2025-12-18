import React from 'react';
import { ResumeData, DocumentLanguage } from '../../../types/resume';
import { useTranslation } from '../../../hooks/useTranslation';
import FlagIcon from '../../shared/FlagIcon';

interface CustomizeStepProps {
  data: ResumeData;
  onUpdateData: (data: Partial<ResumeData>) => void;
}

const CustomizeStep: React.FC<CustomizeStepProps> = ({ data, onUpdateData }) => {
  const { t } = useTranslation();

  const colors = [
    '#1a1a1a', // Black
    '#2563eb', // Blue
    '#059669', // Emerald
    '#dc2626', // Red
    '#7c3aed', // Violet
    '#0891b2', // Cyan
  ];

  const templates = [
      { id: 'modern', nameKey: 'resumeBuilder.preview.template.modern' },
      { id: 'classic', nameKey: 'resumeBuilder.preview.template.classic' },
      { id: 'tech', nameKey: 'resumeBuilder.preview.template.tech' },
  ]
  
  const languages: { id: DocumentLanguage, name: string, flag: string }[] = [
      { id: 'pt', name: t('resumeBuilder.preview.lang.pt'), flag: 'BRL' },
      { id: 'en', name: t('resumeBuilder.preview.lang.en'), flag: 'USD' },
      { id: 'es', name: t('resumeBuilder.preview.lang.es'), flag: 'EUR' }
  ];

  return (
    <div className="animate-fadeIn p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">{t('resumeBuilder.preview.options')}</h3>
        
        <div className="flex flex-col gap-6">
            {/* Template Selector */}
            <div>
                 <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-2">
                    {t('resumeBuilder.preview.template.label')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {templates.map(tpl => (
                         <button
                            key={tpl.id}
                            onClick={() => onUpdateData({ templateId: tpl.id as any })}
                            className={`relative flex flex-col items-center p-2 rounded-lg border-2 transition-all duration-200 ${data.templateId === tpl.id ? 'border-primary bg-primary/5' : 'border-light-border dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'}`}
                         >
                            <div className="w-full aspect-[210/297] bg-white rounded shadow-sm mb-2 overflow-hidden relative">
                                {tpl.id === 'modern' && (
                                    <div className="flex h-full">
                                        <div className="w-1/3 h-full bg-gray-800"></div>
                                        <div className="w-2/3 h-full p-1">
                                            <div className="h-2 w-3/4 bg-gray-200 mb-2 rounded"></div>
                                            <div className="h-1 w-full bg-gray-100 mb-1 rounded"></div>
                                            <div className="h-1 w-full bg-gray-100 mb-1 rounded"></div>
                                        </div>
                                    </div>
                                )}
                                {tpl.id === 'classic' && (
                                    <div className="p-2 h-full flex flex-col items-center pt-4">
                                        <div className="h-2 w-1/2 bg-gray-800 mb-2 rounded"></div>
                                        <div className="h-0.5 w-full bg-gray-300 mb-3"></div>
                                        <div className="w-full flex flex-col gap-1 items-start">
                                            <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                )}
                                {tpl.id === 'tech' && (
                                    <div className="p-2 h-full flex flex-col pt-2">
                                        <div className="h-3 w-full border-b-2 border-gray-800 mb-2 flex items-center gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <div className="h-1 w-1/2 bg-gray-600 rounded"></div>
                                        </div>
                                        <div className="flex gap-1 h-full">
                                            <div className="w-2/3 h-full flex flex-col gap-1">
                                                <div className="h-1 w-full bg-gray-200 rounded"></div>
                                                <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="w-1/3 h-full flex flex-col gap-1">
                                                <div className="h-1 w-full bg-gray-300 rounded"></div>
                                                <div className="h-1 w-full bg-gray-300 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <span className={`text-sm font-medium ${data.templateId === tpl.id ? 'text-primary' : 'text-light-muted dark:text-dark-muted'}`}>
                                {t(tpl.nameKey) || tpl.nameKey}
                            </span>
                         </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Picker */}
                <div>
                    <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-2">
                        {t('resumeBuilder.preview.primaryColor')}
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        {colors.map(color => (
                            <button
                                key={color}
                                onClick={() => onUpdateData({ primaryColor: color })}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${data.primaryColor === color ? 'border-gray-400 ring-2 ring-offset-2 ring-primary' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                        <div className="relative">
                            <input 
                                type="color" 
                                value={data.primaryColor}
                                onChange={(e) => onUpdateData({ primaryColor: e.target.value })}
                                className="w-8 h-8 rounded-full p-0 border-0 overflow-hidden cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Language Selector */}
                <div>
                    <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-2">
                        {t('resumeBuilder.preview.language.label')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {languages.map(l => (
                            <button
                                key={l.id}
                                onClick={() => onUpdateData({ lang: l.id })}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${data.lang === l.id ? 'border-primary bg-primary/10 text-primary' : 'border-light-border dark:border-dark-border text-light-muted hover:bg-light-bg dark:hover:bg-dark-card'}`}
                            >
                                <FlagIcon currency={l.flag} className="w-5 h-3.5 rounded-sm shadow-sm" />
                                <span className="text-sm font-medium">{l.name}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-light-muted dark:text-dark-muted mt-2">
                       {t('resumeBuilder.preview.language.note')}
                    </p>
                </div>
            </div>
        </div>
      </div>
  );
};

export default CustomizeStep;
