'use client';

/**
 * Cursor.tsx
 *
 * Desktop only (fine pointer, motion allowed): a small beige dot that trails
 * the pointer and grows into a labeled circle over any element carrying
 * data-cursor="View" | "Drag". The system cursor is hidden only over those
 * elements (html.has-custom-cursor in globals.css). The circle is always 76px
 * and scaled down to a dot, so growing is transform-only.
 */

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SIZE = 76;
const DOT = 8;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const springX = useSpring(x, { stiffness: 700, damping: 45, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 700, damping: 45, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest?.('[data-cursor]');
      setLabel(target?.getAttribute('data-cursor') ?? null);
    };
    const hide = () => setVisible(false);

    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', hide);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="grid place-items-center rounded-full bg-beige text-ink"
        style={{ width: SIZE, height: SIZE, x: '-50%', y: '-50%' }}
        initial={false}
        animate={{ scale: label ? 1 : DOT / SIZE, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="font-mono text-[0.7rem] uppercase tracking-[0.12em]"
          animate={{ opacity: label ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
