/**
 * Hero — the signature section.
 *
 * Layering (back → front):
 *   1. Blueprint composition: drawing grid, self-drawing floor plan,
 *      dimension lines, survey coordinates, north arrow
 *   2. 3D BIM building canvas (black + gold palette)
 *   3. Left-edge readability mask
 *   4. Content: headline (gold keyword), copy, CTAs, spec chips
 *   5. Right: live "model state" HUD card driven by the 3D stage ref
 *   6. Bottom: scroll cue + drawing-style coordinate readouts
 */
import { Suspense, useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import BIMScene from '../three/BIMScene';
import StaticBuilding from './StaticBuilding';
import { useIsMobile, useIsSmallMobile } from '../hooks/useMediaQuery';
import { Reveal, RevealText } from './Reveal';
import MagneticButton from './MagneticButton';
import Icon from './Icon';
import Corners from './Corners';

const EASE = [0.16, 1, 0.3, 1];

const STAGES = [
  { name: 'POINT CLOUD', note: 'Reality capture' },
  { name: 'SCANNED STRUCTURE', note: 'Registered data' },
  { name: 'WIREFRAME', note: 'CAD geometry' },
  { name: 'BIM MODEL', note: 'Parametric' },
  { name: 'DIGITAL BUILDING', note: 'Coordinated' },
];

/** Self-drawing architectural floor plan (right side, behind the 3D model). */
function FloorPlan({ reduced }) {
  const draw = (delay) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 2.4, ease: EASE, delay },
        };

  return (
    <svg
      viewBox="0 0 640 460"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* site boundary */}
      <motion.rect x="60" y="50" width="520" height="360" fill="none" stroke="rgba(232,228,216,0.16)" strokeWidth="1" {...draw(0.2)} />
      <motion.rect x="72" y="62" width="496" height="336" fill="none" stroke="rgba(232,228,216,0.08)" strokeWidth="1" {...draw(0.5)} />

      {/* building footprint */}
      <motion.rect x="180" y="120" width="280" height="220" fill="none" stroke="rgba(232,228,216,0.34)" strokeWidth="1.4" {...draw(0.9)} />
      {/* interior walls */}
      <motion.g stroke="rgba(232,228,216,0.16)" strokeWidth="1" fill="none">
        <motion.line x1="180" y1="230" x2="460" y2="230" {...draw(1.5)} />
        <motion.line x1="320" y1="120" x2="320" y2="230" {...draw(1.7)} />
        <motion.line x1="320" y1="230" x2="320" y2="340" {...draw(1.9)} />
        <motion.line x1="180" y1="290" x2="320" y2="290" {...draw(2.1)} />
        <motion.line x1="460" y1="180" x2="460" y2="290" {...draw(2.2)} />
      </motion.g>

      {/* door swings */}
      <motion.g stroke="rgba(201,162,39,0.5)" strokeWidth="1" fill="none">
        <motion.path d="M320 230 A34 34 0 0 1 286 196" {...draw(2.4)} />
        <motion.path d="M320 290 A34 34 0 0 0 354 324" {...draw(2.6)} />
      </motion.g>

      {/* dimension line — bottom */}
      <motion.g stroke="rgba(201,162,39,0.55)" strokeWidth="1" fill="none">
        <motion.line x1="180" y1="372" x2="460" y2="372" {...draw(2.8)} />
        <motion.line x1="180" y1="366" x2="180" y2="378" {...draw(2.8)} />
        <motion.line x1="460" y1="366" x2="460" y2="378" {...draw(2.8)} />
      </motion.g>
      <motion.text x="320" y="366" textAnchor="middle" fill="rgba(201,162,39,0.8)" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="2"
        {...(reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 3.1, duration: 0.8 } })}
      >
        28 400
      </motion.text>

      {/* dimension line — left */}
      <motion.g stroke="rgba(201,162,39,0.4)" strokeWidth="1" fill="none">
        <motion.line x1="136" y1="120" x2="136" y2="340" {...draw(3.0)} />
        <motion.line x1="130" y1="120" x2="142" y2="120" {...draw(3.0)} />
        <motion.line x1="130" y1="340" x2="142" y2="340" {...draw(3.0)} />
      </motion.g>

      {/* north arrow */}
      <motion.g transform="translate(560,84)" className="animate-north" style={{ transformOrigin: '560px 84px' }}>
        <circle r="16" fill="none" stroke="rgba(232,228,216,0.3)" strokeWidth="1" />
        <path d="M0 -12 L5 6 L0 2 L-5 6 Z" fill="rgba(201,162,39,0.9)" />
        <text y="-22" textAnchor="middle" fill="rgba(232,228,216,0.55)" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="2">N</text>
      </motion.g>

      {/* survey marks */}
      <motion.g stroke="rgba(232,228,216,0.3)" strokeWidth="1" fill="none">
        <motion.path d="M60 50 h10 M60 50 v10" {...draw(0.3)} />
        <motion.path d="M580 50 h-10 M580 50 v10" {...draw(0.3)} />
        <motion.path d="M60 410 h10 M60 410 v-10" {...draw(0.3)} />
        <motion.path d="M580 410 h-10 M580 410 v-10" {...draw(0.3)} />
      </motion.g>

      {/* level annotation */}
      <motion.g {...(reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 3.3, duration: 0.8 } })}>
        <line x1="470" y1="150" x2="530" y2="150" stroke="rgba(232,228,216,0.25)" strokeWidth="1" />
        <text x="536" y="153" fill="rgba(232,228,216,0.45)" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">LEVEL 01</text>
        <line x1="470" y1="310" x2="530" y2="310" stroke="rgba(232,228,216,0.25)" strokeWidth="1" />
        <text x="536" y="313" fill="rgba(232,228,216,0.45)" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">LEVEL 02</text>
      </motion.g>
    </svg>
  );
}

