import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, projectCategories } from '../data/projects';
import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { Reveal } from './Reveal';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const handleClose = useCallback(() => setSelected(null), []);

  const filtered = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section
      id="projects"
      className="relative scroll-mt-20 overflow-hidden border-t border-line/8 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="blueprint absolute inset-0 opacity-20" />
        <div className="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-gold/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="05"
          kicker="Portfolio"
          title="Our Projects"
          description="Digital models created for real-world building environments."
        />

        {/* filters */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-2.5 border-b border-line/10 pb-6">
            {projectCategories.map((cat) => {
              const on = filter === cat;
              const count =
                cat === 'All'
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`group relative flex items-center gap-2.5 border px-4 py-2.5 transition-all duration-300 ${
                    on
                      ? 'border-sky bg-gold/10'
                      : 'border-line/12 hover:border-sky/40 hover:bg-gold/[0.04]'
                  }`}
                >
                  <span
                    className={`label text-[0.65rem] transition-colors duration-300 ${
                      on ? 'text-gold' : 'text-concrete-light group-hover:text-warm'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </span>
                  <span
                    className={`label text-[0.55rem] transition-colors duration-300 ${
                      on ? 'text-gold/80' : 'text-concrete/60'
                    }`}
                  >
                    {String(count).padStart(2, '0')}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="filter-active"
                      className="absolute -bottom-[1.55rem] left-0 right-0 h-px bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* gallery */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-concrete/75">
            No projects in this category yet.
          </p>
        )}
      </div>

      <ProjectModal project={selected} onClose={handleClose} />
    </section>
  );
}
