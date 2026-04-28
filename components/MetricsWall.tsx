'use client';

/**
 * MetricsWall.tsx
 *
 * Section 02 — Headline metrics, presented as scrollytelling.
 *
 * Architecture: Sticky-pin scroll progression.
 * - Outer wrapper is 350vh tall: 50vh entry buffer + 300vh of slide-progression
 *   (6 slides × 50vh each).
 * - Each slide gets ~50vh of scroll, which matches one typical trackpad/wheel
 *   swipe distance. This means one swipe = one slide advance, instead of
 *   multiple swipes per slide.
 * - Inner viewport is `position: sticky; top: 0; height: 100vh` — stays pinned
 *   to the viewport while the outer scrolls past.
 * - All 6 slides stack at `inset: 0` inside the pinned viewport. Active slide
 *   has opacity: 1 and translateY(0); siblings fade out.
 * - Scroll progress (0 → 1) is computed from the wrapper's bounding rect:
 *     progress = -wrapperTop / (wrapperHeight - viewportHeight)
 *   Slide index = floor(slideProgress * 6) — clamped to [0, 5].
 * - Progress bar (the orange line) tracks progress smoothly, not discretely.
 * - The 100vh entry buffer means the user "glides to the orange line" before
 *   the section pins. This keeps the transition from feeling abrupt.
 *
 * Why sticky-pin instead of scroll-hijack:
 * - Native scroll behavior preserved (trackpad momentum, scrollbar drag, PgDn).
 * - Mobile swipe works without intervention.
 * - Browser back/forward + URL hashes don't break.
 * - Accessibility: keyboard navigation and screen readers behave correctly.
 *
 * Motion principles:
 * - Crossfade between slides: 300ms ease-out, just opacity + 12px translateY.
 * - Count-up runs once per slide on activation, 1400ms ease-out cubic.
 * - prefers-reduced-motion: numbers appear instantly, no translation.
 */

import { useEffect, useRef, useState } from 'react';
import { metrics } from '@/lib/personal-data';

// ============================================
// HOW LINES — short editorial subhead per metric
// ============================================
const HOW_LINES = [
  'Hybrid AI configured 80+ metadata fields in a single prompt.',
  'Caching strategy + intelligent fallback turned every retry into a hit.',
  'Model evaluation experiments picked the right tool for each task.',
  '3-layer fallback architecture made downtime statistically impossible.',
  'Feature engineering on RFM signals tightened the prediction window.',
  'Pandas + Gemini collapsed a 4-hour Excel ritual into a 5-minute dashboard.',
];

// ============================================
// VALUE FORMATTER
// ============================================
function formatValue(current: number, target: number): string {
  if (target < 1) return current.toFixed(2);
  if (target % 1 !== 0) return current.toFixed(1);
  return Math.round(current).toString();
}

// ============================================
// COUNT-UP HOOK
// Drives the digit animation when slide becomes active.
// ============================================
function useCountUp(target: number, isActive: boolean): string {
  const [value, setValue] = useState('0');
  const frameRef = useRef<number>();

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    if (!isActive) {
      // Don't reset to 0 — keep the last value so slide doesn't visually flicker
      // during the fade-out transition. Re-running count-up on re-activation
      // is handled by the next branch.
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(formatValue(target, target));
      return;
    }

    // Reset to 0 then count up. Done here (only when becoming active) instead
    // of on deactivation, to avoid wasted renders during fade-out.
    setValue('0');

    const start = performance.now();
    const duration = 700;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(formatValue(target * eased, target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isActive, target]);

  return value;
}

// ============================================
// METRIC SLIDE
// One slide. Stacked absolutely; visibility driven by `isActive` prop.
// ============================================
interface MetricSlideProps {
  metric: typeof metrics[number];
  howLine: string;
  index: number;
  total: number;
  isActive: boolean;
}

