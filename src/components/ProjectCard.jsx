import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ProjectVisual from './ProjectVisual';
import Corners from './Corners';
import Icon from './Icon';

const EASE = [0.16, 1, 0.3, 1];

export default function ProjectCard({ project, index, onOpen }) {
  const reduced = useReducedMotion();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 5, ry: px * 5 });
  };

  const handleLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index * 0.07, 0.4) }}
      className="group relative h-full"
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="panel panel-hover relative block h-full w-full overflow-hidden text-left"
        aria-label={`View project: ${project.title}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <Corners />

        {/* image area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-black-950">
          <motion.div
            className="absolute inset-0"
            whileHover={reduced ? undefined : { scale: 1.06 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <ProjectVisual
                scene={project.scene}
                seed={project.seed}
                className="h-full w-full"
              />
            )}
          </motion.div>

          {/* dark overlay (deepens on hover) */}
          <div className="absolute inset-0 bg-black-950/45 transition-opacity duration-500 group-hover:bg-black-950/15" />

          {/* category chip */}
          <span className="absolute left-4 top-4 z-10 border border-sky/25 bg-black-950/75 px-3 py-1.5 label text-[0.55rem] text-gold backdrop-blur-sm">
            {project.category}
          </span>

          {/* hover info block */}
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="glass border border-sky/20 p-3.5">
              <p className="text-xs leading-relaxed text-warm/90 line-clamp-2">
                {project.desc}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.services.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="label border border-line/12 bg-gold/[0.06] px-2 py-0.5 text-[0.5rem] text-concrete-light"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* arrow */}
          <span className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-sky/25 bg-black-950/75 text-gold backdrop-blur-sm transition-all duration-500 group-hover:border-sky group-hover:bg-gold/15">
            <Icon
              name="arrow-up-right"
              size={15}
              strokeWidth={1.8}
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>

        {/* footer info */}
        <div className="flex items-end justify-between gap-4 p-5">
          <div>
            <span className="label text-gold/75">{project.type}</span>
            <h3 className="mt-1.5 text-base font-semibold leading-tight tracking-tight text-warm transition-colors duration-300 group-hover:text-gold">
              {project.title}
            </h3>
            <p className="mt-1 text-xs text-concrete/80">
              {project.year} · {project.lod}
            </p>
          </div>
          <span className="label shrink-0 text-[0.55rem] text-concrete/60">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </button>
    </motion.article>
  );
}
