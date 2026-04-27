'use client';

/**
 * OffDutySection.tsx
 *
 * Section 05 — The human side. Three treatments:
 * 1. Photography — horizontal-scroll carousel with snap, 6-10 photo slots
 * 2. Chess — live chess.com rating with count-up animation
 * 3. AI case study practice — counter + today's case preview
 *
 * Photo carousel mechanics:
 * - CSS scroll-snap-type: x mandatory for native swipe
 * - drag-to-scroll on desktop with momentum (mouse-down + move)
 * - Pip indicator below shows current photo
 * - Photos sourced from PHOTOS array — to add real ones, just drop image URLs in
 *
 * Motion principles applied:
 * - Photo card hover: subtle 2deg tilt + vermilion shadow, 220ms ease-out
 * - Count-ups (chess rating, case counter): same ease-out cubic as Section 02
 * - Pip transitions follow active state, 240ms
 * - reduced motion disables tilts and animation, keeps swipe
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================
// PHOTOS — TO ADD YOUR REAL PHOTOS:
// 1. Drop your image files into `public/photos/` (e.g. `public/photos/01.jpg`)
// 2. Replace `src: null` below with the path: `src: '/photos/01.jpg'`
//    (Note: omit `public/` from the path — Next.js serves /public/ at the root)
// 3. Update the `caption` and `location` to match your photo
// 4. Recommended image size: 1200x1500px (4:5 portrait) for best display
// 5. JPEG quality 80-85 keeps file size under 300KB per image
// 6. Total recommended: 6-8 photos. Edit this array to add/remove entries.
// ============================================
interface Photo {
  id: string;
  src: string | null; // null = placeholder; string = path to image
  alt: string;
  caption: string;
  location?: string;
}

const PHOTOS: Photo[] = [
  // Example with real image (uncomment and update once uploaded):
  // { id: 'p1', src: '/photos/01.jpg', alt: 'Street scene', caption: 'Street, Lower East Side', location: 'NYC' },
  { id: 'p1', src: null, alt: 'Photo placeholder 1', caption: 'Street, Lower East Side', location: 'NYC' },
  { id: 'p2', src: null, alt: 'Photo placeholder 2', caption: 'Light study', location: 'Chelsea' },
  { id: 'p3', src: null, alt: 'Photo placeholder 3', caption: 'Subway portrait', location: 'NYC' },
  { id: 'p4', src: null, alt: 'Photo placeholder 4', caption: 'Brooklyn rooftops', location: 'Williamsburg' },
  { id: 'p5', src: null, alt: 'Photo placeholder 5', caption: 'Late night diner', location: 'Midtown' },
  { id: 'p6', src: null, alt: 'Photo placeholder 6', caption: 'Bridge at dusk', location: 'Brooklyn Bridge' },
  { id: 'p7', src: null, alt: 'Photo placeholder 7', caption: 'Bookstore window', location: 'West Village' },
  { id: 'p8', src: null, alt: 'Photo placeholder 8', caption: 'Coffee shop, morning', location: 'NoLita' },
];

// ============================================
// COUNT-UP HOOK — reused from MetricsWall pattern
// ============================================
function useCountUp(target: number, duration = 1400, isActive = false) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, isActive]);

  return value;
}

// ============================================
// PHOTO CAROUSEL
// ============================================
function PhotoCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Drag-to-scroll (desktop)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add('is-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove('is-grabbing');
    };
    const onMouseUp = () => {
      isDown = false;
      el.classList.remove('is-grabbing');
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag multiplier
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Track active photo via IntersectionObserver
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.photo-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = parseInt((entry.target as HTMLElement).dataset.idx || '0', 10);
            setActiveIdx(idx);
          }
        });
      },
      { root: el, threshold: 0.6 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const scrollToPhoto = useCallback((idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector(`[data-idx="${idx}"]`) as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - 32, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="photos">
      <header className="photos__header">
        <div>
          <p className="eyebrow">A — Photography</p>
          <h3 className="photos__title display">
            New York is the <em>studio.</em>
          </h3>
        </div>
        <div className="photos__counter">
          <span className="eyebrow mono">
            {String(activeIdx + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
          </span>
          <span className="eyebrow photos__hint">drag · click to expand</span>
        </div>
      </header>

      <div className="photos__carousel" ref={carouselRef}>
        {PHOTOS.map((photo, idx) => (
          <article key={photo.id} className="photo-card" data-idx={idx}>
            <div className="photo-card__frame">
              {photo.src ? (
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              ) : (
                <div className="photo-card__placeholder" aria-label={photo.alt}>
                  <span className="photo-card__placeholder-mark">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="photo-card__placeholder-label eyebrow">Photo {idx + 1}</span>
                </div>
              )}
            </div>
            <div className="photo-card__meta">
              <p className="photo-card__caption">{photo.caption}</p>
              {photo.location && (
                <p className="eyebrow photo-card__location">{photo.location}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="photos__pips" aria-hidden="true">
        {PHOTOS.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => scrollToPhoto(idx)}
            className={`photos__pip ${idx === activeIdx ? 'is-active' : ''}`}
            aria-label={`Go to photo ${idx + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .photos {
          padding: 4rem 0;
        }
        .photos__header {
          padding: 0 var(--gutter);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .photos__title {
          margin: 0.5rem 0 0;
          color: var(--paper);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .photos__title :global(em) {
          font-style: italic;
          color: var(--accent);
        }
        .photos__counter {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.35rem;
        }
        .photos__hint {
          color: var(--pulp);
          font-size: 0.65rem;
        }

        /* CAROUSEL */
        .photos__carousel {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem var(--gutter) 2rem;
          overflow-x: auto;
          overflow-y: visible;
          scroll-snap-type: x mandatory;
          scroll-padding-left: var(--gutter);
          cursor: grab;
          user-select: none;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .photos__carousel.is-grabbing {
          cursor: grabbing;
        }
        .photos__carousel::-webkit-scrollbar,
        .photos__carousel::-webkit-scrollbar-track,
        .photos__carousel::-webkit-scrollbar-thumb {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }

        .photo-card {
          flex: 0 0 auto;
          width: clamp(240px, 28vw, 380px);
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          cursor: grab;
        }

        .photo-card__frame {
          aspect-ratio: 4 / 5;
          width: 100%;
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          transition: transform 320ms var(--ease-out), border-color 320ms var(--ease-out), box-shadow 320ms var(--ease-out);
        }

        .photo-card__frame :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        .photo-card__placeholder {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          background: linear-gradient(
            135deg,
            var(--ink-2) 0%,
            var(--ink) 100%
          );
          color: var(--pulp-dim);
        }
        .photo-card__placeholder-mark {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(3rem, 5vw, 4.5rem);
          color: var(--pulp);
          line-height: 1;
        }
        .photo-card__placeholder-label {
          color: var(--pulp-dim);
        }

        @media (hover: hover) and (pointer: fine) {
          .photo-card:hover .photo-card__frame {
            transform: rotate(-1deg) scale(1.015) translateY(-4px);
            border-color: var(--accent);
            box-shadow: 0 12px 40px var(--accent-glow);
          }
        }

        .photo-card__meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .photo-card__caption {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.95rem;
          color: var(--paper);
          line-height: 1.3;
          margin: 0;
        }
        .photo-card__location {
          color: var(--pulp);
          font-size: 0.65rem;
        }

        /* PIPS */
        .photos__pips {
          display: flex;
          gap: 0.4rem;
          padding: 1rem var(--gutter) 0;
          margin-top: 0.5rem;
        }
        .photos__pip {
          width: 24px;
          height: 2px;
          background: var(--rule-strong);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 240ms var(--ease-out), transform 240ms var(--ease-out);
        }
        .photos__pip.is-active {
          background: var(--accent);
          transform: scaleY(2);
        }

        @media (max-width: 640px) {
          .photos__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .photos__counter {
            flex-direction: row;
            align-items: center;
            gap: 0.75rem;
            align-self: flex-start;
          }
          .photos__hint {
            font-size: 0.6rem;
          }
          .photo-card {
            width: 78vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .photo-card__frame {
            transition: none;
          }
          .photo-card:hover .photo-card__frame {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// CHESS — live chess.com rating
// ============================================
// ============================================
// CHESS — verified static values + Najdorf opening expansion
// ============================================
const CHESS_CURRENT = 1272;
const CHESS_PEAK = 1314;

// Position after 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6
// rank 8 first row (top, Black), rank 1 last row (bottom, White)
const NAJDORF_POSITION: string[][] = [
  ['♜','♞','♝','♛','♚','♝','',  '♜'],
  ['',  '♟','',  '',  '♟','♟','♟','♟'],   // a7 empty: pawn now on a6
  ['♟','',  '',  '♟','',  '♞','',  ''],   // a6 (highlighted), d6, f6
  ['',  '',  '',  '',  '',  '',  '',  ''],
  ['',  '',  '',  '♘','♙','',  '',  ''],   // d4 = white knight, e4 = white pawn
  ['',  '',  '♘','',  '',  '',  '',  ''],   // c3 = white knight
  ['♙','♙','♙','',  '',  '♙','♙','♙'],
  ['♖','',  '♗','♕','♔','♗','',  '♖'],
];
const NAJDORF_HIGHLIGHT = { row: 2, col: 0 }; // a6 — the move that defines the Najdorf

function ChessRating() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animatedCurrent = useCountUp(CHESS_CURRENT, 1400, isVisible);
  const animatedPeak = useCountUp(CHESS_PEAK, 1400, isVisible);

  // Optional: silently update current rating from API if it differs by >5 points
  const [liveRating, setLiveRating] = useState<number | null>(null);
  useEffect(() => {
    fetch('https://api.chess.com/pub/player/hamidrizvi4/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const live =
          data?.chess_rapid?.last?.rating ||
          data?.chess_blitz?.last?.rating;
        if (live && Math.abs(live - CHESS_CURRENT) > 5) {
          setLiveRating(live);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayCurrent = liveRating ?? Math.round(animatedCurrent);

  return (
    <div className="chess" ref={ref}>
      <p className="eyebrow">B — Chess</p>
      <h3 className="chess__title display">
        Daily practice. <em>Endgames teach you to ship.</em>
      </h3>

      <div className="chess__card">
        <div className="chess__live-dot" aria-hidden="true" />
        <div className="chess__rating-block">
          <p className="eyebrow chess__rating-label">chess.com · current</p>
          <p className="chess__rating">{displayCurrent}</p>
        </div>
        <div className="chess__rating-block chess__rating-block--peak">
          <p className="eyebrow chess__rating-label">peak</p>
          <p className="chess__rating chess__rating--peak">{Math.round(animatedPeak)}</p>
        </div>
        <div className="chess__board" aria-hidden="true">
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isLight = (row + col) % 2 === 0;
            return <span key={i} className={`chess__square ${isLight ? 'is-light' : ''}`} />;
          })}
        </div>
      </div>

      {/* Najdorf opening expansion */}
      <article className="najdorf">
        <div className="najdorf__board-wrap" aria-hidden="true">
          <p className="eyebrow najdorf__board-label">Position after 5...a6</p>
          <div className="najdorf__board">
            {NAJDORF_POSITION.flatMap((row, rIdx) =>
              row.map((piece, cIdx) => {
                const isLight = (rIdx + cIdx) % 2 === 0;
                const isHighlight =
                  rIdx === NAJDORF_HIGHLIGHT.row && cIdx === NAJDORF_HIGHLIGHT.col;
                return (
                  <span
                    key={`${rIdx}-${cIdx}`}
                    className={`najdorf__square najdorf__square--${
                      isLight ? 'light' : 'dark'
                    } ${isHighlight ? 'najdorf__square--highlight' : ''}`}
                  >
                    {piece}
                  </span>
                );
              })
            )}
          </div>
          <p className="najdorf__moves mono">
            1. e4 c5 &nbsp; 2. Nf3 d6 &nbsp; 3. d4 cxd4 &nbsp; 4. Nxd4 Nf6 &nbsp; 5. Nc3 a6
          </p>
        </div>
        <div className="najdorf__text">
          <p className="eyebrow najdorf__eyebrow">
            Favorite opening — Sicilian, Najdorf Variation
          </p>
          <p className="najdorf__lead">
            The most-played defense to <em>1. e4</em> at the elite level. Black plays
            <em> …a6</em> on move five — a quiet pawn push that doesn't develop a piece,
            doesn't capture anything, doesn't attack.
          </p>
          <p className="najdorf__body">
            But it sets up everything. It controls b5, prepares <em>…e5</em> or{' '}
            <em>…e6</em>, and refuses to commit to a bishop placement until White shows
            their hand. It's the chess equivalent of shipping the simplest possible interface
            and letting requirements emerge from contact with users.
          </p>
          <p className="najdorf__signature">
            Fischer played it. Kasparov played it.{' '}
            <em>I'm 1272 — but I'm learning.</em>
          </p>
        </div>
      </article>

      <style jsx>{`
        .chess {
          padding: 4rem var(--gutter);
          border-top: 1px solid var(--rule);
        }
        .chess__title {
          margin: 0.5rem 0 2rem;
          color: var(--paper);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .chess__title :global(em) {
          font-style: italic;
          color: var(--accent);
        }

        .chess__card {
          display: grid;
          grid-template-columns: auto auto auto 1fr auto;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem 2rem;
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
        }

        .chess__live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 12px var(--accent-glow);
          animation: live-pulse 2s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .chess__rating-block {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .chess__rating-block--peak {
          padding-left: 1.5rem;
          border-left: 1px solid var(--rule);
        }
        .chess__rating-label {
          color: var(--pulp);
        }
        .chess__rating {
          font-family: var(--font-mono);
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 300;
          font-style: italic;
          color: var(--accent);
          line-height: 1;
          font-feature-settings: 'tnum' 1;
          margin: 0;
        }
        .chess__rating--peak {
          color: var(--paper);
          font-size: clamp(1.5rem, 2.5vw, 2.2rem);
        }

        .chess__board {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          width: 80px;
          height: 80px;
          border: 1px solid var(--rule-strong);
        }
        .chess__square {
          background: var(--ink);
        }
        .chess__square.is-light {
          background: var(--paper-dim);
          opacity: 0.15;
        }

        /* NAJDORF EXPANSION */
        .najdorf {
          margin-top: 2rem;
          padding: 2.5rem;
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          align-items: center;
        }
        .najdorf__board-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .najdorf__board-label {
          color: var(--pulp);
        }
        .najdorf__board {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
          width: clamp(220px, 26vw, 320px);
          aspect-ratio: 1 / 1;
          border: 1px solid var(--rule-strong);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        }
        .najdorf__square {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 2vw, 1.6rem);
          line-height: 1;
          user-select: none;
        }
        .najdorf__square--light {
          background: #d9d5cb;
          color: #1a1916;
        }
        .najdorf__square--dark {
          background: #5c5953;
          color: #0f0e0c;
        }
        .najdorf__square--highlight {
          box-shadow: inset 0 0 0 2px var(--accent);
        }
        .najdorf__moves {
          color: var(--pulp);
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          line-height: 1.4;
          max-width: 320px;
        }
        .najdorf__text {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 56ch;
        }
        .najdorf__eyebrow {
          color: var(--pulp);
        }
        .najdorf__lead {
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 1.4vw, 1.3rem);
          line-height: 1.4;
          color: var(--paper);
          margin: 0;
        }
        .najdorf__lead :global(em) {
          font-style: italic;
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 0.92em;
        }
        .najdorf__body {
          color: var(--paper-dim);
          font-size: clamp(0.95rem, 1.05vw, 1.05rem);
          line-height: 1.6;
          margin: 0;
        }
        .najdorf__body :global(em) {
          font-style: italic;
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 0.92em;
        }
        .najdorf__signature {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(0.95rem, 1.1vw, 1.1rem);
          color: var(--paper-dim);
          margin: 0;
          padding-top: 0.5rem;
          border-top: 1px solid var(--rule);
        }
        .najdorf__signature :global(em) {
          color: var(--accent);
          font-style: italic;
        }

        @media (max-width: 900px) {
          .najdorf {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
          }
          .najdorf__board-wrap {
            align-items: center;
          }
          .najdorf__moves {
            text-align: center;
          }
        }
        @media (max-width: 640px) {
          .chess__card {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            gap: 0.75rem 1rem;
            padding: 1.25rem 1.5rem;
            align-items: start;
          }
          .chess__live-dot {
            grid-row: 1 / 2;
            grid-column: 1 / 2;
            margin-top: 0.5rem;
          }
          .chess__rating-block:not(.chess__rating-block--peak) {
            grid-row: 1 / 2;
            grid-column: 2 / 3;
          }
          .chess__rating-block--peak {
            grid-row: 2 / 3;
            grid-column: 1 / 3;
            padding-left: 0;
            padding-top: 0.75rem;
            border-left: none;
            border-top: 1px solid var(--rule);
          }
          .chess__board {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// CASE STUDY PRACTICE
// ============================================
const CASE_STUDY_COUNT = 47; // Manually update; or wire to a backend later
const TODAYS_CASE = {
  prompt: 'Design a feature to increase weekday Spotify usage among users aged 25-34.',
  date: 'Today',
};

function CaseStudyTracker() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animatedCount = useCountUp(CASE_STUDY_COUNT, 1400, isVisible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="case" ref={ref}>
      <p className="eyebrow">C — Compounding product sense</p>
      <h3 className="case__title display">
        Two PM cases per day with <em>Gemini.</em>
      </h3>

      <div className="case__grid">
        <div className="case__counter-block">
          <p className="eyebrow case__counter-label">Cases practiced</p>
          <p className="case__counter">{Math.round(animatedCount)}</p>
          <p className="case__counter-sub eyebrow">and counting</p>
        </div>

        <div className="case__today">
          <p className="eyebrow case__today-label">{TODAYS_CASE.date}'s prompt</p>
          <p className="case__today-text">"{TODAYS_CASE.prompt}"</p>
        </div>
      </div>

      <style jsx>{`
        .case {
          padding: 4rem var(--gutter);
          border-top: 1px solid var(--rule);
        }
        .case__title {
          margin: 0.5rem 0 2rem;
          color: var(--paper);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .case__title :global(em) {
          font-style: italic;
          color: var(--accent);
        }

        .case__grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          align-items: center;
          padding: 2rem;
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
        }

        .case__counter-block {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          align-items: flex-start;
          min-width: 140px;
        }
        .case__counter-label {
          color: var(--pulp);
        }
        .case__counter {
          font-family: var(--font-mono);
          font-style: italic;
          font-weight: 300;
          font-size: clamp(3.5rem, 6vw, 5.5rem);
          color: var(--accent);
          line-height: 1;
          font-feature-settings: 'tnum' 1;
          margin: 0;
        }
        .case__counter-sub {
          color: var(--pulp);
        }

        .case__today {
          padding-left: 2rem;
          border-left: 2px solid var(--rule-strong);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .case__today-label {
          color: var(--pulp);
        }
        .case__today-text {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.05rem, 1.4vw, 1.3rem);
          line-height: 1.4;
          color: var(--paper);
          margin: 0;
        }

        @media (max-width: 720px) {
          .case__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1.5rem;
          }
          .case__today {
            padding-left: 0;
            padding-top: 1.5rem;
            border-left: none;
            border-top: 2px solid var(--rule-strong);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN
// ============================================
export default function OffDutySection() {
  return (
    <section className="off-duty" aria-label="Off-duty interests">
      <header className="off-duty__masthead">
        <span className="eyebrow">05 / 06 — Off-duty</span>
        <p className="off-duty__intro display">
          Outside the laptop.
        </p>
      </header>

      <PhotoCarousel />
      <ChessRating />
      <CaseStudyTracker />

      <style jsx>{`
        .off-duty {
          background: var(--ink);
          position: relative;
          border-top: 1px solid var(--rule);
        }
        .off-duty__masthead {
          padding: 6rem var(--gutter) 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .off-duty__intro {
          margin: 0;
          color: var(--paper);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1;
          letter-spacing: -0.03em;
        }
      `}</style>
    </section>
  );
}
