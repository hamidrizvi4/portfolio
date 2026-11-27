'use client';

/**
 * HeroHover.tsx
 *
 * The two hover effects in the hero, kept out of the server HeroSection:
 *  - HeroName: dock-style magnification; letters near the mouse scale up and
 *    push their right-hand neighbours along so nothing overlaps.
 *  - HeroPortrait: the cutout drifts and tilts toward the mouse while it's
 *    over the photo. The photo sits under the text columns, so it's hit-tested
 *    from a window listener instead of its own hover events.
 * Both ease every frame toward a target (rAF lerp) rather than restarting a CSS
 * transition on each pointermove, which is what made them feel steppy.
 * Mouse only (touch has no hover), and off under reduced motion / "Pause motion".
 */

import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef } from 'react';
import { useMotionPrefs } from '@/components/site/Providers';

const MAX_SCALE = 0.3; // extra scale on the letter under the pointer
const REACH = 1.1; // falloff radius, in ems
const EASE = 0.14; // share of the remaining distance covered per frame

export function HeroName({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { still } = useMotionPrefs();
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const scales = useRef<number[]>([]);
  const raf = useRef(0);

  const tick = () => {
    const root = ref.current;
    if (!root) return;
    const reach = REACH * parseFloat(getComputedStyle(root).fontSize);
    const p = pointer.current;
    let i = 0;
    let moving = false;
    for (const line of root.children) {
      let shift = 0;
      for (const el of line.children as HTMLCollectionOf<HTMLElement>) {
        // offsetLeft/Top ignore transforms, so these are the resting positions.
        const w = el.offsetWidth;
        const d = p ? Math.hypot(p.x - (el.offsetLeft + w / 2), p.y - (el.offsetTop + el.offsetHeight / 2)) : reach;
        const target = 1 + (MAX_SCALE * (1 + Math.cos(Math.PI * Math.min(d / reach, 1)))) / 2; // cosine falloff
        const cur = (scales.current[i] ??= 1);
        const s = cur + (target - cur) * EASE;
        scales.current[i++] = s;
        if (Math.abs(target - s) > 0.001) moving = true;
        const extra = w * (s - 1);
        el.style.transform = `translateX(${shift + extra / 2}px) scale(${s})`;
        shift += extra;
      }
    }
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  };

  const aim = (p: { x: number; y: number } | null) => {
    pointer.current = p;
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onMove = (e: React.PointerEvent) => {
    if (still || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    aim({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <>
      <span className="sr-only">{lines.join(' ')}</span>
      <span ref={ref} aria-hidden="true" className="relative inline-block" onPointerMove={onMove} onPointerLeave={() => aim(null)}>
        {lines.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {[...line].map((ch, i) => (
              <span key={i} className="inline-block origin-bottom will-change-transform">
                {ch}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

export function HeroPortrait({ alt, ...props }: ImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const { still } = useMotionPrefs();

  useEffect(() => {
    const img = ref.current;
    const frame = img?.offsetParent;
    if (still || !img || !frame) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * EASE * 0.6;
      y += (ty - y) * EASE * 0.6;
      img.style.transform = `translate(${x * 36}px, ${y * 24}px) rotate(${x * 4}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const aim = (nx: number, ny: number) => {
      tx = nx;
      ty = ny;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      // Resting box (offset* ignore the transform), so the hit area doesn't move with the photo.
      const f = frame.getBoundingClientRect();
      const nx = (e.clientX - f.left - img.offsetLeft) / img.offsetWidth - 0.5; // -0.5…0.5 across the photo
      const ny = (e.clientY - f.top - img.offsetTop) / img.offsetHeight - 0.5;
      if (Math.abs(nx) > 0.5 || Math.abs(ny) > 0.5) aim(0, 0);
      else aim(nx, ny);
    };
    const reset = () => aim(0, 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', reset);
      cancelAnimationFrame(raf);
      img.style.transform = '';
    };
  }, [still]);

  return <Image ref={ref} alt={alt} {...props} />;
}
