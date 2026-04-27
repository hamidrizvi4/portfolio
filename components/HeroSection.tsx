'use client';

/**
 * HeroSection.tsx
 *
 * The editorial masthead. First and only impression.
 *
 * Composition:
 *   01 ────────────────── HAMID RIZVI
 *   "Because the hard part is what's actually possible."   [meta strip]
 *
 *   I turn
 *        AI capabilities                   ← italic vermilion accent line
 *      into shipped products.              ← display-xl, Fraunces
 *
 *   [decrypt animation on load → 800ms reveal]
 *   [cursor-tracked grain field below]
 *   [editorial scroll cue ↓]
 *
 * Motion principles applied:
 * - Single orchestrated reveal on load (staggered, ease-drawer)
 * - Cursor effect uses requestAnimationFrame, throttled
 * - prefers-reduced-motion: replaces decrypt with simple fade
 * - All animation on transform/opacity only (hardware accelerated)
 */

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/lib/personal-data';

// ============================================
// DECRYPT ANIMATION — text scrambles in
// ============================================
const GLYPHS = '▓░▒█◇◈◊◯◐◑◒◓◔◕▲▼◆※→←';

interface DecryptTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  italic?: boolean;
}

function DecryptText({ text, delay = 0, duration = 800, className = '', italic = false }: DecryptTextProps) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Respect reduced motion — just show the text
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const t = setTimeout(() => {
        setDisplay(text);
        setDone(true);
      }, delay);
      return () => clearTimeout(t);
    }

    const startTimeout = setTimeout(() => {
      const startTime = performance.now();
      let frameId: number;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing — ease-out cubic, matches our --ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const settledChars = Math.floor(text.length * eased);

        let next = '';
        for (let i = 0; i < text.length; i++) {
          if (i < settledChars) {
            next += text[i];
          } else if (text[i] === ' ') {
            next += ' ';
          } else {
            next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setDisplay(next);

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setDone(true);
        }
      };
      frameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frameId);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay, duration]);

  return (
    <span
      className={className}
      data-decrypt-done={done}
      style={{ fontStyle: italic ? 'italic' : 'normal' }}
    >
      {display || '\u00A0'}
    </span>
  );
}

