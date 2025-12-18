import { renderHook, act } from '@testing-library/react';
import { useQrCodeGenerator } from './useQrCodeGenerator';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock qrcode library to avoid canvas issues in test environment
vi.mock('qrcode', () => ({
  default: {
    toCanvas: vi.fn(),
    toDataURL: vi.fn(),
  }
}));

describe('useQrCodeGenerator', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useQrCodeGenerator());
    expect(result.current.formData.text).toBe('https://kitfreelancer.com');
    expect(result.current.formData.darkColor).toBe('#000000');
  });

  it('should update text', () => {
    const { result } = renderHook(() => useQrCodeGenerator());

    act(() => {
      result.current.setText('New Text');
    });

    expect(result.current.formData.text).toBe('New Text');
  });

  it('should update colors', () => {
    const { result } = renderHook(() => useQrCodeGenerator());

    act(() => {
      result.current.setDarkColor('#123456');
      result.current.setLightColor('#654321');
    });

    expect(result.current.formData.darkColor).toBe('#123456');
    expect(result.current.formData.lightColor).toBe('#654321');
  });
});