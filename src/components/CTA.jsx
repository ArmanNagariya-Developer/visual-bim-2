/**
 * CTA — full-width call-to-action with an animated architectural backdrop.
 */
import { motion, useReducedMotion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import Corners from './Corners';
import Icon from './Icon';

export default function CTA() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-line/10">
      {/* animated architectural backdrop */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-black-950" />
        <div className="blueprint animate-gridpan absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(33,150,243,0.16),transparent_65%)]" />

        {/* wireframe skyline silhouette */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-[0.18]"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{ height: '38vh' }}
        >
          <g fill="none" stroke="#e8e4d8" strokeWidth="1">
            <rect x="40" y="90" width="90" height="110" />
            <rect x="150" y="50" width="70" height="150" />
            <rect x="240" y="110" width="110" height="90" />
            <rect x="370" y="30" width="60" height="170" />
            <rect x="450" y="80" width="120" height="120" />
            <rect x="590" y="120" width="80" height="80" />
            <rect x="690" y="60" width="100" height="140" />
            <rect x="810" y="100" width="90" height="100" />
            <rect x="920" y="40" width="70" height="160" />
            <rect x="1010" y="95" width="120" height="105" />
          </g>
          <g stroke="rgba(232,228,216,0.22)" strokeWidth="1">
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`c${i}`} x1={i * 52} y1="0" x2={i * 52} y2="200" />
            ))}
          </g>
        </svg>

        {/* scanning line */}
        {!reduced && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-scanline absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-sky/50 to-transparent" />
          </div>
        )}
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
        <div className="panel relative mx-auto max-w-4xl p-8 text-center sm:p-14">
          <Corners size="w-5 h-5" />

          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label inline-flex items-center gap-2.5 border border-sky/25 bg-gold/[0.06] px-4 py-2 text-gold"
          >
            <Icon name="spark" size={13} />
            Start Your Digital Build
          </motion.span>

          <h2 className="mt-7 text-[clamp(1.9rem,4.6vw,3.4rem)] font-semibold leading-[1.06] tracking-tight">
            Ready to Transform{' '}
            <span className="text-gradient glow-text">Your Project?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-concrete-light sm:text-lg">
            Turn your existing drawings, scans, and building information into
            accurate and intelligent digital models.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton variant="primary" onClick={() => window.scrollToSection?.('contact')}>
              Start a Project
            </MagneticButton>
            <MagneticButton
              variant="outline"
              onClick={() => window.scrollToSection?.('services')}
            >
              Explore Services
            </MagneticButton>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-line/10 pt-8">
            {['LOD 100–500', 'Revit · CAD', 'Global Delivery'].map((t) => (
              <span key={t} className="label flex items-center gap-2 text-concrete/80">
                <Icon name="check" size={12} className="text-gold" strokeWidth={2.4} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
