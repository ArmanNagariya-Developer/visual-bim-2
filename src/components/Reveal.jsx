import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Scroll reveal — fade + rise. Respects reduced motion.
 */
export function Reveal({ children, delay = 0, y = 26, className = '', once = true, as = 'div' }) {
  const reduced = useReducedMotion();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/**
 * Masked word-by-word text reveal for headings.
 *
 * Each word animates as a unit while its own clip wrapper is the
 * IntersectionObserver target — a word translated 115% inside an
 * overflow:hidden parent has zero visible area, so observing the inner
 * span can deadlock (it never "enters" the viewport and never animates
 * back). Observing the outer, un-translated wrapper guarantees the
 * callback fires while the heading is on screen.
 */
export function RevealText({ text, className = '', delay = 0, once = true, perWord = 0.05 }) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once, margin: '-40px' }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '115%' },
              visible: {
                y: 0,
                transition: { duration: 0.85, ease: EASE, delay: delay + i * perWord },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}
