'use client';

/**
 * ContactSection.tsx
 *
 * Section 06 — The closer. Massive editorial display + three magnetic buttons.
 *
 * Magnetic button mechanics (from design-eng skill):
 * - On mouse-near (within 80px of button center), the button content shifts toward cursor
 *   with spring physics (lerp factor 0.15)
 * - Maxes out at 12px translation — subtle, not goofy
 * - Releases instantly (snap to 0) when cursor leaves the magnetic radius
 * - Disabled on touch devices via @media (hover: hover)
 *
 * Colophon: tasteful footer crediting fonts + stack. The kind of detail that signals
 * "I notice things" — recruiters and designers read this.
 */

import { useEffect, useRef } from 'react';
import { profile } from '@/lib/personal-data';

interface MagneticButtonProps {
  href: string;
  label: string;
  meta: string;
  icon: React.ReactNode;
  external?: boolean;
}

function MagneticButton({ href, label, meta, icon, external = false }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const inner = innerRef.current;
    if (!button || !inner) return;

    // Disable magnetic effect on touch devices
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let frameId: number;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;

    const MAGNETIC_RADIUS = 120; // pixels
    const MAX_TRANSLATE = 12; // pixels
    const LERP = 0.18;

    const onMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAGNETIC_RADIUS) {
        isHovering = true;
        const strength = 1 - dist / MAGNETIC_RADIUS;
        targetX = (dx / MAGNETIC_RADIUS) * MAX_TRANSLATE * strength;
        targetY = (dy / MAGNETIC_RADIUS) * MAX_TRANSLATE * strength;
      } else if (isHovering) {
        isHovering = false;
        targetX = 0;
        targetY = 0;
      }
    };

    const onMouseLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      inner.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    button.addEventListener('mouseleave', onMouseLeave);
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      button.removeEventListener('mouseleave', onMouseLeave);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <a
      ref={buttonRef}
      href={href}
      className="magnet"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span ref={innerRef} className="magnet__inner">
        <span className="glass-icon" aria-hidden="true">{icon}</span>
        <span className="magnet__text">
          <span className="eyebrow magnet__meta">{meta}</span>
          <span className="magnet__label">{label}</span>
        </span>
        <span className="magnet__arrow" aria-hidden="true">↗</span>
      </span>

      <style jsx>{`
        .magnet {
          display: block;
          padding: 1.25rem 1.75rem;
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 999px;
          color: var(--paper);
          text-decoration: none;
          transition:
            border-color var(--dur-fast) var(--ease-out),
            background var(--dur-fast) var(--ease-out);
          position: relative;
          overflow: hidden;
          will-change: transform;
        }

        .magnet__inner {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1.25rem;
          will-change: transform;
        }

        .magnet__text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }

        .magnet__meta {
          color: var(--pulp);
          font-size: 0.65rem;
        }

        .magnet__label {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.05rem, 1.4vw, 1.3rem);
          line-height: 1;
          color: var(--paper);
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .magnet__arrow {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          color: var(--pulp);
          transition:
            transform var(--dur-base) var(--ease-out),
            color var(--dur-base) var(--ease-out);
        }

        /* LIQUID GLASS ICON */
        .glass-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0) 100%),
            radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 60%),
            rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2),
            0 4px 16px rgba(0, 0, 0, 0.3);
          color: var(--paper);
          transition:
            transform 280ms var(--ease-out),
            border-color 280ms var(--ease-out),
            box-shadow 280ms var(--ease-out),
            color 280ms var(--ease-out);
        }
        .glass-icon :global(svg) {
          width: 20px;
          height: 20px;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
        }

        @media (hover: hover) and (pointer: fine) {
          .magnet:hover {
            border-color: var(--accent);
            background: rgba(255, 74, 28, 0.04);
          }

          .magnet:hover :global(.magnet__arrow) {
            transform: translate(2px, -2px);
            color: var(--accent);
          }

          .magnet:hover :global(.magnet__label) {
            color: var(--accent);
          }

          .magnet:hover :global(.glass-icon) {
            transform: scale(1.05);
            border-color: rgba(255, 74, 28, 0.4);
            color: var(--accent);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2),
              0 4px 20px rgba(255, 74, 28, 0.25);
          }
        }

        @media (max-width: 640px) {
          .magnet { padding: 1rem 1.25rem; }
          .magnet__inner { gap: 0.85rem; }
          .glass-icon { width: 36px; height: 36px; }
          .glass-icon :global(svg) { width: 16px; height: 16px; }
          .magnet__label { font-size: 0.95rem; }
          .magnet__arrow { font-size: 0.95rem; }
        }
      `}</style>
    </a>
  );
}

