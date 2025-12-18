import React from 'react';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import ProviderStep from './ProviderStep';
import ClientStep from './ClientStep';
import ProjectStep from './ProjectStep';
import ProposalPreview from './ProposalPreview';
import SEO from '../../shared/SEO';
import { useProposalBuilder } from '../../../hooks/useProposalBuilder';

const ProposalBuilder: React.FC = () => {
  const { t } = useTranslation();
  const {
    step,
    isGenerating,
    proposalData,
    nextStep,
    prevStep,
    handleUpdateData,
    handleUpdateItems,
    handleReset,
    handleDownload,
  } = useProposalBuilder();

  const steps = [
    { id: 1, key: 'proposalBuilder.steps.provider' },
    { id: 2, key: 'proposalBuilder.steps.client' },
    { id: 3, key: 'proposalBuilder.steps.project' },
    { id: 4, key: 'proposalBuilder.steps.preview' },
  ];

  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-8 overflow-x-auto">
      {steps.map((s, index) => (
        <div key={s.id} className="flex items-center">
           <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${step >= s.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}>
             {s.id}
           </div>
           {index < steps.length - 1 && (
             <div className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors ${step > s.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
           )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <SEO titleKey="tab.proposalBuilder" descriptionKey="proposal-builder.landing.description" />
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-light-border dark:border-dark-border pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text text-center sm:text-left">
            {t('proposalBuilder.title')}
        </h1>
        <Button variant="secondary" size="sm" onClick={handleReset} className="mt-4 sm:mt-0">
            {t('proposalBuilder.newQuote')}
        </Button>
      </div>

      <StepIndicator />
      
      <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">{t(steps[step - 1].key)}</h2>
      </div>

      <Card>
        <div className="min-h-[300px]">
           {step === 1 && <ProviderStep data={proposalData} onChange={handleUpdateData} />}
           {step === 2 && <ClientStep data={proposalData} onChange={handleUpdateData} />}
           {step === 3 && <ProjectStep data={proposalData} onChange={handleUpdateData} onItemsChange={handleUpdateItems} />}
           {step === 4 && (
             <ProposalPreview 
                data={proposalData} 
                onUpdateData={handleUpdateData} 
             />
           )}
        </div>

        <div className="flex justify-between mt-6 border-t border-light-border dark:border-dark-border pt-4">
          <Button onClick={prevStep} disabled={step === 1 || isGenerating} variant="secondary">
            {t('common.previous')}
          </Button>
          
          {step === 4 ? (
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

export default ProposalBuilder;