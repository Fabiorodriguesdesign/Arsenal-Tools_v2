
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// Atualizado para usar componentes globais
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useTranslation } from '../../hooks/useTranslation';
import { useServicePriceCalculator } from '../../hooks/useServicePriceCalculator';
import { TabId } from '../../types';

interface ServicePriceCalculatorProps {
    setActiveTab?: (id: TabId) => void;
}

const ServicePriceCalculator: React.FC<ServicePriceCalculatorProps> = ({ setActiveTab }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [step, setStep] = useState(1);
  
  const { 
      formData, 
      result, 
      errors, 
      totalMonthlyHours, 
      isFormInvalid, 
      handleInputChange, 
      calculate 
  } = useServicePriceCalculator();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculate()) {
        setStep(3);
    }
  };

  const handleCreateProposal = () => {
    if (!result || !setActiveTab) return;
    
    const item = {
      id: Date.now().toString(),
      name: formData.serviceName || t('priceCalculator.defaultItemName'),
      description: '',
      quantity: 1,
      unitPrice: result.suggestedProjectPrice,
    };
    
    localStorage.setItem('pendingProposalItem', JSON.stringify(item));
    setActiveTab('proposal-builder');
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    
    return [
      { name: 'Custo Base', value: result.baseProjectCost, color: '#eab308' }, // Yellow
      { name: 'Impostos', value: result.estimatedTax, color: '#ef4444' }, // Red
      { name: 'Lucro Líquido', value: result.totalProfit, color: '#22c55e' }, // Green
    ].filter(item => item.value > 0);
  }, [result]);

  const StepIndicator = ({ current, total }: { current: number; total: number }) => (
    <div className="flex justify-center items-center space-x-2 mb-6">
        {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i + 1 === current ? 'bg-primary' : 'bg-light-border dark:bg-dark-border'}`}></div>
        ))}
    </div>
  );
  
  const Step1Content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div>
        <Select 
            label={t('priceCalculator.profession.label')}
            value={formData.profession || ''} 
            onChange={handleInputChange('profession')}
        >
          <option value="">{t('priceCalculator.profession.select')}</option>
          <option value="designer">{t('priceCalculator.profession.designer')}</option>
          <option value="developer">{t('priceCalculator.profession.developer')}</option>
          <option value="content-creator">{t('priceCalculator.profession.contentCreator')}</option>
          <option value="marketing-specialist">{t('priceCalculator.profession.marketingSpecialist')}</option>
        </Select>
      </div>
      <div>
        <Select
            label={t('priceCalculator.experienceLevel.label')}
            value={formData.experienceLevel || ''} 
            onChange={handleInputChange('experienceLevel')}
        >
          <option value="">{t('priceCalculator.experienceLevel.select')}</option>
          <option value="junior">{t('priceCalculator.experienceLevel.junior')}</option>
          <option value="mid">{t('priceCalculator.experienceLevel.mid')}</option>
          <option value="senior">{t('priceCalculator.experienceLevel.senior')}</option>
        </Select>
      </div>
      <Input label={t("priceCalculator.monthlySalary.label")} type="number" name="monthlySalary" value={formData.monthlySalary || ''} onChange={handleInputChange('monthlySalary')} placeholder={t('priceCalculator.monthlySalary.placeholder')} error={errors.monthlySalary} />
      <Input label={t("priceCalculator.fixedCosts.label")} type="number" name="fixedCosts" value={formData.fixedCosts || ''} onChange={handleInputChange('fixedCosts')} placeholder={t('priceCalculator.fixedCosts.placeholder')} error={errors.fixedCosts} />
      <Input label={t("priceCalculator.workDays.label")} type="number" name="workDaysPerMonth" value={formData.workDaysPerMonth || ''} onChange={handleInputChange('workDaysPerMonth')} placeholder="22" error={errors.workDaysPerMonth} />
      <Input label={t("priceCalculator.hoursPerDay.label")} type="number" name="hoursPerDay" value={formData.hoursPerDay || ''} onChange={handleInputChange('hoursPerDay')} placeholder="6" error={errors.hoursPerDay} />
      <div className="md:col-span-2">
        <Input 
            label={t("priceCalculator.totalHours.label")}
            type="number" 
            value={totalMonthlyHours.toFixed(0)} 
            readOnly
            className="bg-light-input dark:bg-dark-input border-light-border dark:border-dark-border cursor-not-allowed"
        />
      </div>
    </div>
  );

  const Step2Content = (
      <div className="space-y-6">
        {/* Project Data Section */}
        <div className="space-y-4">
            <Input label={t("priceCalculator.serviceName.label")} name="serviceName" value={formData.serviceName} onChange={handleInputChange('serviceName')} placeholder={t('priceCalculator.serviceName.placeholder')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1.5">{t('priceCalculator.projectTime.label')}</label>
                <div className="flex gap-2">
                    <Input aria-label={t('priceCalculator.projectTime.ariaLabel')} type="number" name="projectTime" value={formData.projectTime || ''} onChange={handleInputChange('projectTime')} error={errors.projectTime} />
                    <div className="w-full">
                         <Select value={formData.projectTimeUnit || 'hours'} onChange={handleInputChange('projectTimeUnit')}>
                            <option value="hours">{t('priceCalculator.hours')}</option>
                            <option value="days">{t('priceCalculator.days')}</option>
                        </Select>
                    </div>
                </div>
                </div>
                <Input label={t("priceCalculator.profitMargin.label")} type="number" name="profitMargin" value={formData.profitMargin || ''} onChange={handleInputChange('profitMargin')} placeholder={t('priceCalculator.profitMargin.placeholder')} error={errors.profitMargin} />
            </div>
        </div>
        
        <div className="border-t border-light-border dark:border-dark-border pt-4"></div>

        {/* Tax Data Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <Select label={t('priceCalculator.taxRegime.label')} value={formData.taxRegime || 'simples'} onChange={handleInputChange('taxRegime')}>
                    <option value="mei">{t('priceCalculator.taxRegime.mei')}</option>
                    <option value="simples">{t('priceCalculator.taxRegime.simples')}</option>
                </Select>
            </div>
            
            {formData.taxRegime === 'mei' && (
            <div className="animate-fadeIn">
                <Input label={t("priceCalculator.meiDas.label")} type="number" name="meiDasValue" value={formData.meiDasValue || ''} onChange={handleInputChange('meiDasValue')} error={errors.meiDasValue} />
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">{t('priceCalculator.meiDas.description')}</p>
            </div>
            )}
            {formData.taxRegime === 'simples' && (
            <div className="animate-fadeIn">
                <Input label={t("priceCalculator.taxRate.label")} type="number" name="effectiveTaxRate" value={formData.effectiveTaxRate || ''} onChange={handleInputChange('effectiveTaxRate')} placeholder={t('priceCalculator.taxRate.placeholder')} error={errors.effectiveTaxRate}/>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">{t('priceCalculator.taxRate.description')}</p>
            </div>
            )}
        </div>
      </div>
  );

  const ResultsStep = (
    <div className="animate-fadeIn">
       {result && !isFormInvalid && (
          <div role="status" aria-live="polite">
            <Card title={t("priceCalculator.results.title")} className="bg-light-accent dark:bg-dark-accent border border-primary/20 dark:border-primary/40">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Values */}
                <div className="space-y-6">
                     <div className="text-center bg-white dark:bg-neutral-900/50 p-6 rounded-xl border border-primary/10 shadow-sm">
                        <p className="text-sm text-light-accent-text dark:text-dark-accent-text mb-1">{t('priceCalculator.results.suggestedPrice')}</p>
                        <p className="text-4xl font-extrabold text-light-accent-text dark:text-dark-text">{formatCurrency(result.suggestedProjectPrice)}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <span className="text-light-muted dark:text-dark-muted">{t('priceCalculator.results.baseCost')}:</span>
                            <span className="font-semibold text-neutral-600 dark:text-neutral-300">{formatCurrency(result.baseProjectCost)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                             <span className="text-light-muted dark:text-dark-muted">{t('priceCalculator.results.estimatedTax')}:</span>
                            <span className="font-semibold text-danger dark:text-red-400">{formatCurrency(result.estimatedTax)}</span>
                        </div>
                         <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <span className="text-light-muted dark:text-dark-muted">{t('priceCalculator.results.netProfit')}:</span>
                            <span className="font-bold text-secondary dark:text-green-400">{formatCurrency(result.totalProfit)}</span>
                        </div>
                    </div>
                    
                    <div className="text-center pt-2">
                        <p className="text-xs text-light-muted dark:text-dark-muted">
                            {t('priceCalculator.results.baseRate')} <span className="font-bold">{formatCurrency(result.baseHourlyRate)}</span>/h
                        </p>
                    </div>
                </div>

                {/* Right Column: Chart */}
                <div className="flex flex-col items-center justify-center min-h-[250px] relative">
                    <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">Composição do Preço</h4>
                    <div className="w-full h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: 'var(--color-dark-card)', borderColor: 'var(--color-dark-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--color-dark-text)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
              </div>

               {/* Explanation Section */}
               <div className="mt-6 pt-6 border-t border-primary/10">
                    <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg text-sm text-light-muted dark:text-dark-muted border border-primary/10">
                        <p className="font-bold mb-2 text-light-text dark:text-dark-text">{t('priceCalculator.results.explanation.title')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li dangerouslySetInnerHTML={{ __html: t('priceCalculator.results.explanation.salary') }}></li>
                            <li dangerouslySetInnerHTML={{ __html: t('priceCalculator.results.explanation.fixedCosts') }}></li>
                            {formData.taxRegime === 'mei' && (
                                <li dangerouslySetInnerHTML={{ __html: t('priceCalculator.results.explanation.meiDas', { value: formatCurrency(parseFloat(formData.meiDasValue || '0')) }) }}></li>
                            )}
                        </ul>
                    </div>
               </div>
            </Card>
          </div>
        )}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border text-center">{t('priceCalculator.title')}</h1>
      
      {isMobile && <StepIndicator current={step} total={3} />}

      <form onSubmit={handleCalculate} className="max-w-4xl mx-auto space-y-6">
        {isMobile ? (
          <>
            {step === 1 && (
              <Card title={t("priceCalculator.step1.title")} className="animate-fadeIn">
                {Step1Content}
                <Button type="button" onClick={() => setStep(2)} className="w-full mt-6">{t('common.next')}</Button>
              </Card>
            )}
            {step === 2 && (
              <Card title={t("priceCalculator.step2.title")} className="animate-fadeIn">
                {Step2Content}
                <div className="flex justify-between mt-6">
                  <Button type="button" onClick={() => setStep(1)} variant="secondary">{t('common.previous')}</Button>
                  <Button type="submit" disabled={isFormInvalid}>{t('common.calculate')}</Button>
                </div>
              </Card>
            )}
             {step === 3 && (
              <div className="animate-fadeIn">
                {ResultsStep}
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
                  <Button type="button" onClick={() => setStep(2)} variant="secondary">{t('common.previous')}</Button>
                  <Button type="button" onClick={handleCreateProposal}>{t('priceCalculator.createProposal')}</Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {step !== 3 && (
                <>
                <Card title={t("priceCalculator.step1.title")}>{Step1Content}</Card>
                <Card title={t("priceCalculator.step2.title")} className="mt-6">
                    {Step2Content}
                    <Button type="submit" className="w-full mt-6" disabled={isFormInvalid}>{t('common.calculateFinalPrice')}</Button>
                </Card>
                </>
            )}
            {step === 3 && (
                 <div className="animate-fadeIn">
                    {ResultsStep}
                     <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
                        <Button type="button" onClick={() => setStep(1)} variant="secondary">{t('common.recalculate')}</Button>
                        <Button type="button" onClick={handleCreateProposal}>{t('priceCalculator.createProposal')}</Button>
                    </div>
                </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default ServicePriceCalculator;
