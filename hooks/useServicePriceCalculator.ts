
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { FormData, ResultData } from '../types/servicePrice';

// Suggested rates in BRL for common internet professions
const SUGGESTED_RATES: Record<string, Record<string, { monthlySalary: string; hoursPerDay: string }>> = {
  'designer': {
    'junior': { monthlySalary: '2500', hoursPerDay: '6' },
    'mid': { monthlySalary: '5000', hoursPerDay: '7' },
    'senior': { monthlySalary: '8000', hoursPerDay: '8' },
  },
  'developer': {
    'junior': { monthlySalary: '3000', hoursPerDay: '6' },
    'mid': { monthlySalary: '6000', hoursPerDay: '7' },
    'senior': { monthlySalary: '10000', hoursPerDay: '8' },
  },
  'content-creator': {
    'junior': { monthlySalary: '2000', hoursPerDay: '5' },
    'mid': { monthlySalary: '4000', hoursPerDay: '6' },
    'senior': { monthlySalary: '7000', hoursPerDay: '7' },
  },
  'marketing-specialist': {
    'junior': { monthlySalary: '2800', hoursPerDay: '6' },
    'mid': { monthlySalary: '5500', hoursPerDay: '7' },
    'senior': { monthlySalary: '9000', hoursPerDay: '8' },
  },
};

export const useServicePriceCalculator = () => {
  const [formData, setFormData] = useFormPersistence<FormData>('servicePriceCalculatorForm', {
    monthlySalary: '5000',
    fixedCosts: '1000',
    workDaysPerMonth: '22',
    hoursPerDay: '6',
    projectTime: '40',
    projectTimeUnit: 'hours',
    profitMargin: '20',
    taxRegime: 'simples',
    meiDasValue: '76.60',
    effectiveTaxRate: '6',
    profession: '',
    experienceLevel: '',
    serviceName: '',
  });

  const [result, setResult] = useState<ResultData | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validateField = useCallback((value: string, allowEmpty?: boolean): string | null => {
    if (!allowEmpty && (!value || value.trim() === '')) return 'validation.required';
    if (!value || value.trim() === '') return null; // Allow empty if specified
    const num = parseFloat(value);
    if (isNaN(num)) return 'validation.number';
    if (num < 0) return 'validation.negative';
    return null;
  }, []);

  const handleInputChange = (name: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only validate numeric fields immediately
    if (['monthlySalary', 'fixedCosts', 'workDaysPerMonth', 'hoursPerDay', 'projectTime', 'profitMargin', 'meiDasValue', 'effectiveTaxRate'].includes(name)) {
        setErrors((prev) => ({ ...prev, [name]: validateField(value) }));
    } else if (name === 'profession' || name === 'experienceLevel' || name === 'serviceName') {
        setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const isFormInvalid = useMemo(() => {
    const fieldsToValidate: Array<keyof FormData> = ['monthlySalary', 'fixedCosts', 'workDaysPerMonth', 'hoursPerDay', 'projectTime', 'profitMargin'];
    if (formData.taxRegime === 'mei') fieldsToValidate.push('meiDasValue');
    if (formData.taxRegime === 'simples') fieldsToValidate.push('effectiveTaxRate');

    return fieldsToValidate.some((key) => validateField(formData[key] as string) !== null);
  }, [formData, validateField]);

  // Validation Effect
  useEffect(() => {
    const newErrors: Record<string, string | null> = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (typeof formData[key] === 'string') {
        if (key === 'meiDasValue' && formData.taxRegime !== 'mei') {
          newErrors[key] = null;
        } else if (key === 'effectiveTaxRate' && formData.taxRegime !== 'simples') {
          newErrors[key] = null;
        } else if (!['profession', 'experienceLevel', 'serviceName'].includes(key)) {
          newErrors[key] = validateField(formData[key] as string);
        }
      }
    });
    setErrors(newErrors);
  }, [formData, validateField]);

  const totalMonthlyHours = useMemo(() => {
    const days = parseFloat(formData.workDaysPerMonth) || 0;
    const hours = parseFloat(formData.hoursPerDay) || 0;
    return days * hours;
  }, [formData.workDaysPerMonth, formData.hoursPerDay]);

  // Suggestion Effect
  useEffect(() => {
    const { profession, experienceLevel } = formData;
    if (profession && experienceLevel && SUGGESTED_RATES[profession] && SUGGESTED_RATES[profession]?.[experienceLevel]) {
      const suggested = SUGGESTED_RATES[profession]?.[experienceLevel];
      if (suggested) {
        setFormData((prev) => ({
          ...prev,
          monthlySalary: suggested.monthlySalary,
          hoursPerDay: suggested.hoursPerDay,
        }));
      }
    }
  }, [formData.profession, formData.experienceLevel, setFormData]);

  const calculate = useCallback(() => {
    if (isFormInvalid) return false;

    const numMonthlySalary = parseFloat(formData.monthlySalary) || 0;
    const numFixedCosts = parseFloat(formData.fixedCosts) || 0;
    const numHoursPerDay = parseFloat(formData.hoursPerDay) || 8;
    const numProjectTime = parseFloat(formData.projectTime) || 0;
    const numProfitMargin = parseFloat(formData.profitMargin) || 0;
    const numMeiDasValue = parseFloat(formData.meiDasValue) || 0;
    const numEffectiveTaxRate = parseFloat(formData.effectiveTaxRate) || 0;

    const isMei = formData.taxRegime === 'mei';
    const totalMonthlyCosts = numMonthlySalary + numFixedCosts + (isMei ? numMeiDasValue : 0);
    const baseHourlyRate = totalMonthlyHours > 0 ? totalMonthlyCosts / totalMonthlyHours : 0;

    const totalProjectHours = formData.projectTimeUnit === 'days' ? numProjectTime * numHoursPerDay : numProjectTime;
    const baseProjectCost = baseHourlyRate * totalProjectHours;

    const priceWithProfit = baseProjectCost * (1 + numProfitMargin / 100);

    let finalPrice = priceWithProfit;
    let taxAmount = 0;

    if (!isMei) {
      const taxRateDecimal = numEffectiveTaxRate / 100;
      if (taxRateDecimal > 0 && taxRateDecimal < 1) {
        finalPrice = priceWithProfit / (1 - taxRateDecimal);
        taxAmount = finalPrice * taxRateDecimal;
      }
    }

    const profitValue = finalPrice - baseProjectCost - taxAmount;
    const netProjectRevenue = finalPrice - taxAmount;

    setResult({
      suggestedProjectPrice: finalPrice,
      baseProjectCost: baseProjectCost,
      estimatedTax: taxAmount,
      totalProfit: profitValue,
      baseHourlyRate: baseHourlyRate,
      netProjectRevenue: netProjectRevenue,
    });
    return true;
  }, [formData, totalMonthlyHours, isFormInvalid]);

  return {
      formData,
      result,
      errors,
      totalMonthlyHours,
      isFormInvalid,
      handleInputChange,
      calculate
  };
};