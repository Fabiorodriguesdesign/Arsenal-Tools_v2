import { useMemo } from 'react';
import { useTranslation } from './useTranslation';
import { useFormPersistence } from './useFormPersistence';
import { calculateCompoundInterest } from '../utils/financial';
import { CompoundInterestFormData } from '../types/compoundInterest';

const INITIAL_STATE: CompoundInterestFormData = {
    initialAmount: '1000',
    monthlyContribution: '200',
    interestRate: '10',
    period: '10',
    periodUnit: 'years',
    investmentType: 'cdb'
};

export const useCompoundInterest = () => {
    const { t } = useTranslation();
    
    const [formData, setFormData] = useFormPersistence<CompoundInterestFormData>(
        'compoundInterestData', 
        INITIAL_STATE
    );

    const setInitialAmount = (val: string) => setFormData(prev => ({ ...prev, initialAmount: val }));
    const setMonthlyContribution = (val: string) => setFormData(prev => ({ ...prev, monthlyContribution: val }));
    const setInterestRate = (val: string) => setFormData(prev => ({ ...prev, interestRate: val }));
    const setPeriod = (val: string) => setFormData(prev => ({ ...prev, period: val }));
    const setPeriodUnit = (val: string) => setFormData(prev => ({ ...prev, periodUnit: val as any }));
    const setInvestmentType = (val: string) => setFormData(prev => ({ ...prev, investmentType: val as any }));

    const investmentTypeDescription = useMemo(() => {
        switch (formData.investmentType) {
            case 'cdb': return t('compoundInterest.desc.cdb');
            case 'lci_lca': return t('compoundInterest.desc.lci_lca');
            case 'savings': return t('compoundInterest.desc.savings');
            case 'generic': return t('compoundInterest.desc.generic');
            default: return '';
        }
    }, [formData.investmentType, t]);

    const calculationResult = useMemo(() => {
        return calculateCompoundInterest(
            formData.initialAmount,
            formData.monthlyContribution,
            formData.interestRate,
            formData.period,
            formData.periodUnit,
            formData.investmentType
        );
    }, [
        formData.initialAmount, 
        formData.monthlyContribution, 
        formData.interestRate, 
        formData.period, 
        formData.periodUnit, 
        formData.investmentType
    ]);

    return {
        // State and Setters
        initialAmount: formData.initialAmount, setInitialAmount,
        monthlyContribution: formData.monthlyContribution, setMonthlyContribution,
        interestRate: formData.interestRate, setInterestRate,
        period: formData.period, setPeriod,
        periodUnit: formData.periodUnit, setPeriodUnit,
        investmentType: formData.investmentType, setInvestmentType,
        
        // Derived data
        investmentTypeDescription,
        ...calculationResult
    };
};