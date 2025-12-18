
import React, { useState, useCallback, useMemo } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { parseBRL, formatBRL } from '../utils/financial';
import { 
    VariableIncomeFormData, 
    GainsResult, 
    AssetType, 
    OperationType,
    FixedIncomeFormData,
    FixedIncomeResult,
    FixedPeriodUnit
} from '../types/investment';
import { useTranslation } from './useTranslation';

// --- Variable Income Hook ---

const INITIAL_VARIABLE_STATE: VariableIncomeFormData = {
    saleValue: '',
    acquisitionCost: '',
    operationType: 'swing',
    assetType: 'acao'
};

export const useVariableIncome = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useFormPersistence<VariableIncomeFormData>('variableIncomeData', INITIAL_VARIABLE_STATE);
    const [result, setResult] = useState<GainsResult | null>(null);

    const handleChange = useCallback((name: keyof VariableIncomeFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, [setFormData]);

    const handleMonetaryBlur = useCallback((name: 'saleValue' | 'acquisitionCost') => {
        const formatted = formatBRL(formData[name]);
        if (formatted) {
            handleChange(name, formatted);
        } else {
            handleChange(name, '');
        }
    }, [formData, handleChange]);

    const calculateGains = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const numSaleValue = parseFloat(parseBRL(formData.saleValue)) || 0;
        const numAcquisitionCost = parseFloat(parseBRL(formData.acquisitionCost)) || 0;
        const profit = numSaleValue - numAcquisitionCost;
        
        if (profit <= 0) {
            setResult({ grossProfit: profit, taxDue: 0, netValue: numSaleValue, isLoss: true });
            return;
        }
        
        let rate: number;
        if (formData.assetType === 'fii') {
            rate = 0.20;
        } else {
            rate = formData.operationType === 'swing' ? 0.15 : 0.20;
        }

        const taxDue = profit * rate;
        const netValue = numSaleValue - taxDue;
        setResult({ grossProfit: profit, taxDue, netValue, isLoss: false });
    }, [formData]);

    const disclaimer = useMemo(() => {
        return t(`investmentTax.variable.disclaimer.${formData.assetType}`);
    }, [formData.assetType, t]);

    return {
        formData,
        result,
        handleChange,
        handleMonetaryBlur,
        calculateGains,
        disclaimer,
        formatCurrency: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    };
};

// --- Fixed Income Hook ---

const INITIAL_FIXED_STATE: FixedIncomeFormData = {
    grossProfit: '',
    investmentPeriod: '400',
    investmentPeriodUnit: 'days'
};

export const useFixedIncome = () => {
    const [formData, setFormData] = useFormPersistence<FixedIncomeFormData>('fixedIncomeData', INITIAL_FIXED_STATE);
    const [result, setResult] = useState<FixedIncomeResult | null>(null);

    const handleChange = useCallback((name: keyof FixedIncomeFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, [setFormData]);

    const handleMonetaryBlur = useCallback(() => {
        const formatted = formatBRL(formData.grossProfit);
        if (formatted) {
            handleChange('grossProfit', formatted);
        } else {
            handleChange('grossProfit', '');
        }
    }, [formData.grossProfit, handleChange]);

    const calculateFixedIncome = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const numGrossProfit = parseFloat(parseBRL(formData.grossProfit)) || 0;
        const numInvestmentPeriod = parseInt(formData.investmentPeriod, 10) || 0;
        
        if (numGrossProfit <= 0 || numInvestmentPeriod <= 0) {
            setResult(null);
            return;
        }
        
        let totalDays = 0;
        switch(formData.investmentPeriodUnit) {
            case 'days': totalDays = numInvestmentPeriod; break;
            case 'months': totalDays = numInvestmentPeriod * 30; break;
            case 'years': totalDays = numInvestmentPeriod * 365; break;
        }

        let rate = 0;
        if (totalDays <= 180) rate = 0.225;
        else if (totalDays <= 360) rate = 0.20;
        else if (totalDays <= 720) rate = 0.175;
        else rate = 0.15;
        
        const taxDue = numGrossProfit * rate;
        const netProfit = numGrossProfit - taxDue;
        setResult({ appliedRate: rate * 100, taxDue, netProfit });
    }, [formData]);

    return {
        formData,
        result,
        handleChange,
        handleMonetaryBlur,
        calculateFixedIncome,
        formatCurrency: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    };
};
