
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { PersonalData, Experience, Education, Skill, Language, ResumeData } from '../../../types/resume';
import PersonalStep from './PersonalStep';
import ExperienceStep from './ExperienceStep';
import EducationStep from './EducationStep';
import SkillsStep from './SkillsStep';
import CustomizeStep from './CustomizeStep';
import ResumePreview from './ResumePreview';
import { useResumeBuilder } from '../../../hooks/useResumeBuilder';
import { Icon } from '@/components/icons';

const ResumeBuilder: React.FC = () => {
  const { t } = useTranslation();
  const {
    step,
    isGenerating,
    resumeData,
    nextStep,
    prevStep,
    updateData,
    handleReset,
    handleDownload,
  } = useResumeBuilder();

  // FIX: Inlined PreviewStep component to resolve 'ResumePreview is not defined' error. The error message suggested a problem in this file, likely due to an incomplete refactor. Inlining the preview logic and adding the necessary imports for ResumePreview and its UI elements resolves the dependency issue.
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPreviewFullscreen(false);
      }
    };

    if (isPreviewFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewFullscreen]);

  const steps = [
    { id: 1, key: 'resumeBuilder.steps.personal' },
    { id: 2, key: 'resumeBuilder.steps.experience' },
    { id: 3, key: 'resumeBuilder.steps.education' },
    { id: 4, key: 'resumeBuilder.steps.skills' },
    { id: 5, key: 'resumeBuilder.steps.customize' },
    { id: 6, key: 'resumeBuilder.steps.preview' },
  ];

  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-8 overflow-x-auto pb-2">
      {steps.map((s, index) => (
        <div key={s.id} className="flex items-center">
           <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${step >= s.id ? 'bg-gradient-accent text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}>
             {s.id}
           </div>
           {index < steps.length - 1 && (
             <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-colors ${step > s.id ? 'bg-accent-blue' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
           )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-light-border dark:border-dark-border pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text text-center sm:text-left">
            {t('resumeBuilder.title')}
        </h1>
        <Button variant="secondary" size="sm" onClick={handleReset} className="mt-4 sm:mt-0">
            {t('resumeBuilder.newResume')}
        </Button>
      </div>

      <StepIndicator />

      <Card>
        <div className="min-h-[300px]">
          {step === 1 && (
            <PersonalStep 
              data={resumeData.personal} 
              onChange={(newData: PersonalData) => updateData({ personal: newData })} 
            />
          )}
          {step === 2 && (
            <ExperienceStep 
                data={resumeData.experience}
                onChange={(newData: Experience[]) => updateData({ experience: newData })}
            />
          )}
          {step === 3 && (
            <EducationStep 
                data={resumeData.education}
                onChange={(newData: Education[]) => updateData({ education: newData })}
            />
          )}
          {step === 4 && (
            <SkillsStep 
                skills={resumeData.skills}
                languages={resumeData.languages}
                onSkillsChange={(newData: Skill[]) => updateData({ skills: newData })}
                onLanguagesChange={(newData: Language[]) => updateData({ languages: newData })}
            />
          )}
          {step === 5 && (
            <CustomizeStep
                data={resumeData}
                onUpdateData={(newData: Partial<ResumeData>) => updateData(newData)}
            />
          )}
           {step === 6 && (
            <div className="animate-fadeIn">
              <div className="flex justify-end mb-4">
                <Button variant="secondary" size="sm" onClick={() => setIsPreviewFullscreen(true)} className="gap-2">
                    <Icon name="maximize" className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('resumeBuilder.preview.fullscreen')}</span>
                </Button>
              </div>
              <div className="w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-8 rounded-xl flex justify-center">
                <div className="min-w-[800px] w-[800px] min-h-[1131px] bg-white shadow-2xl origin-top transform scale-[0.8] lg:scale-95 transition-transform duration-300">
                     <ResumePreview data={resumeData} />
                </div>
              </div>
              {isPreviewFullscreen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn" 
                    role="dialog" 
                    aria-modal="true"
                    onClick={() => setIsPreviewFullscreen(false)}
                >
                    <button
                        onClick={() => setIsPreviewFullscreen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 z-10"
                        aria-label={t('common.close')}
                    >
                        <Icon name="x" className="w-6 h-6" />
                    </button>
                    <div 
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-auto h-full max-h-[95vh] aspect-[210/297] bg-white shadow-2xl overflow-y-auto">
                             <ResumePreview data={resumeData} />
                        </div>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6 border-t border-light-border dark:border-dark-border pt-4">
          <Button onClick={prevStep} disabled={step === 1 || isGenerating} variant="secondary">
            {t('common.previous')}
          </Button>
          {step === 6 ? (
              <Button onClick={handleDownload} isLoading={isGenerating}>
                  {t('common.download.pdf')}
              </Button>
          ) : (
              <Button onClick={nextStep}>
                  {t('common.next')}
              </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ResumeBuilder;