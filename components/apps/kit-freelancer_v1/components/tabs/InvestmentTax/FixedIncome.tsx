
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '../../../hooks/useTranslation';
import { useFixedIncome } from '../../../hooks/useInvestmentTax';
import { FixedPeriodUnit } from '../../../types/investment';

const FixedIncome: React.FC = () => {
  const { t } = useTranslation();
  const { 
      formData, 
      result, 
      handleChange, 
      handleMonetaryBlur, 
      calculateFixedIncome, 
      formatCurrency 
  } = useFixedIncome();

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <form onSubmit={calculateFixedIncome}>
          <Card title={t("investmentTax.fixed.card.title")}>
            <div className="space-y-4">
              <Input 
                label={t("investmentTax.fixed.profit.label")} 
                value={formData.grossProfit} 
                onChange={e => handleChange('grossProfit', e.target.value)} 
                onBlur={handleMonetaryBlur} 
                placeholder={t('investmentTax.fixed.profit.placeholder')} 
              />
              <div>
                <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1.5">{t('investmentTax.fixed.time.label')}</label>
                <div className="flex gap-2">
                    <Input 
                        aria-label={t('investmentTax.fixed.time.ariaLabel')} 
                        type="number" 
                        value={formData.investmentPeriod} 
                        onChange={e => handleChange('investmentPeriod', e.target.value)} 
                    />
                    <div className="w-full">
                        <Select 
                            value={formData.investmentPeriodUnit} 
                            onChange={e => handleChange('investmentPeriodUnit', e.target.value as FixedPeriodUnit)} 
                        >
                            <option value="days">{t('common.days')}</option>
                            <option value="months">{t('common.months')}</option>
                            <option value="years">{t('common.years')}</option>
                        </Select>
                    </div>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">{t('common.calculateTax')}</Button>
          </Card>
        </form>

        {result ? (
          <div role="status" aria-live="polite">
            <Card title={t("common.results")}>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg"><span className="text-light-muted dark:text-dark-muted">{t('investmentTax.results.appliedRate')}:</span><span className="font-bold text-light-accent-text dark:text-dark-accent-text">{result.appliedRate.toFixed(2)}%</span></div>
                <div className="border-t border-light-border dark:border-dark-border my-2"></div>
                <div className="flex justify-between items-center"><span className="text-light-muted dark:text-dark-muted">{t('investmentTax.results.taxDue')}:</span><span className="font-medium text-danger">{formatCurrency(result.taxDue)}</span></div>
                <div className="flex justify-between items-center"><span className="text-light-muted dark:text-dark-muted">{t('investmentTax.results.netProfit')}:</span><span className="font-medium text-secondary">{formatCurrency(result.netProfit)}</span></div>
              </div>
            </Card>
          </div>
        ) : <Card><div className="text-center p-8 text-light-muted dark:text-dark-muted">{t('common.fillDataToCalculate')}</div></Card>}
      </div>
       <div className="mt-6 text-center text-xs text-light-muted dark:text-dark-muted p-4 bg-light-border dark:bg-dark-card rounded-lg"><strong>{t('common.disclaimer')}:</strong> {t('investmentTax.fixed.disclaimer')}</div>
    </div>
  );
};

export default FixedIncome;
