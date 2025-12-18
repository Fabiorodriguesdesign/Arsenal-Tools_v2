import { renderHook, act } from '@testing-library/react';
import { useColorConverter } from './useColorConverter';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

describe('useColorConverter', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default colors', () => {
    const { result } = renderHook(() => useColorConverter());
    expect(result.current.formData.colors.length).toBeGreaterThan(0);
  });

  it('should add a valid hex color', () => {
    const { result } = renderHook(() => useColorConverter());
    const initialLength = result.current.formData.colors.length;

    act(() => {
      // Manually set the "newColor" input state first (simulating user typing)
      result.current.setFormData(prev => ({ ...prev, newColor: '#123456' }));
    });

    act(() => {
      result.current.addColor();
    });

    expect(result.current.formData.colors.length).toBe(initialLength + 1);
    expect(result.current.formData.colors[result.current.formData.colors.length - 1]).toBe('#123456');
  });

  it('should not add invalid hex color', () => {
    const { result } = renderHook(() => useColorConverter());
    const initialLength = result.current.formData.colors.length;

    act(() => {
        result.current.setFormData(prev => ({ ...prev, newColor: 'invalid' }));
    });

    act(() => {
      result.current.addColor();
    });

    expect(result.current.formData.colors.length).toBe(initialLength);
  });

  it('should remove a color', () => {
    const { result } = renderHook(() => useColorConverter());
    const initialLength = result.current.formData.colors.length;

    act(() => {
      result.current.removeColor(0);
    });

    expect(result.current.formData.colors.length).toBe(initialLength - 1);
  });

  it('should update a color', () => {
    const { result } = renderHook(() => useColorConverter());
    
    act(() => {
      result.current.updateColor(0, '#ABCDEF');
    });

    expect(result.current.formData.colors[0]).toBe('#ABCDEF');
  });
});