import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', listener);
    } else {
        mediaQueryList.addListener(listener); // Deprecated fallback
    }

    return () => {
         if (mediaQueryList.removeEventListener) {
            mediaQueryList.removeEventListener('change', listener);
        } else {
            mediaQueryList.removeListener(listener); // Deprecated fallback
        }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
