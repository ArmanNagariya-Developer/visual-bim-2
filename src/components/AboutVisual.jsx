/**
 * AboutVisual — SVG-based scroll-triggered transformation:
 *   EXISTING BUILDING → POINT CLOUD → BIM GEOMETRY → INTELLIGENT MODEL
 *
 * Uses a single sticky canvas-less visual driven by section scroll
 * progress (cheaper than a second WebGL context, and prints well).
 * Warm drafting linework with gold highlights, on a blueprint panel.
 */
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';

const STAGE_LABELS = [
  'EXISTING BUILDING',
  'POINT CLOUD',
  'BIM GEOMETRY',
  'INTELLIGENT MODEL',
];

const EASE = [0.16, 1, 0.3, 1];

/** Deterministic pseudo-random grid of "scan" dots covering the facade. */
function ScanDots({ progress }) {
  const cols = 14;
  const rows = 11;
  const dots = useRef(null);
  if (dots.current === null) {
    const arr = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({
          x: 40 + c * 30 + (rand() - 0.5) * 8,
          y: 26 + r * 26 + (rand() - 0.5) * 8,
          delay: rand(),
        });
      }
    }
    dots.current = arr;
  }

  // Subscribe to the MotionValue without re-rendering on every frame:
  // each dot reads opacity through its own <motion.circle>.
  return (
    <g>
      {dots.current.map((d, i) => (
        <Dot key={i} dot={d} progress={progress} />
      ))}
    </g>
  );
}

function Dot({ dot, progress }) {
  const opacity = useTransform(
    progress,
    (v) => Math.min(1, Math.max(0, (v - 0.28) * 2.2 - dot.delay * 0.45)) * 0.95,
  );
  return (
    <motion.circle
      cx={dot.x}
      cy={dot.y}
      r={1.5}
      fill="#e3c15a"
      opacity={opacity}
      style={{ transition: 'opacity 0.18s linear' }}
    />
  );
}