// ============================================
// GRAIN FIELD — cursor-tracked noise canvas
// ============================================
function GrainField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frameId: number;
    let resizeFrame: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const onMouse = (e: MouseEvent) => {
      targetRef.current.x = e.clientX / window.innerWidth;
      targetRef.current.y = e.clientY / window.innerHeight;
    };

    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    };

    const draw = () => {
      // Spring-lerp toward cursor — feels alive, not robotic
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.08;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Soft radial glow following cursor — vermilion accent
      const gx = mouseRef.current.x * w;
      const gy = mouseRef.current.y * h;
      const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, 600);
      gradient.addColorStop(0, 'rgba(255, 74, 28, 0.10)');
      gradient.addColorStop(0.4, 'rgba(255, 74, 28, 0.04)');
      gradient.addColorStop(1, 'rgba(255, 74, 28, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Sparse film grain — only render every 3rd frame for performance
      if (Math.random() < 0.4) {
        const grainSize = 1;
        const density = 80; // Particles per frame
        ctx.fillStyle = 'rgba(244, 241, 234, 0.025)';
        for (let i = 0; i < density; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          ctx.fillRect(x, y, grainSize, grainSize);
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    if (!reduced) {
      window.addEventListener('mousemove', onMouse, { passive: true });
      window.addEventListener('resize', onResize);
      draw();
    }

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="grain-field" aria-hidden="true" />;
}

// ============================================
// HERO — composition
// ============================================
export default function HeroSection() {
  const [time, setTime] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // NYC time clock — mono, updates every minute, magazine-masthead vibe
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const nyc = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      setTime(nyc);
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" aria-label="Introduction">
      <GrainField />

      {/* Top masthead strip — index, name, time */}
      <header className="hero__masthead">
        <span className="eyebrow">
          <DecryptText text="01 / 06" delay={0} duration={500} />
        </span>
        <span className="eyebrow hero__name-mark">
          <DecryptText text={profile.name.toUpperCase()} delay={120} duration={600} />
        </span>
        <span className="eyebrow hero__time mono" suppressHydrationWarning>
          NYC · {time || '00:00'}
        </span>
      </header>

      {/* Editorial pull-quote, top-right corner */}
      <p className="hero__quote">
        <DecryptText text={`"${profile.pullQuote}"`} delay={400} duration={800} italic />
      </p>

      {/* The display — the moment that lands */}
      <h1 className="hero__display display display-xl">
        <span className="hero__line">
          <DecryptText text="I turn" delay={600} duration={900} />
        </span>
        <span className="hero__line hero__line--accent">
          <DecryptText text="AI capabilities" delay={750} duration={900} italic />
        </span>
        <span className="hero__line">
          <DecryptText text="into shipped products." delay={900} duration={900} />
        </span>
      </h1>

      {/* Bottom strip — credentials + scroll cue */}
      <footer className="hero__footer">
        <div className="hero__credentials">
          <p className="eyebrow hero__now">
            <span className="hero__now-dot" aria-hidden="true" />
            Now · Building production RAG at LexTrack AI · NYC
          </p>
          <p className="hero__sub body">
            New York University · M.S. Technology Management · May 2026<br />
            B.Tech Computer Science Engineering · 2024
          </p>
          <ul className="hero__certs" aria-label="Certifications">
            <li className="hero__cert" title="Scrum Alliance">
              <span className="hero__cert-dot" aria-hidden="true" />
              <span className="hero__cert-label">Certified Scrum Master</span>
            </li>
            <li className="hero__cert-sep" aria-hidden="true">|</li>
            <li className="hero__cert" title="Scrum Alliance">
              <span className="hero__cert-dot" aria-hidden="true" />
              <span className="hero__cert-label">Certified Scrum Product Owner</span>
            </li>
            <li className="hero__cert-sep" aria-hidden="true">|</li>
            <li className="hero__cert" title="Google · Coursera">
              <span className="hero__cert-dot" aria-hidden="true" />
              <span className="hero__cert-label">Google Project Management Professional</span>
            </li>
          </ul>
        </div>

        <div className={`hero__scroll-cue ${scrolled ? 'is-hidden' : ''}`} aria-hidden="true">
          <span className="eyebrow">scroll</span>
          <span className="hero__scroll-line" />
        </div>
      </footer>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          min-height: 100svh; /* Safari mobile address bar */
          padding: 3rem var(--gutter) 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          overflow: hidden;
        }

        :global(.grain-field) {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          mix-blend-mode: screen;
        }

        .hero > * {
          position: relative;
          z-index: 1;
        }

        /* ──────────── MASTHEAD ──────────── */
        .hero__masthead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--rule);
        }

        .hero__name-mark {
          color: var(--paper);
          letter-spacing: 0.24em;
        }

        .hero__time {
          color: var(--pulp);
        }

        /* ──────────── PULL QUOTE ──────────── */
        .hero__quote {
          align-self: flex-end;
          max-width: 22ch;
          font-family: var(--font-display);
          font-size: clamp(0.95rem, 1.1vw, 1.15rem);
          font-weight: 400;
          line-height: 1.4;
          color: var(--pulp);
          text-align: right;
          opacity: 0.85;
        }

        @media (max-width: 900px) {
          .hero {
            gap: 1.5rem;
            min-height: auto;
          }
          .hero__display {
            align-self: flex-start;
            margin: 1rem 0;
          }
          .hero__quote {
            align-self: flex-start;
            max-width: 100%;
            text-align: left;
            opacity: 0.7;
          }
        }

        /* ──────────── DISPLAY ──────────── */
        .hero__display {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 0;
          color: var(--paper);
        }

        .hero__line {
          display: block;
          /* Slight indent on second line for editorial rag */
        }

        .hero__line--accent {
          color: var(--accent);
          padding-left: clamp(2rem, 8vw, 8rem);
        }

        .hero__line:nth-child(3) {
          padding-left: clamp(1rem, 4vw, 4rem);
        }

        /* ──────────── FOOTER ──────────── */
        .hero__footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--rule);
        }

        .hero__sub {
          max-width: 60ch;
          color: var(--pulp);
          font-size: clamp(0.85rem, 1vw, 1rem);
          line-height: 1.5;
        }

        /* ──────────── CREDENTIALS STRIP ──────────── */
        .hero__credentials {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-width: 60ch;
        }

        .hero__now {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--paper-dim);
        }

        .hero__now-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent-glow);
          animation: live-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero__sub-divider {
          display: inline-block;
          width: 24px;
          height: 1px;
          background: var(--pulp);
          margin: 0 0.5rem;
          vertical-align: middle;
          opacity: 0.5;
        }

        /* ──────────── CERTIFICATIONS STRIP ──────────── */
        .hero__certs {
          list-style: none;
          padding: 0;
          margin: 0.25rem 0 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.65rem;
        }

        .hero__cert {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.7rem;
          border: 1px solid var(--rule-strong);
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--paper-dim);
          cursor: default;
          transition:
            color var(--dur-fast) var(--ease-out),
            border-color var(--dur-fast) var(--ease-out),
            transform var(--dur-fast) var(--ease-out);
        }

        .hero__cert-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }

        .hero__cert-label {
          line-height: 1;
        }

        @media (hover: hover) and (pointer: fine) {
          .hero__cert:hover {
            color: var(--paper);
            border-color: var(--accent);
            transform: translateY(-1px);
          }
        }

        .hero__cert-sep {
          color: var(--pulp-dim);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          opacity: 0.5;
          user-select: none;
        }

        /* ──────────── SCROLL CUE ──────────── */
        .hero__scroll-cue {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          transition: opacity var(--dur-base) var(--ease-out);
        }

        .hero__scroll-cue.is-hidden {
          opacity: 0;
          pointer-events: none;
        }

        .hero__scroll-line {
          width: 1px;
          height: 56px;
          background: linear-gradient(
            to bottom,
            var(--paper) 0%,
            var(--paper) 30%,
            transparent 100%
          );
          animation: scroll-pulse 2.4s ease-in-out infinite;
          transform-origin: top;
        }

        @keyframes scroll-pulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        /* ──────────── RESPONSIVE ──────────── */
        @media (max-width: 640px) {
          .hero {
            padding: 4.5rem 1.75rem 2rem;
          }
          .display-xl {
            font-size: clamp(2.5rem, 11vw, 4.5rem);
            line-height: 1;
            letter-spacing: -0.02em;
          }
          .hero__line--accent {
            padding-left: 0.5rem;
          }
          .hero__line:nth-child(3) {
            padding-left: 0.25rem;
          }
          .hero__quote {
            font-size: 0.85rem;
          }
          .hero__footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          .hero__credentials {
            gap: 0.75rem;
            max-width: 100%;
          }
          .hero__sub {
            font-size: 0.8rem;
            line-height: 1.55;
          }
          .hero__certs {
            gap: 0.5rem;
          }
          .hero__cert {
            padding: 0.3rem 0.6rem;
            font-size: 0.6rem;
          }
          .hero__cert-sep {
            display: none;
          }
          .hero__scroll-cue {
            flex-direction: row;
            align-items: center;
          }
          .hero__scroll-line {
            width: 56px;
            height: 1px;
            background: linear-gradient(to right, var(--paper) 0%, var(--paper) 30%, transparent 100%);
          }
          @keyframes scroll-pulse {
            0%, 100% { transform: scaleX(0.3); opacity: 0.4; }
            50% { transform: scaleX(1); opacity: 1; }
          }
        }
      `}</style>
    </section>
  );
}
