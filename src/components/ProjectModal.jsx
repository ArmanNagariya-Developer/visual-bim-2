import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ProjectVisual from './ProjectVisual';
import Icon from './Icon';
import Corners from './Corners';
import MagneticButton from './MagneticButton';

const EASE = [0.16, 1, 0.3, 1];

export default function ProjectModal({ project, onClose }) {
  const reduced = useReducedMotion();

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  // Escape-to-close + scroll lock, only while a project is open.
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const body = document.body;
    body.classList.add('lenis-stopped');
    window.__lenis?.stop?.();
    return () => {
      window.removeEventListener('keydown', onKey);
      body.classList.remove('lenis-stopped');
      window.__lenis?.start?.();
    };
  }, [project, close]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.001 : 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Project details: ${project.title}`}
          onClick={close}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black-950/85 backdrop-blur-md"
            aria-hidden
          />

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="panel relative max-h-[92svh] w-full max-w-5xl overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <Corners />

            {/* close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close project details"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center border border-sky/25 bg-black-950/80 text-warm backdrop-blur-sm transition-colors hover:border-sky hover:text-gold"
            >
              <Icon name="x" size={17} />
            </button>

            {/* hero visual */}
            <div className="relative h-56 w-full overflow-hidden bg-black-950 sm:h-80">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProjectVisual
                  scene={project.scene}
                  seed={project.seed}
                  className="h-full w-full"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black-950 via-black-950/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="label border border-sky/25 bg-black-950/70 px-3 py-1.5 text-[0.55rem] text-gold">
                  {project.category}
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-warm sm:text-3xl">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* body */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h4 className="label text-concrete-light">Project Description</h4>
                  <p className="mt-3 text-sm leading-relaxed text-warm/85 sm:text-base">
                    {project.desc}
                  </p>

                  <h4 className="label mt-8 text-concrete-light">Technical Information</h4>
                  <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden border border-line/10 bg-gold/10">
                    {[
                      ['Project Type', project.type],
                      ['Location', project.location],
                      ['Year', project.year],
                      ['BIM Level / LOD', project.lod],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-black-850/95 px-4 py-3.5">
                        <p className="label text-[0.5rem] text-concrete/75">{k}</p>
                        <p className="mt-1 text-sm font-medium text-warm">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="label text-concrete-light">Services Used</h4>
                  <div className="mt-3 space-y-2">
                    {project.services.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-3 border border-line/10 bg-blueprint-900/55 px-4 py-3"
                      >
                        <Icon name="check" size={14} className="flex-none text-gold" strokeWidth={2.2} />
                        <span className="text-sm text-warm/90">{s}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border border-line/10 bg-blueprint-900/50 p-4">
                    <p className="label text-[0.5rem] text-concrete/75">Deliverable Format</p>
                    <p className="mt-1.5 text-sm font-medium text-gold">
                      RVT · IFC · DWG · NWD
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-line/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-concrete/75">
                  Project shown for illustration. Figures are placeholders pending official data.
                </p>
                <MagneticButton
                  variant="outline"
                  className="!px-5 !py-2.5 !text-[0.7rem]"
                  onClick={() => {
                    close();
                    requestAnimationFrame(() => window.scrollToSection?.('contact'));
                  }}
                >
                  Request Similar Project
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
