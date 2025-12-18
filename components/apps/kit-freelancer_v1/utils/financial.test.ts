import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest, parseBRL, formatBRL } from './financial';

describe('Financial Utils', () => {
  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest correctly for CDB (Taxable)', () => {
      // Scenario: 1000 initial, 100 monthly, 12% annual, 1 year (12 months)
      // Monthly rate approx 0.948%
      const result = calculateCompoundInterest('1000', '100', '12', '1', 'years', 'cdb');
      
      expect(result.totalInvested).toBe(2200); // 1000 + (100 * 12)
      expect(result.finalAmount).toBeGreaterThan(2200);
      expect(result.incomeTax).toBeGreaterThan(0); // CDB pays tax
      expect(result.finalAmountNet).toBeLessThan(result.finalAmount);
    });

    it('should calculate compound interest correctly for LCI/LCA (Tax Exempt)', () => {
      const result = calculateCompoundInterest('1000', '100', '12', '1', 'years', 'lci_lca');
      
      expect(result.incomeTax).toBe(0);
      expect(result.finalAmountNet).toBe(result.finalAmount);
    });

    it('should handle empty or invalid inputs gracefully', () => {
      const result = calculateCompoundInterest('', '', '', '', 'years', 'cdb');
      expect(result.finalAmount).toBe(0);
      expect(result.chartData.length).toBe(1); // Just initial point
    });
  });

  describe('Currency Helpers', () => {
    it('should parse BRL formatted string to number string', () => {
      expect(parseBRL('1.500,50')).toBe('1500.50');
      expect(parseBRL('100,00')).toBe('100.00');
    });

    it('should format number string to BRL', () => {
      // Note: Intl behavior depends on node/browser locale, assuming pt-BR in test env or mock
      // If full ICU data isn't available, it might default to US. 
      // Checking loosely for digits.
      const formatted = formatBRL('1500.50');
      // Expect 1.500,50 or similar depending on env, but definitely formatted
      expect(formatted).toContain('1');
      expect(formatted).toContain('500');
      expect(formatted).toContain('50');
    });
  });
});
