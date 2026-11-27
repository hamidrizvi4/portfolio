/**
 * ProjectVisual.tsx
 *
 * One image slot for the work list, gallery, and case studies. Renders the
 * shot through next/image when it exists; otherwise (TODO(hamid), see
 * lib/projects.ts) it renders a tinted --ink-2 card with the project name,
 * so adding images is a data change only. The parent sets the size and
 * aspect ratio.
 */

import Image from 'next/image';
import type { Shot } from '@/lib/projects';

// Glow positions so neighbouring placeholders don't look identical.
const GLOWS = [
  ['30% 20%', '80% 90%'],
  ['75% 25%', '20% 85%'],
  ['50% 80%', '85% 15%'],
  ['20% 60%', '70% 10%'],
];

export default function ProjectVisual({
  title,
  shot,
  tag = 'Preview',
  variant = 0,
  sizes,
  priority = false,
  className = '',
}: {
  title: string;
  shot?: Shot;
  tag?: string;
  variant?: number;
  /** next/image sizes hint, e.g. "(min-width: 768px) 25vw, 80vw". */
  sizes: string;
  /** Above-the-fold images (case study hero): load eagerly for LCP. */
  priority?: boolean;
  className?: string;
}) {
  if (shot) {
    return (
      <div className={`relative overflow-hidden bg-ink-2 ${className}`}>
        {/* object-top: screenshots crop from the bottom, so the app header stays in frame. */}
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    );
  }

  const [a, b] = GLOWS[variant % GLOWS.length];
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-ink-2 ${className}`}
      style={{
        background: `radial-gradient(circle at ${a}, rgb(var(--burgundy-rgb) / 0.55), transparent 60%), radial-gradient(circle at ${b}, rgb(var(--camel-rgb) / 0.16), transparent 55%), rgb(var(--ink-2-rgb))`,
      }}
    >
      <span className="label absolute left-[8%] top-[7%]">[ {tag} ]</span>
      <span className="absolute bottom-[7%] left-[8%] right-[8%] font-display text-[clamp(1rem,2.2vw,1.9rem)] italic leading-tight text-beige/90">
        {title}
      </span>
    </div>
  );
}
