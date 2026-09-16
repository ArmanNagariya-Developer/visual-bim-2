/**
 * Technical corner ticks — a reusable "frame" detail. Gold by default.
 */
export default function Corners({ size = 'w-3.5 h-3.5', color = 'border-gold/60' }) {
  const base = `pointer-events-none absolute ${size} ${color}`;
  return (
    <>
      <span className={`${base} top-0 left-0 border-t border-l`} aria-hidden />
      <span className={`${base} top-0 right-0 border-t border-r`} aria-hidden />
      <span className={`${base} bottom-0 left-0 border-b border-l`} aria-hidden />
      <span className={`${base} bottom-0 right-0 border-b border-r`} aria-hidden />
    </>
  );
}