export default function ContactSection() {
  return (
    <section className="contact" aria-label="Contact">
      <header className="contact__masthead">
        <span className="eyebrow">06 / 06 — Contact</span>
      </header>

      <div className="contact__inner">
        <h2 className="contact__display display">
          Currently looking for full-time{' '}
          <em>PM roles</em>
          ,<br /> May 2026.
        </h2>

        <p className="contact__sub">
          Based in NYC. Open to remote and hybrid. Best way to reach me is email — I respond fast.
        </p>

        <div className="contact__buttons">
          <MagneticButton
            href={`mailto:${profile.email}`}
            label={profile.email}
            meta="EMAIL"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            }
          />
          <MagneticButton
            href={profile.linkedin}
            label="hamid-rizvi"
            meta="LINKEDIN"
            external
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.78C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.78 24h20.44c.99 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.22 0z" />
              </svg>
            }
          />
          <MagneticButton
            href={profile.github}
            label="hamidrizvi4"
            meta="GITHUB"
            external
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.57 21.79 24 17.31 24 12 24 5.37 18.63 0 12 0z" />
              </svg>
            }
          />
        </div>

        <p className="contact__now eyebrow">
          <span className="contact__live-dot" aria-hidden="true" />
          Now: building at LexTrack AI · {new Date().getFullYear()}
        </p>
      </div>

      {/* COLOPHON */}
      <footer className="colophon">
        <div className="colophon__row">
          <div className="colophon__col">
            <p className="eyebrow colophon__label">Set in</p>
            <p className="colophon__value">
              <span style={{ fontFamily: 'var(--font-display)' }}>Fraunces</span> ·{' '}
              <span style={{ fontFamily: 'var(--font-sans)' }}>Inter</span> ·{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>JetBrains Mono</span>
            </p>
          </div>

          <div className="colophon__col">
            <p className="eyebrow colophon__label">Made by</p>
            <p className="colophon__value">
              Hamid Rizvi · NYC · {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="colophon__signature">
          <span className="eyebrow">END / 06</span>
          <span className="eyebrow">— THANKS FOR SCROLLING —</span>
        </div>
      </footer>

      <style jsx>{`
        .contact {
          background: var(--ink);
          position: relative;
          border-top: 1px solid var(--rule);
        }

        .contact__masthead {
          padding: 6rem var(--gutter) 2rem;
        }

        .contact__inner {
          padding: 2rem var(--gutter) 6rem;
          max-width: var(--max-w);
          display: grid;
          gap: 2.5rem;
        }

        .contact__display {
          margin: 0;
          color: var(--paper);
          font-size: clamp(2.5rem, 7vw, 6.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.04em;
          font-variation-settings: 'opsz' 144;
          max-width: 22ch;
        }

        .contact__display :global(em) {
          font-style: italic;
          color: var(--accent);
        }

        .contact__sub {
          color: var(--pulp);
          font-size: clamp(1rem, 1.2vw, 1.15rem);
          line-height: 1.5;
          max-width: 50ch;
        }

        .contact__buttons {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
          max-width: 540px;
        }

        @media (min-width: 720px) {
          .contact__buttons {
            grid-template-columns: 1fr;
          }
        }

        .contact__now {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--pulp);
          padding-top: 1.5rem;
          border-top: 1px solid var(--rule);
        }

        .contact__live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent-glow);
          animation: live-pulse 2s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* COLOPHON */
        .colophon {
          padding: 3rem var(--gutter);
          border-top: 1px solid var(--rule);
          background: var(--ink-2);
        }

        .colophon__row {
          max-width: var(--max-w);
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--rule);
        }

        .colophon__col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .colophon__label {
          color: var(--pulp);
          font-size: 0.65rem;
        }

        .colophon__value {
          color: var(--paper-dim);
          font-size: clamp(0.85rem, 1vw, 0.95rem);
          line-height: 1.5;
        }

        .colophon__signature {
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .colophon__signature .eyebrow {
          color: var(--pulp-dim);
        }

        @media (max-width: 720px) {
          .colophon__row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .colophon__signature {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}
