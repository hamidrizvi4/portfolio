/**
 * Capabilities.tsx
 *
 * "What I do": four numbered capabilities, each linking to the project that
 * proves it. Desktop: hover or keyboard focus rotates the arrow and slides
 * the description in (opacity + transform only; the description always holds
 * its space, so nothing reflows). Phones: descriptions always visible.
 * Each claim is backed by lib/hamid-knowledge.md.
 */

import Link from 'next/link';
import SectionHeader from './SectionHeader';

const CAPABILITIES = [
  {
    name: 'Discovery and scoping',
    body: 'Find the real constraint before picking a model, then scope the narrowest version that proves it.',
    proof: { label: 'LexTrack AI', href: '/work/lextrack' },
  },
  {
    name: 'Production AI systems',
    body: 'RAG, tool-using agents, and document extraction, with fallbacks so a model outage never blocks the user.',
    proof: { label: 'Claude Support Triage Agent', href: '/work/triage' },
  },
  {
    name: 'Guardrails and evals',
    body: 'Hard walls where a wrong answer is expensive, and fixtures that measure every model swap.',
    proof: { label: 'QuadTax', href: '/work/quadtax' },
  },
  {
    name: 'Integration and reliability',
    body: 'Payments, auth, Row-Level Security, and webhooks, tested by breaking them on purpose.',
    proof: { label: 'ResidenceOS', href: '/work/residenceos' },
  },
];

export default function Capabilities() {
  return (
    <section aria-labelledby="capabilities-label" className="container-site mt-section">
      <SectionHeader id="capabilities-label" label="[06] What I do" />
      <ol>
        {CAPABILITIES.map((c, i) => (
          <li key={c.name} className="border-b border-rule">
            <Link
              href={c.proof.href}
              className="group grid gap-x-8 gap-y-3 py-7 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline md:py-10"
            >
              <span className="label flex items-center gap-3">
                {String(i + 1).padStart(2, '0')}
                <span
                  aria-hidden="true"
                  className="inline-block text-base transition-transform duration-base ease-out group-hover:-rotate-45 group-focus-visible:-rotate-45"
                >
                  →
                </span>
              </span>
              <span className="font-display text-[clamp(1.9rem,4vw,3.4rem)] leading-none text-beige transition-colors duration-base group-hover:text-burgundy-bright group-focus-visible:text-burgundy-bright">
                {c.name}
              </span>
              <span className="transition duration-base ease-out md:-translate-x-3 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-focus-visible:translate-x-0 md:group-focus-visible:opacity-100 motion-reduce:md:translate-x-0">
                <span className="block leading-relaxed text-beige/90">{c.body}</span>
                <span className="label mt-2 block">See it in {c.proof.label} →</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
