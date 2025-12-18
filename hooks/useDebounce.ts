import { useState, useEffect } from 'react';

/**
 * Hook personalizado para "debounce" um valor.
 * Retorna um valor que só é atualizado após um atraso (delay) especificado
 * desde a última vez que o valor original mudou.
 * Útil para otimizar eventos como buscas em tempo real.
 *
 * @param value O valor a ser "debounced".
 * @param delay O atraso em milissegundos.
 * @returns O valor "debounced".
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpeza: Cancela o timer se o valor mudar antes do atraso ou se o componente for desmontado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
