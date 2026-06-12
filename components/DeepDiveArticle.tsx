'use client';

/**
 * DeepDiveArticle.tsx
 *
 * Long-form case study layout for /work/[slug].
 *
 * Editorial structure mirrors a PM interview answer:
 *   masthead → context → my role → the hard decisions
 *   (setup / tradeoff / call / result) → outcomes → retro → next study
 *
 * Same design tokens as the homepage; no GlassNav here — a single
 * "back to portfolio" affordance keeps the page focused on reading.
 */

import Link from 'next/link';
import { type DeepDive, getDeepDive } from '@/lib/deep-dives';

const DECISION_STEPS: { key: keyof Pick<
  DeepDive['decisions'][number],
  'setup' | 'tradeoff' | 'call' | 'result'
>; label: string }[] = [
  { key: 'setup', label: 'The setup' },
  { key: 'tradeoff', label: 'The tradeoff' },
  { key: 'call', label: 'The call' },
  { key: 'result', label: 'What happened' },
];

export default function DeepDiveArticle({ dive }: { dive: DeepDive }) {
  const next = getDeepDive(dive.nextSlug);

  return (
    <article className="dive">
      {/* ──────────── MASTHEAD ──────────── */}
      <header className="dive__masthead">
        <Link href="/#work" className="dive__back eyebrow">
          ← Back to portfolio
        </Link>
        <span className="eyebrow dive__index">
          Deep case study · {dive.index} / 02
        </span>
      </header>

      {/* ──────────── TITLE BLOCK ──────────── */}
      <div className="dive__title-block">
        <h1 className="dive__title display">{dive.title}</h1>
        <p className="dive__subtitle">{dive.subtitle}</p>

        <div className="dive__meta">
          <div className="dive__meta-col">
            <p className="eyebrow dive__meta-label">Role</p>
            <p className="dive__meta-value">{dive.role}</p>
          </div>
          <div className="dive__meta-col">
            <p className="eyebrow dive__meta-label">Period</p>
            <p className="dive__meta-value">{dive.period}</p>
          </div>
          <div className="dive__meta-col dive__meta-col--stack">
            <p className="eyebrow dive__meta-label">Stack</p>
            <ul className="dive__stack" aria-label="Tech stack">
              {dive.stack.map((tech) => (
                <li key={tech} className="dive__chip">{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ──────────── 01 CONTEXT ──────────── */}
      <section className="dive__section" aria-label="Context">
        <p className="eyebrow dive__section-eyebrow">01 — Context</p>
        <div className="dive__prose">
          {dive.context.map((para, i) => (
            <p key={i} className={i === 0 ? 'dive__lead' : ''}>{para}</p>
          ))}
        </div>
      </section>

      {/* ──────────── 02 MY ROLE ──────────── */}
      <section className="dive__section" aria-label="My role">
        <p className="eyebrow dive__section-eyebrow">02 — My role</p>
        <div className="dive__prose">
          {dive.myRole.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* ──────────── 03 THE HARD DECISIONS ──────────── */}
      <section className="dive__section" aria-label="The hard decisions">
        <p className="eyebrow dive__section-eyebrow">03 — The hard decisions</p>

        <div className="dive__decisions">
          {dive.decisions.map((decision, i) => (
            <div key={decision.title} className="decision">
              <div className="decision__head">
                <span className="decision__number mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="decision__title display">{decision.title}</h2>
              </div>

              <dl className="decision__steps">
                {DECISION_STEPS.map((step) => (
                  <div key={step.key} className="decision__step">
                    <dt className="eyebrow decision__step-label">{step.label}</dt>
                    <dd className="decision__step-body">{decision[step.key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── 04 OUTCOMES ──────────── */}
      <section className="dive__section" aria-label="Outcomes">
        <p className="eyebrow dive__section-eyebrow">04 — Outcomes</p>
        <ul className="dive__outcomes">
          {dive.outcomes.map((o) => (
            <li key={o.label} className="outcome">
              <span className="outcome__stat mono">{o.stat}</span>
              <span className="outcome__label">{o.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ──────────── 05 RETRO ──────────── */}
      <section className="dive__section" aria-label="What I'd do differently">
        <p className="eyebrow dive__section-eyebrow">
          05 — What I&apos;d do differently
        </p>
        <ol className="dive__retro">
          {dive.retro.map((item, i) => (
            <li key={i} className="dive__retro-item">{item}</li>
          ))}
        </ol>
      </section>

      {/* ──────────── FOOTER ──────────── */}
      <footer className="dive__footer">
        {dive.cta && (
          <a
            className="dive__cta"
            href={dive.cta.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="eyebrow">
              {dive.cta.type === 'github' ? 'Source code' : 'Product demo'}
            </span>
            <span className="dive__cta-label">
              {dive.cta.label} <span aria-hidden="true">↗</span>
            </span>
          </a>
        )}

        {next && (
          <Link href={`/work/${next.slug}`} className="dive__next">
            <span className="eyebrow">Next case study</span>
            <span className="dive__next-title display">
              {next.title} <span aria-hidden="true">→</span>
            </span>
          </Link>
        )}

        <div className="dive__colophon">
          <Link href="/#work" className="eyebrow dive__colophon-link">
            ← All work
          </Link>
          <span className="eyebrow">Hamid Rizvi · NYC</span>
        </div>
      </footer>

      <style jsx>{`
        .dive {
          max-width: 880px;
          margin: 0 auto;
          padding: 2.5rem var(--gutter) 6rem;
        }

        /* ──────────── MASTHEAD ──────────── */
        .dive__masthead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--rule);
        }

        :global(.dive__back) {
          color: var(--pulp);
          transition: color var(--dur-fast) var(--ease-out);
        }
        :global(.dive__back:hover) {
          color: var(--accent);
        }

        .dive__index {
          color: var(--pulp-dim);
        }

        /* ──────────── TITLE ──────────── */
        .dive__title-block {
          padding: 4rem 0 3rem;
          border-bottom: 1px solid var(--rule);
        }

        .dive__title {
          margin: 0 0 1.25rem;
          color: var(--paper);
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 300;
          font-style: italic;
          line-height: 0.95;
          letter-spacing: -0.04em;
          font-variation-settings: 'opsz' 144;
        }

        .dive__subtitle {
          margin: 0;
          max-width: 56ch;
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 1.6vw, 1.35rem);
          font-weight: 400;
          line-height: 1.45;
          color: var(--paper-dim);
        }

        .dive__meta {
          display: grid;
          grid-template-columns: auto auto 1fr;
          gap: 2.5rem;
          margin-top: 2.5rem;
        }

        .dive__meta-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dive__meta-label {
          color: var(--pulp-dim);
          font-size: 0.62rem;
        }

        .dive__meta-value {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.45;
          color: var(--paper-dim);
          max-width: 32ch;
        }

        .dive__stack {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .dive__chip {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.3rem 0.6rem;
          color: var(--paper-dim);
          border: 1px solid var(--rule-strong);
          border-radius: 999px;
        }

        /* ──────────── SECTIONS ──────────── */
        .dive__section {
          padding: 3.5rem 0;
          border-bottom: 1px solid var(--rule);
        }

        .dive__section-eyebrow {
          color: var(--accent);
          margin-bottom: 1.75rem;
        }

        .dive__prose {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .dive__prose p {
          margin: 0;
          max-width: 64ch;
          color: var(--paper-dim);
          font-size: clamp(1rem, 1.15vw, 1.1rem);
          line-height: 1.7;
        }

        .dive__prose .dive__lead {
          font-family: var(--font-display);
          font-size: clamp(1.15rem, 1.7vw, 1.4rem);
          line-height: 1.5;
          color: var(--paper);
        }

        /* ──────────── DECISIONS ──────────── */
        .dive__decisions {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .decision {
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
          background: var(--ink-2);
          padding: 2.25rem clamp(1.25rem, 3vw, 2.5rem);
        }

        .decision__head {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          padding-bottom: 1.5rem;
          margin-bottom: 1.75rem;
          border-bottom: 1px solid var(--rule);
        }

        .decision__number {
          color: var(--accent);
          font-style: italic;
          font-size: clamp(1.5rem, 2.5vw, 2.25rem);
          font-weight: 300;
          line-height: 1;
          flex-shrink: 0;
        }

        .decision__title {
          margin: 0;
          color: var(--paper);
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .decision__steps {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .decision__step {
          display: grid;
          grid-template-columns: 8.5rem 1fr;
          gap: 1.25rem;
          align-items: baseline;
        }

        .decision__step-label {
          color: var(--pulp);
          font-size: 0.62rem;
        }

        .decision__step-body {
          margin: 0;
          color: var(--paper-dim);
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          line-height: 1.65;
          max-width: 58ch;
        }

        .decision__step:nth-child(3) .decision__step-body {
          color: var(--paper);
        }

        /* ──────────── OUTCOMES ──────────── */
        .dive__outcomes {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--rule);
          border: 1px solid var(--rule);
          border-radius: 4px;
          overflow: hidden;
        }

        .outcome {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1.5rem 1.25rem;
          background: var(--ink);
        }

        .outcome__stat {
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1.5rem, 2.5vw, 2.1rem);
          line-height: 1;
          color: var(--accent);
          font-feature-settings: 'tnum' 1;
        }

        .outcome__label {
          font-size: 0.78rem;
          line-height: 1.45;
          color: var(--pulp);
        }

        /* ──────────── RETRO ──────────── */
        .dive__retro {
          margin: 0;
          padding: 0;
          list-style: none;
          counter-reset: retro;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .dive__retro-item {
          counter-increment: retro;
          display: grid;
          grid-template-columns: 2.5rem 1fr;
          gap: 1rem;
          align-items: baseline;
          color: var(--paper-dim);
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          line-height: 1.65;
          max-width: 68ch;
        }

        .dive__retro-item::before {
          content: counter(retro, decimal-leading-zero);
          font-family: var(--font-mono);
          font-style: italic;
          font-weight: 300;
          font-size: 1.1rem;
          color: var(--accent);
        }

        /* ──────────── FOOTER ──────────── */
        .dive__footer {
          padding-top: 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        :global(.dive__cta),
        :global(.dive__next) {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1.5rem clamp(1.25rem, 3vw, 2rem);
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
          text-decoration: none;
          color: var(--paper);
          transition:
            border-color var(--dur-fast) var(--ease-out),
            background var(--dur-fast) var(--ease-out),
            transform var(--dur-fast) var(--ease-out);
        }

        :global(.dive__cta .eyebrow),
        :global(.dive__next .eyebrow) {
          color: var(--pulp);
        }

        .dive__cta-label {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(1.1rem, 1.5vw, 1.3rem);
          color: var(--paper);
        }

        .dive__next-title {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 300;
          font-style: italic;
          letter-spacing: -0.02em;
          color: var(--paper);
        }

        @media (hover: hover) and (pointer: fine) {
          :global(.dive__cta:hover),
          :global(.dive__next:hover) {
            border-color: var(--accent);
            background: rgba(255, 74, 28, 0.04);
            transform: translateY(-2px);
          }
        }

        .dive__colophon {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--rule);
        }

        :global(.dive__colophon-link) {
          color: var(--pulp);
          transition: color var(--dur-fast) var(--ease-out);
        }
        :global(.dive__colophon-link:hover) {
          color: var(--accent);
        }

        .dive__colophon .eyebrow {
          color: var(--pulp-dim);
        }

        /* ──────────── RESPONSIVE ──────────── */
        @media (max-width: 720px) {
          .dive {
            padding: 1.5rem 1.5rem 4rem;
          }
          .dive__title-block {
            padding: 2.5rem 0 2rem;
          }
          .dive__meta {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-top: 2rem;
          }
          .dive__section {
            padding: 2.5rem 0;
          }
          .decision {
            padding: 1.5rem 1.25rem;
          }
          .decision__step {
            grid-template-columns: 1fr;
            gap: 0.4rem;
          }
          .dive__outcomes {
            grid-template-columns: 1fr 1fr;
          }
          .dive__retro-item {
            grid-template-columns: 2rem 1fr;
            gap: 0.75rem;
          }
        }

        @media (max-width: 460px) {
          .dive__outcomes {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </article>
  );
}
