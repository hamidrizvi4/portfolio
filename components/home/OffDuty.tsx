'use client';

/**
 * OffDuty.tsx
 *
 * Two columns: New York street photography (nine thumbnails opening a
 * lightbox) and chess. The lightbox is a native <dialog>: Escape, focus
 * containment, and focus return come from the browser. Arrow keys step
 * through photos; clicking outside the photo closes it. Page scroll is held
 * while it is open.
 *
 * TODO(hamid): confirm locations; only the Vanderbilt Ave shots have a
 * street sign in frame, the rest say "New York".
 */

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SectionHeader from './SectionHeader';

const PHOTOS = [
  { src: '/photos/6.jpg', caption: 'Under the marquee', location: '42nd St & Vanderbilt Ave' },
  { src: '/photos/3.jpg', caption: 'Wet crosswalk', location: 'Midtown' },
  { src: '/photos/10.jpg', caption: 'Red storefront', location: 'New York' },
  { src: '/photos/8.jpg', caption: 'Waiting out the storm', location: 'Subway entrance' },
  { src: '/photos/5.jpg', caption: 'Umbrella weather', location: 'Vanderbilt Ave' },
  { src: '/photos/9.jpg', caption: 'Refuel', location: 'New York' },
  { src: '/photos/2.jpg', caption: 'Afternoon light', location: 'New York' },
  { src: '/photos/7.jpg', caption: 'After the rain', location: 'Midtown' },
  { src: '/photos/4.jpg', caption: 'Long shadows', location: 'New York' },
];

const NAJDORF = '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6';

// The position after 5...a6, rank 8 first. Uppercase is White, '.' is empty.
const NAJDORF_BOARD = ['rnbqkb.r', '.p..pppp', 'p..p.n..', '........', '...NP...', '..N.....', 'PPP..PPP', 'R.BQKB.R'];
// Book-diagram glyphs: outlined White, solid Black. U+FE0E keeps ♟ from rendering as an emoji.
const GLYPHS: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};
const FILES = 'abcdefgh';
// 5...a6 itself: a7 → a6.
const LAST_MOVE = new Set(['a7', 'a6']);

function NajdorfBoard() {
  return (
    <figure className="mt-6 max-w-[20rem]">
      <div
        role="img"
        aria-label={`Chess board after ${NAJDORF}: the Najdorf Variation, Black's pawn just moved from a7 to a6.`}
        className="grid grid-cols-8 border border-rule [container-type:inline-size]"
      >
        {NAJDORF_BOARD.flatMap((rank, r) =>
          [...rank].map((piece, f) => {
            const square = `${FILES[f]}${8 - r}`;
            const light = (r + f) % 2 === 0;
            return (
              <div
                key={square}
                aria-hidden="true"
                className={`relative grid aspect-square place-items-center font-['Apple_Symbols','Segoe_UI_Symbol','Noto_Sans_Symbols_2',serif] text-[10cqw] leading-none text-ink ${light ? 'bg-beige' : 'bg-camel'}`}
              >
                {LAST_MOVE.has(square) && <span className="absolute inset-0 bg-burgundy-bright/40" />}
                {f === 0 && (
                  <span className={`absolute left-[6%] top-[3%] font-mono text-[3.2cqw] ${light ? 'text-camel-dim' : 'text-beige'}`}>
                    {8 - r}
                  </span>
                )}
                {r === 7 && (
                  <span className={`absolute bottom-[3%] right-[6%] font-mono text-[3.2cqw] ${light ? 'text-camel-dim' : 'text-beige'}`}>
                    {FILES[f]}
                  </span>
                )}
                {piece !== '.' && <span className="relative">{GLYPHS[piece]}{'︎'}</span>}
              </div>
            );
          }),
        )}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-camel">
        After 5…a6. The quiet pawn move takes b5 away from White&apos;s knight and bishop and keeps …e5 and …b5 in
        reserve.
      </figcaption>
    </figure>
  );
}

export default function OffDuty() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setCurrent(null);
      lenis?.start();
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [lenis]);

  const open = (i: number) => {
    setCurrent(i);
    lenis?.stop();
    dialogRef.current?.showModal();
  };
  const step = (dir: 1 | -1) => setCurrent((i) => (i === null ? null : (i + dir + PHOTOS.length) % PHOTOS.length));
  const photo = current === null ? null : PHOTOS[current];

  return (
    <section aria-labelledby="offduty-label" className="container-site mt-section">
      <SectionHeader id="offduty-label" label="[ Off duty ]" />

      <div className="mt-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <h3 className="font-display text-3xl text-beige">Photography</h3>
          <p className="mt-2 text-camel">Street and editorial. New York is the studio.</p>
          <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            {PHOTOS.map((p, i) => (
              <li key={p.src}>
                <button
                  type="button"
                  onClick={() => open(i)}
                  data-cursor="View"
                  aria-label={`Open photo: ${p.caption}, ${p.location}`}
                  className="group relative block aspect-[3/2] w-full overflow-hidden bg-ink-2"
                >
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 22vw, 32vw"
                    className="object-cover transition-transform duration-slow ease-out group-hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="font-display text-3xl text-beige">Chess</h3>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <dt className="label">Current</dt>
              <dd className="mt-1 font-display text-6xl leading-none text-beige lining-nums">1272</dd>
            </div>
            <div>
              <dt className="label">Peak</dt>
              <dd className="mt-1 font-display text-6xl leading-none text-beige lining-nums">1314</dd>
            </div>
          </dl>
          <p className="mt-6 text-camel">On chess.com. I play the Sicilian, Najdorf Variation.</p>
          <p className="label mt-3 normal-case tracking-[0.04em]">{NAJDORF}</p>
          <NajdorfBoard />
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={photo ? `${photo.caption}, ${photo.location}` : 'Photo'}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        className="m-0 h-[100svh] max-h-none w-screen max-w-none bg-transparent p-0 text-beige backdrop:bg-ink/90 backdrop:backdrop-blur-sm"
      >
        {photo && (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-4 p-4">
            <div className="pointer-events-auto relative aspect-[3/2] w-[min(90vw,calc(80svh*1.5))]">
              <Image src={photo.src} alt={`${photo.caption}, ${photo.location}`} fill sizes="90vw" className="object-contain" />
            </div>
            <div className="pointer-events-auto flex items-center gap-6">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="grid h-10 w-10 place-items-center rounded-full border border-rule hover:border-beige">
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <p className="label min-w-48 text-center">
                {photo.caption} · {photo.location} · {String((current ?? 0) + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
              </p>
              <button type="button" onClick={() => step(1)} aria-label="Next photo" className="grid h-10 w-10 place-items-center rounded-full border border-rule hover:border-beige">
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close photo"
              className="pointer-events-auto absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-rule hover:border-beige"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
