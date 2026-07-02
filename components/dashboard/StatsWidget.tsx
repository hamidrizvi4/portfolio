'use client';

import { metrics } from '@/lib/personal-data';

export default function StatsWidget() {
  return (
    <section className="widget stats" aria-label="Assigned to me">
      <header className="widget__header">
        <p className="widget__eyebrow">Assigned to me</p>
        <p className="widget__subhead">Headline numbers across five shipped projects</p>
      </header>

      <ul className="stats__list">
        {metrics.map((m) => (
          <li key={m.label} className="stats__row">
            <span className="stats__value">
              {'prefix' in m && <span className="stats__prefix">{m.prefix}</span>}
              {m.value}
              {m.suffix}
            </span>
            <span className="stats__text">
              <span className="stats__label">{m.label}</span>
              <span className="stats__context">{m.context}</span>
            </span>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .widget {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          padding: 1.5rem 1.75rem;
        }
        .widget__header {
          margin-bottom: 1.1rem;
        }
        .widget__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pulp);
          margin: 0;
        }
        .widget__subhead {
          font-size: 0.8rem;
          color: var(--pulp);
          margin: 0.3rem 0 0;
        }

        .stats__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        .stats__row {
          display: grid;
          grid-template-columns: 96px 1fr;
          align-items: start;
          gap: 1rem;
          padding: 0.65rem 0.5rem;
          margin: 0 -0.5rem;
          border-bottom: 1px solid var(--chrome-border);
          border-radius: 4px;
          transition: background var(--dur-fast) var(--ease-out);
        }
        .stats__row:hover {
          background: var(--chrome-hover);
        }
        .stats__row:last-child {
          border-bottom: none;
        }
        .stats__value {
          display: block;
          font-family: var(--font-mono);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--accent-deep);
          font-feature-settings: 'tnum' 1;
          white-space: nowrap;
          line-height: 1.3;
          padding-top: 0.1rem;
        }
        .stats__prefix {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .stats__text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
          padding-top: 0.15rem;
        }
        .stats__label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--paper);
          line-height: 1.3;
        }
        .stats__context {
          font-size: 0.76rem;
          color: var(--pulp);
          line-height: 1.4;
        }

        @media (max-width: 560px) {
          .stats__row {
            grid-template-columns: 72px 1fr;
          }
          .stats__value {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
}
