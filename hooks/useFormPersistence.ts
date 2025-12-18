import { useState, useEffect, useCallback } from 'react';

function useFormPersistence<T extends object>(key: string, initialState: T): [T, (value: T | ((val: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedValue = window.localStorage.getItem(key);
        if (storedValue) {
            // Merge stored value with initial state to ensure new fields exist in the state
            // This prevents crashes when adding new fields to an existing form structure
            return { ...initialState, ...JSON.parse(storedValue) };
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
    }
    return initialState;
  });

  useEffect(() => {
    const handler = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
          console.error('Error writing to localStorage', error);
        }
    }, 500); // 500ms debounce delay

    return () => {
        clearTimeout(handler);
    };
  }, [key, state]);

  const setPersistentState = useCallback((value: T | ((val: T) => T)) => {
      setState(value);
  }, []);


  return [state, setPersistentState];
}

export { useFormPersistence };