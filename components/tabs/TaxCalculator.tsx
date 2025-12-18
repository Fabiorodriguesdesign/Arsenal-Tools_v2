
import React from 'react';
import Card from '../shared/Card';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaxCalculator } from '../../hooks/useTaxCalculator';

const TaxCalculator: React.FC = () => {
  const { t } = useTranslation();
  const { 
      formData, 
      result, 
      handleChange, 
      calculateTaxes, 
      formatCurrency 
  } = useTaxCalculator();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">
        {t('tax.title')}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={calculateTaxes}>
            <Card title="tax.card.title">
              <div className="space-y-6">
                <Input 
                  label="tax.monthlyRevenue.label"
                  type="number" 
                  name="monthlyRevenue"
                  value={formData.monthlyRevenue} 
                  onChange={handleChange}
                  placeholder={t('tax.monthlyRevenue.placeholder')}
                />
                <div>
                  <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('tax.taxRegime.label')}</label>
                  <select 
                    name="taxRegime"
                    value={formData.taxRegime} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none"
                  >
                    <option value="mei">{t('tax.taxRegime.mei')}</option>
                    <option value="simples-iii">{t('tax.taxRegime.simples3')}</option>
                    <option value="simples-v">{t('tax.taxRegime.simples5')}</option>
                  </select>
                </div>
                
                {formData.taxRegime === 'mei' ? (
                  <div className="animate-fadeIn">
                    <Input 
                      label="tax.meiDas.label"
                      type="number" 
                      name="meiDasValue"
                      value={formData.meiDasValue}
                      onChange={handleChange}
                    />
                  </div>
                ) : null}

                <Input 
                  label="tax.serviceValue.label"
                  type="number" 
                  name="serviceValue"
                  value={formData.serviceValue} 
                  onChange={handleChange}
                  placeholder={t('tax.serviceValue.placeholder')}
                />
              </div>
              <Button type="submit" className="w-full mt-6">
                {t('tax.calculate.button')}
              </Button>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div role="status" aria-live="polite" className="space-y-6 animate-fadeIn">
              <Card title="tax.results.title">
                <div className="text-center bg-light-accent dark:bg-dark-accent p-4 rounded-lg mb-6">
                    <p className="text-sm text-light-accent-text dark:text-dark-accent-text">{t('tax.effectiveRate')}</p>
                    <p className="text-3xl font-bold text-light-accent-text dark:text-dark-text">
                        {formData.taxRegime === 'mei' && result.effectiveRate > 0 ? `~${result.effectiveRate.toFixed(2)}%` : `${result.effectiveRate.toFixed(2)}%`}
                    </p>
                    {formData.taxRegime === 'mei' && <p className="text-xs text-primary/80 dark:text-dark-accent-text mt-1">{t('tax.meiRate.note')}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg" aria-labelledby="monthly-results-title">
                        <h3 id="monthly-results-title" className="font-bold text-lg mb-3 text-center text-light-text dark:text-dark-text">{t('tax.monthlyResults.title')}</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-light-muted dark:text-dark-muted">{t('tax.monthlyTax')}:</span>
                                <span className="font-medium text-danger">{formatCurrency(result.monthlyTax)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-light-muted dark:text-dark-muted">{t('tax.monthlyNet')}:</span>
                                <span className="font-medium text-secondary">{formatCurrency(result.monthlyNet)}</span>
                            </div>
                        </div>
                    </div>
                     <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg" aria-labelledby="service-results-title">
                        <h3 id="service-results-title" className="font-bold text-lg mb-3 text-center text-light-text dark:text-dark-text">{t('tax.serviceResults.title')}</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-light-muted dark:text-dark-muted">{t('tax.serviceTax')}:</span>
                                <span className="font-medium text-danger">{formatCurrency(result.serviceTax)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-light-muted dark:text-dark-muted">{t('tax.serviceNet')}:</span>
                                <span className="font-medium text-secondary">{formatCurrency(result.serviceNet)}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </Card>

              {result.warning && (
                <Card className="bg-warning/10 dark:bg-warning/20 border border-warning/30 dark:border-warning/40">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">{result.warning}</p>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card>
                <div className="text-center p-8 text-light-muted dark:text-dark-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <p className="mt-4">{t('tax.fillData')}</p>
                </div>
            </Card>
          )}
        </div>
      </div>

       <div className="mt-6 p-4 bg-light-border dark:bg-dark-card rounded-lg text-center text-sm text-light-muted dark:text-dark-muted">
        <strong>{t('common.disclaimer')}:</strong> {t('tax.disclaimer')}
      </div>
    </div>
  );
};

export default TaxCalculator;
