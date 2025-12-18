
import { describe, it, expect } from 'vitest';
import { convertUnitToPx, calculateAllConversions } from './unitConverter';

describe('Unit Converter Utils', () => {
  describe('convertUnitToPx', () => {
    it('should convert absolute units to pixels correctly', () => {
      // 1 inch = 96px
      expect(convertUnitToPx(1, 'in', 16)).toBeCloseTo(96);
      
      // 1 cm = 96 / 2.54 ~= 37.795
      expect(convertUnitToPx(1, 'cm', 16)).toBeCloseTo(37.795, 3);
      
      // 72 pt = 1 inch = 96px
      expect(convertUnitToPx(72, 'pt', 16)).toBeCloseTo(96);
    });

    it('should convert relative units based on base size', () => {
      const baseSize = 16;
      
      // 1rem = 16px
      expect(convertUnitToPx(1, 'rem', baseSize)).toBe(16);
      
      // 2em = 32px
      expect(convertUnitToPx(2, 'em', baseSize)).toBe(32);
      
      // 100% = 16px
      expect(convertUnitToPx(100, '%', baseSize)).toBe(16);
    });
  });

  describe('calculateAllConversions', () => {
    it('should return an object with all conversions', () => {
      const result = calculateAllConversions(16, 16);
      
      expect(result.px).toBe('16.000');
      expect(result.rem).toBe('1.000');
      expect(result['%']).toBe('100.000');
      
      // 16px is roughly 0.166 inches
      expect(parseFloat(result.in)).toBeCloseTo(0.167, 3);
    });
  });
});
