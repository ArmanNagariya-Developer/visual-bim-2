import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query and returns whether it currently matches.
 * SSR-safe (defaults to false on the server / first paint).
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Tablets and smaller — used to simplify heavy 3D. */
export const useIsMobile = () => useMediaQuery('(max-width: 820px)');

/** Small phones — used to trim particle counts further. */
export const useIsSmallMobile = () => useMediaQuery('(max-width: 480px)');

/** True when the user prefers reduced motion. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
