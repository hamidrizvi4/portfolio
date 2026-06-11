'use client';

/**
 * GlassNav.tsx
 *
 * Floating bottom tab bar — Apple "Liquid Glass" treatment.
 *
 * Visual recipe:
 * - Translucent pill: backdrop-filter blur + saturate over the page content
 * - Layered gradients + inset top highlight to fake refraction on the rim
 * - Active tab gets its own lighter glass bubble (like iOS 26 tab bars)
 *
 * Behavior:
 * - One tab per section (ids set on each section component)
 * - Scroll-spy: rAF-throttled scroll listener marks the section currently
 *   crossing the viewport midline as active
 * - Click → smooth scroll to the section (instant under reduced motion)
 * - Sits above content (z 9000) but below the photo lightbox (z 9999)
 */

import { useEffect, useRef, useState } from 'react';

interface NavTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: NavTab[] = [
  {
    id: 'hero',
    label: 'Intro',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    id: 'metrics',
    label: 'Metrics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-8" />
        <path d="M22 20H2" />
      </svg>
    ),
  },
  {
    id: 'work',
    label: 'Work',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    id: 'ask',
    label: 'Ask',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-8 8H4l2.5-2.7A8 8 0 1 1 21 12z" />
        <path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    id: 'off-duty',
    label: 'Off-duty',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
];

export default function GlassNav() {
  const [activeId, setActiveId] = useState('hero');
  const [mounted, setMounted] = useState(false);
  const activeIdRef = useRef('hero');

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============ SCROLL SPY ============
  // The active section is the last one whose top has crossed the viewport
  // midline. Works for the 350vh metrics scroll-zone too, since its wrapper
  // owns all that height.
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const midline = window.innerHeight / 2;
        let current = TABS[0].id;

        for (const tab of TABS) {
          const el = document.getElementById(tab.id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= midline) {
            current = tab.id;
          }
        }

        if (current !== activeIdRef.current) {
          activeIdRef.current = current;
          setActiveId(current);
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`glass-nav ${mounted ? 'is-mounted' : ''}`}
      aria-label="Section navigation"
    >
      <ul className="glass-nav__list">
        {TABS.map((tab) => (
          <li key={tab.id} className="glass-nav__item">
            <button
              type="button"
              className={`glass-nav__tab ${activeId === tab.id ? 'is-active' : ''}`}
              onClick={() => scrollToSection(tab.id)}
              aria-current={activeId === tab.id ? 'true' : undefined}
            >
              <span className="glass-nav__icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="glass-nav__label">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .glass-nav {
          position: fixed;
          left: 50%;
          bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
          transform: translate(-50%, 16px);
          z-index: 9000;
          opacity: 0;
          transition:
            opacity 600ms var(--ease-drawer),
            transform 600ms var(--ease-drawer);
          /* The liquid glass pill */
          border-radius: 999px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.03) 40%,
              rgba(255, 255, 255, 0.01) 100%
            ),
            radial-gradient(
              120% 160% at 50% -30%,
              rgba(255, 255, 255, 0.12) 0%,
              transparent 55%
            ),
            rgba(20, 19, 16, 0.55);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.25),
            0 12px 40px rgba(0, 0, 0, 0.45),
            0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .glass-nav.is-mounted {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        .glass-nav__list {
          list-style: none;
          margin: 0;
          padding: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.15rem;
        }

        .glass-nav__item {
          display: flex;
        }

        .glass-nav__tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.85rem;
          border: 1px solid transparent;
          border-radius: 999px;
          background: transparent;
          color: var(--pulp);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition:
            color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            box-shadow var(--dur-base) var(--ease-out);
        }

        .glass-nav__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .glass-nav__icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .glass-nav__label {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1;
          white-space: nowrap;
        }

        /* Active tab — its own lighter glass bubble, iOS-style */
        .glass-nav__tab.is-active {
          color: var(--paper);
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(255, 255, 255, 0.06) 100%
            );
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 2px 12px rgba(0, 0, 0, 0.25);
        }

        .glass-nav__tab.is-active .glass-nav__icon {
          color: var(--accent);
        }

        @media (hover: hover) and (pointer: fine) {
          .glass-nav__tab:not(.is-active):hover {
            color: var(--paper-dim);
            background: rgba(255, 255, 255, 0.05);
          }
        }

        .glass-nav__tab:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        /* Fallback for browsers without backdrop-filter: solid-ish pill */
        @supports not (backdrop-filter: blur(24px)) {
          .glass-nav {
            background: rgba(20, 19, 16, 0.92);
          }
        }

        @media (max-width: 640px) {
          .glass-nav {
            bottom: calc(0.65rem + env(safe-area-inset-bottom, 0px));
            max-width: calc(100vw - 1.5rem);
          }
          .glass-nav__list {
            padding: 0.3rem;
            gap: 0;
          }
          .glass-nav__tab {
            padding: 0.45rem 0.55rem;
          }
          .glass-nav__icon {
            width: 18px;
            height: 18px;
          }
          .glass-nav__label {
            font-size: 0.5rem;
            letter-spacing: 0.04em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glass-nav {
            transition: opacity 200ms linear;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </nav>
  );
}
