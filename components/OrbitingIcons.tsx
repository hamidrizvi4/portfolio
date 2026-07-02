'use client';

/**
 * OrbitingIcons.tsx
 *
 * A from-scratch reimplementation of the "orbiting circles" pattern
 * (the shadcn/21st.dev / magicui component) using plain CSS — this
 * project has no Tailwind config, so the original className-driven
 * version doesn't apply here.
 *
 * Orbit mechanic: each icon sits on a zero-size "pivot" positioned at
 * the container's center, which spins 0→360deg. Its child "badge" is
 * offset by `radius` via static top/left (so it sits on the circle at
 * angle 0), then counter-spins at the same speed in the opposite
 * direction — that cancels the pivot's rotation and keeps the badge
 * itself upright as it travels around the circle.
 *
 * Every badge here is a real, recognizable credential (NYU, Scrum
 * Alliance, Google) rather than an abstract project icon — the badge
 * itself carries its own label (a torch, a seal with "CSM" printed on
 * it), so it reads at a glance instead of requiring outside context.
 */

import { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';

interface OrbitNode {
  id: string;
  label: string;
  icon: ReactNode;
  radius: number;
  duration: number;
  delay?: number;
  reverse?: boolean;
  size?: number;
}

interface OrbitVars extends CSSProperties {
  '--orbit-radius': string;
  '--orbit-size': string;
  '--orbit-duration': string;
  '--orbit-delay': string;
}

function OrbitItem({ label, icon, radius, duration, delay = 0, reverse = false, size = 46 }: OrbitNode) {
  const vars: OrbitVars = {
    '--orbit-radius': `${radius}px`,
    '--orbit-size': `${size}px`,
    '--orbit-duration': `${duration}s`,
    '--orbit-delay': `-${delay}s`,
  };

  return (
    <div className={`orbit-pivot ${reverse ? 'is-reverse' : ''}`} style={vars} aria-hidden="true" title={label}>
      <div className="orbit-badge">{icon}</div>

      <style jsx>{`
        .orbit-pivot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          animation: orbit-rotate var(--orbit-duration) linear infinite;
          animation-delay: var(--orbit-delay);
        }

        .orbit-pivot.is-reverse {
          animation-direction: reverse;
        }

        .orbit-badge {
          position: absolute;
          top: calc(var(--orbit-size) * -0.5);
          left: calc(var(--orbit-radius) - var(--orbit-size) * 0.5);
          width: var(--orbit-size);
          height: var(--orbit-size);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          background: var(--ink);
          border: 1px solid var(--rule-strong);
          box-shadow: 0 2px 10px rgba(23, 23, 23, 0.10);
          color: var(--paper-dim);
          animation: orbit-counter var(--orbit-duration) linear infinite;
          animation-delay: var(--orbit-delay);
        }

        .orbit-pivot.is-reverse .orbit-badge {
          animation-direction: reverse;
        }

        .orbit-badge :global(svg) {
          width: 100%;
          height: 100%;
          display: block;
        }

        .orbit-badge :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes orbit-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit-counter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-pivot,
          .orbit-badge {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

interface OrbitingIconsProps {
  items: OrbitNode[];
  className?: string;
}

export function OrbitingIcons({ items, className = '' }: OrbitingIconsProps) {
  return (
    <div className={`orbit-field ${className}`}>
      {/* Faint orbit path rings, purely decorative */}
      {Array.from(new Set(items.map((i) => i.radius))).map((r) => (
        <span key={r} className="orbit-ring" style={{ width: r * 2, height: r * 2 }} aria-hidden="true" />
      ))}

      {items.map((item) => (
        <OrbitItem key={item.id} {...item} />
      ))}

      <style jsx>{`
        .orbit-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid var(--rule);
        }
      `}</style>
    </div>
  );
}

// ============================================
// ICONS — real credentials, not abstract project glyphs.
// CSM / CSPO / Google PM are the same badge images already used in
// the hero credentials strip (public/badges/). NYU and the interview
// mic are redrawn as clean SVGs in their real brand colors, since no
// source file for those two was available to drop in directly.
// ============================================
export const OrbitIconGlyphs = {
  nyu: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <rect width="24" height="24" fill="#57068C" />
      <path
        fill="#ffffff"
        d="M12 3.2c-.4 1-.9 1.7-1.6 2.3-.8.7-1.3 1.5-1.3 2.5 0 .6.15 1.1.4 1.55-.85-.35-1.55-1-1.85-1.9-.4.6-.6 1.3-.6 2.05 0 1.9 1.5 3.3 3.35 3.4H10v5.7c0 .3.1.5.4.5h3.2c.3 0 .4-.2.4-.5v-5.7h.4c1.85-.1 3.35-1.5 3.35-3.4 0-.75-.2-1.45-.6-2.05-.3.9-1 1.55-1.85 1.9.25-.45.4-.95.4-1.55 0-1-.5-1.8-1.3-2.5-.7-.6-1.2-1.3-1.6-2.3z"
      />
    </svg>
  ),
  interviews: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <rect width="24" height="24" fill="#E5231B" />
      <circle cx="14.5" cy="8" r="3.4" fill="#F5F5F5" />
      <path
        stroke="#F5F5F5"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        d="M12.3 12.3 7 17.6"
      />
    </svg>
  ),
  csm: (
    <Image src="/badges/csm.png" alt="Certified Scrum Master" fill sizes="60px" style={{ objectFit: 'cover' }} />
  ),
  cspo: (
    <Image src="/badges/cspo.png" alt="Certified Scrum Product Owner" fill sizes="60px" style={{ objectFit: 'cover' }} />
  ),
  googlePm: (
    <Image src="/badges/google-pm.png" alt="Google Project Management Certificate" fill sizes="60px" style={{ objectFit: 'cover' }} />
  ),
};
