'use client';

/**
 * Header.tsx
 *
 * Wordmark · live NYC time · nav + "Get in touch" pill. Hides on scroll
 * down, returns on scroll up (and whenever it receives keyboard focus).
 * Below md, a Menu button opens a full-screen overlay; while it is open
 * the page content is marked `inert`, which keeps keyboard focus in the
 * menu without a hand-rolled focus trap.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { profile } from '@/lib/personal-data';
import { NAV, SOCIALS, useNycTime } from '@/lib/site';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const INERT_WHEN_MENU_OPEN = ['main', 'site-footer'];

export default function Header() {
  const pathname = usePathname();
  const time = useNycTime();
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
    setScrolled(y > 8);
  });

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    INERT_WHEN_MENU_OPEN.forEach((id) => document.getElementById(id)?.setAttribute('inert', ''));
    firstLinkRef.current?.focus();

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const menuButton = menuButtonRef.current;
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis?.start();
      document.documentElement.style.overflow = '';
      INERT_WHEN_MENU_OPEN.forEach((id) => document.getElementById(id)?.removeAttribute('inert'));
      menuButton?.focus();
    };
  }, [open, lenis]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-base ${
          scrolled || open ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent'
        }`}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.32, ease: EASE_OUT }}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="container-site grid h-[var(--header-h)] grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="label justify-self-start !text-beige" aria-label="Hamid Rizvi, home">
            Hamid Rizvi
          </Link>

          <p className="label hidden md:block" aria-label={time ? `New York, ${time}` : 'New York'}>
            New York, NY · <span className="tabular-nums">{time ?? '--:--'}</span>
          </p>

          <nav aria-label="Primary" className="hidden items-center justify-self-end gap-8 md:flex">
            {NAV.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="text-sm text-camel transition-colors duration-fast hover:text-beige aria-[current=page]:text-beige"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full border border-rule px-4 py-2 text-sm text-beige transition-colors duration-fast hover:border-beige hover:bg-beige hover:text-ink"
            >
              Get in touch
            </Link>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="label justify-self-end !text-beige md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink pb-8 pt-[calc(var(--header-h)+2rem)] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
          >
            <nav aria-label="Mobile" className="container-site">
              <motion.ul
                className="flex flex-col gap-2"
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
              >
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    className="border-b border-rule"
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
                    }}
                  >
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-3 font-display text-[clamp(3rem,14vw,5rem)] leading-none text-beige aria-[current=page]:text-burgundy-bright"
                    >
                      <span className="label">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div className="container-site flex flex-col gap-3">
              <a href={`mailto:${profile.email}`} className="text-beige underline-offset-4 hover:underline">
                {profile.email}
              </a>
              <div className="flex gap-6">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="label hover:!text-beige">
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
