import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { company } from '../data/company';
import { useActiveSection } from '../hooks/useActiveSection';
import { useIsMobile } from '../hooks/useMediaQuery';
import Icon from './Icon';
import MagneticButton from './MagneticButton';
import Corners from './Corners';

const NAV_IDS = company.nav.map((n) => n.id);

function LogoMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 3 27 9.5v13L16 29 5 22.5v-13z" />
      <path d="M5 9.5 16 16l11-6.5M16 16v13" opacity="0.65" />
      <path d="M11 12.5v6M21 12.5v6" opacity="0.4" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { active } = useActiveSection(NAV_IDS);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    const body = document.body;
    if (menuOpen) {
      body.classList.add('lenis-stopped');
      window.__lenis?.stop?.();
    } else {
      body.classList.remove('lenis-stopped');
      window.__lenis?.start?.();
    }
    return () => {
      body.classList.remove('lenis-stopped');
      window.__lenis?.start?.();
    };
  }, [menuOpen]);

  const go = (id) => {
    setMenuOpen(false);
    // allow the overlay to begin closing before scrolling
    requestAnimationFrame(() => window.scrollToSection?.(id));
  };

  const handleNav = (e, id) => {
    e.preventDefault();
    go(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-[60]"
      >
        <div
          className={`relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled || menuOpen
              ? 'border-b border-line/10 bg-black-900/88 backdrop-blur-xl'
              : 'border-b border-transparent bg-black-900/40 backdrop-blur-sm'
          }`}
        >
          {/* hairline gold rule under the bar when scrolled */}
          {scrolled && !menuOpen && (
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden />
          )}
          <div
            className={`mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 transition-all duration-500 sm:px-8 lg:px-12 ${
              scrolled ? 'h-16' : 'h-20'
            }`}
          >
            {/* ---- Brand ---- */}
            <a
              href="#home"
              onClick={(e) => handleNav(e, 'home')}
              className="group relative flex items-center gap-3"
              aria-label="Visual BIM — home"
            >
              <span className="relative flex h-9 w-9 items-center justify-center text-warm transition-colors duration-300 group-hover:text-gold">
                <span className="absolute inset-0 border border-line/20 transition-colors duration-300 group-hover:border-gold/60" />
                <LogoMark className="h-5 w-5" />
                {/* small gold architectural accent */}
                <span className="absolute -bottom-px -right-px h-1.5 w-1.5 bg-gold" aria-hidden />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[0.95rem] font-semibold tracking-[0.2em] text-warm">
                  VISUAL BIM
                </span>
                <span className="label mt-1.5 text-[0.5rem] text-concrete" style={{ letterSpacing: '0.28em' }}>
                  DIGITAL CONSTRUCTION
                </span>
              </span>
            </a>

            {/* ---- Desktop nav ---- */}
            {!isMobile && (
              <nav className="relative flex items-center gap-1">
                {company.nav.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleNav(e, item.id)}
                      className={`relative px-4 py-2 text-[0.8rem] font-medium tracking-[0.1em] transition-colors duration-300 ${
                        isActive ? 'text-warm' : 'text-concrete-light hover:text-gold'
                      }`}
                    >
                      {item.label.toUpperCase()}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute -bottom-0.5 left-4 right-4 h-px bg-gold"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  );
                })}
              </nav>
            )}

            {/* ---- CTA / hamburger ---- */}
            <div className="flex items-center gap-3">
              {!isMobile && (
                <MagneticButton
                  variant="primary"
                  className="!px-5 !py-2.5 !text-[0.7rem]"
                  onClick={() => go('contact')}
                  strength={0.35}
                >
                  Start a Project
                </MagneticButton>
              )}

              {isMobile && (
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  className="relative flex h-11 w-11 items-center justify-center border border-line/20 text-warm transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <Corners size="w-2 h-2" />
                  <Icon name={menuOpen ? 'x' : 'menu'} size={19} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ---- Mobile overlay ---- */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.001 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] flex flex-col bg-black-950/97 backdrop-blur-xl"
          >
            <div className="blueprint-fine absolute inset-0 opacity-60" aria-hidden />
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="animate-scanline absolute left-0 h-px w-full bg-gold/30" />
            </div>

            <div className="relative flex h-20 items-center justify-between px-5">
              <span className="font-display text-[0.95rem] font-semibold tracking-[0.2em] text-warm">VISUAL BIM</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center border border-line/20 text-warm"
              >
                <Icon name="x" size={19} />
              </button>
            </div>

            <nav className="relative flex flex-1 flex-col justify-center gap-1 px-5">
              {company.nav.map((item, i) => {
                const isActive = active === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNav(e, item.id)}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: reduced ? 0.001 : 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.06 * i + 0.1,
                    }}
                    className="group flex items-center justify-between border-b border-line/10 py-5"
                  >
                    <span
                      className={`font-display text-3xl font-semibold tracking-tight transition-colors duration-300 ${
                        isActive ? 'text-gold' : 'text-warm group-hover:text-gold'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="label text-[0.6rem] text-concrete">0{i + 1}</span>
                  </motion.a>
                );
              })}
            </nav>

            <div className="relative px-5 pb-10">
              <MagneticButton variant="primary" className="w-full" onClick={() => go('contact')}>
                Start a Project
              </MagneticButton>
              <p className="label mt-6 text-center text-concrete">
                {company.email.value}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
