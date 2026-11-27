'use client';

/**
 * SkillMarquee.tsx
 *
 * Two full-bleed rows scrolling in opposite directions: capabilities in the
 * display serif, the stack in mono. The motion lives in globals.css
 * (.marquee__track): pause on hover, site-wide via the "Pause motion"
 * toggle in the section label, static wrapped list under reduced motion.
 */

import { useMotionPrefs } from '@/components/site/Providers';
import SectionHeader from './SectionHeader';

const CAPABILITIES = [
  'Production AI',
  'RAG Systems',
  'LLM Evals',
  'Agentic Workflows',
  'Guardrails',
  'Document Intelligence',
  'Customer Discovery',
  '0→1 Builds',
  'Cost & Latency',
];

const STACK = [
  'Python',
  'TypeScript',
  'Next.js',
  'React',
  'FastAPI',
  'Supabase',
  'PostgreSQL',
  'pgvector',
  'Row-Level Security',
  'Stripe',
  'Gemini',
  'OpenAI',
  'Claude',
  'Pydantic',
  'Docker',
  'AWS',
  'Vercel',
];

function Row({ items, seconds, reverse, itemClass }: { items: string[]; seconds: number; reverse?: boolean; itemClass: string }) {
  const list = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className={`flex items-center whitespace-nowrap ${itemClass}`}>
          {item}
          <span aria-hidden="true" className="mx-[0.7em] inline-block h-[0.2em] w-[0.2em] rounded-full bg-burgundy-bright" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee overflow-hidden">
      <div
        className={`marquee__track flex w-max ${reverse ? 'marquee__track--reverse' : ''}`}
        style={{ animationDuration: `${seconds}s` }}
      >
        {list()}
        {list(true)}
      </div>
    </div>
  );
}

export default function SkillMarquee() {
  const { paused, togglePaused } = useMotionPrefs();

  return (
    <section aria-labelledby="skills-label" className="mt-section">
      <div className="container-site">
        <SectionHeader
          id="skills-label"
          label="[01] What I work with"
          aside={
            <button
              type="button"
              onClick={togglePaused}
              aria-pressed={paused}
              className="motion-reduce:hidden hover:!text-beige"
            >
              ({paused ? 'Play motion' : 'Pause motion'})
            </button>
          }
        />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <Row items={CAPABILITIES} seconds={48} itemClass="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-beige" />
        <Row items={STACK} seconds={36} reverse itemClass="label text-sm" />
      </div>
    </section>
  );
}
