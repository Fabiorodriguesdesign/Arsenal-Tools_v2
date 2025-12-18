
import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useFormPersistence } from '../../hooks/useFormPersistence';

interface GoalData {
    S: string;
    M: string;
    A: string;
    R: string;
    T: string;
    [key: string]: string; // Index signature to allow dynamic access
}

const SmartGoals: React.FC = () => {
  const { t } = useTranslation();

  const smartSteps = [
    { key: 'S', titleKey: 'smartGoals.s.title', questionKey: 'smartGoals.s.question' },
    { key: 'M', titleKey: 'smartGoals.m.title', questionKey: 'smartGoals.m.question' },
    { key: 'A', titleKey: 'smartGoals.a.title', questionKey: 'smartGoals.a.question' },
    { key: 'R', titleKey: 'smartGoals.r.title', questionKey: 'smartGoals.r.question' },
    { key: 'T', titleKey: 'smartGoals.t.title', questionKey: 'smartGoals.t.question' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const [goalData, setGoalData] = useFormPersistence<GoalData>('smartGoalsData', { 
      S: '', M: '', A: '', R: '', T: '' 
  });

  const handleNext = () => {
    if (currentStep < smartSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleReset = () => {
      if (confirm(t('common.confirmReset'))) {
        setCurrentStep(0);
        setIsFinished(false);
        setGoalData({ S: '', M: '', A: '', R: '', T: '' });
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGoalData(prev => ({ ...prev, [name]: value }));
  };

  const progressPercentage = ((currentStep + 1) / smartSteps.length) * 100;
  const currentGoal = smartSteps[currentStep];

  if (isFinished) {
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-gray-200 dark:border-dark-border">{t('smartGoals.finished.title')}</h1>
            <Card className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-4 text-primary">{t('smartGoals.finished.summary')}</h2>
                <div className="space-y-4">
                    {smartSteps.map(step => (
                        <div key={step.key}>
                            <h3 className="font-semibold text-lg">{t(step.titleKey)}</h3>
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{goalData[step.key] || t('smartGoals.notFilled')}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Button onClick={handleReset} variant="secondary">
                        {t('smartGoals.create.new')}
                    </Button>
                </div>
            </Card>
        </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-gray-200 dark:border-dark-border">{t('smartGoals.title')}</h1>
      
      {/* Progress Bar */}
      <section className="mb-6" aria-label={t('common.step', { current: currentStep + 1, total: smartSteps.length })}>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-900 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40" aria-hidden="true">
                {t('common.step', { current: currentStep + 1, total: smartSteps.length })}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-gray-700">
            <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
          </div>
        </div>
      </section>

      <Card className="animate-fadeIn" key={currentStep}>
        <h2 className="text-2xl font-bold mb-2 text-light-text dark:text-dark-text">{t(currentGoal.titleKey)}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{t(currentGoal.questionKey)}</p>
        <textarea
          name={currentGoal.key}
          value={goalData[currentGoal.key]}
          onChange={handleChange}
          rows={6}
          className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border placeholder-light-muted/70 dark:placeholder-dark-muted/70 transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
          placeholder={t('smartGoals.placeholder')}
        />
        <div className="flex justify-between mt-6">
          <Button onClick={handleBack} disabled={currentStep === 0} variant="secondary">
            {t('common.previous')}
          </Button>
          <Button onClick={handleNext}>
            {currentStep === smartSteps.length - 1 ? t('smartGoals.viewResult') : t('common.next')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SmartGoals;