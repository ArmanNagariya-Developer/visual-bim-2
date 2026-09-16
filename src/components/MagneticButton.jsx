import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import Icon from './Icon';

const VARIANTS = {
  primary:
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-[4px] bg-gold px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-black-950 transition-colors duration-300 hover:bg-gold-light',
  outline:
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-[4px] border border-gold/45 bg-transparent px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-warm transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black-950',
  ghost:
    'group relative inline-flex items-center justify-center gap-2 rounded-[4px] px-2 py-1 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-concrete-light transition-colors duration-300 hover:text-gold',
};

/**
 * Magnetic button — translates slightly toward the cursor.
 * `primary` / `outline` variants include a light sheen sweep on hover.
 */
export default function MagneticButton({
  as = 'button',
  href,
  target,
  rel,
  onClick,
  type = 'button',
  children,
  variant = 'primary',
  className = '',
  arrow = true,
  strength = 0.4,
  disabled = false,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 170, damping: 16, mass: 0.12 });
  const springY = useSpring(y, { stiffness: 170, damping: 16, mass: 0.12 });

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = motion[as] || motion.button;

  const sharedProps = {
    ref,
    onClick,
    disabled,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: { x: springX, y: springY },
    whileTap: reduced ? undefined : { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
    className: `${VARIANTS[variant] || VARIANTS.primary} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`,
    ...rest,
  };

  const content = (
    <>
      {/* sheen sweep */}
      {(variant === 'primary' || variant === 'outline') && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[4px]">
          <span className="absolute inset-y-0 -left-2/5 w-2/5 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {children}
        {arrow && (
          <Icon
            name="arrow-right"
            size={16}
            strokeWidth={2}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          />
        )}
      </span>
    </>
  );

  if (as === 'a') {
    return (
      <Comp href={href} target={target} rel={rel} {...sharedProps}>
        {content}
      </Comp>
    );
  }

  return (
    <Comp type={type} {...sharedProps}>
      {content}
    </Comp>
  );
}
