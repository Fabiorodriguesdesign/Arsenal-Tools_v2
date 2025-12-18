
import React from 'react';
import Card from '../../shared/Card';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { useVariableIncome } from '../../../hooks/useInvestmentTax';
import { AssetType, OperationType } from '../../../types/investment';

const VariableIncome: React.FC = () => {
  const { t } = useTranslation();
  const { 
      formData, 
      result, 
      handleChange, 
      handleMonetaryBlur, 
      calculateGains, 
      disclaimer,
      formatCurrency 
  } = useVariableIncome();

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <form onSubmit={calculateGains}>
          <Card title="investmentTax.variable.card.title">
            <div className="space-y-4">
              <Input 
                label="investmentTax.variable.saleValue.label" 
                value={formData.saleValue} 
                onChange={e => handleChange('saleValue', e.target.value)} 
                onBlur={() => handleMonetaryBlur('saleValue')} 
                placeholder={t('investmentTax.variable.saleValue.placeholder')} 
              />
              <Input 
                label="investmentTax.variable.cost.label" 
                value={formData.acquisitionCost} 
                onChange={e => handleChange('acquisitionCost', e.target.value)} 
                onBlur={() => handleMonetaryBlur('acquisitionCost')} 
                placeholder={t('investmentTax.variable.cost.placeholder')} 
              />
              <div>
                <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('investmentTax.variable.asset.label')}</label>
                <select 
                    value={formData.assetType} 
                    onChange={e => handleChange('assetType', e.target.value as AssetType)} 
                    className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
                >
                  <option value="acao">{t('investmentTax.variable.asset.stock')}</option>
                  <option value="fii">{t('investmentTax.variable.asset.fii')}</option>
                  <option value="crypto">{t('investmentTax.variable.asset.crypto')}</option>
                  <option value="bdr">{t('investmentTax.variable.asset.bdr')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('investmentTax.variable.operation.label')}</label>
                <select 
                  value={formData.operationType} 
                  onChange={e => handleChange('operationType', e.target.value as OperationType)} 
                  className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
                  disabled={formData.assetType === 'fii'}
                >
                  <option value="swing">{t('investmentTax.variable.operation.swing')}</option>
                  <option value="day">{t('investmentTax.variable.operation.day')}</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">{t('common.calculateTax')}</Button>
          </Card>
        </form>

        {result ? (
          <div role="status" aria-live="polite">
            <Card title="common.results">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg"><span className="text-light-muted dark:text-dark-muted">{t('investmentTax.results.profitOrLoss')}:</span><span className={`font-bold ${result.isLoss ? 'text-danger' : 'text-secondary'}`}>{formatCurrency(result.grossProfit)}</span></div>
                <div className="border-t border-light-border dark:border-dark-border my-2"></div>
                <div className="flex justify-between items-center"><span className="text-light-muted dark:text-dark-muted">{t('investmentTax.results.taxDue')}:</span><span className="font-medium text-danger">{formatCurrency(result.taxDue)}</span></div>
                <div className="flex justify-between items-center"><span className="text-light-muted dark:text-dark-muted">{t('investmentTax.results.netValue')}:</span><span className="font-medium text-light-accent-text dark:text-dark-accent-text">{formatCurrency(result.netValue)}</span></div>
              </div>
            </Card>
          </div>
        ) : <Card><div className="text-center p-8 text-light-muted dark:text-dark-muted">{t('common.fillDataToCalculate')}</div></Card>}
      </div>
      <div className="mt-6 text-center text-xs text-light-muted dark:text-dark-muted p-4 bg-light-border dark:bg-dark-card rounded-lg">{disclaimer}</div>
    </div>
  );
};

export default VariableIncome;
