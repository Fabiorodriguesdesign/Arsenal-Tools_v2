
import React from 'react';
// FIX: Update imports to use centralized UI components from '@/' for consistency.
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { Education } from '../../../types/resume';
import { CloseIconSmall } from '@/components/icons';

interface EducationStepProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationStep: React.FC<EducationStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {data.length === 0 ? (
         <div className="text-center py-10 bg-light-bg dark:bg-dark-bg rounded-lg border border-dashed border-light-border dark:border-dark-border flex flex-col items-center justify-center">
            <p className="text-light-muted dark:text-dark-muted mb-4">{t('resumeBuilder.education.empty')}</p>
            <Button onClick={addEducation} className="mx-auto w-fit">{t('resumeBuilder.education.add')}</Button>
         </div>
      ) : (
        data.map((edu, index) => (
          <div key={edu.id} className="p-6 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border relative group transition-all duration-200 hover:shadow-md">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => removeEducation(edu.id)}
                className="p-2 text-light-muted hover:text-danger transition-colors rounded focus:outline-none focus:ring-2 focus:ring-danger"
                aria-label={t('resumeBuilder.education.remove')}
              >
                <CloseIconSmall />
              </button>
            </div>

            <h3 className="font-bold text-lg mb-4 text-light-text dark:text-dark-text">
                {edu.institution || `${t('resumeBuilder.education.title')} ${index + 1}`}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="resumeBuilder.education.institution"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="Ex: USP"
              />
              <Input
                label="resumeBuilder.education.degree"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Ex: Bacharelado"
              />
               <div className="md:col-span-2">
                 <Input
                    label="resumeBuilder.education.field"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                    placeholder="Ex: Ciência da Computação"
                />
               </div>
              <Input
                label="resumeBuilder.education.startDate"
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
               <div>
                <Input
                    label="resumeBuilder.education.endDate"
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    disabled={edu.current}
                    className={edu.current ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600 opacity-100' : ''}
                />
                 <div className="mt-2 flex items-center">
                    <input
                        type="checkbox"
                        id={`edu-current-${edu.id}`}
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor={`edu-current-${edu.id}`} className="ml-2 block text-sm text-light-muted dark:text-dark-muted cursor-pointer select-none">
                        {t('resumeBuilder.education.current')}
                    </label>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {data.length > 0 && (
        <div className="flex justify-center pt-4">
             <Button onClick={addEducation} variant="secondary" className="mx-auto w-fit">{t('resumeBuilder.education.add')}</Button>
        </div>
      )}
    </div>
  );
};

export default EducationStep;