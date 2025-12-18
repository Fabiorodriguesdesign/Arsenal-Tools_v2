
import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import VariableIncome from './InvestmentTax/VariableIncome';
import FixedIncome from './InvestmentTax/FixedIncome';

type SubTab = 'variable' | 'fixed';

const InvestmentTaxCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SubTab>('variable');

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl text-center font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">
        {t('investmentTax.title')}
      </h1>
      
      <div className="flex justify-center border-b border-light-border dark:border-dark-border mb-6">
          <button 
            onClick={() => setActiveTab('variable')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'variable' ? 'border-b-2 border-primary text-primary' : 'text-light-muted hover:text-light-text dark:hover:text-dark-text'}`}
          >
            {t('investmentTax.variable.tab')}
          </button>
          <button 
            onClick={() => setActiveTab('fixed')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'fixed' ? 'border-b-2 border-primary text-primary' : 'text-light-muted hover:text-light-text dark:hover:text-dark-text'}`}
          >
            {t('investmentTax.fixed.tab')}
          </button>
      </div>
      
      {activeTab === 'variable' ? <VariableIncome /> : <FixedIncome />}
    </div>
  );
};

export default InvestmentTaxCalculator;
