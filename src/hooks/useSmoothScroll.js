import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * Initialises a global Lenis smooth-scroll instance.
 *
 * - Skips inertia entirely when the user prefers reduced motion (native scroll).
 * - Syncs with GSAP ScrollTrigger if it is present on the page.
 * - Exposes a global helper `window.scrollToSection(id)` for anchor navigation.
 *
 * @returns {void}
 */
export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Honour reduced motion: native scrolling, still smooth via CSS.
      window.scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      };
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1.0,
    });

    lenis.on('scroll', (e) => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.update(e.scroll);
      }
    });

    // Expose the instance so overlay components (menu, modal) can stop/start it.
    window.__lenis = lenis;

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Global anchor navigation used by the navbar / buttons.
    window.scrollToSection = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'home') {
        lenis.scrollTo(0, { duration: 1.3 });
      } else {
        lenis.scrollTo(el, { offset: -64, duration: 1.35 });
      }
    };

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.scrollToSection;
    };
  }, [reduced]);
}
