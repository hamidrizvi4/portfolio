'use client';

/**
 * template.tsx
 *
 * Next remounts this on every route change, so each new page fades up in.
 * The first load is skipped: server HTML paints immediately (no invisible
 * page while JS loads) and the preloader already covers the entrance.
 * MotionConfig in Providers drops the lift under reduced motion.
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';

let firstMount = true;

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    firstMount = false;
  }, []);

  return (
    <motion.div
      initial={firstMount ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
