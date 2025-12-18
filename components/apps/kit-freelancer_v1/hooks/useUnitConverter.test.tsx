import { renderHook, act } from '@testing-library/react';
import { useUnitConverter } from './useUnitConverter';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useUnitConverter', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUnitConverter());
    expect(result.current.formData.baseSize).toBe('16');
    expect(result.current.formData.unit).toBe('px');
  });

  it('should calculate conversions correctly when inputs change', () => {
    const { result } = renderHook(() => useUnitConverter());

    act(() => {
      result.current.setBaseSize('16');
      result.current.setValueW('16'); // 16px
      result.current.setUnit('px');
    });

    // 16px should be 1rem if base is 16
    expect(result.current.conversions.px.w).toBe('16.000');
    expect(result.current.conversions.rem.w).toBe('1.000');
  });

  it('should handle unit change to relative unit (rem)', () => {
    const { result } = renderHook(() => useUnitConverter());

    act(() => {
      result.current.setBaseSize('16');
      result.current.setUnit('rem');
      result.current.setValueW('2'); // 2rem
    });

    // 2rem * 16px base = 32px
    expect(result.current.conversions.px.w).toBe('32.000');
  });

  it('should disable relative units if useBaseSize is false', () => {
    const { result } = renderHook(() => useUnitConverter());

    act(() => {
      result.current.setUnit('rem');
    });
    
    // Initially allowed
    expect(result.current.formData.unit).toBe('rem');

    act(() => {
      result.current.setUseBaseSize(false);
    });

    // Should fallback to px
    expect(result.current.formData.unit).toBe('px');
  });
});