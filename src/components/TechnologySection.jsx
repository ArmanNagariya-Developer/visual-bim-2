/**
 * SitePlan — dedicated blueprint / map section ("Where Reality Meets
 * Digital Construction" content preserved, rendered as a full site plan).
 *
 * A drafting-sheet composition on #111820: site boundary, roads, plots,
 * terrain (earth hatch), trees, dimension chains, coordinates, grid
 * axes (A–F / 1–5), north arrow, scale bar and a title block — the
 * professional construction-drawing language of the brand.
 *
 * White/warm linework, gold for the highlighted building + dimensions,
 * earth tones for terrain. Pure SVG — cheap, crisp, prints well.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from './Reveal';
import SectionHeading from './SectionHeading';
import Icon from './Icon';

const EASE = [0.16, 1, 0.3, 1];

/* Stage annotations echoing the reality→BIM pipeline (content preserved). */
const STAGES = [
  { name: 'REALITY CAPTURE', note: 'Survey & scans' },
  { name: 'SITE ANALYSIS', note: 'Boundaries & terrain' },
  { name: 'DIGITAL MODEL', note: 'Coordinated BIM' },
];

/* Draw-in helper for linework (respects reduced motion). */
const draw = (reduced, delay, duration = 1.6) =>
  reduced
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration, ease: EASE, delay },
      };

const fade = (reduced, delay) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.9, ease: EASE, delay },
      };

