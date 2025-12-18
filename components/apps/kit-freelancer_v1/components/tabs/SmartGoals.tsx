
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useTranslation } from '../../hooks/useTranslation';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { Icon } from '@/components/icons';

interface GoalData {
    S: string;
    M: string;
    A: string;
    R: string;
    T: string;
    [key: string]: string;
}

const SmartGoals: React.FC = () => {
  const { t } = useTranslation();

  const smartSteps = [
    { key: 'S', titleKey: 'smartGoals.s.title', questionKey: 'smartGoals.s.question', color: 'bg-blue-500' },
    { key: 'M', titleKey: 'smartGoals.m.title', questionKey: 'smartGoals.m.question', color: 'bg-green-500' },
    { key: 'A', titleKey: 'smartGoals.a.title', questionKey: 'smartGoals.a.question', color: 'bg-yellow-500' },
    { key: 'R', titleKey: 'smartGoals.r.title', questionKey: 'smartGoals.r.question', color: 'bg-orange-500' },
    { key: 'T', titleKey: 'smartGoals.t.title', questionKey: 'smartGoals.t.question', color: 'bg-red-500' },
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
        <div className="animate-fadeIn">
             <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                     <Icon name="check-circle" className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text">{t('smartGoals.finished.title')}</h1>
                <p className="text-light-muted dark:text-dark-muted mt-2">Aqui está o plano detalhado da sua meta.</p>
            </div>

            <Card className="animate-scale-in">
                <div className="space-y-6">
                    {smartSteps.map((step, idx) => (
                        <div key={step.key} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${step.color} border-2 border-white dark:border-dark-card`}></div>
                            <h3 className="font-bold text-lg text-light-text dark:text-dark-text mb-1">{t(step.titleKey)}</h3>
                            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg border border-light-border dark:border-dark-border text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                                {goalData[step.key] || <span className="italic text-gray-400">{t('smartGoals.notFilled')}</span>}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border flex justify-center">
                    <Button onClick={handleReset} variant="primary">
                        <Icon name="plus" className="w-4 h-4" />
                        {t('smartGoals.create.new')}
                    </Button>
                </div>
            </Card>
        </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border text-center sm:text-left">{t('smartGoals.title')}</h1>
      
      {/* Enhanced Progress Bar */}
      <section className="mb-8" aria-label={t('common.step', { current: currentStep + 1, total: smartSteps.length })}>
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
                {t(currentGoal.titleKey)}
            </span>
            <span className="text-xs font-mono text-light-muted dark:text-dark-muted bg-light-bg dark:bg-dark-bg px-2 py-1 rounded">
                {currentStep + 1} / {smartSteps.length}
            </span>
        </div>
        <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
             <div 
                className={`h-full ${currentGoal.color} transition-all duration-500 ease-out`} 
                style={{ width: `${progressPercentage}%` }}
             ></div>
        </div>
      </section>

      <Card className="animate-fadeIn min-h-[400px] flex flex-col" key={currentStep}>
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${currentGoal.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-current`}>
                 <span className={`text-xl font-bold ${currentGoal.color.replace('bg-', 'text-')}`}>
                     {currentGoal.key}
                 </span>
            </div>
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text">{t(currentGoal.titleKey)}</h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
            {t(currentGoal.questionKey)}
        </p>
        
        <div className="flex-grow">
            <Textarea
                name={currentGoal.key}
                value={goalData[currentGoal.key]}
                onChange={handleChange}
                rows={8}
                placeholder={t('smartGoals.placeholder')}
                className="h-full resize-none"
            />
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-light-border dark:border-dark-border">
          <Button 
            onClick={handleBack} 
            disabled={currentStep === 0} 
            variant="ghost"
            leftIcon={<Icon name="arrow-left" className="w-4 h-4" />}
          >
            {t('common.previous')}
          </Button>
          <Button 
            onClick={handleNext}
            rightIcon={currentStep < smartSteps.length - 1 ? <Icon name="arrow-right" className="w-4 h-4" /> : <Icon name="check" className="w-4 h-4" />}
          >
            {currentStep === smartSteps.length - 1 ? t('smartGoals.viewResult') : t('common.next')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SmartGoals;
