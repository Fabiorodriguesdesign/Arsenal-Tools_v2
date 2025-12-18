
import { describe, it, expect } from 'vitest';
import { isValidHex, hexToRgbFloat, slugify } from './colorConverter';

describe('Color Converter Utils', () => {
  describe('isValidHex', () => {
    it('should return true for valid hex codes', () => {
      expect(isValidHex('#fff')).toBe(true);
      expect(isValidHex('#FFFFFF')).toBe(true);
      expect(isValidHex('#000000')).toBe(true);
      expect(isValidHex('#ff0000')).toBe(true);
    });

    it('should return false for invalid hex codes', () => {
      expect(isValidHex('fff')).toBe(false); // Missing hash
      expect(isValidHex('#ffff')).toBe(false); // Wrong length
      expect(isValidHex('#gggggg')).toBe(false); // Invalid chars
      expect(isValidHex('')).toBe(false);
    });
  });

  describe('hexToRgbFloat', () => {
    it('should convert hex to normalized RGB float values', () => {
      const white = hexToRgbFloat('#ffffff');
      expect(white).toEqual([1, 1, 1]);

      const black = hexToRgbFloat('#000000');
      expect(black).toEqual([0, 0, 0]);

      // Red #FF0000 -> 255, 0, 0 -> 1, 0, 0
      const red = hexToRgbFloat('#FF0000');
      expect(red).toEqual([1, 0, 0]);
    });

    it('should handle shorthand hex', () => {
      const white = hexToRgbFloat('#fff');
      expect(white).toEqual([1, 1, 1]);
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgbFloat('invalid')).toBeNull();
    });
  });

  describe('slugify', () => {
    it('should convert text to slug format', () => {
      expect(slugify('My Palette')).toBe('my-palette');
      expect(slugify(' Test  Value ')).toBe('test-value');
      expect(slugify('MixedCase_Text')).toBe('mixedcase_text');
    });
  });
});
