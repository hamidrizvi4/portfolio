'use client';

/**
 * DragGallery.tsx
 *
 * "Up close": a horizontal strip of project detail shots.
 *  - Mouse: drag with momentum (momentum off under reduced motion).
 *  - Touch: native swipe.
 *  - Wheel: vertical wheel scrolls the strip while hovered, and hands the
 *    wheel back to the page at either end, so it never traps the visitor.
 *    While the strip consumes the wheel it stops propagation, so Lenis
 *    (listening on window) doesn't also scroll the page; at the ends the
 *    event bubbles and Lenis scrolls the page smoothly. (Not
 *    data-lenis-prevent-wheel: Lenis pairs it with overscroll-behavior:
 *    contain, which would trap the wheel at the ends.)
 *  - Keyboard: the strip is focusable, so arrow keys scroll it natively.
 * The counter tracks scroll progress: (01 / 08) at the start, (08 / 08) at
 * the end.
 */

import { useEffect, useRef, useState } from 'react';
import { galleryShots } from '@/lib/projects';
import { useMotionPrefs } from '@/components/site/Providers';
import ProjectVisual from './ProjectVisual';
import SectionHeader from './SectionHeader';

const pad = (n: number) => String(n).padStart(2, '0');

export default function DragGallery() {
  const { reduced } = useMotionPrefs();
  const stripRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; t: number; v: number } | null>(null);
  const momentumRef = useRef(0);
  const reducedRef = useRef(reduced);
  const [index, setIndex] = useState(0);
  const total = galleryShots.length;

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = strip.scrollWidth - strip.clientWidth;
        setIndex(max > 0 ? Math.round((strip.scrollLeft / max) * (total - 1)) : 0);
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpad sideways swipe: native
      const max = strip.scrollWidth - strip.clientWidth;
      const atStart = strip.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = strip.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      e.stopPropagation();
      strip.scrollLeft += e.deltaY;
    };

    strip.addEventListener('scroll', onScroll, { passive: true });
    strip.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      strip.removeEventListener('scroll', onScroll);
      strip.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(momentumRef.current);
    };
  }, [total]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    cancelAnimationFrame(momentumRef.current);
    dragRef.current = { x: e.clientX, t: performance.now(), v: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const now = performance.now();
    const dx = e.clientX - drag.x;
    e.currentTarget.scrollLeft -= dx;
    drag.v = dx / Math.max(now - drag.t, 1);
    drag.x = e.clientX;
    drag.t = now;
  };

  const onPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    const strip = stripRef.current;
    if (!drag || !strip || reducedRef.current) return;
    let v = drag.v * 16; // px per frame
    const glide = () => {
      if (Math.abs(v) < 0.5) return;
      strip.scrollLeft -= v;
      v *= 0.94;
      momentumRef.current = requestAnimationFrame(glide);
    };
    momentumRef.current = requestAnimationFrame(glide);
  };

  return (
    <section aria-labelledby="details-label" className="mt-section">
      <div className="container-site">
        <SectionHeader
          id="details-label"
          label="[04] Up close"
          aside={
            <>
              <span className="hidden sm:inline">Drag or scroll →</span>
              <span className="tabular-nums">
                ({pad(index + 1)} / {pad(total)})
              </span>
            </>
          }
        />
      </div>

      <div
        ref={stripRef}
        role="region"
        aria-label="Project details. Scroll sideways, drag, or use the arrow keys."
        tabIndex={0}
        data-cursor="Drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative mt-8 flex select-none gap-4 overflow-x-auto px-gutter pb-2 [scrollbar-width:none] md:cursor-grab md:gap-6 md:active:cursor-grabbing [&::-webkit-scrollbar]:hidden [&_img]:pointer-events-none"
      >
        {/* One height for every card; width follows each shot's ratio (placeholders are 4:5).
            w-min wraps the caption to the card's width. */}
        {galleryShots.map(({ project, shot }, i) => (
          <figure
            key={`${project.slug}-${i}`}
            style={{ '--r': shot?.ratio ?? 4 / 5 } as React.CSSProperties}
            className="w-min shrink-0"
          >
            <ProjectVisual
              title={project.title}
              shot={shot}
              tag="Detail"
              variant={i}
              sizes="(min-width: 768px) 50vw, 90vw"
              className="aspect-[var(--r)] h-[clamp(300px,37.5vw,550px)]"
            />
            <figcaption className="label mt-3">
              ({pad(i + 1)}) {project.title} · Detail
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
