import { useState, useEffect } from 'react';

/**
 * ⚡ Bolt: Custom hook to track matchMedia states efficiently
 * 💡 What: Provides a reactive state for media queries instead of relying on resize listeners.
 * 🎯 Why: Reduces code duplication and centralizes the matchMedia logic.
 */
export function useMediaQuery(query: string, defaultState: boolean = false): boolean {
  const [matches, setMatches] = useState(defaultState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);

    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, [query]);

  return matches;
}
