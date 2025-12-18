
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { FormData, ResultData } from '../types/servicePrice';
import { calculateServicePrice, ServicePriceInput } from '../utils/financial';

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
    if (!value || value.trim() === '') return null; 
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

    if (['monthlySalary', 'fixedCosts', 'workDaysPerMonth', 'hoursPerDay', 'projectTime', 'profitMargin', 'meiDasValue', 'effectiveTaxRate'].includes(name)) {
        setErrors((prev) => ({ ...prev, [name]: validateField(value) }));
    } else {
        setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const isFormInvalid = useMemo(() => {
    const fieldsToValidate: Array<keyof FormData> = ['monthlySalary', 'fixedCosts', 'workDaysPerMonth', 'hoursPerDay', 'projectTime', 'profitMargin'];
    if (formData.taxRegime === 'mei') fieldsToValidate.push('meiDasValue');
    if (formData.taxRegime === 'simples') fieldsToValidate.push('effectiveTaxRate');

    return fieldsToValidate.some((key) => validateField(formData[key] as string) !== null);
  }, [formData, validateField]);

  useEffect(() => {
    const newErrors: Record<string, string | null> = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const val = formData[key];
      if (typeof val === 'string') {
        if (key === 'meiDasValue' && formData.taxRegime !== 'mei') {
          newErrors[key] = null;
        } else if (key === 'effectiveTaxRate' && formData.taxRegime !== 'simples') {
          newErrors[key] = null;
        } else if (!['profession', 'experienceLevel', 'serviceName'].includes(key)) {
          newErrors[key] = validateField(val);
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

  useEffect(() => {
    const { profession, experienceLevel } = formData;
    if (profession && experienceLevel) {
      const professionRates = SUGGESTED_RATES[profession];
      if (professionRates) {
          const suggested = professionRates[experienceLevel];
          if (suggested) {
            setFormData((prev) => ({
              ...prev,
              monthlySalary: suggested.monthlySalary,
              hoursPerDay: suggested.hoursPerDay,
            }));
          }
      }
    }
  }, [formData.profession, formData.experienceLevel, setFormData]);

  const calculate = useCallback(() => {
    if (isFormInvalid) return false;

    const input: ServicePriceInput = {
        monthlySalary: parseFloat(formData.monthlySalary) || 0,
        fixedCosts: parseFloat(formData.fixedCosts) || 0,
        hoursPerDay: parseFloat(formData.hoursPerDay) || 8,
        workDaysPerMonth: parseFloat(formData.workDaysPerMonth) || 0,
        projectTime: parseFloat(formData.projectTime) || 0,
        projectTimeUnit: formData.projectTimeUnit,
        profitMargin: parseFloat(formData.profitMargin) || 0,
        taxRegime: formData.taxRegime,
        meiDasValue: parseFloat(formData.meiDasValue) || 0,
        effectiveTaxRate: parseFloat(formData.effectiveTaxRate) || 0,
    };

    const calculationResult = calculateServicePrice(input);
    setResult(calculationResult);
    return true;
  }, [formData, isFormInvalid]);

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
