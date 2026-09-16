/**
 * Scroll progress — a thin technical bar pinned to the top of the viewport.
 */
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-gold-dim via-gold to-gold-light"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
