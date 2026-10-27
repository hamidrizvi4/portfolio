'use client';

/**
 * FooterCTA.tsx
 *
 * Eyebrow → giant magnetic "Let's build it." (links to /contact) → email
 * copy + socials → bottom bar (location, live time, back to top) → the
 * cropped full-width wordmark. Magnetic pull is mouse-only and off under
 * reduced motion.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { profile } from '@/lib/personal-data';
import { SOCIALS, useNycTime } from '@/lib/site';
import { useMotionPrefs } from './Providers';

export default function FooterCTA() {
  const time = useNycTime();
  const lenis = useLenis();
  const { reduced } = useMotionPrefs();
  const [toast, setToast] = useState('');

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const pull = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const release = () => {
    x.set(0);
    y.set(0);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setToast('Email copied to clipboard');
    } catch {
      // Clipboard blocked: fall back to the mail client.
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const toTop = () => (lenis ? lenis.scrollTo(0, { immediate: reduced }) : window.scrollTo({ top: 0 }));

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-rule pt-section">
      <div className="container-site">
        <p className="label">[ Got a messy workflow? ]</p>

        <motion.div className="mt-6 inline-block" style={{ x: springX, y: springY }}>
          <Link
            href="/contact"
            onPointerMove={pull}
            onPointerLeave={release}
            className="group relative inline-block font-display text-[clamp(3.5rem,12vw,11rem)] italic leading-[0.95] tracking-[-0.03em] text-beige"
          >
            Let&apos;s build it.
            <span
              aria-hidden="true"
              className="absolute bottom-[0.06em] left-0 h-[2px] w-full origin-left scale-x-0 bg-burgundy-bright transition-transform duration-slow ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </Link>
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
          <button
            type="button"
            onClick={copyEmail}
            className="group flex items-baseline gap-3 text-left text-lg text-beige"
            aria-label={`${profile.email}, copy to clipboard`}
          >
            <span className="underline-offset-4 group-hover:underline">{profile.email}</span>
            <span className="label">[ copy ]</span>
          </button>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="label hover:!text-beige">
              {s.label} ↗
            </a>
          ))}
        </div>

        <div className="mt-section flex flex-wrap items-center justify-between gap-4 border-t border-rule py-5">
          <span className="label">New York, NY</span>
          <span className="label tabular-nums">{time ?? '--:--'}</span>
          <button type="button" onClick={toTop} className="label hover:!text-beige">
            Back to top ↑
          </button>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.22em] select-none whitespace-nowrap text-center font-display text-[15.5vw] leading-[0.8] text-ink-3"
      >
        HAMID RIZVI
      </p>

      <p
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-rule bg-ink-2 px-5 py-2 text-sm text-beige transition-opacity duration-base ${
          toast ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {toast}
      </p>
    </footer>
  );
}
