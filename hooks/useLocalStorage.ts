
import React, { useState, useEffect } from 'react';

/**
 * Hook para persistir estado no localStorage.
 * Sincroniza automaticamente entre abas e atualiza o estado se o localStorage mudar externamente.
 * 
 * @param key Chave do localStorage
 * @param initialValue Valor inicial (pode ser uma função)
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Inicializa o estado
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage chave "${key}":`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor (wrapper para setState)
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispara evento para sincronizar outras instâncias do hook na mesma aba
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.warn(`Erro ao salvar no localStorage chave "${key}":`, error);
    }
  };

  // Efeito para ouvir mudanças no localStorage (outras abas ou instâncias)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
        // Se for um StorageEvent (outra aba) e a chave coincidir
        if ((e as StorageEvent).key && (e as StorageEvent).key !== key) {
            return;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Erro ao sincronizar localStorage chave "${key}":`, error);
        }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
