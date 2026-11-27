'use client';

/**
 * Orb.tsx
 *
 * The AskOrb's visual: a soft sphere of light. Four blurred gradient blobs
 * (burgundy, bright burgundy, camel, a touch of beige) screen-blend inside a
 * circular mask, each drifting on its own Lissajous path, under a thin glassy
 * highlight ring.
 *
 * One rAF loop writes transforms straight to the DOM (no React state per
 * frame) and eases every parameter toward the current state's targets, so
 * states blend instead of snapping. The loop stops while the orb is off
 * screen. Under reduced motion or "Pause motion" the orb is painted once,
 * still. Decorative only: the parent announces state in text.
 */

import { useEffect, useRef } from 'react';
import { useMotionPrefs } from '@/components/site/Providers';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface Params {
  /** Drift speed multiplier. */
  speed: number;
  /** How far blobs wander from center; listening pulls them in. */
  reach: number;
  /** Radians per second the whole field rotates; thinking swirls. */
  swirl: number;
  /** Breathing amplitude: scale 1 → 1 + breathe. */
  breathe: number;
  saturate: number;
}

const STATE_PARAMS: Record<OrbState, Params> = {
  idle: { speed: 0.35, reach: 1, swirl: 0, breathe: 0.04, saturate: 1 },
  listening: { speed: 0.55, reach: 0.5, swirl: 0.25, breathe: 0.02, saturate: 1.1 },
  thinking: { speed: 1.2, reach: 0.65, swirl: 2.4, breathe: 0.015, saturate: 1.15 },
  speaking: { speed: 0.8, reach: 0.85, swirl: 0.5, breathe: 0.01, saturate: 1.1 },
  error: { speed: 0.4, reach: 0.9, swirl: 0, breathe: 0, saturate: 0.15 },
};

// size: fraction of the orb. fx/fy: Lissajous frequencies. travel: max offset as a fraction of the orb.
const BLOBS = [
  { color: 'var(--burgundy)', size: 0.9, fx: 0.7, fy: 0.9, phase: 0, travel: 0.2, opacity: 1 },
  { color: 'var(--burgundy-bright)', size: 0.66, fx: 1.1, fy: 0.6, phase: 1.7, travel: 0.24, opacity: 0.9 },
  { color: 'var(--camel)', size: 0.5, fx: 0.5, fy: 1.3, phase: 3.1, travel: 0.26, opacity: 0.75 },
  { color: 'var(--beige)', size: 0.28, fx: 1.3, fy: 0.8, phase: 4.4, travel: 0.18, opacity: 0.45 },
] as const;

const SHAKE_SECONDS = 0.5;
const BREATH_PERIOD = 4.5;

interface Frame {
  t: number;
  angle: number;
  amp: number;
  sphereScale: number;
  shakeX: number;
}

function paint(blobs: (HTMLDivElement | null)[], sphere: HTMLDivElement, p: Params, f: Frame) {
  BLOBS.forEach((b, i) => {
    const el = blobs[i];
    if (!el) return;
    const x = Math.sin(b.fx * f.t + b.phase) * b.travel * p.reach;
    const y = Math.cos(b.fy * f.t + b.phase * 0.7) * b.travel * p.reach;
    const rx = x * Math.cos(f.angle) - y * Math.sin(f.angle);
    const ry = x * Math.sin(f.angle) + y * Math.cos(f.angle);
    const pulse = 1 + f.amp * (i % 2 ? 0.22 : 0.12);
    // translate % is relative to the blob's own size, so offsets need no layout reads.
    el.style.transform = `translate3d(${((rx / b.size) * 100).toFixed(2)}%, ${((ry / b.size) * 100).toFixed(2)}%, 0) scale(${pulse.toFixed(3)})`;
  });
  sphere.style.transform = `translate3d(${f.shakeX.toFixed(1)}px, 0, 0) scale(${f.sphereScale.toFixed(4)})`;
}

