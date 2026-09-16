/**
 * BIMProcess — "From Reality to Digital Intelligence"
 *
 * A vertical timeline of 5 stages. The progress line draws itself as the
 * user scrolls (scroll-driven), each step activates and reveals in turn.
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Reveal } from './Reveal';
import Icon from './Icon';

const STEPS = [
  {
    num: '01',
    title: 'Capture',
    icon: 'camera',
    desc: 'Capture existing conditions using laser scanning / point-cloud data.',
    meta: 'TERRESTRIAL SCAN · REGISTERED',
  },
  {
    num: '02',
    title: 'Process',
    icon: 'viewfinder',
    desc: 'Process and organize collected information.',
    meta: 'CLEAN · CLASSIFY · SEGMENT',
  },
  {
    num: '03',
    title: 'Model',
    icon: 'box',
    desc: 'Create accurate BIM/CAD models.',
    meta: 'REVIT · PARAMETRIC · LOD',
  },
  {
    num: '04',
    title: 'Coordinate',
    icon: 'nodes',
    desc: 'Coordinate architectural, structural, and MEP information.',
    meta: 'CLASH DETECTION · FEDERATED',
  },
  {
    num: '05',
    title: 'Deliver',
    icon: 'clipboard-check',
    desc: 'Deliver intelligent digital models and documentation.',
    meta: 'RVT · IFC · DRAWINGS · FM',
  },
];

export default function BIMProcess() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 55%'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="process"
      className="relative scroll-mt-20 overflow-hidden border-t border-line/8 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="blueprint absolute inset-0 opacity-15" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="03"
          kicker="Workflow"
          title="From Reality to Digital Intelligence"
          description="A structured pipeline that converts physical conditions into coordinated, data-rich models."
        />

        <div ref={ref} className="relative mt-16 pl-0 sm:mt-20 sm:pl-4">
          {/* track */}
          <div className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-line/10 sm:left-[1.4rem]" />

          {/* animated progress line */}
          <motion.div
            className="absolute left-[1.15rem] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-gold-dim via-gold to-gold-light sm:left-[1.4rem]"
            style={{ scaleY: reduced ? 1 : lineScale }}
          />

          <div className="space-y-8 sm:space-y-12">
            {STEPS.map((step, i) => (
              <ProcessRow key={step.num} step={step} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessRow({ step, index, progress }) {
  const reduced = useReducedMotion();
  const start = index / STEPS.length;

  const opacity = useTransform(progress, [start - 0.06, start + 0.05], [0.35, 1]);
  const x = useTransform(progress, [start - 0.06, start + 0.05], [-8, 0]);

  const active = useTransform(progress, [start - 0.02, start + 0.12], [0, 1]);
  const dotScale = useTransform(active, [0, 1], [1, 1.35]);
  const dotColor = useTransform(
    active,
    [0, 1],
    ['rgba(119,117,109,0.5)', '#e3c15a'],
  );

  return (
    <motion.div
      className="relative flex items-start gap-6 sm:gap-8"
      style={reduced ? undefined : { opacity, x }}
    >
      {/* node */}
      <div className="relative z-10 flex h-10 w-10 flex-none items-center justify-center sm:h-11 sm:w-11">
        <motion.span
          className="absolute inset-0 border border-sky/25"
          style={reduced ? undefined : { scale: dotScale, borderColor: dotColor }}
        />
        <span className="h-2 w-2 rounded-full bg-gold" />
        <motion.span
          className="absolute -inset-1.5 border border-sky/20"
          animate={reduced ? undefined : { opacity: [0.5, 0, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.4 }}
        />
      </div>

      <div className="flex-1 pt-1">
        <Reveal delay={0.05}>
          <div className="panel panel-hover group relative overflow-hidden p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="label text-2xl font-semibold text-gold/50 transition-colors duration-300 group-hover:text-gold/75">
                  {step.num}
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <Icon name={step.icon} size={16} className="text-gold" />
                    <h3 className="text-lg font-semibold tracking-tight text-warm">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-concrete-light">
                    {step.desc}
                  </p>
                </div>
              </div>
              <span className="label shrink-0 border border-line/12 bg-gold/[0.04] px-3 py-1.5 text-[0.55rem] text-concrete-light">
                {step.meta}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </motion.div>
  );
}
