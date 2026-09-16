import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import Corners from './Corners';
import ServiceViz from './ServiceViz';

const EASE = [0.16, 1, 0.3, 1];

const ICONS = {
  'scan-to-bim': 'viewfinder',
  'scan-to-cad': 'grid',
  'pdf-to-bim': 'file',
  'cad-to-bim': 'box',
  'revit-modeling': 'layers',
  'bim-3d-modeling': 'nodes',
  'as-built-modeling': 'clipboard-check',
};

export default function ServiceCard({ service, index }) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const icon = ICONS[service.id] || 'box';

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.09 }}
      whileHover={reduced ? undefined : { y: -6 }}
      className="panel panel-hover group relative flex h-full flex-col overflow-hidden rounded-[4px]"
      tabIndex={0}
      aria-label={service.title}
    >
      <Corners />

      {/* gold technical line that draws itself on hover */}
      <span
        className="pointer-events-none absolute inset-x-6 top-[4.6rem] h-px origin-left bg-gradient-to-r from-gold/0 via-gold/70 to-gold/0 transition-all duration-500"
        style={{ transform: hovered ? 'scaleX(1)' : 'scaleX(0)' }}
      />

      {/* viz */}
      <div className="relative">
        <ServiceViz variant={service.viz} active={hovered} />

        {/* index badge */}
        <span className="label absolute right-3 top-3 z-10 border border-gold/25 bg-black-950/80 px-2 py-1 text-[0.55rem] text-gold">
          {service.num}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3.5">
          <motion.span
            className="relative flex h-11 w-11 flex-none items-center justify-center border border-line/15 text-gold transition-colors duration-300 group-hover:border-gold/60 group-hover:bg-gold/[0.06]"
            animate={reduced || !hovered ? {} : { rotate: [0, -6, 6, 0] }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Corners size="w-2 h-2" />
            <Icon name={icon} size={19} />
          </motion.span>
          <h3 className="font-display text-lg font-semibold tracking-tight text-warm">
            {service.title}
          </h3>
        </div>

        <span className="label mt-4 text-gold/75">{service.tag}</span>

        <p className="mt-3 text-sm leading-relaxed text-concrete-light">{service.desc}</p>

        {/* hover-revealed detail */}
        <motion.div
          className="mt-4 overflow-hidden"
          initial={false}
          animate={{
            height: hovered ? 'auto' : 0,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="border-t border-line/10 pt-3.5">
            <ul className="flex flex-wrap gap-1.5">
              {service.bullets.map((b) => (
                <li
                  key={b}
                  className="label border border-gold/15 bg-gold/[0.05] px-2 py-1 text-[0.55rem] text-concrete-light"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-auto pt-6">
          <span className="inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-gold transition-colors">
            <span className="h-px w-5 bg-gold/45 transition-all duration-300 group-hover:w-8 group-hover:bg-gold" />
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              {service.title}
            </span>
            <Icon
              name="arrow-right"
              size={13}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