export default function Orb({
  state,
  amplitude = 0,
  className = '',
}: {
  state: OrbState;
  /** 0–1, drives the speaking pulse. */
  amplitude?: number;
  className?: string;
}) {
  const { still } = useMotionPrefs();
  const rootRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stateRef = useRef(state);
  const ampRef = useRef(amplitude);

  useEffect(() => {
    stateRef.current = state;
    ampRef.current = amplitude;
  }, [state, amplitude]);

  // Animated: one rAF loop, paused while off screen.
  useEffect(() => {
    if (still) return;
    const root = rootRef.current;
    const sphere = sphereRef.current;
    const field = fieldRef.current;
    if (!root || !sphere || !field) return;

    const p: Params = { ...STATE_PARAMS[stateRef.current] };
    const f: Frame = { t: 0, angle: 0, amp: 0, sphereScale: 1, shakeX: 0 };
    let prevState = stateRef.current;
    let shake = SHAKE_SECONDS;
    let lastSaturate = -1;
    let last = performance.now();
    let raf = 0;
    let onScreen = true;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = stateRef.current;
      if (s !== prevState) {
        if (s === 'error') shake = 0;
        prevState = s;
      }

      const target = STATE_PARAMS[s];
      const k = 1 - Math.exp(-dt * 3.5);
      (Object.keys(target) as (keyof Params)[]).forEach((key) => {
        p[key] += (target[key] - p[key]) * k;
      });
      f.amp += ((s === 'speaking' ? ampRef.current : 0) - f.amp) * (1 - Math.exp(-dt * 8));
      f.t += dt * p.speed * 2;
      f.angle += dt * p.swirl;
      shake += dt;

      const breath = p.breathe * (0.5 + 0.5 * Math.sin(((now / 1000) * 2 * Math.PI) / BREATH_PERIOD));
      f.sphereScale = 1 + breath + f.amp * 0.06;
      f.shakeX = shake < SHAKE_SECONDS ? Math.sin(shake * 55) * 6 * (1 - shake / SHAKE_SECONDS) : 0;

      paint(blobRefs.current, sphere, p, f);
      if (Math.abs(p.saturate - lastSaturate) > 0.01) {
        field.style.filter = `saturate(${p.saturate.toFixed(2)})`;
        lastSaturate = p.saturate;
      }
      raf = onScreen ? requestAnimationFrame(frame) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(root);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [still]);

  // Still: paint one frame for the current state.
  useEffect(() => {
    if (!still || !sphereRef.current || !fieldRef.current) return;
    const p = STATE_PARAMS[state];
    paint(blobRefs.current, sphereRef.current, p, { t: 1.3, angle: 0, amp: 0, sphereScale: 1, shakeX: 0 });
    fieldRef.current.style.filter = `saturate(${p.saturate})`;
  }, [still, state]);

  return (
    <div ref={rootRef} className={`relative aspect-square ${className}`} aria-hidden="true">
      {state === 'listening' && (
        <>
          <span className="orb-ripple absolute inset-0 rounded-full border border-beige/30" />
          <span className="orb-ripple absolute inset-0 rounded-full border border-beige/20 [animation-delay:1.2s]" />
        </>
      )}

      <div
        ref={sphereRef}
        className="absolute inset-0 rounded-full will-change-transform"
        style={{ boxShadow: '0 0 90px 6px rgb(var(--burgundy-rgb) / 0.45)' }}
      >
        {/* Circular mask. The -webkit-mask keeps Safari clipping blurred, transformed children. */}
        <div
          className="absolute inset-0 overflow-hidden rounded-full [isolation:isolate]"
          style={{
            background: 'radial-gradient(circle at 50% 58%, rgb(var(--burgundy-rgb) / 0.55), rgb(var(--ink-rgb)) 72%)',
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          }}
        >
          <div ref={fieldRef} className="absolute inset-0">
            {BLOBS.map((b, i) => (
              <div
                key={b.color}
                ref={(el) => {
                  blobRefs.current[i] = el;
                }}
                className="absolute rounded-full will-change-transform"
                style={{
                  width: `${b.size * 100}%`,
                  height: `${b.size * 100}%`,
                  left: `${((1 - b.size) / 2) * 100}%`,
                  top: `${((1 - b.size) / 2) * 100}%`,
                  background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
                  opacity: b.opacity,
                  filter: 'blur(24px)',
                  mixBlendMode: 'screen',
                }}
              />
            ))}
          </div>

          {/* Glassy edge: thin highlight ring + a soft specular spot. */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 32% 24%, rgb(var(--beige-rgb) / 0.2), transparent 36%)',
              boxShadow: 'inset 0 0 0 1px rgb(var(--beige-rgb) / 0.14), inset 0 -24px 48px rgb(var(--ink-rgb) / 0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
