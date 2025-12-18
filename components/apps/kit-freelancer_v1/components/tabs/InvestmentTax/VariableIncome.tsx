

import React from 'react';
// FIX: Update imports to use centralized UI components
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
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
          <Card title={t("investmentTax.variable.card.title")}>
            <div className="space-y-4">
              <Input 
                label={t("investmentTax.variable.saleValue.label")} 
                value={formData.saleValue} 
                onChange={e => handleChange('saleValue', e.target.value)} 
                onBlur={() => handleMonetaryBlur('saleValue')} 
                placeholder={t('investmentTax.variable.saleValue.placeholder')} 
              />
              <Input 
                label={t("investmentTax.variable.cost.label")} 
                value={formData.acquisitionCost} 
                onChange={e => handleChange('acquisitionCost', e.target.value)} 
                onBlur={() => handleMonetaryBlur('acquisitionCost')} 
                placeholder={t('investmentTax.variable.cost.placeholder')} 
              />
              <div>
                <Select 
                    label={t('investmentTax.variable.asset.label')}
                    value={formData.assetType} 
                    onChange={e => handleChange('assetType', e.target.value as AssetType)} 
                >
                  <option value="acao">{t('investmentTax.variable.asset.stock')}</option>
                  <option value="fii">{t('investmentTax.variable.asset.fii')}</option>
                  <option value="crypto">{t('investmentTax.variable.asset.crypto')}</option>
                  <option value="bdr">{t('investmentTax.variable.asset.bdr')}</option>
                </Select>
              </div>
              <div>
                <Select 
                  label={t('investmentTax.variable.operation.label')}
                  value={formData.operationType} 
                  onChange={e => handleChange('operationType', e.target.value as OperationType)} 
                  disabled={formData.assetType === 'fii'}
                >
                  <option value="swing">{t('investmentTax.variable.operation.swing')}</option>
                  <option value="day">{t('investmentTax.variable.operation.day')}</option>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">{t('common.calculateTax')}</Button>
          </Card>
        </form>

        {result ? (
          <div role="status" aria-live="polite">
            <Card title={t("common.results")}>
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