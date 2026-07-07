'use client';

import { useEffect, useRef, useState } from 'react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
}

const PHOTOS: Photo[] = [
  { id: 'p1', src: '/photos/6.jpg', alt: 'The Great Lawn', caption: 'The Great Lawn', location: 'Central Park' },
  { id: 'p2', src: '/photos/8.jpg', alt: 'Fountain', caption: 'Fountain', location: 'Washington Square Park' },
  { id: 'p3', src: '/photos/2.jpg', alt: 'Prince Street', caption: 'Prince Street', location: 'SoHo' },
  { id: 'p4', src: '/photos/3.jpg', alt: 'Greene Street', caption: 'Greene Street', location: 'SoHo' },
  { id: 'p5', src: '/photos/4.jpg', alt: 'Mercer Street', caption: 'Mercer Street', location: 'SoHo' },
  { id: 'p6', src: '/photos/1.jpg', alt: 'Statue of Liberty', caption: 'Statue of Liberty', location: 'Liberty Island' },
  { id: 'p7', src: '/photos/9.jpg', alt: 'West Drive', caption: 'West Drive', location: 'Central Park' },
  { id: 'p8', src: '/photos/7.jpg', alt: 'Cherry blossoms', caption: 'Cherry blossoms', location: 'Central Park' },
  { id: 'p9', src: '/photos/5.jpg', alt: 'Linden Terrace', caption: 'Linden Terrace', location: 'Fort Tryon Park' },
];

const CHESS_CURRENT = 1272;
const CHESS_PEAK = 1314;

const NAJDORF_POSITION: string[][] = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '', '♜'],
  ['', '♟', '', '', '♟', '♟', '♟', '♟'],
  ['♟', '', '', '♟', '', '♞', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '♘', '♙', '', '', ''],
  ['', '', '♘', '', '', '', '', ''],
  ['♙', '♙', '♙', '', '', '♙', '♙', '♙'],
  ['♖', '', '♗', '♕', '♔', '♗', '', '♖'],
];
const NAJDORF_HIGHLIGHT = { row: 2, col: 0 };

const CASE_STUDY_COUNT = 47;
const TODAYS_CASE = 'Design a feature to increase weekday Spotify usage among users aged 25-34.';

// Starts at the real value so the number is never a permanent 0 when the
// IntersectionObserver doesn't fire (print, PDF export, some in-app browsers);
// the 0-to-target animation only plays once the block scrolls into view.
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);
  return value;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

