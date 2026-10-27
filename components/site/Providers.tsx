'use client';

/**
 * Providers.tsx
 *
 * One client boundary for the two app-wide concerns:
 *  - Motion preferences: OS-level reduced motion plus the visible
 *    "Pause motion" toggle that stops every marquee site-wide.
 *  - Lenis smooth scroll, with smooth wheel turned off under reduced motion.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';

interface MotionPrefs {
  /** OS asks for reduced motion. */
  reduced: boolean;
  /** Visitor pressed "Pause motion". */
  paused: boolean;
  /** Either of the above: decorative motion should stop. */
  still: boolean;
  togglePaused: () => void;
}

const MotionPrefsContext = createContext<MotionPrefs>({
  reduced: false,
  paused: false,
  still: false,
  togglePaused: () => {},
});

export const useMotionPrefs = () => useContext(MotionPrefsContext);

const PAUSE_KEY = 'hr-motion-paused';

export default function Providers({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    try {
      setPaused(localStorage.getItem(PAUSE_KEY) === '1');
    } catch {
      // Storage blocked (private mode): default to motion on.
    }
  }, []);

  // CSS-driven loops (marquees) read this attribute, so pausing needs no re-render.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-motion-paused', paused || reduced);
  }, [paused, reduced]);

  const togglePaused = useCallback(() => {
    setPaused((p) => {
      try {
        localStorage.setItem(PAUSE_KEY, p ? '0' : '1');
      } catch {}
      return !p;
    });
  }, []);

  return (
    <MotionPrefsContext.Provider value={{ reduced, paused, still: reduced || paused, togglePaused }}>
      {/* reducedMotion="user": Framer drops transform animations for visitors who ask. */}
      <MotionConfig reducedMotion="user">
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduced, anchors: true }}>
          {children}
        </ReactLenis>
      </MotionConfig>
    </MotionPrefsContext.Provider>
  );
}
