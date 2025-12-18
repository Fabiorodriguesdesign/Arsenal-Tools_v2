import { renderHook, act } from '@testing-library/react';
import { useVariableIncome, useFixedIncome } from './useInvestmentTax';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('useInvestmentTax', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('useVariableIncome', () => {
    it('should initialize correctly', () => {
      const { result } = renderHook(() => useVariableIncome());
      expect(result.current.formData.assetType).toBe('acao');
    });

    it('should format values on blur', () => {
      const { result } = renderHook(() => useVariableIncome());
      act(() => {
        result.current.handleChange('saleValue', '1000'); // Raw input
        result.current.handleMonetaryBlur('saleValue');
      });
      // Check if it formats correctly (basic check for separator presence)
      expect(result.current.formData.saleValue).toMatch(/1\.?000,00/);
    });

    it('should calculate tax for swing trade stocks (15%)', () => {
      const { result } = renderHook(() => useVariableIncome());
      act(() => {
        result.current.handleChange('saleValue', '20.000,00');
        result.current.handleChange('acquisitionCost', '10.000,00');
        result.current.handleChange('operationType', 'swing');
        result.current.handleChange('assetType', 'acao');
      });

      act(() => {
        result.current.calculateGains({ preventDefault: vi.fn() } as any);
      });

      // Profit 10k. Tax 15% = 1.5k. Net Value (Sale - Tax) = 18.5k
      expect(result.current.result?.grossProfit).toBe(10000);
      expect(result.current.result?.taxDue).toBe(1500);
      expect(result.current.result?.netValue).toBe(18500);
    });

    it('should handle loss correctly', () => {
      const { result } = renderHook(() => useVariableIncome());
      act(() => {
        result.current.handleChange('saleValue', '5.000,00');
        result.current.handleChange('acquisitionCost', '10.000,00');
      });

      act(() => {
        result.current.calculateGains({ preventDefault: vi.fn() } as any);
      });

      expect(result.current.result?.isLoss).toBe(true);
      expect(result.current.result?.taxDue).toBe(0);
      expect(result.current.result?.grossProfit).toBe(-5000);
    });
  });

  describe('useFixedIncome', () => {
    it('should calculate tax based on duration (regressive table)', () => {
      const { result } = renderHook(() => useFixedIncome());
      
      // Case 1: < 180 days (22.5%)
      act(() => {
        result.current.handleChange('grossProfit', '1.000,00');
        result.current.handleChange('investmentPeriod', '100');
        result.current.handleChange('investmentPeriodUnit', 'days');
      });
      act(() => {
        result.current.calculateFixedIncome({ preventDefault: vi.fn() } as any);
      });
      expect(result.current.result?.appliedRate).toBe(22.5);
      expect(result.current.result?.taxDue).toBe(225);

      // Case 2: > 720 days (15%)
      act(() => {
        result.current.handleChange('investmentPeriod', '800');
      });
      act(() => {
        result.current.calculateFixedIncome({ preventDefault: vi.fn() } as any);
      });
      expect(result.current.result?.appliedRate).toBe(15);
      expect(result.current.result?.taxDue).toBe(150);
    });
  });
});