export default function AboutVisual() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [stageIndex, setStageIndex] = useState(reduced ? 3 : 0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // progress 0 → 1 across the section maps the four stages.
  const solidOp = useTransform(scrollYProgress, [0, 0.18, 0.34], [1, 1, 0.12]);
  const dotOp = useTransform(scrollYProgress, [0.16, 0.3, 0.52, 0.66], [0, 1, 1, 0.25]);
  const wireOp = useTransform(scrollYProgress, [0.42, 0.58, 0.86], [0, 1, 1]);
  const dataOp = useTransform(scrollYProgress, [0.7, 0.86], [0, 1]);
  const scanY = useTransform(scrollYProgress, [0.2, 0.5], [10, 300]);
  const scanOp = useTransform(scrollYProgress, [0.16, 0.26, 0.5], [0, 1, 0]);
  const labelIndex = stageIndex;
  const dotProgress = useTransform(scrollYProgress, (v) => (reduced ? 0.6 : v));

  // Map continuous scroll progress to the discrete active stage.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = reduced ? 3 : Math.min(3, Math.floor(v * 4));
    setStageIndex((prev) => (prev === next ? prev : next));
  });

  return (
    <div ref={ref} className="relative">
      <div className="panel relative aspect-[4/5] overflow-hidden rounded-[4px] bg-blueprint-900/70 sm:aspect-[4/4.2]">
        {/* corner frame */}
        <span className="pointer-events-none absolute left-0 top-0 z-20 h-10 w-10 border-l border-t border-gold/60" />
        <span className="pointer-events-none absolute right-0 top-0 z-20 h-10 w-10 border-r border-t border-gold/60" />
        <span className="pointer-events-none absolute bottom-0 left-0 z-20 h-10 w-10 border-b border-l border-gold/60" />
        <span className="pointer-events-none absolute bottom-0 right-0 z-20 h-10 w-10 border-b border-r border-gold/60" />

        <div className="blueprint-fine absolute inset-0 opacity-70" aria-hidden />

        {/* drawing title block */}
        <div className="absolute left-4 top-4 z-20 hidden select-none items-center gap-2 sm:flex" aria-hidden>
          <span className="label text-[0.5rem] text-concrete">A-101</span>
          <span className="h-px w-6 bg-concrete/40" />
          <span className="label text-[0.5rem] text-concrete/70">SCALE 1:100</span>
        </div>

        <svg
          viewBox="0 0 500 420"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Transformation from existing building to intelligent BIM model"
        >
          <defs>
            <linearGradient id="about-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#161f2a" />
              <stop offset="100%" stopColor="#0b0b0a" />
            </linearGradient>
            <linearGradient id="about-solid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1c2733" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="scanline-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(227,193,90,0)" />
              <stop offset="50%" stopColor="rgba(227,193,90,0.9)" />
              <stop offset="100%" stopColor="rgba(227,193,90,0)" />
            </linearGradient>
          </defs>

          <rect width="500" height="420" fill="url(#about-sky)" />

          {/* ground line + ticks */}
          <line x1="20" y1="360" x2="480" y2="360" stroke="rgba(232,228,216,0.28)" strokeWidth="1" />
          {[60, 120, 180, 240, 300, 360, 420].map((x) => (
            <line
              key={x}
              x1={x}
              y1="356"
              x2={x}
              y2="364"
              stroke="rgba(232,228,216,0.3)"
              strokeWidth="1"
            />
          ))}
          {/* soil / terrain hatch under ground line */}
          <g stroke="rgba(107,81,56,0.5)" strokeWidth="1">
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`soil-${i}`} x1={24 + i * 20} y1="366" x2={16 + i * 20} y2="374" />
            ))}
          </g>

          {/* 1 — Solid existing building */}
          <motion.g opacity={solidOp}>
            <rect x="120" y="80" width="150" height="280" fill="url(#about-solid)" />
            <rect x="285" y="140" width="95" height="220" fill="url(#about-solid)" />
            {/* windows as dark voids */}
            {[0, 1, 2, 3, 4].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`w-${r}-${c}`}
                  x={138 + c * 42}
                  y={100 + r * 50}
                  width="24"
                  height="30"
                  fill="#050505"
                  opacity="0.9"
                />
              )),
            )}
            {[0, 1, 2, 3].map((r) => (
              <rect
                key={`w2-${r}`}
                x="303"
                y={162 + r * 50}
                width="24"
                height="30"
                fill="#050505"
                opacity="0.9"
              />
            ))}
          </motion.g>

          {/* 2 — Scan pass line (gold) */}
          <motion.line
            x1="30"
            x2="470"
            y1={scanY}
            y2={scanY}
            stroke="url(#scanline-grad)"
            strokeWidth="2"
            opacity={scanOp}
          />

          {/* 3 — Point cloud */}
          <motion.g opacity={dotOp}>
            <ScanDots progress={dotProgress} />
          </motion.g>

          {/* 4 — BIM geometry wireframe (warm drafting lines) */}
          <motion.g
            opacity={wireOp}
            fill="none"
            stroke="#e8e4d8"
            strokeWidth="1.1"
            className={reduced ? '' : 'animate-dash'}
          >
            <rect x="120" y="80" width="150" height="280" />
            <rect x="285" y="140" width="95" height="220" />
            {/* floor plates */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={`f-${i}`} x1="120" y1={80 + i * 56} x2="270" y2={80 + i * 56} />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={`f2-${i}`} x1="285" y1={140 + i * 55} x2="380" y2={140 + i * 55} />
            ))}
            {/* columns */}
            {[0, 1, 2, 3].map((i) => (
              <line key={`c-${i}`} x1={120 + i * 50} y1="80" x2={120 + i * 50} y2="360" />
            ))}
            <line x1="285" y1="140" x2="285" y2="360" />
            <line x1="380" y1="140" x2="380" y2="360" />
            {/* roof */}
            <line x1="110" y1="80" x2="280" y2="80" />
            <line x1="275" y1="140" x2="395" y2="140" />
          </motion.g>

          {/* 5 — Intelligent model: gold data nodes + links */}
          <motion.g opacity={dataOp}>
            {[
              [150, 120],
              [230, 168],
              [320, 210],
              [180, 268],
              [300, 312],
            ].map(([x, y], i) => (
              <g key={`node-${i}`}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="1"
                  animate={reduced ? undefined : { scale: [0.8, 1.15, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
                <circle cx={x} cy={y} r="2.4" fill="#e3c15a" />
              </g>
            ))}
            <motion.path
              d="M150 120 L230 168 L320 210 L300 312 L180 268 Z"
              fill="none"
              stroke="rgba(201,162,39,0.45)"
              strokeWidth="1"
              strokeDasharray="4 5"
            />
          </motion.g>
        </svg>

        {/* stage indicator */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-line/10 bg-black-950/80 px-4 py-3.5 backdrop-blur-sm sm:px-5">
          <div className="flex items-center justify-between gap-1.5">
            {STAGE_LABELS.map((label, i) => (
              <StagePill key={label} label={label} active={labelIndex === i} />
            ))}
          </div>
        </div>
      </div>

      {/* caption under the visual */}
      <div className="mt-4 flex items-center justify-between">
        <span className="label text-concrete/70">FIG. 01 — REALITY → BIM PIPELINE</span>
        <span className="label text-gold/80">SCROLL TO TRANSFORM</span>
      </div>
    </div>
  );
}

function StagePill({ label, active }) {
  return (
    <span className="flex flex-1 flex-col items-center gap-1.5">
      <span className="h-1 w-full bg-line/10">
        <motion.span
          className="block h-full bg-gold"
          animate={{ opacity: active ? 1 : 0.15, scaleX: active ? 1 : 0.4 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </span>
      <span
        className="label text-center text-[0.5rem] transition-colors duration-300 sm:text-[0.55rem]"
        style={{ color: active ? 'var(--color-gold)' : 'rgba(119,117,109,0.55)' }}
      >
        {label}
      </span>
    </span>
  );
}
