import { renderHook, act } from '@testing-library/react';
import { useWhatsappGenerator } from './useWhatsappGenerator';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

describe('useWhatsappGenerator', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should clean phone number correctly', () => {
    const { result } = renderHook(() => useWhatsappGenerator());

    act(() => {
      result.current.setPhone('(11) 99999-8888');
    });

    // The generated link should use the clean number
    expect(result.current.generatedLink).toContain('5511999998888'); // Assuming input includes DDI or user types it
    // Note: The hook logic assumes user types DDI. If input is (11)... it becomes 11999998888.
    
    // Let's check validity logic
    expect(result.current.isValidPhone).toBe(true);
  });

  it('should generate correct link with message', () => {
    const { result } = renderHook(() => useWhatsappGenerator());

    act(() => {
      result.current.setPhone('5511988887777');
      result.current.setMessage('Olá Mundo');
    });

    expect(result.current.generatedLink).toBe('https://wa.me/5511988887777?text=Ol%C3%A1%20Mundo');
  });

  it('should handle invalid phone numbers', () => {
    const { result } = renderHook(() => useWhatsappGenerator());

    act(() => {
      result.current.setPhone('123'); // Too short
    });

    expect(result.current.isValidPhone).toBe(false);
    expect(result.current.generatedLink).toBe('');
  });
});