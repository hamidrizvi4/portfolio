'use client';

/**
 * MetricsWall.tsx — v2 (snap-scroll)
 *
 * Section 02 — Six full-viewport slides, vertical scroll-snap.
 *
 * Architecture (changed from v1):
 * - Container has scroll-snap-type: y mandatory.
 * - Each metric is a 100vh slide with scroll-snap-align: start.
 * - scroll-snap-stop: always — can't blow past a slide on a fast scroll.
 * - IntersectionObserver triggers count-up when slide is ≥50% visible.
 * - Sticky masthead floats above slides — counter updates per active slide.
 * - Progress rule fills based on which slide is active (1/6 → 6/6).
 *
 * Motion principles applied (Emil's framework):
 * - Snap behavior is native browser CSS — best possible perf, smooth on mobile.
 * - Count-up uses ease-out cubic, 1400ms — same curve as Hero decrypt.
 * - Slide content uses opacity + transform for hardware acceleration.
 * - prefers-reduced-motion: removes count-up + transitions, keeps snap.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { metrics } from '@/lib/personal-data';

const HOW_LINES = [
  'Hybrid AI configured 80+ metadata fields in a single prompt.',
  'Caching strategy + intelligent fallback turned every retry into a hit.',
  'Model evaluation experiments picked the right tool for each task.',
  '3-layer fallback architecture made downtime statistically impossible.',
  'Feature engineering on RFM signals tightened the prediction window.',
  'Pandas + Gemini collapsed a 4-hour Excel ritual into a 5-minute dashboard.',
];

function formatValue(current: number, target: number): string {
  if (target < 1) return current.toFixed(2);
  if (target % 1 !== 0) return current.toFixed(1);
  return Math.round(current).toString();
}

interface MetricSlideProps {
  metric: typeof metrics[number];
  howLine: string;
  index: number;
  total: number;
  onActivate: (idx: number) => void;
  direction: 'left' | 'right';
  rootRef: React.RefObject<HTMLDivElement>;
}

function MetricSlide({ metric, howLine, index, total, onActivate, direction, rootRef }: MetricSlideProps) {
  const slideRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const slide = slideRef.current;
    if (!slide) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        setIsActive(active);
        if (active) onActivate(index);
      },
      {
        root: rootRef.current,
        threshold: [0, 0.5, 1],
      }
    );
    observer.observe(slide);
    return () => observer.disconnect();
  }, [index, onActivate, rootRef]);

  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (!isActive) {
      setDisplayValue('0');
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplayValue(formatValue(metric.value, metric.value));
      return;
    }

    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(formatValue(metric.value * eased, metric.value));
      if (progress < 1) animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, metric.value]);

  return (
    <article
      ref={slideRef}
      className={`metric-slide ${isActive ? 'is-active' : ''}`}
      data-direction={direction}
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
          height: 100%;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 6rem var(--gutter) 6rem;
          position: relative;
        }

        .metric-slide__inner {
          width: 100%;
          max-width: var(--max-w);
          display: grid;
          gap: 1.5rem;
          opacity: 0;
          transform: translateX(${direction === 'left' ? '-32px' : '32px'});
          transition:
            opacity 420ms var(--ease-out),
            transform 420ms var(--ease-out);
          will-change: opacity, transform;
        }

        .metric-slide.is-active .metric-slide__inner {
          opacity: 1;
          transform: translateX(0);
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
          .metric-slide__inner {
            transform: none;
            transition: opacity 200ms linear;
          }
        }
      `}</style>
    </article>
  );
}

export default function MetricsWall() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleActivate = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // ============ SCROLL CHAINING ============
  // Release scroll to the page when the user reaches the top or bottom of the section.
  // Without this, the inner snap-scroll container traps the wheel events
  // and the user can't progress to the next section by scrolling.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const releaseScrollIfAtEdge = (deltaY: number): boolean => {
      const atTop = track.scrollTop <= 1;
      const atBottom = track.scrollTop + track.clientHeight >= track.scrollHeight - 1;
      if (deltaY > 0 && atBottom) {
        window.scrollBy({ top: deltaY, behavior: 'auto' });
        return true;
      }
      if (deltaY < 0 && atTop) {
        window.scrollBy({ top: deltaY, behavior: 'auto' });
        return true;
      }
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (releaseScrollIfAtEdge(e.deltaY)) {
        e.preventDefault();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const atBottom = track.scrollTop + track.clientHeight >= track.scrollHeight - 1;
      const atTop = track.scrollTop <= 1;
      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && atBottom) {
        track.blur();
        window.scrollBy({ top: window.innerHeight * 0.5 });
      }
      if ((e.key === 'ArrowUp' || e.key === 'PageUp') && atTop) {
        track.blur();
        window.scrollBy({ top: -window.innerHeight * 0.5 });
      }
    };

    track.addEventListener('wheel', onWheel, { passive: false });
    track.addEventListener('keydown', onKeyDown);
    return () => {
      track.removeEventListener('wheel', onWheel);
      track.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <section className="metrics" aria-label="Headline metrics">
      <header className="metrics__masthead">
        <span className="eyebrow">02 / 06 — Metrics</span>
        <span className="eyebrow metrics__counter">
          {String(activeIndex + 1).padStart(2, '0')} / {String(metrics.length).padStart(2, '0')}
        </span>
      </header>

      <div className="metrics__track" ref={trackRef}>
        {metrics.map((metric, idx) => (
          <MetricSlide
            key={metric.label}
            metric={metric}
            howLine={HOW_LINES[idx]}
            index={idx}
            total={metrics.length}
            onActivate={handleActivate}
            direction={idx % 2 === 0 ? 'left' : 'right'}
            rootRef={trackRef}
          />
        ))}
      </div>

      <footer className="metrics__progress-rule">
        <span
          className="metrics__progress-fill"
          style={{ transform: `scaleX(${(activeIndex + 1) / metrics.length})` }}
        />
      </footer>

      <style jsx>{`
        .metrics {
          position: relative;
          background: var(--ink);
          height: 100vh;
          height: 100svh;
          overflow: hidden;
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

        .metrics__track {
          height: 100%;
          overflow-y: scroll;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-y: auto;
        }
        .metrics__track::-webkit-scrollbar {
          display: none;
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
          transition: transform 420ms var(--ease-out);
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
