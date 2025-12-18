import { useState, useRef, useCallback } from 'react';

export const useScrollReveal = <T extends HTMLElement,>(): [(node: T | null) => void, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (observerRef.current && node) {
            observerRef.current.unobserve(node);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );

    if (node) {
      observerRef.current.observe(node);
    }
  }, []);

  return [setRef, isVisible];
};