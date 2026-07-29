'use client';

/**
 * DeepDiveArticle.tsx
 *
 * The "Narrative" tab of a project space — the full PRD-style decision
 * narrative (context → role → architecture → market → the hard
 * decisions → outcomes → retro), styled to match the rest of the Jira
 * rebuild instead of the old dramatic editorial design. Lives at
 * /projects/[slug]/narrative, inside the same ProjectHeader tabs as
 * Summary/Backlog/Timeline, so leaving it lands back on the project,
 * not the homepage.
 */

import Link from 'next/link';
import { type DeepDive, getDeepDive } from '@/lib/deep-dives';
import LexTrackDiagram from '@/components/LexTrackDiagram';
import MarketPanel from '@/components/project/MarketPanel';
import OutcomesGrid from '@/components/project/OutcomesGrid';

const DECISION_STEPS: { key: keyof Pick<
  DeepDive['decisions'][number],
  'setup' | 'tradeoff' | 'call' | 'result'
>; label: string }[] = [
  { key: 'setup', label: 'Setup' },
  { key: 'tradeoff', label: 'Tradeoff' },
  { key: 'call', label: 'The call' },
  { key: 'result', label: 'Result' },
];

export default function DeepDiveArticle({ dive }: { dive: DeepDive }) {
  const next = getDeepDive(dive.nextSlug);

  return (
    <div className="narrative">
      <p className="narrative__intro">{dive.subtitle}</p>

      <div className="narrative__grid">
        <div className="narrative__main">
          <section className="panel">
            <h2 className="panel__title">Context</h2>
            <div className="narrative__prose">
              {dive.context.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel__title">My role</h2>
            <div className="narrative__prose">
              {dive.myRole.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {(dive.slug === 'lextrack' || dive.architectureDiagram) && (
            <section className="panel">
              <h2 className="panel__title">Architecture</h2>
              {dive.slug === 'lextrack' ? (
                <LexTrackDiagram />
              ) : (
                <div className="narrative__diagram-wrap">
                  <pre className="narrative__diagram">{dive.architectureDiagram}</pre>
                </div>
              )}
            </section>
          )}

          {dive.tamSlide && <MarketPanel tam={dive.tamSlide} />}

          <section className="panel">
            <h2 className="panel__title">The hard decisions</h2>
            <div className="decisions">
              {dive.decisions.map((decision, i) => (
                <article key={decision.title} className="decision">
                  <div className="decision__head">
                    <span className="decision__number">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="decision__title">{decision.title}</h3>
                  </div>
                  <dl className="decision__steps">
                    {DECISION_STEPS.map((step) => (
                      <div key={step.key} className={`decision__step ${step.key === 'call' ? 'decision__step--call' : ''}`}>
                        <dt className="decision__step-label">{step.label}</dt>
                        <dd className="decision__step-body">{decision[step.key]}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <OutcomesGrid outcomes={dive.outcomes} />

          {dive.retro.length > 0 && (
            <section className="panel">
              <h2 className="panel__title">Retro: what I&apos;d do differently</h2>
              <ol className="narrative__retro">
                {dive.retro.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="narrative__side">
          <section className="panel">
            <h2 className="panel__title">At a glance</h2>
            <dl className="narrative__facts">
              <div className="narrative__fact">
                <dt>Role</dt>
                <dd>{dive.role}</dd>
              </div>
              <div className="narrative__fact">
                <dt>Period</dt>
                <dd style={{ whiteSpace: 'pre-line' }}>{dive.period}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <h2 className="panel__title">Stack</h2>
            <div className="narrative__stack">
              {dive.stack.map((s) => (
                <span key={s} className="narrative__tag">{s}</span>
              ))}
            </div>
          </section>

          {dive.cta && (
            <a href={dive.cta.href} target="_blank" rel="noopener noreferrer" className="side-cta">
              <span className="side-cta__eyebrow">{dive.cta.type === 'github' ? 'Source code' : 'Product demo'}</span>
              <span className="side-cta__title">{dive.cta.label} ↗</span>
            </a>
          )}

          {next && (
            <Link href={`/projects/${next.slug}/narrative`} className="side-cta">
              <span className="side-cta__eyebrow">Next case study</span>
              <span className="side-cta__title">{next.title} &rarr;</span>
            </Link>
          )}

          <Link href={`/projects/${dive.slug}`} className="side-cta">
            <span className="side-cta__eyebrow">Back to project</span>
            <span className="side-cta__title">&larr; {dive.title} summary</span>
          </Link>
        </aside>
      </div>

      <style jsx>{`
        .narrative {
          padding: 1.5rem clamp(1.25rem, 3vw, 2.5rem) 4rem;
          max-width: 1320px;
          margin: 0 auto;
        }
        .narrative__intro {
          font-size: 0.95rem;
          color: var(--pulp);
          line-height: 1.6;
          margin: 0 0 1.25rem;
          max-width: 72ch;
        }

        .narrative__grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        /* min-width:0 — a grid child defaults to min-width:auto, so the wide
           <pre> architecture diagram would size this whole column to its own
           intrinsic width and push the page into horizontal scroll instead of
           scrolling inside .narrative__diagram-wrap. */
        .narrative__main,
        .narrative__side {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-width: 0;
        }

        .panel {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          padding: 1.5rem 1.75rem;
        }
        .panel__title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0 0 0.85rem;
        }

        .narrative__prose {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .narrative__prose p {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--paper-dim);
        }

        .narrative__diagram-wrap {
          overflow-x: auto;
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          background: var(--chrome-sidebar);
        }
        .narrative__diagram {
          display: block;
          padding: 1.25rem 1.5rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          line-height: 1.65;
          color: var(--paper-dim);
          white-space: pre;
          margin: 0;
        }

        .decisions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .decision {
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          background: var(--chrome-sidebar);
          padding: 1.25rem 1.5rem;
        }
        .decision__head {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--chrome-border);
        }
        .decision__number {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent);
          flex-shrink: 0;
        }
        .decision__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--paper);
        }
        .decision__steps {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .decision__step {
          display: grid;
          grid-template-columns: 7.5rem 1fr;
          gap: 1rem;
        }
        .decision__step-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: var(--pulp);
          padding-top: 0.1rem;
        }
        .decision__step-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--paper-dim);
        }
        .decision__step--call .decision__step-label {
          color: var(--accent-deep);
        }
        .decision__step--call .decision__step-body {
          color: var(--paper);
          font-weight: 500;
        }

        .narrative__retro {
          margin: 0;
          padding-left: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .narrative__retro li {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--paper-dim);
        }

        .narrative__facts {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin: 0;
        }
        .narrative__fact {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 0.6rem;
          font-size: 0.85rem;
        }
        .narrative__fact dt {
          color: var(--pulp);
        }
        .narrative__fact dd {
          color: var(--paper);
          margin: 0;
        }

        .narrative__stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .narrative__tag {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--pulp);
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          padding: 0.25rem 0.55rem;
          border-radius: 3px;
        }

        /* :global() required — .side-cta is applied to both a native <a> and next/link's <Link>; styled-jsx can't scope the Link instances without it. */
        :global(.side-cta) {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 1.1rem 1.35rem;
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        :global(.side-cta:hover) {
          border-color: var(--accent);
          background: var(--accent-glow);
          transform: translateY(-1px);
        }
        .side-cta__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--pulp);
        }
        .side-cta__title {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--paper);
        }

        @media (max-width: 900px) {
          .narrative__grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .decision__step {
            grid-template-columns: 1fr;
            gap: 0.3rem;
          }
        }
      `}</style>
    </div>
  );
}
