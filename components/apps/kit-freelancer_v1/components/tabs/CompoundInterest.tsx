

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Update imports to use centralized UI components
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useTranslation } from '../../hooks/useTranslation';
import { InvestmentType, PeriodUnit } from '../../utils/financial';
import { useCompoundInterest } from '../../hooks/useCompoundInterest';

const CompoundInterest: React.FC = () => {
    const { t } = useTranslation();
    const {
        initialAmount, setInitialAmount,
        monthlyContribution, setMonthlyContribution,
        interestRate, setInterestRate,
        period, setPeriod,
        periodUnit, setPeriodUnit,
        investmentType, setInvestmentType,
        investmentTypeDescription,
        chartData,
        totalInvested,
        totalInterest,
        finalAmount,
        incomeTax,
        finalAmountNet
    } = useCompoundInterest();
    
    const isMobile = useMediaQuery('(max-width: 1023px)');
    const [step, setStep] = useState(1);
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const StepIndicator = () => (
        <div className="flex justify-center items-center mb-4">
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-primary' : 'bg-light-border dark:bg-dark-border'}`}></div>
            <div className="w-8 h-px bg-light-border dark:bg-dark-border mx-2"></div>
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-primary' : 'bg-light-border dark:bg-dark-border'}`}></div>
        </div>
    );

    const ConfigStep = (
        <Card className="lg:col-span-1" title={isMobile ? "compoundInterest.step1.title" : "common.configuration"}>
            <div className="space-y-4">
                <Input label="compoundInterest.initialAmount.label" type="number" value={initialAmount} onChange={e => setInitialAmount(e.target.value)} />
                <Input label="compoundInterest.monthlyContribution.label" type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(e.target.value)} />
                <div>
                    <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('compoundInterest.investmentType.label')}</label>
                    <select value={investmentType} onChange={e => setInvestmentType(e.target.value as InvestmentType)} className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none">
                        <option value="cdb">{t('compoundInterest.investmentType.cdb')}</option>
                        <option value="lci_lca">{t('compoundInterest.investmentType.lci_lca')}</option>
                        <option value="savings">{t('compoundInterest.investmentType.savings')}</option>
                        <option value="generic">{t('compoundInterest.investmentType.generic')}</option>
                    </select>
                    {investmentTypeDescription && (
                        <p className="text-xs text-light-muted dark:text-dark-muted mt-2">
                            {investmentTypeDescription}
                        </p>
                    )}
                </div>
                <Input label={t('compoundInterest.interestRate.label', { type: investmentType === 'cdb' ? t('compoundInterest.gross') : '' })} type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                <div className="flex gap-2">
                    <Input label="compoundInterest.duration.label" type="number" value={period} onChange={e => setPeriod(e.target.value)} />
                    <div className="w-full">
                        <label className="block text-sm font-medium text-light-muted dark:text-dark-muted mb-1">{t('compoundInterest.unit.label')}</label>
                        <select value={periodUnit} onChange={e => setPeriodUnit(e.target.value as PeriodUnit)} className="w-full p-2 border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border-light-border dark:border-dark-border transition duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary outline-none">
                            <option value="years">{t('compoundInterest.unit.years')}</option>
                            <option value="months">{t('compoundInterest.unit.months')}</option>
                        </select>
                    </div>
                </div>
            </div>
             {isMobile && <Button onClick={() => setStep(2)} className="w-full mt-6">{t('compoundInterest.simulate')}</Button>}
        </Card>
    );

    const ProjectionStep = (
        <Card className="lg:col-span-2" title={isMobile ? "compoundInterest.step2.title" : "compoundInterest.projection.title"}>
            <div role="status" aria-live="polite" className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-center">
                 <div>
                    <p className="text-sm text-light-muted">{t('compoundInterest.results.totalInvested')}</p>
                    <p className="text-lg font-bold text-light-text dark:text-dark-text">{formatCurrency(totalInvested)}</p>
                </div>
                 <div>
                    <p className="text-sm text-light-muted">{t('compoundInterest.results.grossInterest')}</p>
                    <p className="text-lg font-bold text-secondary">{formatCurrency(totalInterest)}</p>
                </div>
                <div>
                    <p className="text-sm text-light-muted">{t('compoundInterest.results.incomeTax')}</p>
                    <p className="text-lg font-bold text-danger">{formatCurrency(incomeTax)}</p>
                </div>
                <div className="col-span-2 sm:col-span-3">
                    <p className="text-sm text-light-muted">{t('compoundInterest.results.netFinalAmount')}</p>
                    <p className="text-xl sm:text-2xl font-bold text-light-accent-text dark:text-dark-accent-text">{formatCurrency(finalAmountNet)}</p>
                    <p className="text-xs text-light-muted mt-1">({t('compoundInterest.grossAmount')}: {formatCurrency(finalAmount)})</p>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.3)" />
                        <XAxis dataKey="month" label={{ value: t('compoundInterest.unit.months'), position: 'insideBottom', offset: -5 }} stroke="currentColor" />
                        <YAxis tickFormatter={(tick) => formatCurrency(tick)} stroke="currentColor" domain={['dataMin', 'auto']}/>
                        <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} />
                        <Legend />
                        <Line type="monotone" dataKey="grossValue" name={t('compoundInterest.chart.grossValue')} stroke="#f97316" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="netValue" name={t('compoundInterest.chart.netValue')} stroke="#ea580c" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="totalInvested" name={t('compoundInterest.chart.totalInvested')} stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
             {isMobile && <Button onClick={() => setStep(1)} variant="secondary" className="w-full mt-6">{t('common.previous')}</Button>}
        </Card>
    );

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold pb-4 mb-6 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">{t('compoundInterest.title')}</h1>
            
            {isMobile ? (
                <div>
                    <StepIndicator />
                    {step === 1 && <div className="animate-fadeIn">{ConfigStep}</div>}
                    {step === 2 && <div className="animate-fadeIn">{ProjectionStep}</div>}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {ConfigStep}
                    {ProjectionStep}
                </div>
            )}
        </div>
    );
};

export default CompoundInterest;