import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useServicePriceCalculator } from './useServicePriceCalculator';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useTranslation
vi.mock('./useTranslation', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe('useServicePriceCalculator', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useServicePriceCalculator());
    
    expect(result.current.formData.monthlySalary).toBe('5000');
    expect(result.current.formData.taxRegime).toBe('simples');
  });

  it('should update form data and validate inputs', () => {
    const { result } = renderHook(() => useServicePriceCalculator());

    act(() => {
      // Valid input
      result.current.handleInputChange('monthlySalary')({ target: { value: '8000' } } as any);
    });
    expect(result.current.formData.monthlySalary).toBe('8000');
    expect(result.current.errors.monthlySalary).toBeNull();

    act(() => {
        // Invalid input (negative)
        result.current.handleInputChange('fixedCosts')({ target: { value: '-100' } } as any);
    });
    expect(result.current.errors.fixedCosts).toBe('validation.negative');
  });

  it('should update suggestion based on profession', () => {
      const { result } = renderHook(() => useServicePriceCalculator());

      act(() => {
          result.current.handleInputChange('profession')({ target: { value: 'developer' } } as any);
          result.current.handleInputChange('experienceLevel')({ target: { value: 'senior' } } as any);
      });

      // Check if salary updated to developer senior rate (defined in hook constant)
      expect(result.current.formData.monthlySalary).toBe('10000');
      expect(result.current.formData.hoursPerDay).toBe('8');
  });

  it('should perform calculation correctly', () => {
    const { result } = renderHook(() => useServicePriceCalculator());

    // Setup basic valid data
    act(() => {
        result.current.handleInputChange('monthlySalary')({ target: { value: '5000' } } as any);
        result.current.handleInputChange('fixedCosts')({ target: { value: '1000' } } as any);
        result.current.handleInputChange('workDaysPerMonth')({ target: { value: '20' } } as any);
        result.current.handleInputChange('hoursPerDay')({ target: { value: '5' } } as any); 
        // Total monthly hours = 100.
        // Total monthly cost = 6000. 
        // Base Hourly Rate = 60.
        
        result.current.handleInputChange('projectTime')({ target: { value: '10' } } as any); // 10 hours
        result.current.handleInputChange('projectTimeUnit')({ target: { value: 'hours' } } as any);
        // Base Project Cost = 600.
        
        result.current.handleInputChange('profitMargin')({ target: { value: '50' } } as any);
        // Price with Profit (before tax) = 600 * 1.5 = 900.
        
        result.current.handleInputChange('taxRegime')({ target: { value: 'simples' } } as any);
        result.current.handleInputChange('effectiveTaxRate')({ target: { value: '10' } } as any); 
        // Final Price Calculation with Tax Markup:
        // Final Price = PriceWithProfit / (1 - TaxRate)
        // Final Price = 900 / (1 - 0.10) = 900 / 0.9 = 1000.
    });

    act(() => {
      const success = result.current.calculate();
      expect(success).toBe(true);
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.baseHourlyRate).toBe(60);
    expect(result.current.result?.baseProjectCost).toBe(600);
    expect(result.current.result?.suggestedProjectPrice).toBeCloseTo(1000);
    
    // Estimated Tax = 1000 * 10% = 100
    expect(result.current.result?.estimatedTax).toBeCloseTo(100);
    
    // Net Profit = Final Price - Base Cost - Tax
    // 1000 - 600 - 100 = 300.
    expect(result.current.result?.totalProfit).toBeCloseTo(300);
  });
});