function MetricSlide({ metric, howLine, index, total, isActive }: MetricSlideProps) {
  const displayValue = useCountUp(metric.value, isActive);

  return (
    <article
      className={`metric-slide ${isActive ? 'is-active' : ''}`}
      aria-hidden={!isActive}
      aria-label={`${metric.label}: ${('prefix' in metric && metric.prefix) || ''}${metric.value}${metric.suffix}`}
    >
      <div className="metric-slide__inner">
        <p className="metric-slide__index eyebrow">
          {String(index + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}
        </p>

        <p className="metric-slide__label eyebrow">{metric.label}</p>

        <p className="metric-slide__number">
          {'prefix' in metric && metric.prefix && (
            <span className="metric-slide__prefix">{metric.prefix}</span>
          )}
          <span className="metric-slide__digits">{displayValue}</span>
          {metric.suffix && <span className="metric-slide__suffix">{metric.suffix}</span>}
        </p>

        <p className="metric-slide__how">{howLine}</p>

        <p className="metric-slide__context">{metric.context}</p>
      </div>

      <style jsx>{`
        .metric-slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 6rem var(--gutter) 6rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .metric-slide.is-active {
          opacity: 1;
          pointer-events: auto;
          transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .metric-slide__inner {
          width: 100%;
          max-width: var(--max-w);
          display: grid;
          gap: 1.5rem;
          transform: translateY(6px);
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        .metric-slide.is-active .metric-slide__inner {
          transform: translateY(0);
        }

        .metric-slide__index {
          color: var(--pulp-dim);
          font-feature-settings: 'tnum' 1;
        }

        .metric-slide__label {
          color: var(--pulp);
        }

        .metric-slide__number {
          margin: 0;
          color: var(--accent);
          font-family: var(--font-display);
          font-size: clamp(6rem, 22vw, 22rem);
          font-weight: 300;
          line-height: 0.85;
          letter-spacing: -0.05em;
          font-variation-settings: 'opsz' 144;
          display: flex;
          align-items: baseline;
          gap: 0.05em;
          flex-wrap: wrap;
        }

        .metric-slide__digits {
          font-feature-settings: 'tnum' 1;
          font-family: var(--font-mono);
          font-weight: 300;
          font-style: italic;
        }

        .metric-slide__prefix,
        .metric-slide__suffix {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: 0.7em;
          opacity: 0.85;
        }

        .metric-slide__how {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.1rem, 1.8vw, 1.6rem);
          line-height: 1.35;
          color: var(--paper);
          max-width: 38ch;
          margin: 0;
        }

        .metric-slide__context {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          color: var(--pulp);
          text-transform: uppercase;
        }

        @media (prefers-reduced-motion: reduce) {
          .metric-slide,
          .metric-slide__inner {
            transition: opacity 200ms linear;
            transform: none !important;
          }
        }
      `}</style>
    </article>
  );
}

// ============================================
// METRICS WALL — sticky-pin orchestrator
// ============================================
export default function MetricsWall() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ============ SCROLL PROGRESS TRACKING ============
  // Computes which slide should be active based on the outer wrapper's
  // position relative to the viewport. Throttled with requestAnimationFrame
  // for 60fps smoothness.
  //
  // Performance note: progress (orange line) updates the DOM directly via
  // ref — never through React state. This avoids re-rendering all 6 slides
  // on every scroll tick, which was causing visible lag.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let frame = 0;
    let lastIndex = -1;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = wrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollableDistance = wrapper.offsetHeight - viewportHeight;

        if (scrollableDistance <= 0) {
          setActiveIndex(0);
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = 'scaleX(0)';
          }
          return;
        }

        // -rect.top is how far we've scrolled into the wrapper.
        // Clamp to [0, scrollableDistance].
        const scrolled = Math.max(0, Math.min(-rect.top, scrollableDistance));
        const rawProgress = scrolled / scrollableDistance;

        // ENTRY BUFFER: First 1/7 of the wrapper is "glide to the orange line"
        // — slide 1 stays put through this. Slide progression starts only
        // after the buffer is consumed. On a 350vh wrapper, that's 50vh of
        // entry glide before pinning takes effect for slide changes.
        const ENTRY_BUFFER_RATIO = 1 / 7;
        const slideProgress =
          rawProgress < ENTRY_BUFFER_RATIO
            ? 0
            : Math.min(1, (rawProgress - ENTRY_BUFFER_RATIO) / (1 - ENTRY_BUFFER_RATIO));

        // Update orange progress line directly (no React re-render)
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${slideProgress})`;
        }

        // SLIDE THRESHOLDS — unequal buckets so slides 1 & 2 advance faster.
        // Each entry is the slideProgress value at which that slide starts.
        // Slides 1 & 2: 8% each (~48vh of scroll on a 600vh progression zone).
        // Slides 3–6: ~21% each (~126vh) — comfortable pacing for the meatier metrics.
        const THRESHOLDS = [0, 0.08, 0.16, 0.37, 0.58, 0.79];
        let idx = 0;
        for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
          if (slideProgress >= THRESHOLDS[i]) {
            idx = i;
            break;
          }
        }

        if (idx !== lastIndex) {
          lastIndex = idx;
          setActiveIndex(idx);
        }
      });
    };

    onScroll(); // Initial computation on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="metrics-scroll-zone" ref={wrapperRef}>
      <section className="metrics-pinned" aria-label="Headline metrics">
        <header className="metrics__masthead">
          <span className="eyebrow">02 / 06 — Metrics</span>
          <span className="eyebrow metrics__counter">
            {String(activeIndex + 1).padStart(2, '0')} / {String(metrics.length).padStart(2, '0')}
          </span>
        </header>

        <div className="metrics__stage">
          {metrics.map((metric, idx) => (
            <MetricSlide
              key={metric.label}
              metric={metric}
              howLine={HOW_LINES[idx]}
              index={idx}
              total={metrics.length}
              isActive={idx === activeIndex}
            />
          ))}
        </div>

        <footer className="metrics__progress-rule">
          <span
            ref={progressBarRef}
            className="metrics__progress-fill"
            style={{ transform: 'scaleX(0)' }}
          />
        </footer>
      </section>

      <style jsx>{`
        /* Outer wrapper — 350vh tall: 50vh entry buffer + 300vh of slide-progression
           (6 slides × 50vh each). One typical scroll swipe (~40-60vh) advances
           one slide cleanly. Smaller per-slide windows = snappier feel without
           sacrificing the sticky pin. */
        .metrics-scroll-zone {
          position: relative;
          height: 350vh;
          background: var(--ink);
        }

        /* Inner pinned viewport — sticks to the top of the viewport during the
           parent's full 700vh scroll, then releases naturally into the next section. */
        .metrics-pinned {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
          background: var(--ink);
        }

        .metrics__masthead {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem var(--gutter) 1rem;
          background: linear-gradient(to bottom, var(--ink) 60%, transparent);
          pointer-events: none;
        }

        .metrics__counter {
          color: var(--paper);
          font-feature-settings: 'tnum' 1;
        }

        /* Stage holds all slides stacked absolutely. Active slide fades in. */
        .metrics__stage {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .metrics__progress-rule {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--rule);
          z-index: 10;
        }
        .metrics__progress-fill {
          display: block;
          height: 100%;
          background: var(--accent);
          transform-origin: left center;
          will-change: transform;
        }

        /* Mobile: same tighter scroll zone as desktop. Touch swipes typically
           travel ~70-80vh per gesture, so 50vh per slide may slightly overshoot
           into the next slide — that feels responsive, not broken. */
        @media (max-width: 640px) {
          .metrics-scroll-zone {
            height: 320vh;
          }
        }
      `}</style>
    </div>
  );
}