import { motion, useReducedMotion } from 'framer-motion';
import { company, stats } from '../data/company';
import SectionHeading from './SectionHeading';
import { Reveal } from './Reveal';
import AboutVisual from './AboutVisual';
import Icon from './Icon';
import Corners from './Corners';

const CARDS = [
  {
    icon: 'target',
    title: 'Precision',
    desc: 'Accurate digital representation of real-world conditions.',
  },
  {
    icon: 'gauge',
    title: 'Efficiency',
    desc: 'Streamlined workflows that reduce unnecessary manual work.',
  },
  {
    icon: 'chip',
    title: 'Intelligence',
    desc: 'Data-rich BIM models that support better project decisions.',
  },
  {
    icon: 'nodes',
    title: 'Coordination',
    desc: 'Coordinated digital models for architecture, structure, and MEP.',
  },
];

/* Technical drawing annotations decorating the visual panel. */
const TECH_LABELS = ['BIM', '3D MODEL', 'SCAN TO BIM', 'ARCHITECTURAL', 'STRUCTURAL', 'MEP'];

export default function About() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="relative scroll-mt-20 overflow-hidden bg-black-900 py-24 sm:py-32">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="blueprint absolute inset-0 opacity-30" />
        <div className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-gold/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="01"
          kicker="About Visual BIM"
          title="Turning Reality Into Intelligent Digital Models"
        />

        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* left — visual */}
          <Reveal className="order-2 lg:order-1" y={36}>
            <div className="relative">
              <AboutVisual />
              {/* drafting annotations around the figure */}
              <div className="pointer-events-none absolute -left-3 top-8 hidden select-none flex-col gap-2 xl:flex" aria-hidden>
                {TECH_LABELS.slice(0, 3).map((t) => (
                  <span key={t} className="label flex items-center gap-2 text-[0.5rem] text-concrete/70">
                    <span className="h-px w-4 bg-gold/50" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute -right-3 bottom-10 hidden select-none flex-col items-end gap-2 xl:flex" aria-hidden>
                {TECH_LABELS.slice(3).map((t) => (
                  <span key={t} className="label flex items-center gap-2 text-[0.5rem] text-concrete/70">
                    {t}
                    <span className="h-px w-4 bg-gold/50" />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* right — mission + cards */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="relative border-l-2 border-gold/60 pl-6">
                <Icon
                  name="quote"
                  size={26}
                  className="mb-4 text-gold/60"
                  strokeWidth={1.2}
                />
                <p className="font-display text-lg font-medium leading-relaxed text-warm sm:text-xl">
                  {company.mission}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-line/10 bg-line/10 sm:grid-cols-2">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-black-850/95 px-5 py-5 transition-colors duration-300 hover:bg-blueprint-900"
                  >
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-semibold text-warm">{s.value}</span>
                      <span className="text-sm font-medium text-gold">{s.suffix}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-tight text-concrete">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="mt-10 space-y-3">
              {CARDS.map((card, i) => (
                <Reveal key={card.title} delay={0.16 + i * 0.07}>
                  <motion.div
                    whileHover={reduced ? undefined : { x: 4 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="panel panel-hover group flex items-start gap-4 rounded-[4px] p-5"
                  >
                    <span className="relative flex h-11 w-11 flex-none items-center justify-center border border-line/15 text-gold transition-all duration-300 group-hover:border-gold/60 group-hover:bg-gold/[0.06]">
                      <Corners size="w-2 h-2" />
                      <Icon name={card.icon} size={19} />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight text-warm">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-concrete-light">
                        {card.desc}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
