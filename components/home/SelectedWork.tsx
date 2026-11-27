'use client';

/**
 * SelectedWork.tsx
 *
 * Projects as numbered full-width rows: the three featured ones on the home
 * page, experience plus featured on /work. Desktop (mouse
 * only): a 4:5 preview follows the cursor on a spring, tilting with cursor
 * velocity; the hovered row shifts right 12px and its name turns
 * --burgundy-bright. Phones and reduced motion: a small inline thumbnail per
 * row instead. All previews stay mounted and cross-fade, so images are
 * already decoded when the cursor arrives.
 */

import Link from 'next/link';
import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { byTier, type Project } from '@/lib/projects';
import ProjectVisual from './ProjectVisual';
import SectionHeader from './SectionHeader';

const SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

export default function SelectedWork({
  items = byTier('featured'),
  id = 'work',
  label = `[03] Selected work (${String(items.length).padStart(2, '0')})`,
  aside = '[2026]',
}: {
  items?: Project[];
  id?: string;
  label?: string;
  aside?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const tilt = useSpring(useTransform(useVelocity(springX), [-1500, 1500], [-8, 8], { clamp: true }), {
    stiffness: 200,
    damping: 30,
  });

  const follow = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    x.set(e.clientX);
    y.set(e.clientY);
  };
  // Start the preview under the cursor instead of springing in from a corner.
  const enterList = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    springX.jump(e.clientX);
    springY.jump(e.clientY);
    follow(e);
  };

  return (
    <section id={id} aria-labelledby={`${id}-label`} className="container-site mt-section scroll-mt-24">
      <SectionHeader id={`${id}-label`} label={label} aside={aside} />

      <ul onPointerEnter={enterList} onPointerMove={follow} onPointerLeave={() => setActive(null)}>
        {items.map((p, i) => (
          <li key={p.slug} className="border-b border-rule">
            <Link
              href={`/work/${p.slug}`}
              data-cursor="View"
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              className="group flex items-center gap-4 py-6 md:gap-8 md:py-9"
            >
              <span className="label w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 transition-transform duration-base ease-out group-hover:translate-x-3 group-focus-visible:translate-x-3">
                <span className="block font-display text-[clamp(2rem,5vw,4.5rem)] leading-none text-beige transition-colors duration-base group-hover:text-burgundy-bright group-focus-visible:text-burgundy-bright">
                  {p.title}
                </span>
                <span className="mt-2 block text-sm text-camel lg:hidden">
                  {p.role} · {p.category}
                </span>
              </span>
              <span className="label hidden w-32 shrink-0 md:block">[{p.year}]</span>
              <span className="hidden w-64 shrink-0 text-sm leading-snug text-camel lg:block">
                {p.role}
                <br />
                {p.category}
              </span>
              <span className="hidden shrink-0 text-sm text-beige md:block">View →</span>
              <ProjectVisual
                title={p.title}
                shot={p.preview}
                variant={i}
                sizes="64px"
                tag="Preview"
                className="aspect-[4/5] w-14 shrink-0 [&_.label]:hidden [&_span]:text-[0.6rem] md:hidden motion-reduce:md:block"
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating cursor preview (desktop, mouse, motion allowed). */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block motion-reduce:!hidden"
        style={{ x: springX, y: springY, rotate: tilt }}
      >
        <motion.div
          className="relative aspect-[4/5] w-[clamp(220px,18vw,300px)] overflow-hidden"
          style={{ x: '-50%', y: '-50%' }}
          animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.92 : 1 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="absolute inset-0 transition-opacity duration-base"
              style={{ opacity: active === i ? 1 : 0 }}
            >
              <ProjectVisual title={p.title} shot={p.preview} variant={i} sizes="300px" className="h-full w-full" />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
