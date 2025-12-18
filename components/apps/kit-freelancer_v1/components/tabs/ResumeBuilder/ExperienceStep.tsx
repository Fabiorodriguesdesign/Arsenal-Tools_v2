
import React from 'react';
// FIX: Update imports to use centralized UI components from '@/' for consistency.
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { Experience } from '../../../types/resume';
import { CloseIconSmall } from '@/components/icons';

interface ExperienceStepProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {data.length === 0 ? (
         <div className="text-center py-10 bg-light-bg dark:bg-dark-bg rounded-lg border border-dashed border-light-border dark:border-dark-border flex flex-col items-center justify-center">
            <p className="text-light-muted dark:text-dark-muted mb-4">{t('resumeBuilder.experience.empty')}</p>
            <Button onClick={addExperience} className="mx-auto w-fit">{t('resumeBuilder.experience.add')}</Button>
         </div>
      ) : (
        data.map((exp, index) => (
          <div key={exp.id} className="p-6 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border relative group transition-all duration-200 hover:shadow-md">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => removeExperience(exp.id)}
                className="p-2 text-light-muted hover:text-danger transition-colors rounded focus:outline-none focus:ring-2 focus:ring-danger"
                aria-label={t('resumeBuilder.experience.remove')}
              >
                <CloseIconSmall />
              </button>
            </div>

            <h3 className="font-bold text-lg mb-4 text-light-text dark:text-dark-text">
                {exp.company || `${t('resumeBuilder.experience.title')} ${index + 1}`}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="resumeBuilder.experience.company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Ex: Google"
              />
              <Input
                label="resumeBuilder.experience.position"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Ex: Senior Product Designer"
              />
              <Input
                label="resumeBuilder.experience.startDate"
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
               <div>
                <Input
                    label="resumeBuilder.experience.endDate"
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className={exp.current ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600 opacity-100' : ''}
                />
                 <div className="mt-2 flex items-center">
                    <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor={`current-${exp.id}`} className="ml-2 block text-sm text-light-muted dark:text-dark-muted cursor-pointer select-none">
                        {t('resumeBuilder.experience.current')}
                    </label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">
                    {t('resumeBuilder.experience.description')}
                </label>
                <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border placeholder-light-muted/70 dark:placeholder-dark-muted/70 transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>
        ))
      )}

      {data.length > 0 && (
        <div className="flex justify-center pt-4">
             <Button onClick={addExperience} variant="secondary" className="mx-auto w-fit">{t('resumeBuilder.experience.add')}</Button>
        </div>
      )}
    </div>
  );
};

export default ExperienceStep;