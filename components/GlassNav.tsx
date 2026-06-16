'use client';

/**
 * GlassNav.tsx
 *
 * Two-part floating nav — Apple Liquid Glass treatment.
 *
 * Layout:
 *   [main pill — 5 tabs] [○ Ask circle — separate]
 *
 * The Ask button breaks out as its own circle to the right of the pill,
 * matching the Apple News pattern (primary tabs in pill, action in circle).
 * When the Ask section is active, the circle fills with the accent colour.
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
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L3 9.5V21h6v-6h6v6h6V9.5L12 2z" />
      </svg>
    ),
  },
  {
    id: 'metrics',
    label: 'Metrics',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3zm2 0h4V4h-4v2z" />
      </svg>
    ),
  },
  {
    id: 'off-duty',
    label: 'Off-duty',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7l-8 5.34L4 8.7V6.97l8 5.34 8-5.34V8.7z" />
      </svg>
    ),
  },
];

const ASK_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3c5.52 0 10 3.94 10 8.8 0 4.86-4.48 8.8-10 8.8-1.51 0-2.94-.32-4.2-.88L3 21l1.48-4.38A8.42 8.42 0 0 1 2 11.8C2 6.94 6.48 3 12 3zm-3 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

const ALL_IDS = [...TABS.map((t) => t.id), 'ask'];

export default function GlassNav() {
  const [activeId, setActiveId] = useState('hero');
  const [mounted, setMounted] = useState(false);
  const activeIdRef = useRef('hero');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const midline = window.innerHeight / 2;
        let current = ALL_IDS[0];
        for (const id of ALL_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= midline) current = id;
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  const isAskActive = activeId === 'ask';

  return (
    <nav
      className={`nav-wrap ${mounted ? 'is-mounted' : ''}`}
      aria-label="Section navigation"
    >
      {/* ── Main pill ── */}
      <ul className="pill" role="list">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              className={`pill__tab ${activeId === tab.id ? 'is-active' : ''}`}
              onClick={() => scrollTo(tab.id)}
              aria-current={activeId === tab.id ? 'true' : undefined}
              aria-label={tab.label}
            >
              <span className="pill__icon">{tab.icon}</span>
              <span className="pill__label">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* ── Ask circle ── */}
      <button
        type="button"
        className={`ask-btn ${isAskActive ? 'is-active' : ''}`}
        onClick={() => scrollTo('ask')}
        aria-label="Ask Hamid"
        aria-current={isAskActive ? 'true' : undefined}
      >
        <span className="ask-btn__icon">{ASK_ICON}</span>
        <span className="ask-btn__label">Ask</span>
      </button>

      <style jsx>{`
        /* ── Shell ── */
        .nav-wrap {
          position: fixed;
          left: 50%;
          bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
          transform: translate(-50%, 16px);
          z-index: 9000;
          opacity: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition:
            opacity 600ms var(--ease-drawer),
            transform 600ms var(--ease-drawer);
        }
        .nav-wrap.is-mounted {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        /* ── Glass mixin values (shared) ── */
        /* Main pill */
        .pill {
          list-style: none;
          margin: 0;
          padding: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.15rem;
          border-radius: 999px;
          background: linear-gradient(
            160deg,
            rgba(255, 255, 255, 0.20) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 100%
          );
          backdrop-filter: blur(40px) saturate(200%) brightness(1.01);
          -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.01);
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow:
            inset 0 1.5px 0 rgba(255, 255, 255, 0.80),
            inset 0 -1px 0 rgba(0, 0, 0, 0.06),
            0 8px 32px rgba(0, 0, 0, 0.10),
            0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .pill__tab {
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

        .pill__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .pill__icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .pill__label {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          line-height: 1;
          white-space: nowrap;
        }

        .pill__tab.is-active {
          color: var(--paper);
          background: linear-gradient(
            160deg,
            rgba(255, 255, 255, 0.50) 0%,
            rgba(255, 255, 255, 0.22) 100%
          );
          border-color: rgba(255, 255, 255, 0.70);
          box-shadow:
            inset 0 1.5px 0 rgba(255, 255, 255, 0.90),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05),
            0 2px 8px rgba(0, 0, 0, 0.07);
        }

        .pill__tab.is-active .pill__icon {
          color: var(--accent);
        }

        @media (hover: hover) and (pointer: fine) {
          .pill__tab:not(.is-active):hover {
            color: var(--paper-dim);
            background: rgba(0, 0, 0, 0.04);
          }
        }

        .pill__tab:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        /* ── Ask circle ── */
        .ask-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.55);
          background: linear-gradient(
            160deg,
            rgba(255, 255, 255, 0.20) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 100%
          );
          backdrop-filter: blur(40px) saturate(200%) brightness(1.01);
          -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.01);
          box-shadow:
            inset 0 1.5px 0 rgba(255, 255, 255, 0.80),
            inset 0 -1px 0 rgba(0, 0, 0, 0.06),
            0 8px 32px rgba(0, 0, 0, 0.10),
            0 2px 8px rgba(0, 0, 0, 0.05);
          color: var(--pulp);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition:
            color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            box-shadow var(--dur-base) var(--ease-out);
        }

        .ask-btn__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
        }

        .ask-btn__icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .ask-btn__label {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          line-height: 1;
        }

        /* Active — accent fill */
        .ask-btn.is-active {
          color: #fff;
          background: linear-gradient(
            160deg,
            rgba(255, 74, 28, 0.92) 0%,
            rgba(220, 50, 10, 0.85) 100%
          );
          border-color: rgba(255, 74, 28, 0.55);
          box-shadow:
            inset 0 1.5px 0 rgba(255, 255, 255, 0.30),
            0 8px 28px rgba(255, 74, 28, 0.30),
            0 2px 8px rgba(255, 74, 28, 0.15);
        }

        @media (hover: hover) and (pointer: fine) {
          .ask-btn:not(.is-active):hover {
            color: var(--paper-dim);
            background: rgba(0, 0, 0, 0.04);
          }
          .ask-btn.is-active:hover {
            background: linear-gradient(
              160deg,
              rgba(255, 74, 28, 1.0) 0%,
              rgba(220, 50, 10, 0.95) 100%
            );
          }
        }

        .ask-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        /* ── Fallback (no backdrop-filter) ── */
        @supports not (backdrop-filter: blur(1px)) {
          .pill,
          .ask-btn {
            background: rgba(248, 245, 239, 0.94);
            border-color: rgba(0, 0, 0, 0.10);
          }
          .ask-btn.is-active {
            background: var(--accent);
          }
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .nav-wrap {
            bottom: calc(0.65rem + env(safe-area-inset-bottom, 0px));
            max-width: calc(100vw - 1rem);
            gap: 0.35rem;
          }
          .pill {
            padding: 0.3rem;
            gap: 0;
          }
          .pill__tab {
            padding: 0.45rem 0.55rem;
          }
          .pill__icon {
            width: 18px;
            height: 18px;
          }
          .pill__label {
            font-size: 0.55rem;
            letter-spacing: 0;
          }
          .ask-btn {
            width: 48px;
            height: 48px;
          }
          .ask-btn__icon {
            width: 19px;
            height: 19px;
          }
          .ask-btn__label {
            font-size: 0.55rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-wrap {
            transition: opacity 200ms linear;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </nav>
  );
}