export default function OffDutyContent() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const chess = useInView<HTMLDivElement>();
  const cases = useInView<HTMLDivElement>();
  const currentRating = useCountUp(CHESS_CURRENT, chess.inView);
  const peakRating = useCountUp(CHESS_PEAK, chess.inView);
  const caseCount = useCountUp(CASE_STUDY_COUNT, cases.inView);
  const [liveRating, setLiveRating] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.chess.com/pub/player/hamidrizvi4/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const live = data?.chess_rapid?.last?.rating || data?.chess_blitz?.last?.rating;
        if (live && Math.abs(live - CHESS_CURRENT) > 5) setLiveRating(live);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i === null ? null : (i + PHOTOS.length - 1) % PHOTOS.length));
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i === null ? null : (i + 1) % PHOTOS.length));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx]);

  return (
    <div className="off-duty">
      <section className="block">
        <h2 className="block__title">Photography: street and editorial. New York is the studio.</h2>
        <div className="photo-grid">
          {PHOTOS.map((photo, idx) => (
            <button type="button" key={photo.id} className="photo" onClick={() => setLightboxIdx(idx)}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <span className="photo__caption">{photo.caption} &middot; {photo.location}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="block" ref={chess.ref}>
        <h2 className="block__title">Chess: daily practice. Endgames teach you to ship.</h2>
        <div className="chess-card">
          <div className="chess-stat">
            <p className="chess-stat__label">chess.com &middot; current</p>
            <p className="chess-stat__value">{liveRating ?? Math.round(currentRating)}</p>
          </div>
          <div className="chess-stat">
            <p className="chess-stat__label">peak</p>
            <p className="chess-stat__value chess-stat__value--peak">{Math.round(peakRating)}</p>
          </div>
        </div>

        <div className="najdorf">
          <div className="najdorf__board" aria-hidden="true">
            {NAJDORF_POSITION.flatMap((row, r) =>
              row.map((piece, c) => {
                const light = (r + c) % 2 === 0;
                const highlight = r === NAJDORF_HIGHLIGHT.row && c === NAJDORF_HIGHLIGHT.col;
                return (
                  <span key={`${r}-${c}`} className={`najdorf__sq ${light ? 'najdorf__sq--light' : 'najdorf__sq--dark'} ${highlight ? 'najdorf__sq--hl' : ''}`}>
                    {piece}
                  </span>
                );
              })
            )}
          </div>
          <div className="najdorf__text">
            <p className="najdorf__eyebrow">Favorite opening &mdash; Sicilian, Najdorf Variation</p>
            <p className="najdorf__moves">1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6</p>
            <p className="najdorf__body">
              The most-played defense to 1. e4 at the elite level. Black plays a6 on move five,
              a quiet pawn push that doesn't develop a piece, doesn't capture anything, doesn't
              attack. But it sets up everything: it controls b5, prepares e5 or e6, and refuses
              to commit to a bishop placement until White shows their hand. It's the chess
              equivalent of shipping the simplest possible interface and letting requirements
              emerge from contact with users.
            </p>
            <p className="najdorf__signature">Fischer played it. Kasparov played it. I'm 1272, but I'm learning.</p>
          </div>
        </div>
      </section>

      <section className="block" ref={cases.ref}>
        <h2 className="block__title">AI-driven case study practice: compounding product sense.</h2>
        <div className="case-card">
          <div>
            <p className="case-card__label">Cases practiced</p>
            <p className="case-card__count">{Math.round(caseCount)}</p>
            <p className="case-card__sub">and counting, two per day with Gemini</p>
          </div>
          <div className="case-card__today">
            <p className="case-card__label">Today's prompt</p>
            <p className="case-card__prompt">&ldquo;{TODAYS_CASE}&rdquo;</p>
          </div>
        </div>
      </section>

      {lightboxIdx !== null && (
        <div className="lightbox" onClick={() => setLightboxIdx(null)} role="dialog" aria-label="Photo lightbox">
          <button className="lightbox__close" onClick={() => setLightboxIdx(null)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i === null ? null : (i + PHOTOS.length - 1) % PHOTOS.length)); }}
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[lightboxIdx].src} alt={PHOTOS[lightboxIdx].alt} />
            <p className="lightbox__caption">{PHOTOS[lightboxIdx].caption} &middot; {PHOTOS[lightboxIdx].location}</p>
          </div>
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i === null ? null : (i + 1) % PHOTOS.length)); }}
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        .off-duty {
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }
        .block__title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0 0 1.1rem;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .photo {
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid var(--chrome-border);
        }
        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .photo__caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0.5rem 0.6rem;
          font-size: 0.68rem;
          color: #ffffff;
          background: linear-gradient(to top, rgba(23, 43, 77, 0.75), transparent);
          text-align: left;
        }

        .chess-card {
          display: flex;
          gap: 2rem;
          padding: 1.25rem 1.5rem;
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }
        .chess-stat__label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--pulp);
          margin: 0 0 0.3rem;
        }
        .chess-stat__value {
          font-family: var(--font-mono);
          font-size: 1.9rem;
          font-weight: 600;
          color: var(--accent-deep);
          margin: 0;
        }
        .chess-stat__value--peak {
          color: var(--paper);
          font-size: 1.4rem;
        }

        .najdorf {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          align-items: center;
        }
        .najdorf__board {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
          width: 220px;
          aspect-ratio: 1 / 1;
          border: 1px solid var(--chrome-border);
        }
        .najdorf__sq {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .najdorf__sq--light {
          background: #eef0e2;
        }
        .najdorf__sq--dark {
          background: #b9bfa3;
        }
        .najdorf__sq--hl {
          box-shadow: inset 0 0 0 2px var(--accent);
        }
        .najdorf__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--pulp);
          margin: 0 0 0.4rem;
        }
        .najdorf__moves {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--accent-deep);
          margin: 0 0 0.75rem;
        }
        .najdorf__body {
          font-family: var(--font-serif);
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--paper-dim);
          margin: 0 0 0.75rem;
        }
        .najdorf__signature {
          font-size: 0.88rem;
          color: var(--paper);
          margin: 0;
          font-weight: 600;
        }

        .case-card {
          display: flex;
          gap: 2.5rem;
          padding: 1.5rem 1.75rem;
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          align-items: center;
        }
        .case-card__label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--pulp);
          margin: 0 0 0.3rem;
        }
        .case-card__count {
          font-family: var(--font-mono);
          font-size: 2.4rem;
          font-weight: 600;
          color: var(--accent-deep);
          margin: 0;
        }
        .case-card__sub {
          font-size: 0.72rem;
          color: var(--pulp);
          margin: 0.2rem 0 0;
        }
        .case-card__today {
          padding-left: 2rem;
          border-left: 1px solid var(--chrome-border);
        }
        .case-card__prompt {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: var(--paper);
          margin: 0;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(23, 43, 77, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem;
        }
        .lightbox__close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.3);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        .lightbox__close svg {
          width: 16px;
          height: 16px;
        }
        .lightbox__close:hover {
          background: rgba(12, 102, 228, 0.5);
          transform: scale(1.06);
        }
        .lightbox__nav {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.3);
          color: #fff;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        .lightbox__nav svg {
          width: 20px;
          height: 20px;
        }
        .lightbox__nav:hover {
          background: rgba(12, 102, 228, 0.5);
          transform: scale(1.08);
        }
        .lightbox__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-width: 80vw;
          max-height: 85vh;
        }
        .lightbox__content img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 4px;
        }
        .lightbox__caption {
          color: #fff;
          font-size: 0.85rem;
        }

        @media (max-width: 640px) {
          .photo-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .najdorf {
            grid-template-columns: 1fr;
          }
          .najdorf__board {
            width: 100%;
            max-width: 280px;
            margin: 0 auto;
          }
          .case-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .case-card__today {
            padding-left: 0;
            border-left: none;
            padding-top: 1rem;
            border-top: 1px solid var(--chrome-border);
          }
        }
      `}</style>
    </div>
  );
}
