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
      // House — filled roof, open door, like SF Symbols "house"
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 10.5 12 3l9.5 7.5" />
        <path d="M4.5 8.8V20a.5.5 0 0 0 .5.5h4.5v-5a2.5 2.5 0 0 1 5 0v5H19a.5.5 0 0 0 .5-.5V8.8" />
      </svg>
    ),
  },
  {
    id: 'metrics',
    label: 'Metrics',
    icon: (
      // Three bars with rounded tops, ascending — SF "chart.bar"
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2.5" y="13" width="4" height="8" rx="1.25" />
        <rect x="10" y="8" width="4" height="13" rx="1.25" />
        <rect x="17.5" y="4" width="4" height="17" rx="1.25" />
      </svg>
    ),
  },
  {
    id: 'work',
    label: 'Work',
    icon: (
      // Briefcase — SF "briefcase"
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7.5" width="20" height="14" rx="2.5" />
        <path d="M15.5 7.5V6a3.5 3.5 0 0 0-7 0v1.5" />
        <line x1="2" y1="13" x2="22" y2="13" />
        <line x1="12" y1="11.5" x2="12" y2="14.5" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'ask',
    label: 'Ask',
    icon: (
      // Filled speech bubble with waveform dots — SF "bubble.left.and.bubble.right"
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C7.03 3 3 6.58 3 11c0 1.9.7 3.65 1.87 5.06L3.5 21l5.08-1.52A9.66 9.66 0 0 0 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9z" />
        <circle cx="8.5" cy="11" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="11" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'off-duty',
    label: 'Off-duty',
    icon: (
      // Camera — SF "camera" style, with inner lens circle
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a2 2 0 0 1 2-2h1.5l1.8-2.5h5.4L14.5 7H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" />
        <circle cx="12" cy="13.5" r="3.5" />
        <circle cx="12" cy="13.5" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: (
      // Envelope with a neat chevron fold — SF "envelope"
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5.5" width="20" height="14" rx="2.5" />
        <polyline points="2,8 12,14.5 22,8" />
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
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.01em;
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
            font-size: 0.55rem;
            letter-spacing: 0;
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
