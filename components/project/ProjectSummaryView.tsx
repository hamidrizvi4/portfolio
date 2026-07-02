'use client';

import Link from 'next/link';
import type { ProjectSpace } from '@/lib/jira-data';
import MarketPanel from './MarketPanel';
import OutcomesGrid from './OutcomesGrid';

export default function ProjectSummaryView({ project }: { project: ProjectSpace }) {
  const deepDiveLink = project.links.find((l) => l.type === 'deep-dive');
  const otherLinks = project.links.filter((l) => l.type !== 'deep-dive');

  return (
    <div className="summary">
      <div className="summary__grid">
        <div className="summary__main">
          <section className="panel">
            <h2 className="panel__title">Overview</h2>
            <p className="summary__hero">{project.hero}</p>
            <dl className="summary__facts">
              <div className="summary__fact">
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div className="summary__fact">
                <dt>Period</dt>
                <dd style={{ whiteSpace: 'pre-line' }}>{project.period}</dd>
              </div>
              <div className="summary__fact">
                <dt>Lead</dt>
                <dd>{project.lead}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <h2 className="panel__title">Problem</h2>
            <p className="panel__body">{project.problem}</p>
          </section>

          <section className="panel">
            <h2 className="panel__title">Build</h2>
            <p className="panel__body">{project.build}</p>
          </section>

          <section className="panel">
            <h2 className="panel__title">Impact</h2>
            <ul className="summary__impact">
              {project.impact.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <OutcomesGrid outcomes={project.outcomes} />

          {project.tamSlide && <MarketPanel tam={project.tamSlide} />}

          {project.retro.length > 0 && (
            <section className="panel">
              <h2 className="panel__title">Retro: what I'd do differently</h2>
              <ol className="summary__retro">
                {project.retro.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="summary__side">
          <section className="panel">
            <h2 className="panel__title">Stack</h2>
            <div className="summary__stack">
              {project.stack.map((s) => (
                <span key={s} className="summary__tag">{s}</span>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel__title">Epics</h2>
            <p className="panel__body panel__body--small">
              {project.epics.length} decision epics, {project.epics.reduce((n, e) => n + e.stories.length, 0)} stories.
            </p>
            <Link href={`/projects/${project.slug}/backlog`} className="summary__cta">
              View backlog &rarr;
            </Link>
          </section>

          {deepDiveLink && (
            <Link href={deepDiveLink.url} className="deep-dive-cta">
              <span className="deep-dive-cta__eyebrow">Full PRD-style narrative</span>
              <span className="deep-dive-cta__title">Read the full decision narrative &rarr;</span>
              <span className="deep-dive-cta__hint">Context, role, architecture, and every tradeoff in prose.</span>
            </Link>
          )}

          {otherLinks.length > 0 && (
            <section className="panel">
              <h2 className="panel__title">Links</h2>
              <div className="summary__links">
                {otherLinks.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    className="summary__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label} &rarr;
                  </a>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      <style jsx>{`
        .summary {
          padding: 1.5rem clamp(1.25rem, 3vw, 2.5rem) 4rem;
          max-width: 1320px;
          margin: 0 auto;
        }
        .summary__grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        .summary__main,
        .summary__side {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
        .panel__body {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--paper-dim);
          margin: 0;
        }
        .panel__body--small {
          margin-bottom: 0.75rem;
        }

        .summary__hero {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--accent-deep);
          margin: 0 0 1.1rem;
        }
        .summary__facts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0;
        }
        .summary__fact {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 0.6rem;
          font-size: 0.85rem;
        }
        .summary__fact dt {
          color: var(--pulp);
        }
        .summary__fact dd {
          color: var(--paper);
          margin: 0;
        }

        .summary__impact,
        .summary__retro {
          margin: 0;
          padding-left: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .summary__impact li,
        .summary__retro li {
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--paper-dim);
        }

        .summary__stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .summary__tag {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--pulp);
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          padding: 0.25rem 0.55rem;
          border-radius: 3px;
        }

        /* :global() required — .summary__cta is next/link's <Link>, which styled-jsx cannot auto-scope. */
        :global(.summary__cta) {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--accent-deep);
          transition: color var(--dur-fast) var(--ease-out);
        }
        :global(.summary__cta:hover) {
          color: var(--accent);
        }

        /* :global() required — .deep-dive-cta is next/link's <Link>, which styled-jsx cannot auto-scope. */
        :global(.deep-dive-cta) {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 1.25rem 1.5rem;
          background: var(--accent-glow);
          border: 1px solid var(--accent);
          border-radius: 6px;
          transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        :global(.deep-dive-cta:hover) {
          background: rgba(12, 102, 228, 0.14);
          transform: translateY(-1px);
        }
        .deep-dive-cta__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent-deep);
        }
        .deep-dive-cta__title {
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--paper);
        }
        .deep-dive-cta__hint {
          font-size: 0.78rem;
          color: var(--paper-dim);
          line-height: 1.45;
        }

        .summary__links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .summary__link {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--paper);
        }
        .summary__link:hover {
          color: var(--accent);
        }

        @media (max-width: 900px) {
          .summary__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
