import { Reveal, RevealText } from './Reveal';

/**
 * Section heading block: mono kicker with index tick over a drafting-style
 * dimension line, large display title, optional supporting description.
 */
export default function SectionHeading({
  index,
  kicker,
  title,
  description,
  align = 'left',
  className = '',
  titleClassName = '',
}) {
  const centered = align === 'center';
  return (
    <div
      className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start'} ${className}`}
    >
      <Reveal>
        <div className="mb-5 flex items-center gap-3">
          {index && (
            <span className="label text-gold" style={{ letterSpacing: '0.2em' }}>
              {index}
            </span>
          )}
          {/* architectural dimension line with end ticks */}
          <span className="relative h-px w-12 bg-gold/50" aria-hidden>
            <span className="absolute -top-[3px] left-0 h-[7px] w-px bg-gold/70" />
            <span className="absolute -top-[3px] right-0 h-[7px] w-px bg-gold/70" />
          </span>
          {kicker && (
            <span className="label text-concrete-light" style={{ letterSpacing: '0.24em' }}>
              {kicker}
            </span>
          )}
        </div>
      </Reveal>

      <h2
        className={`max-w-3xl font-display text-[clamp(1.9rem,4.4vw,3.35rem)] font-semibold leading-[1.06] tracking-tight ${titleClassName}`}
      >
        <RevealText text={title} />
      </h2>

      {description && (
        <Reveal delay={0.15}>
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed text-concrete-light sm:text-lg ${
              centered ? 'mx-auto' : ''
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