export default function TechnologySection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="technology"
      className="relative scroll-mt-20 overflow-hidden border-t border-line/8 bg-blueprint-900 py-24 sm:py-32"
      aria-labelledby="siteplan-title"
    >
      {/* fine drafting grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="blueprint absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="04"
          kicker="Blueprint"
          title="Where Reality Meets Digital Construction"
          description="Every project begins as a survey and becomes a coordinated, data-rich model."
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ---- The site plan sheet ---- */}
          <Reveal className="lg:col-span-8" y={30}>
            <div className="panel relative overflow-hidden rounded-[4px]">
              {/* drafting corner ticks */}
              <span className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-gold/60" />
              <span className="pointer-events-none absolute right-0 top-0 z-20 h-8 w-8 border-r border-t border-gold/60" />
              <span className="pointer-events-none absolute bottom-0 left-0 z-20 h-8 w-8 border-b border-l border-gold/60" />
              <span className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-gold/60" />

              <svg
                viewBox="0 0 860 560"
                className="block h-auto w-full"
                role="img"
                aria-label="Architectural site plan with roads, plots, terrain and dimensions"
              >
                <rect width="860" height="560" fill="#111820" />

                {/* ===== grid axes (A–F horizontal, 1–5 vertical) ===== */}
                <g stroke="rgba(232,228,216,0.10)" strokeWidth="1">
                  {[130, 260, 390, 520, 650].map((x, i) => (
                    <line key={`ax${i}`} x1={x} y1="46" x2={x} y2="486" />
                  ))}
                  {[120, 230, 340, 450].map((y, i) => (
                    <line key={`ay${i}`} x1="70" y1={y} x2="800" y2={y} />
                  ))}
                </g>
                {/* axis bubbles */}
                <g fontSize="9" fontFamily="JetBrains Mono, monospace" fill="rgba(232,228,216,0.5)">
                  {[130, 260, 390, 520, 650].map((x, i) => (
                    <g key={`ab${i}`}>
                      <circle cx={x} cy="36" r="10" fill="none" stroke="rgba(232,228,216,0.3)" />
                      <text x={x} y="40" textAnchor="middle">{String.fromCharCode(65 + i)}</text>
                    </g>
                  ))}
                  {[120, 230, 340, 450].map((y, i) => (
                    <g key={`abv${i}`}>
                      <circle cx="56" cy={y} r="10" fill="none" stroke="rgba(232,228,216,0.3)" />
                      <text x="56" y={y + 4} textAnchor="middle">{i + 1}</text>
                    </g>
                  ))}
                </g>

                {/* ===== site boundary (property line — dash-dot) ===== */}
                <motion.rect
                  x="90" y="66" width="690" height="400"
                  fill="none" stroke="rgba(232,228,216,0.55)" strokeWidth="1.4"
                  strokeDasharray="14 5 3 5"
                  {...draw(reduced, 0.1, 1.8)}
                />

                {/* ===== terrain: earth-brown hatch band along the south ===== */}
                <motion.g {...fade(reduced, 0.7)}>
                  <rect x="91" y="398" width="688" height="66" fill="rgba(107,81,56,0.22)" />
                  <g stroke="rgba(166,138,98,0.55)" strokeWidth="1">
                    {Array.from({ length: 45 }).map((_, i) => (
                      <line key={`soil${i}`} x1={96 + i * 15.4} y1="464" x2={88 + i * 15.4} y2="452" />
                    ))}
                  </g>
                  <text x="100" y="416" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="2" fill="rgba(166,138,98,0.75)">
                    LANDSCAPE / SOIL
                  </text>
                </motion.g>

                {/* ===== roads ===== */}
                <motion.g {...fade(reduced, 0.35)}>
                  {/* main road (horizontal) */}
                  <rect x="90" y="352" width="690" height="40" fill="rgba(232,228,216,0.045)" />
                  <line x1="90" y1="352" x2="780" y2="352" stroke="rgba(232,228,216,0.4)" strokeWidth="1.2" />
                  <line x1="90" y1="392" x2="780" y2="392" stroke="rgba(232,228,216,0.4)" strokeWidth="1.2" />
                  {/* centre line */}
                  <line x1="90" y1="372" x2="780" y2="372" stroke="rgba(232,228,216,0.35)" strokeWidth="1" strokeDasharray="16 10" />
                  {/* side road (vertical) */}
                  <rect x="620" y="66" width="34" height="286" fill="rgba(232,228,216,0.045)" />
                  <line x1="620" y1="66" x2="620" y2="352" stroke="rgba(232,228,216,0.4)" strokeWidth="1.2" />
                  <line x1="654" y1="66" x2="654" y2="352" stroke="rgba(232,228,216,0.4)" strokeWidth="1.2" />
                  <line x1="637" y1="80" x2="637" y2="340" stroke="rgba(232,228,216,0.3)" strokeWidth="1" strokeDasharray="12 9" />
                  {/* kerb ticks */}
                  <g stroke="rgba(232,228,216,0.28)" strokeWidth="1">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <line key={`k${i}`} x1={104 + i * 50} y1="352" x2={98 + i * 50} y2="344" />
                    ))}
                  </g>
                  <text x="704" y="376" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="2" fill="rgba(232,228,216,0.45)">
                    ACCESS ROAD
                  </text>
                </motion.g>

                {/* ===== neighbouring plots (concrete gray) ===== */}
                <motion.g {...fade(reduced, 0.5)}>
                  <rect x="110" y="86" width="150" height="110" fill="rgba(232,228,216,0.03)" stroke="rgba(232,228,216,0.3)" strokeWidth="1" />
                  <text x="185" y="145" fontSize="8.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.6" fill="rgba(184,181,170,0.55)" textAnchor="middle">
                    PLOT 02
                  </text>
                  <rect x="110" y="216" width="150" height="110" fill="rgba(232,228,216,0.03)" stroke="rgba(232,228,216,0.3)" strokeWidth="1" />
                  <text x="185" y="275" fontSize="8.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.6" fill="rgba(184,181,170,0.55)" textAnchor="middle">
                    PLOT 03
                  </text>
                </motion.g>

                {/* ===== the highlighted building (gold) ===== */}
                <motion.g {...fade(reduced, 0.65)}>
                  <rect x="290" y="86" width="290" height="240" fill="rgba(201,162,39,0.06)" stroke="#c9a227" strokeWidth="1.6" />
                  {/* interior BIM-style walls */}
                  <g stroke="rgba(201,162,39,0.4)" strokeWidth="1">
                    <line x1="290" y1="166" x2="580" y2="166" />
                    <line x1="290" y1="246" x2="580" y2="246" />
                    <line x1="435" y1="86" x2="435" y2="166" />
                    <line x1="435" y1="246" x2="435" y2="326" />
                    <line x1="510" y1="166" x2="510" y2="326" />
                  </g>
                  <text x="435" y="132" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="3" fill="#e3c15a" textAnchor="middle">
                    BIM MODEL
                  </text>
                  <text x="435" y="212" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="2" fill="rgba(227,193,90,0.6)" textAnchor="middle">
                    LEVEL 01
                  </text>
                  <text x="435" y="292" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="2" fill="rgba(227,193,90,0.6)" textAnchor="middle">
                    LEVEL 02
                  </text>
                </motion.g>

                {/* ===== trees / landscape (south strip) ===== */}
                <motion.g {...fade(reduced, 0.8)}>
                  {[130, 190, 330, 470, 560, 720].map((x, i) => (
                    <g key={`tree${i}`} transform={`translate(${x}, 428)`}>
                      <circle r="9" fill="none" stroke="rgba(166,138,98,0.65)" strokeWidth="1" />
                      <line x1="0" y1="-9" x2="0" y2="9" stroke="rgba(166,138,98,0.4)" strokeWidth="0.8" />
                      <line x1="-9" y1="0" x2="9" y2="0" stroke="rgba(166,138,98,0.4)" strokeWidth="0.8" />
                    </g>
                  ))}
                </motion.g>

                {/* ===== dimension chains ===== */}
                {/* bottom overall dimension */}
                <motion.g stroke="rgba(201,162,39,0.65)" strokeWidth="1" {...fade(reduced, 1.0)}>
                  <line x1="290" y1="500" x2="580" y2="500" />
                  <line x1="290" y1="493" x2="290" y2="507" />
                  <line x1="580" y1="493" x2="580" y2="507" />
                </motion.g>
                <motion.text x="435" y="492" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="2" fill="rgba(227,193,90,0.8)" textAnchor="middle" {...fade(reduced, 1.15)}>
                  36 000
                </motion.text>
                {/* right-side dimension */}
                <motion.g stroke="rgba(201,162,39,0.5)" strokeWidth="1" {...fade(reduced, 1.1)}>
                  <line x1="806" y1="86" x2="806" y2="326" />
                  <line x1="799" y1="86" x2="813" y2="86" />
                  <line x1="799" y1="326" x2="813" y2="326" />
                </motion.g>
                <motion.text x="818" y="210" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="2" fill="rgba(227,193,90,0.65)" {...fade(reduced, 1.2)} style={{ writingMode: 'vertical-rl' }}>
                  30 000
                </motion.text>

                {/* ===== section marker A-A ===== */}
                <motion.g stroke="#c9a227" strokeWidth="1.4" {...fade(reduced, 1.25)}>
                  <line x1="240" y1="40" x2="240" y2="478" strokeDasharray="18 6 4 6" opacity="0.7" />
                  <path d="M240 40 l-6 12 h12 z" fill="#c9a227" />
                  <path d="M240 478 l-6 -12 h12 z" fill="#c9a227" />
                </motion.g>
                <motion.text x="228" y="30" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="1" fill="#e3c15a" {...fade(reduced, 1.3)}>
                  A
                </motion.text>

                {/* ===== north arrow ===== */}
                <motion.g transform="translate(760,110)" {...fade(reduced, 1.35)}>
                  <circle r="20" fill="none" stroke="rgba(232,228,216,0.4)" strokeWidth="1" />
                  <path d="M0 -14 L6 8 L0 4 L-6 8 Z" fill="#c9a227" />
                  <text y="-28" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="2" fill="rgba(232,228,216,0.6)">
                    NORTH
                  </text>
                </motion.g>

                {/* ===== scale bar ===== */}
                <motion.g transform="translate(96, 524)" {...fade(reduced, 1.4)}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <rect key={i} x={i * 26} y="0" width="26" height="6"
                      fill={i % 2 ? 'rgba(232,228,216,0.65)' : 'rgba(232,228,216,0.2)'}
                      stroke="rgba(232,228,216,0.4)" strokeWidth="0.6" />
                  ))}
                  <text x="0" y="20" fontSize="7.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5" fill="rgba(232,228,216,0.5)">0</text>
                  <text x="130" y="20" fontSize="7.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5" fill="rgba(232,228,216,0.5)" textAnchor="middle">10 m</text>
                  <text x="150" y="20" fontSize="7.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1" fill="rgba(232,228,216,0.35)">SCALE 1:100</text>
                </motion.g>

                {/* ===== coordinates ===== */}
                <motion.g fontSize="8" fontFamily="JetBrains Mono, monospace" fill="rgba(232,228,216,0.4)" {...fade(reduced, 1.45)}>
                  <text x="90" y="550">X: 245.20</text>
                  <text x="170" y="550">Y: 182.40</text>
                  <text x="248" y="550">ELEV. +12.60</text>
                  <text x="778" y="550" fill="rgba(201,162,39,0.6)" textAnchor="end">DWG A-101 · REV 03</text>
                </motion.g>
              </svg>

              {/* title block (drafting sheet corner) */}
              <div className="absolute bottom-3 right-3 z-20 hidden select-none border border-line/15 bg-black-950/85 px-3 py-2 sm:block" aria-hidden>
                <p className="label text-[0.5rem] text-concrete">SITE PLAN</p>
                <p className="label mt-1 text-[0.55rem] text-gold">VISUAL BIM · A-101</p>
              </div>
            </div>
          </Reveal>

          {/* ---- Right rail: stage list + pipeline note ---- */}
          <div className="lg:col-span-4">
            <div className="space-y-1.5">
              {STAGES.map((s, i) => (
                <Reveal key={s.name} delay={0.1 + i * 0.08}>
                  <div className="group flex items-center gap-4 border border-line/10 bg-black-950/60 px-4 py-4 transition-colors duration-500 hover:border-gold/40">
                    <span className="label flex h-7 w-9 flex-none items-center justify-center border border-gold/30 text-[0.55rem] text-gold">
                      0{i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-display text-base font-semibold tracking-tight text-warm">{s.name}</p>
                      <p className="mt-0.5 text-xs text-concrete">{s.note}</p>
                    </div>
                    <span className="h-4 w-px bg-gold/50 transition-all duration-300 group-hover:h-6" aria-hidden />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.35}>
              <div className="mt-8 border border-line/10 bg-black-950/60 p-5">
                <div className="flex items-center gap-3 border-l border-gold/60 pl-4">
                  <Icon name="move-3d" size={16} className="flex-none text-gold" />
                  <p className="text-sm leading-relaxed text-concrete-light">
                    From survey data to a coordinated digital twin — roads, terrain and
                    structures mapped, measured and modelled.
                  </p>
                </div>
                {/* mini legend */}
                <div className="mt-5 space-y-2 border-t border-line/10 pt-4" aria-hidden>
                  {[
                    { c: 'border-gold', t: 'MODELLED STRUCTURE' },
                    { c: 'border-line/50', t: 'SITE BOUNDARY / PLOTS' },
                    { c: 'border-sand', t: 'TERRAIN & LANDSCAPE' },
                  ].map((l) => (
                    <div key={l.t} className="flex items-center gap-3">
                      <span className={`h-2 w-6 border ${l.c} bg-transparent`} />
                      <span className="label text-[0.5rem] text-concrete/70">{l.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
