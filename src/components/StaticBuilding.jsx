/**
 * StaticBuilding — lightweight SVG stand-in for the 3D building.
 * Used when WebGL is unavailable or the user prefers reduced motion,
 * so the hero still carries the architectural identity without a GPU.
 */
export default function StaticBuilding({ className = '' }) {
  return (
    <svg
      viewBox="0 0 500 560"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sb-sky" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#111820" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="sb-solid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c2733" />
          <stop offset="100%" stopColor="#0b0b0a" />
        </linearGradient>
      </defs>

      <rect width="500" height="560" fill="url(#sb-sky)" />

      {/* blueprint grid */}
      <g stroke="rgba(232,228,216,0.06)" strokeWidth="1">
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="560" />
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="500" y2={i * 20} />
        ))}
      </g>

      {/* ground */}
      <line x1="0" y1="470" x2="500" y2="470" stroke="rgba(232,228,216,0.3)" strokeWidth="1" />

      {/* annex */}
      <rect x="300" y="330" width="120" height="140" fill="rgba(28,39,51,0.75)" stroke="rgba(232,228,216,0.35)" strokeWidth="1.2" />
      {[0, 1, 2].map((i) => (
        <rect key={`an${i}`} x="316" y={350 + i * 40} width="26" height="20" fill="#e3c15a" opacity="0.16" />
      ))}

      {/* main tower */}
      <rect x="110" y="90" width="170" height="380" fill="url(#sb-solid)" stroke="rgba(232,228,216,0.35)" strokeWidth="1.4" />
      {/* window grid */}
      {Array.from({ length: 9 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <rect
            key={`w${r}-${c}`}
            x={128 + c * 30}
            y={112 + r * 38}
            width="18"
            height="20"
            fill="#e3c15a"
            opacity={(0.1 + ((r * 5 + c) % 4) * 0.16).toFixed(2)}
          />
        )),
      )}
      {/* floor plates */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line
          key={`f${i}`}
          x1="110"
          y1={128 + i * 38}
          x2="280"
          y2={128 + i * 38}
          stroke="rgba(232,228,216,0.2)"
          strokeWidth="1"
          strokeDasharray="4 5"
        />
      ))}

      {/* core */}
      <rect x="196" y="60" width="46" height="410" fill="rgba(11,11,10,0.92)" stroke="rgba(232,228,216,0.35)" strokeWidth="1.2" />
      <line x1="219" y1="60" x2="219" y2="40" stroke="#c9a227" strokeWidth="1.4" />

      {/* roof */}
      <rect x="150" y="52" width="90" height="10" fill="none" stroke="#c9a227" strokeWidth="1.2" />

      {/* scan ring */}
      <ellipse
        cx="245"
        cy="470"
        rx="190"
        ry="22"
        fill="none"
        stroke="rgba(201,162,39,0.55)"
        strokeWidth="1.2"
        strokeDasharray="6 6"
      />

      {/* coordinate reticle */}
      <g stroke="rgba(201,162,39,0.55)" strokeWidth="1" fill="none">
        <path d="M16 30 V16 H30" />
        <path d="M484 30 V16 H470" />
        <path d="M16 530 V544 H30" />
        <path d="M484 530 V544 H470" />
      </g>

      {/* technical labels */}
      <g fill="rgba(201,162,39,0.8)" fontSize="9" fontFamily="monospace" letterSpacing="1.6">
        <text x="32" y="150">POINT CLOUD</text>
        <text x="300" y="120">BIM MODEL</text>
        <text x="300" y="280">REVIT</text>
        <text x="32" y="440">MEP</text>
        <text x="298" y="440">AS-BUILT</text>
      </g>
      <g stroke="rgba(201,162,39,0.45)" strokeWidth="1">
        <line x1="118" y1="146" x2="28" y2="146" />
        <line x1="292" y1="116" x2="296" y2="116" />
        <line x1="292" y1="276" x2="296" y2="276" />
        <line x1="118" y1="436" x2="28" y2="436" />
        <line x1="292" y1="436" x2="294" y2="436" />
      </g>
    </svg>
  );
}
