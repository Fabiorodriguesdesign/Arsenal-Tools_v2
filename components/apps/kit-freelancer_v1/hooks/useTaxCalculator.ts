
import React, { useState, useCallback } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { useTranslation } from './useTranslation';
import { TaxFormData, ResultData, TaxRegime } from '../types/tax';

const SIMPLES_TABLES = {
  'simples-iii': [ // Anexo III - Serviços
    { limit: 180000, rate: 0.060, deduction: 0 },
    { limit: 360000, rate: 0.112, deduction: 9360 },
    { limit: 720000, rate: 0.135, deduction: 17640 },
    { limit: 1800000, rate: 0.160, deduction: 35640 },
    { limit: 3600000, rate: 0.210, deduction: 125640 },
    { limit: 4800000, rate: 0.330, deduction: 648000 },
  ],
  'simples-v': [ // Anexo V - Serviços
    { limit: 180000, rate: 0.155, deduction: 0 },
    { limit: 360000, rate: 0.180, deduction: 4500 },
    { limit: 720000, rate: 0.195, deduction: 9900 },
    { limit: 1800000, rate: 0.205, deduction: 17100 },
    { limit: 3600000, rate: 0.230, deduction: 62100 },
    { limit: 4800000, rate: 0.305, deduction: 540000 },
  ],
};

const INITIAL_STATE: TaxFormData = {
    monthlyRevenue: '7000',
    serviceValue: '2000',
    taxRegime: 'simples-iii',
    meiDasValue: '76.60'
};

export const useTaxCalculator = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useFormPersistence<TaxFormData>('taxCalculatorData', INITIAL_STATE);
  const [result, setResult] = useState<ResultData | null>(null);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const calculateTaxes = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const numMonthlyRevenue = parseFloat(formData.monthlyRevenue) || 0;
    const numServiceValue = parseFloat(formData.serviceValue) || 0;

    if (numMonthlyRevenue <= 0) {
      setResult(null);
      return;
    }
    
    let res: ResultData;

    if (formData.taxRegime === 'mei') {
        const numMeiDasValue = parseFloat(formData.meiDasValue) || 0;
        const MEI_MONTHLY_LIMIT = 6750; // R$ 81.000 / 12
        let warnMsg: string | null = null;

        if (numMonthlyRevenue > MEI_MONTHLY_LIMIT) {
            warnMsg = t('tax.warning.meiLimit', { revenue: formatCurrency(numMonthlyRevenue) });
        }

        res = {
            effectiveRate: numMonthlyRevenue > 0 ? (numMeiDasValue / numMonthlyRevenue) * 100 : 0,
            monthlyTax: numMeiDasValue,
            monthlyNet: numMonthlyRevenue - numMeiDasValue,
            serviceTax: 0,
            serviceNet: numServiceValue,
            warning: warnMsg,
        };

    } else { // Simples Nacional logic
        let calculatedRate = 0;
        let warnMsg: string | null = null;
        
        const annualRevenue = numMonthlyRevenue * 12;
        const regimeKey = formData.taxRegime as keyof typeof SIMPLES_TABLES;
        const table = SIMPLES_TABLES[regimeKey];
        const tier = table.find(t => annualRevenue <= t.limit);
        
        if (tier) {
            calculatedRate = ((annualRevenue * tier.rate) - tier.deduction) / annualRevenue;
        } else {
            warnMsg = t('tax.warning.simplesLimit');
            calculatedRate = 0;
        }

        if (formData.taxRegime === 'simples-v' && !warnMsg) {
            warnMsg = t('tax.warning.factorR');
        }

        res = {
            effectiveRate: calculatedRate * 100,
            monthlyTax: numMonthlyRevenue * calculatedRate,
            monthlyNet: numMonthlyRevenue - (numMonthlyRevenue * calculatedRate),
            serviceTax: numServiceValue * calculatedRate,
            serviceNet: numServiceValue - (numServiceValue * calculatedRate),
            warning: warnMsg,
        };
    }

    setResult(res);
  }, [formData, t]);

  return {
      formData,
      result,
      handleChange,
      calculateTaxes,
      formatCurrency
  };
};
