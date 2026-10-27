'use client';

/**
 * Preloader.tsx
 *
 * 000 → 100 mono counter over ~1.4s, then the overlay slides up.
 * First visit per session only. PRELOADER_GATE runs inline in <head>
 * before first paint: on repeat visits or under reduced motion it marks
 * <html data-skip-preloader>, and globals.css hides the overlay, so it
 * never flashes.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';

const SEEN_KEY = 'hr-preloaded';
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const PRELOADER_GATE = `try{if(sessionStorage.getItem('${SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-skip-preloader','')}catch(e){document.documentElement.setAttribute('data-skip-preloader','')}`;

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const countRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (document.documentElement.hasAttribute('data-skip-preloader')) {
      setVisible(false);
      return;
    }
    const controls = animate(0, 100, {
      duration: 1.4,
      ease: EASE_IN_OUT,
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, '0');
      },
      onComplete: () => {
        try {
          sessionStorage.setItem(SEEN_KEY, '1');
        } catch {}
        setVisible(false);
      },
    });
    return () => controls.stop();
  }, []);

  // Hold scroll while the overlay is up.
  useEffect(() => {
    if (!lenis) return;
    if (visible) lenis.stop();
    else lenis.start();
  }, [lenis, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader fixed inset-0 z-[100] flex items-end justify-between bg-ink px-gutter pb-gutter"
          aria-hidden="true"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: EASE_IN_OUT }}
        >
          <span className="label">[ Hamid Rizvi / Portfolio ]</span>
          <span ref={countRef} className="font-mono text-[clamp(3rem,10vw,8rem)] leading-none tabular-nums text-beige">
            000
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
