/**
 * ProjectVisual — procedurally generated architectural artwork.
 *
 * Each project renders a unique blueprint-style scene derived from its
 * `scene` typology (tower / complex / public) and a numeric `seed`.
 * No external images required; deterministic per project.
 * Warm drafting linework on black/blueprint with gold glazing.
 */
import { mulberry32 } from '../lib/math';

function rng(seed) {
  const r = mulberry32(seed);
  return () => r();
}

function TowerArt({ rand }) {
  const windows = [];
  for (let f = 0; f < 9; f++) {
    for (let c = 0; c < 5; c++) {
      if (rand() > 0.32) {
        windows.push(
          <rect
            key={`tw-${f}-${c}`}
            x={118 + c * 30}
            y={52 + f * 26}
            width="16"
            height="14"
            fill="#e3c15a"
            opacity={(0.1 + rand() * 0.45).toFixed(2)}
          />,
        );
      }
    }
  }
  return (
    <g>
      {/* main tower */}
      <rect x="110" y="40" width="164" height="286" fill="url(#pg-solid)" stroke="rgba(232,228,216,0.35)" strokeWidth="1.2" />
      {windows}
      {/* roof element */}
      <rect x="150" y="16" width="84" height="24" fill="none" stroke="rgba(201,162,39,0.7)" strokeWidth="1" />
      <line x1="192" y1="4" x2="192" y2="16" stroke="rgba(201,162,39,0.7)" strokeWidth="1" />
      {/* annex */}
      <rect x="286" y="200" width="86" height="126" fill="rgba(28,39,51,0.7)" stroke="rgba(232,228,216,0.25)" strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <rect key={`an-${i}`} x="298" y={216 + i * 34} width="26" height="16" fill="#e3c15a" opacity="0.14" />
      ))}
      {/* structure hints */}
      <line x1="110" y1="120" x2="274" y2="120" stroke="rgba(232,228,216,0.2)" strokeDasharray="4 5" />
      <line x1="110" y1="200" x2="274" y2="200" stroke="rgba(232,228,216,0.2)" strokeDasharray="4 5" />
    </g>
  );
}

function ComplexArt({ rand }) {
  const blocks = [
    { x: 60, y: 150, w: 110, h: 176 },
    { x: 182, y: 96, w: 96, h: 230 },
    { x: 290, y: 178, w: 82, h: 148 },
  ];
  return (
    <g>
      {blocks.map((b, i) => (
        <g key={`blk-${i}`}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={i === 1 ? 'url(#pg-solid)' : 'rgba(28,39,51,0.7)'}
            stroke="rgba(232,228,216,0.32)"
            strokeWidth="1.2"
          />
          {Array.from({ length: Math.floor(b.h / 30) }).map((_, r) =>
            Array.from({ length: Math.floor(b.w / 26) }).map((_, c) => (
              <rect
                key={`bw-${i}-${r}-${c}`}
                x={b.x + 8 + c * 24}
                y={b.y + 12 + r * 28}
                width="12"
                height="12"
                fill="#e3c15a"
                opacity={(0.07 + rand() * 0.38).toFixed(2)}
              />
            )),
          )}
        </g>
      ))}
      {/* skybridge */}
      <rect x="168" y="180" width="18" height="40" fill="rgba(201,162,39,0.16)" stroke="rgba(201,162,39,0.6)" strokeWidth="0.8" />
      <rect x="276" y="210" width="16" height="36" fill="rgba(201,162,39,0.16)" stroke="rgba(201,162,39,0.6)" strokeWidth="0.8" />
      {/* roof lines */}
      <line x1="182" y1="80" x2="278" y2="80" stroke="rgba(201,162,39,0.65)" strokeWidth="1.2" />
      <line x1="230" y1="62" x2="230" y2="80" stroke="rgba(201,162,39,0.65)" strokeWidth="1" />
    </g>
  );
}

function PublicArt({ rand }) {
  const columns = [];
  for (let i = 0; i < 7; i++) {
    columns.push(
      <rect
        key={`col-${i}`}
        x={72 + i * 42}
        y={170}
        width="14"
        height="156"
        fill="url(#pg-col)"
        stroke="rgba(232,228,216,0.3)"
        strokeWidth="0.9"
      />,
    );
  }
  return (
    <g>
      {/* colonnade */}
      {columns}
      {/* entablature */}
      <rect x="56" y="140" width="336" height="26" fill="url(#pg-solid)" stroke="rgba(232,228,216,0.35)" strokeWidth="1.2" />
      <rect x="48" y="128" width="352" height="12" fill="none" stroke="rgba(201,162,39,0.6)" strokeWidth="1" />
      {/* pediment */}
      <path d="M56 128 L224 60 L392 128 Z" fill="rgba(28,39,51,0.6)" stroke="rgba(232,228,216,0.35)" strokeWidth="1.2" />
      <line x1="224" y1="60" x2="224" y2="128" stroke="rgba(232,228,216,0.25)" strokeDasharray="4 5" />
      {/* steps */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={`step-${i}`}
          x1={64 - i * 8}
          y1={326 + i * 10}
          x2={384 + i * 8}
          y2={326 + i * 10}
          stroke="rgba(232,228,216,0.4)"
          strokeWidth="1.2"
          opacity={0.85 - i * 0.12}
        />
      ))}
      {/* gold entrance */}
      <rect x="196" y="170" width="56" height="156" fill="#c9a227" opacity="0.12" />
      {/* windows between columns */}
      {[1, 3, 5].map((i) => (
        <rect
          key={`pw-${i}`}
          x={90 + i * 42}
          y={196}
          width="18"
          height="104"
          fill="#e3c15a"
          opacity={(0.08 + rand() * 0.26).toFixed(2)}
        />
      ))}
    </g>
  );
}

const SCENES = {
  tower: TowerArt,
  complex: ComplexArt,
  public: PublicArt,
};

export default function ProjectVisual({ scene = 'tower', seed = 1, className = '' }) {
  const rand = rng(seed);
  const Art = SCENES[scene] || TowerArt;

  return (
    <svg
      viewBox="0 0 440 380"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pg-bg" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#111820" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="pg-solid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c2733" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="pg-col" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#161f2a" />
          <stop offset="50%" stopColor="#232f3d" />
          <stop offset="100%" stopColor="#0b0b0a" />
        </linearGradient>
      </defs>

      <rect width="440" height="380" fill="url(#pg-bg)" />

      {/* drafting grid */}
      <g stroke="rgba(232,228,216,0.05)" strokeWidth="1">
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="380" />
        ))}
        {Array.from({ length: 19 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="440" y2={i * 20} />
        ))}
      </g>

      {/* ground */}
      <line x1="0" y1="326" x2="440" y2="326" stroke="rgba(232,228,216,0.3)" strokeWidth="1" />
      <line x1="0" y1="332" x2="440" y2="332" stroke="rgba(232,228,216,0.12)" strokeWidth="1" />
      {/* soil hatch */}
      <g stroke="rgba(107,81,56,0.45)" strokeWidth="1">
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`s${i}`} x1={8 + i * 21} y1="338" x2={i * 21} y2="346" />
        ))}
      </g>

      <Art rand={rand} />

      {/* corner reticle — gold */}
      <g stroke="rgba(201,162,39,0.55)" strokeWidth="1" fill="none">
        <path d="M12 26 V12 H26" />
        <path d="M428 26 V12 H414" />
        <path d="M12 354 V368 H26" />
        <path d="M428 354 V368 H414" />
      </g>
    </svg>
  );
}
