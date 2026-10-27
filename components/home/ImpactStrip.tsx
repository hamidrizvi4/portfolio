'use client';

/**
 * ImpactStrip.tsx
 *
 * Six numbers, each with a label and its source, counting up once (600ms)
 * when they enter view. Values come only from the Metrics table in
 * lib/hamid-knowledge.md.
 *
 * The server HTML carries the final values (crawlers and no-JS visitors see
 * real numbers). On mount, a number still off screen is reset to zero so it
 * can count up when it arrives; one already on screen is left as is. Under
 * reduced motion nothing animates.
 */

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { useMotionPrefs } from '@/components/site/Providers';
import SectionHeader from './SectionHeader';

interface Metric {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  source: string;
}

const METRICS: Metric[] = [
  { value: 80, suffix: '%', label: 'Onboarding time cut, 30 minutes to 5', source: 'LexTrack AI, capstone' },
  { value: 99.5, decimals: 1, suffix: '%', label: 'Uptime across 50+ restaurant partners', source: 'LexTrack AI, internship' },
  { value: 40, suffix: '%', label: 'Inference cost cut, held under 2s p95', source: 'LexTrack AI, internship' },
  { value: 14, suffix: '/14', label: 'Extraction accuracy at about one ninth the cost', source: 'ResidenceOS' },
  { value: 0.25, decimals: 2, prefix: '$', label: 'To cut incomplete tickets from 50% to 7.5%', source: 'Claude Support Triage Agent' },
  { value: 100, suffix: '%', label: 'Tax math accuracy, by construction', source: 'QuadTax' },
];

const format = (m: Metric, v: number) => `${m.prefix ?? ''}${v.toFixed(m.decimals ?? 0)}${m.suffix ?? ''}`;

function CountUp({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const { reduced } = useMotionPrefs();
  const armed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) {
      el.textContent = format(metric, 0);
      armed.current = true;
    }
  }, [metric, reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || !armed.current) return;
    const controls = animate(0, metric.value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = format(metric, v)),
    });
    return () => controls.stop();
  }, [inView, metric]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(metric, metric.value)}
    </span>
  );
}

export default function ImpactStrip() {
  return (
    <section aria-labelledby="impact-label" className="container-site mt-section">
      <SectionHeader id="impact-label" label="[ Impact ]" aside="Measured, not estimated" />
      <dl className="mt-2 grid grid-cols-2 lg:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.label} className="flex flex-col gap-2 border-b border-rule py-8 pr-4 sm:py-10">
            <dt className="order-2 max-w-xs text-beige/90">{m.label}</dt>
            <dd className="order-1 font-display text-[clamp(3rem,7vw,6rem)] leading-none text-beige lining-nums">
              <CountUp metric={m} />
            </dd>
            <dd className="label order-3">{m.source}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
