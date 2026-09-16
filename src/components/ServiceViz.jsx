/**
 * ServiceViz — animated SVG mini-visualisations, one per service.
 *
 * Each variant animates a small technical diagram (points, scan lines,
 * wireframes, layers, LOD bars) tied to hover state via Framer Motion.
 * Pure SVG — no WebGL cost.
 */
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

function Frame({ children }) {
  return (
    <div className="relative h-32 w-full overflow-hidden border-b border-line/10 bg-blueprint-900/60">
      <div className="blueprint-fine absolute inset-0 opacity-60" aria-hidden />
      <svg
        viewBox="0 0 300 128"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
    </div>
  );
}

/** Helper: grid of dots used by several variants. */
function DotGrid({ active, cols = 9, rows = 4, x = 60, y = 34, dx = 20, dy = 20 }) {
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ x: x + c * dx, y: y + r * dy, i: r * cols + c });
    }
  }
  return (
    <g>
      {dots.map((d) => (
        <motion.circle
          key={d.i}
          cx={d.x}
          cy={d.y}
          r="1.6"
          fill="#e3c15a"
          initial={{ opacity: 0.15 }}
          animate={{ opacity: active ? 0.9 : 0.15 }}
          transition={{ duration: 0.5, delay: active ? d.i * 0.012 : 0 }}
        />
      ))}
    </g>
  );
}

/* ---------- 01 Scan to BIM: point cloud → Revit model ---------- */
function PointToBIM({ active }) {
  return (
    <Frame>
      <DotGrid active={active} />
      <motion.rect
        x="150"
        y="24"
        width="96"
        height="80"
        fill="none"
        stroke="#c9a227"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1="150"
          y1={44 + i * 18}
          x2="246"
          y2={44 + i * 18}
          stroke="#e3c15a"
          strokeWidth="1"
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          style={{ transformOrigin: '150px' }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.9 + i * 0.12 }}
        />
      ))}
      <motion.line
        x1="134"
        y1="64"
        x2="148"
        y2="64"
        stroke="#c9a227"
        strokeWidth="1"
        animate={{ opacity: active ? 0.8 : 0.2 }}
      />
    </Frame>
  );
}

/* ---------- 02 Scan to CAD: laser sweep → layered drawing ---------- */
function ScanToCAD({ active }) {
  return (
    <Frame>
      <rect x="40" y="20" width="120" height="88" fill="none" stroke="rgba(232,228,216,0.22)" strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="48" y1={36 + i * 20} x2="152" y2={36 + i * 20} stroke="rgba(232,228,216,0.14)" strokeWidth="1" />
      ))}
      <motion.line
        x1="40"
        x2="160"
        y1="64"
        y2="64"
        stroke="#c9a227"
        strokeWidth="2"
        initial={false}
        animate={active ? { x1: [40, 160, 40], y1: [20, 108, 20], x2: [160, 40, 160], y2: [20, 108, 20] } : {}}
        transition={{ duration: 2.4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <rect x="196" y="20" width="70" height="88" fill="none" stroke="#e3c15a" strokeWidth="1.2" />
        {[
          [196, 52, 70],
          [196, 76, 46],
          [196, 96, 58],
        ].map(([x, y, w], i) => (
          <line key={i} x1={x + 8} y1={y} x2={x + w - 8} y2={y} stroke="#c9a227" strokeWidth="1.4" />
        ))}
        <line x1="184" y1="64" x2="196" y2="64" stroke="rgba(201,162,39,0.5)" strokeWidth="1" />
        <text x="200" y="34" fill="rgba(184,181,170,0.6)" fontSize="7" fontFamily="monospace" letterSpacing="1">
          .DWG
        </text>
      </motion.g>
    </Frame>
  );
}

