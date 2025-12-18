import { renderHook, act } from '@testing-library/react';
import { useTaxCalculator } from './useTaxCalculator';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useTranslation
vi.mock('./useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
        if (key === 'tax.warning.meiLimit') return `Limit Exceeded: ${params?.revenue}`;
        return key;
    },
  }),
}));

describe('useTaxCalculator', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTaxCalculator());
    
    expect(result.current.formData.monthlyRevenue).toBe('7000');
    expect(result.current.formData.taxRegime).toBe('simples-iii');
  });

  it('should calculate correctly for MEI', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
        // Set MEI regime
        result.current.handleChange({ target: { name: 'taxRegime', value: 'mei' } } as any);
        // Set Revenue within limit (e.g., 5000)
        result.current.handleChange({ target: { name: 'monthlyRevenue', value: '5000' } } as any);
        // Set DAS value
        result.current.handleChange({ target: { name: 'meiDasValue', value: '70' } } as any);
        // Set Service Value
        result.current.handleChange({ target: { name: 'serviceValue', value: '1000' } } as any);
    });

    act(() => {
        result.current.calculateTaxes({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.result).not.toBeNull();
    // Effective Rate = (70 / 5000) * 100 = 1.4%
    expect(result.current.result?.effectiveRate).toBeCloseTo(1.4);
    expect(result.current.result?.monthlyTax).toBe(70);
    // MEI service tax is typically treated as 0 in this specific calculator logic (covered by DAS)
    expect(result.current.result?.serviceTax).toBe(0); 
    expect(result.current.result?.warning).toBeNull();
  });

  it('should show warning for MEI if revenue exceeds limit', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
        result.current.handleChange({ target: { name: 'taxRegime', value: 'mei' } } as any);
        // Exceed monthly limit (approx 6750)
        result.current.handleChange({ target: { name: 'monthlyRevenue', value: '8000' } } as any);
    });

    act(() => {
        result.current.calculateTaxes({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.result?.warning).toContain('Limit Exceeded');
  });

  it('should calculate correctly for Simples Nacional (Anexo III)', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
        result.current.handleChange({ target: { name: 'taxRegime', value: 'simples-iii' } } as any);
        // Annual Revenue = 10,000 * 12 = 120,000 (First Tier)
        // First Tier Limit: 180,000. Rate: 6%. Deduction: 0.
        result.current.handleChange({ target: { name: 'monthlyRevenue', value: '10000' } } as any);
        result.current.handleChange({ target: { name: 'serviceValue', value: '2000' } } as any);
    });

    act(() => {
        result.current.calculateTaxes({ preventDefault: vi.fn() } as any);
    });

    // Effective Rate = ((120,000 * 0.06) - 0) / 120,000 = 0.06 (6%)
    expect(result.current.result?.effectiveRate).toBeCloseTo(6.0);
    expect(result.current.result?.monthlyTax).toBeCloseTo(600); // 6% of 10000
    expect(result.current.result?.serviceTax).toBeCloseTo(120); // 6% of 2000
  });

  it('should calculate correctly for Simples Nacional (Anexo V) with deduction', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
        result.current.handleChange({ target: { name: 'taxRegime', value: 'simples-v' } } as any);
        // Annual Revenue = 20,000 * 12 = 240,000 (Second Tier)
        // Second Tier: Limit 360,000. Rate: 18%. Deduction: 4,500.
        result.current.handleChange({ target: { name: 'monthlyRevenue', value: '20000' } } as any);
    });

    act(() => {
        result.current.calculateTaxes({ preventDefault: vi.fn() } as any);
    });

    // Calculation:
    // Annual R = 240,000
    // Base Tax = 240,000 * 0.18 = 43,200
    // With Deduction = 43,200 - 4,500 = 38,700
    // Effective Rate = 38,700 / 240,000 = 0.16125 (16.125%)
    
    expect(result.current.result?.effectiveRate).toBeCloseTo(16.125);
    
    // Monthly Tax = 20,000 * 0.16125 = 3225
    expect(result.current.result?.monthlyTax).toBeCloseTo(3225);
  });
});