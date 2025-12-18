import { renderHook, act, waitFor } from '@testing-library/react';
import { useCurrencyConverter } from './useCurrencyConverter';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Helper to mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('useCurrencyConverter', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockFetch.mockReset();
  });

  it('should fetch currencies on mount', async () => {
    const currencies = { USD: 'United States Dollar', BRL: 'Brazilian Real', EUR: 'Euro' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => currencies,
    });

    const { result } = renderHook(() => useCurrencyConverter());

    // Initial fetch happens automatically
    await waitFor(() => {
      expect(result.current.allCurrencies).toContain('USD');
      expect(result.current.allCurrencies).toContain('BRL');
    });
  });

  it('should fetch conversion rate and calculate', async () => {
    // Mock fetch to handle multiple calls
    mockFetch.mockImplementation((url) => {
        if (url.includes('/currencies')) {
            return Promise.resolve({ ok: true, json: async () => ({ USD: 'Dollar', BRL: 'Real' }) });
        }
        if (url.includes('/latest')) {
             return Promise.resolve({
                 ok: true,
                 json: async () => ({ rates: { USD: 0.2 } }) // 1 BRL = 0.2 USD
             });
        }
        if (url.includes('..')) { // History
             return Promise.resolve({
                 ok: true,
                 json: async () => ({ rates: {} })
             });
        }
        return Promise.reject('Unknown URL');
    });

    const { result } = renderHook(() => useCurrencyConverter());

    // Wait for rate to be fetched
    await waitFor(() => {
        expect(result.current.exchangeRate).toBe(0.2);
    });

    act(() => {
        result.current.setAmount('100');
    });

    // 100 BRL * 0.2 = 20 USD
    expect(result.current.convertedAmount).toBeCloseTo(20);
  });

  it('should swap currencies', () => {
    const { result } = renderHook(() => useCurrencyConverter());
    
    // Setup initial state different from default if needed, or just verify default swap
    act(() => {
        result.current.setFromCurrency('USD');
        result.current.setToCurrency('EUR');
    });

    expect(result.current.formData.fromCurrency).toBe('USD');
    expect(result.current.formData.toCurrency).toBe('EUR');

    act(() => {
        result.current.swapCurrencies();
    });

    expect(result.current.formData.fromCurrency).toBe('EUR');
    expect(result.current.formData.toCurrency).toBe('USD');
  });
});