/* ---------- 03 PDF to BIM: flat sheet → folded model ---------- */
function PDFToBIM({ active }) {
  return (
    <Frame>
      <motion.g
        initial={false}
        animate={active ? { rotateY: 0, skewY: 0 } : { rotateY: 0, skewY: 0 }}
      />
      {/* flat sheet */}
      <motion.g
        initial={false}
        animate={active ? { opacity: 0.15, scaleX: 0.6, x: 14 } : { opacity: 1, scaleX: 1, x: 0 }}
        style={{ transformOrigin: '96px 64px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <rect x="56" y="20" width="80" height="88" fill="none" stroke="rgba(170,180,192,0.5)" strokeWidth="1" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="68" y1={38 + i * 20} x2="124" y2={38 + i * 20} stroke="rgba(170,180,192,0.4)" strokeWidth="1" />
        ))}
        <text x="70" y="30" fill="rgba(184,181,170,0.6)" fontSize="7" fontFamily="monospace">PDF</text>
      </motion.g>
      {/* folded 3D model */}
      <motion.g
        initial={false}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        style={{ transformOrigin: '206px 64px' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        fill="none"
        stroke="#c9a227"
        strokeWidth="1.2"
      >
        <path d="M170 96 L206 32 L242 96 Z" />
        <path d="M170 96 L206 48 L242 96" opacity="0.5" />
        <line x1="206" y1="32" x2="206" y2="48" opacity="0.5" />
        <rect x="182" y="96" width="48" height="10" opacity="0.6" />
      </motion.g>
      <motion.line
        x1="152"
        y1="64"
        x2="168"
        y2="64"
        stroke="#c9a227"
        animate={{ opacity: active ? 0.8 : 0.2 }}
      />
    </Frame>
  );
}

/* ---------- 04 CAD to BIM: 2D plan extrudes into 3D ---------- */
function CADToBIM({ active }) {
  return (
    <Frame>
      {/* 2D plan */}
      <motion.g
        initial={false}
        animate={active ? { y: 26, opacity: 0.35, scale: 0.92 } : { y: 0, opacity: 1, scale: 1 }}
        style={{ transformOrigin: '80px 64px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <rect x="40" y="36" width="80" height="56" fill="none" stroke="rgba(170,180,192,0.55)" strokeWidth="1" />
        <line x1="40" y1="64" x2="120" y2="64" stroke="rgba(170,180,192,0.4)" strokeWidth="1" />
        <line x1="80" y1="36" x2="80" y2="92" stroke="rgba(170,180,192,0.4)" strokeWidth="1" />
      </motion.g>
      {/* extrusion arrows */}
      <motion.g
        stroke="#c9a227"
        strokeWidth="1.2"
        animate={{ opacity: active ? 0.9 : 0.15 }}
      >
        {[50, 70, 90, 110].map((x) => (
          <line key={x} x1={x} y1="30" x2={x + 18} y2="14" />
        ))}
      </motion.g>
      {/* extruded 3D */}
      <motion.g
        fill="none"
        stroke="#c9a227"
        strokeWidth="1.2"
        initial={false}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <path d="M164 100 L164 52 L204 36 L244 52 L244 100 Z" />
        <path d="M164 52 L204 68 L244 52" opacity="0.55" />
        <path d="M204 68 L204 116" opacity="0.4" strokeDasharray="3 3" />
        <path d="M164 100 L204 116 L244 100" opacity="0.55" />
      </motion.g>
    </Frame>
  );
}

/* ---------- 05 Revit Modeling: LOD 100 → 500 build-up ---------- */
const LOD_STAGES = [
  { label: 'LOD 100', w: 26 },
  { label: 'LOD 200', w: 48 },
  { label: 'LOD 300', w: 70 },
  { label: 'LOD 400', w: 88 },
  { label: 'LOD 500', w: 106 },
];
function RevitLOD({ active }) {
  return (
    <Frame>
      <motion.g
        initial={false}
        animate={active ? { opacity: 1 } : { opacity: 0.5 }}
      >
        {LOD_STAGES.map((s, i) => (
          <g key={s.label}>
            <motion.rect
              x="40"
              y={26 + i * 18}
              width={s.w}
              height="10"
              fill={i === 4 ? '#c9a227' : 'rgba(201,162,39,0.16)'}
              initial={false}
              animate={active ? { width: s.w } : { width: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.14 }}
            />
            <text
              x="154"
              y={34 + i * 18}
              fill={active ? 'rgba(243,241,232,0.78)' : 'rgba(119,117,109,0.5)'}
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="1"
            >
              {s.label}
            </text>
          </g>
        ))}
      </motion.g>
      <motion.line
        x1="40"
        x2="146"
        y1="22"
        y2="22"
        stroke="#c9a227"
        strokeWidth="1.4"
        initial={false}
        animate={active ? { x2: [40, 146] } : { x2: 40 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
      />
    </Frame>
  );
}

/* ---------- 06 3D BIM Modeling: three disciplines combine ---------- */
function Layers3D({ active }) {
  const layers = [
    { label: 'ARCH', y: 40, color: '#e3c15a' },
    { label: 'STR', y: 64, color: '#c9a227' },
    { label: 'MEP', y: 88, color: '#a68a62' },
  ];
  return (
    <Frame>
      {layers.map((l, i) => (
        <motion.g
          key={l.label}
          initial={false}
          animate={
            active
              ? { x: 0, y: [l.y, 60], opacity: 1 }
              : { x: i === 1 ? 0 : i === 0 ? -20 : 20, y: l.y, opacity: 0.9 }
          }
          transition={{ duration: 1, ease: EASE, delay: active ? i * 0.18 : 0 }}
        >
          <rect
            x="70"
            y={l.y}
            width="120"
            height="14"
            fill={`${l.color}22`}
            stroke={l.color}
            strokeWidth="1"
          />
          <text
            x="76"
            y={l.y + 10}
            fill={l.color}
            fontSize="7.5"
            fontFamily="monospace"
            letterSpacing="1.2"
          >
            {l.label}
          </text>
        </motion.g>
      ))}
      <motion.g
        fill="none"
        stroke="#c9a227"
        strokeWidth="1.2"
        initial={false}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.95 }}
      >
        <path d="M212 34 L248 62 L212 90 Z" />
        <line x1="212" y1="34" x2="212" y2="90" opacity="0.4" />
        <line x1="248" y1="62" x2="212" y2="62" opacity="0.4" strokeDasharray="3 3" />
      </motion.g>
      <motion.text
        x="204"
        y="108"
        fill="rgba(201,162,39,0.75)"
        fontSize="7"
        fontFamily="monospace"
        letterSpacing="1"
        animate={{ opacity: active ? 1 : 0 }}
      >
        FEDERATED
      </motion.text>
    </Frame>
  );
}

/* ---------- 07 As-Built: site → scan → verified → BIM ---------- */
const AB_STAGES = [
  { label: 'SITE', x: 46 },
  { label: 'SCAN', x: 112 },
  { label: 'VERIFIED', x: 178 },
  { label: 'AS-BUILT', x: 244 },
];
function AsBuilt({ active }) {
  return (
    <Frame>
      {/* connecting pipeline */}
      <line x1="46" y1="76" x2="260" y2="76" stroke="rgba(232,228,216,0.18)" strokeWidth="1" />
      <motion.line
        x1="46"
        y1="76"
        x2="260"
        y2="76"
        stroke="#c9a227"
        strokeWidth="1.4"
        initial={false}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
      />
      {AB_STAGES.map((s, i) => (
        <g key={s.label}>
          <motion.rect
            x={s.x - 26}
            y="44"
            width="52"
            height="26"
            fill="rgba(201,162,39,0.08)"
            stroke="rgba(201,162,39,0.4)"
            strokeWidth="1"
            initial={false}
            animate={active ? { opacity: 1 } : { opacity: 0.35 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.35 }}
          />
          <text
            x={s.x}
            y="61"
            fill="rgba(243,241,232,0.72)"
            fontSize="6.5"
            fontFamily="monospace"
            letterSpacing="0.8"
            textAnchor="middle"
          >
            {s.label}
          </text>
          <motion.circle
            cx={s.x}
            cy="76"
            r="3"
            fill="#c9a227"
            initial={false}
            animate={active ? { scale: [1, 1.5, 1] } : { scale: 1 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 + i * 0.35 }}
          />
        </g>
      ))}
      <motion.text
        x="150"
        y="106"
        fill="rgba(201,162,39,0.6)"
        fontSize="7"
        fontFamily="monospace"
        letterSpacing="1.4"
        textAnchor="middle"
        animate={{ opacity: active ? 1 : 0.3 }}
      >
        VERIFIED AGAINST SITE CONDITIONS
      </motion.text>
    </Frame>
  );
}

const VARIANTS = {
  pointtobim: PointToBIM,
  scantocad: ScanToCAD,
  pdftobim: PDFToBIM,
  cadtobim: CADToBIM,
  lod: RevitLOD,
  layers: Layers3D,
  asbuilt: AsBuilt,
};

export default function ServiceViz({ variant, active }) {
  const Comp = VARIANTS[variant] || PointToBIM;
  return <Comp active={active} />;
}