function ModelStateHUD({ stageRef }) {
  const [index, setIndex] = useState(0);
  const [frac, setFrac] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const s = stageRef?.current ?? 0;
      setIndex(Math.min(4, Math.floor(s + 0.45)));
      setFrac(s / 4);
    }, 150);
    return () => clearInterval(id);
  }, [stageRef]);

  return (
    <div className="panel relative w-[15rem] rounded-[4px] p-5 sm:w-[17rem]">
      <Corners />
      <div className="mb-4 flex items-center justify-between">
        <span className="label text-concrete">Model State</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-gold" />
          <span className="label text-gold">LIVE</span>
        </span>
      </div>

      <div className="space-y-2">
        {STAGES.map((s, i) => {
          const on = i === index;
          const done = i < index;
          return (
            <div key={s.name} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 flex-none items-center justify-center border text-[0.6rem] transition-colors duration-300 ${
                  on
                    ? 'border-gold text-gold'
                    : done
                      ? 'border-gold/30 text-gold/60'
                      : 'border-concrete/25 text-concrete/40'
                }`}
              >
                {done ? '✓' : `0${i + 1}`}
              </span>
              <span
                className={`label flex-1 transition-colors duration-300 ${
                  on ? 'text-warm' : done ? 'text-concrete-light' : 'text-concrete/40'
                }`}
              >
                {s.name}
              </span>
              {on && (
                <motion.span
                  layoutId="hud-active"
                  className="h-3 w-px bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="label text-concrete">Progress</span>
          <span className="label text-gold">{Math.round(frac * 100)}%</span>
        </div>
        <div className="h-px w-full bg-line/10">
          <div
            className="h-full bg-gradient-to-r from-gold-dim to-gold transition-[width] duration-150 ease-out"
            style={{ width: `${frac * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-5 border-t border-line/10 pt-4">
        <p className="label text-concrete/70">REVIT · LOD 300 · COORDINATED</p>
      </div>
    </div>
  );
}

function CoordinateReadout({ className = '', label, value }) {
  return (
    <div className={`label flex items-center gap-2 text-concrete/60 ${className}`}>
      <span className="h-px w-3 bg-concrete/40" />
      <span>{label}</span>
      <span className="text-gold/80">{value}</span>
    </div>
  );
}

export default function Hero() {
  const stageRef = useRef(0);
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  const reduced = useReducedMotion();

  return (
    <section
      id="home"
      className="relative min-h-[100svh] w-full overflow-hidden bg-black-900"
      aria-labelledby="hero-title"
    >
      {/* ---- 1. Blueprint backdrop ---- */}
      <div className="absolute inset-0" aria-hidden>
        <div className="blueprint animate-gridpan absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_62%_42%,rgba(201,162,39,0.07),transparent_62%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black-950/70 via-transparent to-black-900" />

        {/* self-drawing floor plan composition (desktop / larger tablets) */}
        {!isSmallMobile && <FloorPlan reduced={reduced} />}

        {/* horizontal datum lines */}
        <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(232,228,216,0)" />
              <stop offset="50%" stopColor="rgba(232,228,216,0.22)" />
              <stop offset="100%" stopColor="rgba(232,228,216,0)" />
            </linearGradient>
          </defs>
          <line x1="0" y1="22%" x2="100%" y2="22%" stroke="url(#hero-line)" strokeWidth="1" />
          <line x1="0" y1="78%" x2="100%" y2="78%" stroke="url(#hero-line)" strokeWidth="1" />
          <line x1="68%" y1="0" x2="68%" y2="100%" stroke="rgba(232,228,216,0.07)" strokeWidth="1" />
        </svg>
      </div>

      {/* ---- 2. 3D building (or static fallback for reduced motion) ---- */}
      <div className="canvas-wrap" aria-hidden>
        {reduced ? (
          <StaticBuilding className="absolute inset-0 h-full w-full opacity-90" />
        ) : (
          <Suspense fallback={null}>
            <BIMScene stageRef={stageRef} reduced={reduced} mobile={isMobile} />
          </Suspense>
        )}
      </div>

      {/* ---- 3. Readability masks ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'linear-gradient(90deg, rgba(11,11,10,0.95) 0%, rgba(11,11,10,0.8) 26%, rgba(11,11,10,0.25) 52%, rgba(11,11,10,0) 66%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black-900" aria-hidden />

      {/* ---- 4/5. Content ---- */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-5 pb-28 pt-28 sm:px-8 lg:px-12 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-6">
            <Reveal>
              <div className="mb-7 inline-flex items-center gap-3 border border-gold/25 bg-black-850/60 px-4 py-2">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-gold" />
                <span className="label text-concrete-light" style={{ letterSpacing: '0.22em' }}>
                  {isSmallMobile ? 'BIM MODELING SOLUTIONS' : 'BIM MODELING & DIGITAL CONSTRUCTION SOLUTIONS'}
                </span>
              </div>
            </Reveal>

            <h1
              id="hero-title"
              className="font-display text-[clamp(2.4rem,6.4vw,5.4rem)] font-semibold leading-[1.03] tracking-tight"
            >
              <RevealText text="Concept, rebuilt as an" delay={0.05} />
              <br />
              <span className="text-gradient glow-text">
                <RevealText text="intelligent digital model." delay={0.24} />
              </span>
            </h1>

            <Reveal delay={0.42}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-concrete-light sm:text-lg">
                Transforming reality into accurate, intelligent digital models through advanced
                BIM, scanning, CAD, and 3D modeling solutions.
              </p>
            </Reveal>

            <Reveal delay={0.54}>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <MagneticButton variant="primary" onClick={() => window.scrollToSection?.('services')}>
                  Explore Services
                </MagneticButton>
                <MagneticButton variant="outline" onClick={() => window.scrollToSection?.('projects')}>
                  View Projects
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.66}>
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  { k: 'Scan to BIM', v: 'LOD 300' },
                  { k: 'Disciplines', v: 'ARCH · STR · MEP' },
                  { k: 'Delivery', v: 'REVIT · CAD · IFC' },
                ].map((item) => (
                  <div key={item.k} className="flex items-center gap-2.5">
                    <Icon name="check" size={13} className="text-gold" strokeWidth={2.4} />
                    <span className="label text-concrete-light/85">{item.k}</span>
                    <span className="label text-gold">{item.v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* HUD */}
          {!isSmallMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.9 }}
              className="flex justify-end lg:col-span-5 xl:col-span-6"
            >
              <ModelStateHUD stageRef={stageRef} />
            </motion.div>
          )}
        </div>
      </div>

      {/* ---- 6. Scroll cue + drawing coordinates ---- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden pb-6 sm:block">
        <div className="mx-auto flex max-w-[1400px] items-end justify-between px-5 sm:px-8 lg:px-12">
          <CoordinateReadout label="X" value="245.20" />
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <span className="label text-concrete/60">Scroll</span>
            <span className="relative h-12 w-px overflow-hidden bg-concrete/20">
              <motion.span
                className="absolute left-0 top-0 h-4 w-px bg-gold"
                animate={reduced ? undefined : { y: [0, 48, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: EASE }}
              />
            </span>
          </motion.div>
          <CoordinateReadout label="Y" value="182.40" className="flex-row-reverse" />
        </div>
      </div>
    </section>
  );
}
